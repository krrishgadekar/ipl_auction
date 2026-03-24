// ═══════════════════════════════════════════════════════════════
// Auth Routes — Team login + session validation
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import auctionService from '../services/auctionService.js';

const router = Router();

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { success, teamId, teamName, sessionId, brandKey, franchiseName }
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const result = await auctionService.loginTeam(username, password, req.body);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

export default router;
