import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        res.json({
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                mobile: user.mobile
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
export const register = async (req, res) => {
    const { firstName, lastName, mobile, email, password } = req.body;

    try {

        if (!firstName || !lastName || !mobile || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!/^(80|83|85|86|88|89|90|91|93|94|95|96|97|98|99)\d{6}$/.test(mobile)) {
            return res.status(400).json({ message: 'Invalid mobile number' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await query('SELECT * FROM users WHERE email = $1 OR mobile = $2', [email, mobile]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email or mobile already registered' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const idResult = await query('SELECT MAX(id) as max_id FROM users');
        const id = (idResult.rows[0].max_id || 0) + 1;

        await query(
            'INSERT INTO users (id, first_name, last_name, mobile, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, firstName, lastName, mobile, email, hashedPassword]
        );

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};