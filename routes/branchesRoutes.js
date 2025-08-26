import { Router } from 'express';
const router = Router();
import { getBranches, getHallsByBranchId } from '../controllers/branchesController.js';

// GET all branches
router.get('/', getBranches);

// GET all halls and seat types for a specific branch
router.get('/:id/halls', getHallsByBranchId);

export default router;
