import express, { json } from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import { query } from './config/db.js';
import branchesRoutes from './routes/branchesRoutes.js';
import moviesRoutes from './routes/moviesRoutes.js';
import bookingsRoutes from './routes/bookingsRoutes.js';
import authRoutes from './routes/authRoutes.js';

app.use(json());

app.use('/api/branches', branchesRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Movie Booking API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});