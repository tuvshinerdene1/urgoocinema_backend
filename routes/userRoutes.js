import { Router } from 'express';
const router = Router();
import { getUsers, getUserById, updateUser } from '../controllers/userController.js';

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/update/', updateUser);

export default router;
