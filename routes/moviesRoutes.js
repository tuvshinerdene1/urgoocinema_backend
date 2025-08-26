import { Router } from 'express';
const router = Router();
import { getMovies, getShowtimesByMovieId } from '../controllers/moviesController.js';

// GET all current movies
router.get('/', getMovies);

// GET all showtimes for a specific movie
router.get('/:id/showtimes', getShowtimesByMovieId);

export default router;
