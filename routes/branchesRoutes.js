import { Router } from 'express';
const router = Router();
import { getBranches, getHallsByBranchId } from '../controllers/branchesController.js';


router.get('/', getBranches);
router.get('/:id/halls', getHallsByBranchId);

export default router;
