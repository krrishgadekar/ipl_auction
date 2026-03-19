import { Router } from 'express';
import dashboardController from '../controllers/dashboardController.js';

const router = Router();

/**
 * Public endpoint for Big Screen (Smartboard)
 */
router.get('/big-screen', dashboardController.getBigScreenData);

/**
 * Team-specific dashboard endpoint
 */
router.get('/team/:teamId', dashboardController.getTeamDashboardData);

/**
 * Admin master dashboard endpoint
 */
router.get('/admin', dashboardController.getAdminDashboardData);

export default router;
