import { Router } from 'express';
const router = Router();
import { getMovies } from '../controllers/moviesController.js';

// GET all current movies
router.get('/', getMovies);


export default router;
