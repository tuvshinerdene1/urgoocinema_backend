import { query } from '../config/db.js';

export const getUsers = async (req, res) => {
    try {
        const result = await query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).send('Server Error');
    }
};

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

export const updateUser = async (req, res) => {
    const { id, first_name, last_name, mobile, email } = req.body;
    try {
        await query('UPDATE users set first_name = $1, last_name = $2, mobile = $3 , email = $4 where id = $5', [first_name, last_name, mobile, email, id]);
        res.json("successfully updated.")
        await query('COMMIT');
    }
    catch (err) {
        console.error('Error updating user data:', err.message);
        res.status(500).send('Server error');
    }
};