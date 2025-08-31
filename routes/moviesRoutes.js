import { Router } from 'express';
const router = Router();
import { getMovies } from '../controllers/moviesController.js';


router.get('/', getMovies);
export default router;
