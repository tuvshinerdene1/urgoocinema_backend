import { Router } from 'express';
const router = Router();
import { getUpcoming, getUpcomingById } from '../controllers/upcomingController.js';

router.get('/', getUpcoming);
router.get('/:id', getUpcomingById);

export default router;
