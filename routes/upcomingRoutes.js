import { Router } from 'express';
const router = Router();
import { getUpcoming, getUpcomingById, getUpcomingByUserId, postNotifications } from '../controllers/upcomingController.js';

router.get('/', getUpcoming);
router.get('/:userId', getUpcomingByUserId);
router.get('/:id', getUpcomingById);

router.post('/', postNotifications);

export default router;
