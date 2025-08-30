import { Router } from 'express';
const router = Router();
import { getShowTimes, getShowtimesById, getShowtimesByMovieId } from '../controllers/showtimesController.js';


// GET all current movies
router.get('/', getShowTimes);

// GET all showtimes for a specific movie
router.get('/:id', getShowtimesById);

router.get('/movie/:movieId', getShowtimesByMovieId)

export default router;
