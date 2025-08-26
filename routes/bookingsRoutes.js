import { Router } from 'express';
const router = Router();
import { getOccupiedSeats, createBooking } from '../controllers/bookingsController.js';

// GET all occupied seats for a specific showtime
router.get('/:showtimeId/occupied-seats', getOccupiedSeats);

// POST a new booking for selected seats
router.post('/', createBooking);

export default router;
