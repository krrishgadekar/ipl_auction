// ═══════════════════════════════════════════════════════════════
// Scoring Routes — Post-auction lineup locking & leaderboard
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import scoringService from '../services/scoringService.js';

const router = Router();

/**
 * POST /api/scoring/validate
 * Validate a Top 11 selection without locking it.
 * Body: { teamId, playerIds: [11 UUIDs], captainId, viceCaptainId }
 */
router.post('/validate', async (req, res) => {
    try {
        const { teamId, playerIds, captainId, viceCaptainId } = req.body;
        const result = await scoringService.validateTop11(teamId, playerIds, captainId, viceCaptainId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/scoring/lock-lineup
 * Lock in Top 11 + Captain + Vice-Captain for scoring.
 * Body: { teamId, playerIds: [11 UUIDs], captainId, viceCaptainId }
 */
router.post('/lock-lineup', async (req, res) => {
    try {
        const { teamId, playerIds, captainId, viceCaptainId } = req.body;
        const result = await scoringService.lockLineup(teamId, playerIds, captainId, viceCaptainId);
        req.io.emit('LINEUP_LOCKED', { teamId });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /api/scoring/leaderboard
 * Returns scored leaderboard with full breakdown for all submitted teams.
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await scoringService.calculateLeaderboard();
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/scoring/team/:teamId
 * Returns a single team's score breakdown.
 */
router.get('/team/:teamId', async (req, res) => {
    try {
        const score = await scoringService.getTeamScore(req.params.teamId);
        if (!score) return res.status(404).json({ error: 'Team has not submitted lineup' });
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
