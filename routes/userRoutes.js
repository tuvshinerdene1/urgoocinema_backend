import { Router } from 'express';
const router = Router();
import { getUsers, getUserById } from '../controllers/userController.js';

// GET all current movies
router.get('/', getUsers);

// GET all showtimes for a specific movie
router.get('/:id', getUserById);

export default router;
