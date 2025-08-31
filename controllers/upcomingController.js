import { query } from '../config/db.js';


export const getUpcoming = async (req, res) => {
    try {
        const result = await query('SELECT * FROM upcoming_movies');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching upcoming movies:', err.message);
        res.status(500).send('Server Error');
    }
};

export const getUpcomingById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM upcoming_movies WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching upcoming movies:', err.message);
        res.status(500).send('Server Error');
    }
};
