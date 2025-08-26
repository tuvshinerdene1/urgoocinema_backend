import { query } from '../config/db.js';

// Get a list of all occupied seats for a specific showtime
export const getOccupiedSeats = async (req, res) => {
    const { showtimeId } = req.params;
    try {
        const result = await query(
            'SELECT seat_row, seat_column FROM booked_seats WHERE showtime_id = $1',
            [showtimeId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching occupied seats:', err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new booking using a database transaction
export const createBooking = async (req, res) => {
    const { showtime_id, user_id, seats } = req.body;

    try {
        // Start a transaction to ensure all or none of the seats are booked
        await query('BEGIN');

        // Check if any of the requested seats are already booked
        for (const seat of seats) {
            const { row, column } = seat;
            const occupiedCheck = await query(
                'SELECT 1 FROM booked_seats WHERE showtime_id = $1 AND seat_row = $2 AND seat_column = $3',
                [showtime_id, row, column]
            );

            if (occupiedCheck.rows.length > 0) {
                // If a seat is already booked, rollback the transaction and send an error
                await query('ROLLBACK');
                return res.status(409).json({ error: 'One or more of the selected seats are already booked.' });
            }
        }

        // If all seats are available, insert them into the database
        for (const seat of seats) {
            const { row, column } = seat;
            await query(
                'INSERT INTO booked_seats (showtime_id, user_id, seat_row, seat_column) VALUES ($1, $2, $3, $4)',
                [showtime_id, user_id, row, column]
            );
        }

        // Commit the transaction
        await query('COMMIT');
        res.status(201).json({ message: 'Booking successful!' });

    } catch (err) {
        // In case of any error, rollback the transaction
        await query('ROLLBACK');
        console.error('Error creating booking:', err.message);
        res.status(500).send('Server Error');
    }
};
