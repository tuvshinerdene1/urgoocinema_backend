import { v4 as uuidv4 } from 'uuid';
import { query } from './config/db.js';

// Simple dummy data for seeding the database
const branchesData = {
    "branches": [
        {
            "id": 1,
            "name": "Өргөө 1",
            "location": "Хороолол",
            "halls": [
                {
                    "id": 1,
                    "name": "Энгийн танхим",
                    "layout": {
                        "rows": 10,
                        "columns": 12,
                        "unavailable_seats": [],
                        "seatTypes": [
                            { "type": "regular", "rows": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "label": "Энгийн", "price": 18000, "caption": "Энгийн суудлууд" }
                        ]
                    }
                }
            ]
        }
    ]
};

const moviesData = {
    "movies": [
        {
            "id": 1,
            "title": "Монгол кино: Сэтгэл",
            "description": "Энэхүү сэтгэл татам кинонд хайр дурлал, урвалт, эргэлзээний тухай өгүүлдэг.",
            "cast": ["Мөнхбат", "Амар"],
            "duration": 95,
            "poster_url": "/src/assets/pics/movie-poster.webp",
            "widePosterSource": "/src/assets/pics/movie-wide.webp",
            "age_rating": "PG-13",
            "cc": "mongolian",
            "genres": ["Уран зөгнөлт", "Романтик"],
            "imdb_rating": 7.5,
            "allowed_preorder_days": 7,
            "start_date": "2025-08-20T02:00:00Z",
            "end_date": "2025-09-30T02:00:00Z",
            "showtimes": {
                "branch1": { "hallId": 1, "schedule": { "monday": ["15:00", "18:00", "21:00"] } }
            }
        }
    ]
};

const usersData = [
    { "id": 1, "firstName": "Төгс", "lastName": "Дөлгөөн", "mobile": "99******", "email": "tugsuu.dulguun@example.com" }
];

// This will be populated dynamically after showtimes are created.
const occupiedSeatsData = {
    "OccupiedSeats": []
};

const seedData = async () => {
    try {
        await query('BEGIN');
        console.log('Starting data seeding...');

        // 1. Seed branches
        console.log('Seeding branches...');
        for (const branch of branchesData.branches) {
            await query('INSERT INTO branches (id, name, location) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING', [branch.id, branch.name, branch.location]);

            // 2. Seed halls and seat types for each branch
            console.log(`Seeding halls for branch ${branch.id}...`);
            for (const hall of branch.halls) {
                const unavailableSeatsJson = JSON.stringify(hall.layout.unavailable_seats);
                await query('INSERT INTO halls (id, branch_id, name, rows, columns, unavailable_seats) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING', [hall.id, branch.id, hall.name, hall.layout.rows, hall.layout.columns, unavailableSeatsJson]);

                // Seed seat types for the current hall
                console.log(`Seeding seat types for hall ${hall.id}...`);
                for (const seatType of hall.layout.seatTypes) {
                    await query('INSERT INTO seat_types (hall_id, type, label, price, caption, seat_rows) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING', [hall.id, seatType.type, seatType.label, seatType.price, seatType.caption, seatType.rows]);
                }
            }
        }

        // 3. Seed movies
        console.log('Seeding movies...');
        for (const movie of moviesData.movies) {
            await query('INSERT INTO movies (id, title, description, cast_names, duration, poster_url, wide_poster_source, age_rating, cc, genres, imdb_rating, allowed_preorder_days, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT (id) DO NOTHING', [movie.id, movie.title, movie.description, movie.cast, movie.duration, movie.poster_url, movie.widePosterSource, movie.age_rating, movie.cc, movie.genres, movie.imdb_rating, movie.allowed_preorder_days, movie.start_date, movie.end_date]);

            // 4. Seed showtimes
            console.log(`Seeding showtimes for movie ${movie.id}...`);
            for (const branchId in movie.showtimes) {
                const showtimeData = movie.showtimes[branchId];
                const hallId = showtimeData.hallId;
                const branchNum = parseInt(branchId.replace('branch', ''));

                for (const day in showtimeData.schedule) {
                    for (const time of showtimeData.schedule[day]) {
                        const now = new Date();
                        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        const targetDay = daysOfWeek.indexOf(day);
                        const currentDay = now.getDay();
                        const diff = targetDay - currentDay;
                        const targetDate = new Date(now);
                        targetDate.setDate(now.getDate() + diff);

                        const [hour, minute] = time.split(':').map(Number);
                        targetDate.setHours(hour, minute, 0, 0);

                        // Generate a UUID for the showtime
                        const showtimeId = uuidv4();

                        await query('INSERT INTO showtimes (id, movie_id, branch_id, hall_id, start_datetime) VALUES ($1, $2, $3, $4, $5)', [showtimeId, movie.id, branchNum, hallId, targetDate.toISOString()]);

                        // Add the dynamically generated showtimeId to our booked seats data
                        occupiedSeatsData.OccupiedSeats.push({
                            "showtimeId": showtimeId,
                            "occupiedSeats": [
                                { "row": 5, "column": 5 },
                                { "row": 5, "column": 6 },
                                { "row": 6, "column": 8 }
                            ]
                        });
                    }
                }
            }
        }

        // 5. Seed users
        console.log('Seeding users...');
        for (const user of usersData) {
            await query('INSERT INTO users (id, first_name, last_name, mobile, email) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING', [user.id, user.firstName, user.lastName, user.mobile, user.email]);
        }

        // 6. Seed booked seats
        console.log('Seeding booked seats...');
        for (const booking of occupiedSeatsData.OccupiedSeats) {
            const user_id = 1; // Assuming a single user for now
            for (const seat of booking.occupiedSeats) {
                await query('INSERT INTO booked_seats (showtime_id, seat_row, seat_column, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [booking.showtimeId, seat.row, seat.column, user_id]);
            }
        }

        await query('COMMIT');
        console.log('Data seeding complete!');
    } catch (err) {
        await query('ROLLBACK');
        console.error('Data seeding failed:', err.message);
    }
};

seedData();
