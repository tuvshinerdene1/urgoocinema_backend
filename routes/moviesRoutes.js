import { Router } from 'express';
const router = Router();
import { getMovies, getMovieById } from '../controllers/moviesController.js';


router.get('/', getMovies);
router.get('/:movieId', getMovieById);
export default router;
