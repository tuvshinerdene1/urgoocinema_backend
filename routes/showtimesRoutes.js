import { Router } from 'express';
const router = Router();
import { getShowTimes, getShowtimesById, getShowtimesByMovieId } from '../controllers/showtimesController.js';


router.get('/', getShowTimes);
router.get('/:id', getShowtimesById);
router.get('/movie/:movieId', getShowtimesByMovieId)
export default router;
