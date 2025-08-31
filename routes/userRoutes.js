import { Router } from 'express';
const router = Router();
import { getUsers, getUserById } from '../controllers/userController.js';

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
