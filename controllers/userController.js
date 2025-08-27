import { query } from '../config/db.js';

// Get all users

export const getUsers = async (req, res) => {
    try {
        const result = await query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).send('Server Error');
    }
};

// Get the user for a given user ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM users WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).send('Server Error');
    }
};
