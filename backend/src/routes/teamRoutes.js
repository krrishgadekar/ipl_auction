import { Router } from 'express';
import teamController from '../controllers/teamController.js';
import finalXIController from '../controllers/finalXIController.js';

const router = Router();

router.post('/final-xi', finalXIController.submitFinalXI);
export default router;
