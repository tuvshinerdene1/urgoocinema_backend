import { query } from '../config/db.js';

// Get all movies that are currently playing
export const getShowTimes = async (req, res) => {
    try {
        const result = await query('SELECT * FROM showtimes');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching showtimes:', err.message);
        res.status(500).send('Server Error');
    }
};

// Get all showtimes for a given movie ID
export const getShowtimesById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM showtimes WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching showtimes:', err.message);
        res.status(500).send('Server Error');
    }
};
