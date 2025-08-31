import { Router } from 'express';
const router = Router();
import { getOccupiedSeats, createBooking, getBookingsofUser } from '../controllers/bookingsController.js';

router.get('/:showtimeId/occupied-seats', getOccupiedSeats);
router.get('/:userId', getBookingsofUser);
router.post('/', createBooking);

export default router;
