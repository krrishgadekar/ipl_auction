// ═══════════════════════════════════════════════════════════════
// Admin Auth Routes — Admin login + session verification
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import auctionService from '../services/auctionService.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

/**
 * POST /api/admin/auth/login
 * Body: { username, password }
 * Returns: { success, sessionId, username, role }
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const result = await auctionService.loginAdmin(username, password);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

/**
 * GET /api/admin/auth/verify
 * Returns status 200 if the standard adminAuth middleware passes.
 */
router.get('/verify', adminAuth, (req, res) => {
    res.json({ success: true, message: 'Authenticated', role: req.user.role });
});

export default router;
