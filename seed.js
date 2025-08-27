import { v4 as uuidv4 } from 'uuid';
import { query } from './config/db.js';
import branch_list from './data/branch-list.json' with { type: 'json' };
import ongoing_movies from './data/ongoing-list.json' with { type: 'json' };
import upcoming_movies from './data/upcoming.json' with { type: 'json' };
import user_info from './data/user-info.json' with { type: 'json' };
import occupied_seats from './data/seat-availability.json' with { type: 'json' };

const branchesData = branch_list;
const moviesData = ongoing_movies;
const upcomingMoviesData = upcoming_movies;
const usersData = user_info;
const occupiedSeatsData = occupied_seats;

// A temporary map to store showtime IDs for later use with booked seats
const showtimeIdMap = {};

const seedUsers = async () => {
    console.log('Seeding users...');
    for (const user of usersData) {
        await query('INSERT INTO users (id, first_name, last_name, mobile, email) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING', [user.id, user.firstName, user.lastName, user.mobile, user.email]);
    }
};

const seedBranches = async () => {
    console.log('Seeding branches and halls from branches list...');
    for (const branch of branchesData.branches) {
        await query('INSERT INTO branches (id, name, location) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING', [branch.id, branch.name, branch.location]);

        for (const hall of branch.halls) {
            const unavailableSeatsJson = JSON.stringify(hall.layout.unavailable_seats);
            await query('INSERT INTO halls (id, branch_id, name, rows, columns, unavailable_seats) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING', [hall.id, branch.id, hall.name, hall.layout.rows, hall.layout.columns, unavailableSeatsJson]);

            for (const seatType of hall.layout.seatTypes) {
                await query('INSERT INTO seat_types (hall_id, type, label, price, caption, seat_rows) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING', [hall.id, seatType.type, seatType.label, seatType.price, seatType.caption, seatType.rows]);
            }
        }
    }
};

const seedMovies = async () => {
    console.log('Seeding movies...');
    for (const movie of moviesData.movies) {
        await query('INSERT INTO movies (id, title, description, cast_names, duration, poster_url, wide_poster_source, age_rating, cc, genres, imdb_rating, allowed_preorder_days, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT (id) DO NOTHING', [movie.id, movie.title, movie.description, movie.cast, movie.duration, movie.poster_url, movie.widePosterSource, movie.age_rating, movie.cc, movie.genres, movie.imdb_rating, movie.allowed_preorder_days, movie.start_date, movie.end_date]);
    }
};

const seedShowtimes = async () => {
    console.log('Seeding showtimes...');
    // Generate showtimes based on ongoing movies schedule and a fixed date to match occupied_seats.json
    const fixedDate = new Date('2025-05-01'); // A fixed reference date

    for (const movie of moviesData.movies) {
        for (const branchId in movie.showtimes) {
            const showtimeData = movie.showtimes[branchId];
            const hallId = showtimeData.hallId;
            const branchNum = parseInt(branchId.replace('branch', ''));

            for (const day in showtimeData.schedule) {
                for (const time of showtimeData.schedule[day]) {
                    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    const targetDayIndex = daysOfWeek.indexOf(day);
                    const dayDifference = targetDayIndex - fixedDate.getDay();
                    const targetDate = new Date(fixedDate);
                    targetDate.setDate(fixedDate.getDate() + dayDifference);

                    const [hour, minute] = time.split(':').map(Number);
                    targetDate.setHours(hour, minute, 0, 0);

                    const showtimeId = uuidv4();
                    const oldShowtimeId = `${branchNum}_${hallId}_${movie.id}_${targetDate.getFullYear()}${String(targetDate.getMonth() + 1).padStart(2, '0')}${String(targetDate.getDate()).padStart(2, '0')}_${time.replace(':', '')}`;
                    console.log(`Mapping old showtime ID ${oldShowtimeId} to new UUID ${showtimeId}`);


                    showtimeIdMap[oldShowtimeId] = showtimeId;

                    await query('INSERT INTO showtimes (id, movie_id, branch_id, hall_id, start_datetime) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING', [showtimeId, movie.id, branchNum, hallId, targetDate.toISOString()]);
                }
            }
        }
    }
};

const seedBookedSeats = async () => {
    console.log('Seeding booked seats...');
    for (const booking of occupiedSeatsData.OccupiedSeats) {
        // Parse booking.showtimeId back into parts
        // Format in JSON is something like: branchNum_hallId_movieId_YYYYMMDD_HHMM
        const [branchNum, hallId, movieId, datePart, timePart] = booking.showtimeId.split('_');

        // Convert date + time into ISO datetime
        const year = datePart.slice(0, 4);
        const month = datePart.slice(4, 6);
        const day = datePart.slice(6, 8);
        const hour = timePart.slice(0, 2);
        const minute = timePart.slice(2, 4);

        const startDatetime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`);

        // Lookup actual UUID from DB
        const res = await query(
            'SELECT id FROM showtimes WHERE movie_id=$1 AND branch_id=$2 AND hall_id=$3 AND start_datetime=$4',
            [movieId, branchNum, hallId, startDatetime.toISOString()]
        );

        if (res.rows.length === 0) {
            console.warn(` Could not find matching showtime for ${booking.showtimeId}. Skipping.`);
            continue;
        }

        const correctShowtimeId = res.rows[0].id;

        // Insert booked seats
        for (const seat of booking.occupiedSeats) {
            await query(
                'INSERT INTO booked_seats (showtime_id, seat_row, seat_column, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                [correctShowtimeId, seat.row, seat.column, seat.userId]
            );
        }
    }
};


const seedUpcomingMovies = async () => {
    console.log('Seeding upcoming movies...');
    for (const movie of upcomingMoviesData) {
        const castArray = movie.cast.split(',').map(name => name.trim());
        const genresArray = movie.genre.split(',').map(name => name.trim());
        await query('INSERT INTO upcoming_movies (id, title, description, cast_names, duration, poster_url, wide_poster_source, age_rating, genres, releasedate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING',
            [movie.id, movie.name, movie.description, castArray, movie.runTime, movie.imageSrc, movie.widePosterSource, movie.ageRating, genresArray, movie.releaseDate]);
    }
};

const seedAllData = async () => {
    try {
        await query('BEGIN');
        console.log('Starting data seeding...');

        await seedUsers();
        await seedBranches();
        await seedMovies();
        await seedShowtimes();
        await seedBookedSeats();
        await seedUpcomingMovies();

        await query('COMMIT');
        console.log('Data seeding complete!');
    } catch (err) {
        await query('ROLLBACK');
        console.error('Data seeding failed:', err.message);
    }
};

seedAllData();
