import { query } from '../config/db.js';

// Get all movies that are currently playing
export const getMovies = async (req, res) => {
    try {
        const result = await query('SELECT * FROM movies WHERE start_date <= NOW() AND end_date >= NOW()');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching movies:', err.message);
        res.status(500).send('Server Error');
    }
};