import { query } from '../config/db.js';


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


export const createBooking = async (req, res) => {
    const { showtime_id, user_id, seats, booking_time } = req.body;
    console.log(req.body);

    try {
        await query('BEGIN');

        for (const seat of seats) {
            const { row, column } = seat;
            const occupiedCheck = await query(
                'SELECT 1 FROM booked_seats WHERE showtime_id = $1 AND seat_row = $2 AND seat_column = $3',
                [showtime_id, row, column]
            );

            if (occupiedCheck.rows.length > 0) {
                await query('ROLLBACK');
                return res.status(409).json({ error: 'One or more of the selected seats are already booked.' });
            }
        }

        for (const seat of seats) {
            const { row, column } = seat;
            await query(
                'INSERT INTO booked_seats (showtime_id, user_id, seat_row, seat_column, booking_time) VALUES ($1, $2, $3, $4, $5)',
                [showtime_id, user_id, row, column, booking_time]
            );
        }

        await query('COMMIT');
        res.status(201).json({ message: 'Booking successful!' });

    } catch (err) {
        await query('ROLLBACK');
        console.error('Error creating booking:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

export const getBookingsofUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await query(
            'SELECT * FROM booked_seats WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching occupied seats:', err.message);
        res.status(500).send('Server Error');
    }
}