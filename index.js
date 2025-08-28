import express, { json } from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import branchesRoutes from './routes/branchesRoutes.js';
import moviesRoutes from './routes/moviesRoutes.js';
import bookingsRoutes from './routes/bookingsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import showtimesRoutes from './routes/showtimesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import upcomingRoutes from './routes/upcomingRoutes.js';

app.use(cors());
app.use(json());

app.use('/api/branches', branchesRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/showtimes', showtimesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upcoming', upcomingRoutes);
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Movie Booking API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});