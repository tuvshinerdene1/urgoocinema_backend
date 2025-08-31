import { Router } from 'express';
const router = Router();
import { getOccupiedSeats, createBooking } from '../controllers/bookingsController.js';

router.get('/:showtimeId/occupied-seats', getOccupiedSeats);
router.post('/', createBooking);

export default router;
