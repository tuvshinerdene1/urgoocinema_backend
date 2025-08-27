import { Router } from 'express';
const router = Router();
import { getShowTimes, getShowtimesById } from '../controllers/moviesController.js';

// GET all current movies
router.get('/', getShowTimes);

// GET all showtimes for a specific movie
router.get('/:id/showtimes', getShowtimesById);

export default router;
