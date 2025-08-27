import { Router } from 'express';
const router = Router();
import { getUpcoming, getUpcomingById } from '../controllers/upcomingController.js';

// GET all current movies
router.get('/', getUpcoming);

// GET all showtimes for a specific movie
router.get('/:id', getUpcomingById);

export default router;
