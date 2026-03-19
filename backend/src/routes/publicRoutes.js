import { Router } from 'express';
import adminController from '../controllers/adminController.js';
// Public routes

const router = Router();

router.get('/leaderboard', adminController.getLeaderboard);

export default router;
