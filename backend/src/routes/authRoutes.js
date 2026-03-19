import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

/**
 * Team/Participant login
 * Expects { teamName, password }
 */
router.post('/login', authController.login);

/**
 * Admin Master login
 * Expects { password }
 */
router.post('/admin/login', authController.adminLogin);

/**
 * Big Screen / Smartboard login
 * Expects { password }
 */
router.post('/screen/login', authController.screenLogin);

export default router;
