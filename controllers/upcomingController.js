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

export const getUpcomingByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await query('select * from upcoming_movies where id = (select movie_id from movie_notifications where user_id = $1)', [userId]);
        res.json(result.rows);
        res.status(500).send('Server Error');
    } catch (err) {
        await query('ROLLBACK');
        console.error('Error getting upcoming movies:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};


export const postNotifications = async (req, res) => {
    const { user_id, movie_id } = req.params;

    try {
        await query('BEGIN');
        await query(
            'INSERT INTO movie_notifications (user_id, movie_id) VALUES ($1, $2)',
            [user_id, movie_id]
        );


        await query('COMMIT');
        res.status(201).json({ message: 'Notification post successful!' });

    } catch (err) {
        await query('ROLLBACK');
        console.error('Error creating booking:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

export const getNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await query('select * from movie_notifications where user_id = $1)', [userId]);
        res.json(result.rows);
        res.status(500).send('Server Error');
    } catch (err) {
        await query('ROLLBACK');
        console.error('Error getting notifications:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }

}
