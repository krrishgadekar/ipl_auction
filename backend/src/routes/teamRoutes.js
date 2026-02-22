import express from 'express';
const router = express.Router();
import prisma from '../config/db.js';

/**
 * @swagger
 * /api/team/me:
 *   get:
 *     summary: Get my team profile (Placeholder for authenticated user)
 *     tags: [Team]
 */
router.get('/me', async (req, res) => {
    // In a real app, we'd get teamId from JWT
    const team = await prisma.team.findFirst({
        include: { team_players: { include: { player: true } } }
    });
    res.json(team);
});

/**
 * @swagger
 * /api/team/{id}:
 *   get:
 *     summary: Get team profile and roster
 *     tags: [Team]
 */
router.get('/:id', async (req, res) => {
    try {
        const team = await prisma.team.findUnique({
            where: { id: req.params.id },
            include: { team_players: { include: { player: true } } }
        });
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/team/top11:
 *   post:
 *     summary: Select Top 11 players, captain, and vice-captain
 *     tags: [Team]
 */
router.post('/top11', async (req, res) => {
    const { teamId, playerIds, captainId, viceCaptainId } = req.body;

    if (playerIds.length !== 11) {
        return res.status(400).json({ message: 'Must select exactly 11 players' });
    }

    try {
        const selection = await prisma.top11Selection.upsert({
            where: { team_id: teamId },
            update: { player_ids: playerIds, captain_id: captainId, vice_captain_id: viceCaptainId },
            create: { team_id: teamId, player_ids: playerIds, captain_id: captainId, vice_captain_id: viceCaptainId }
        });
        req.io.emit('TOP11_LOCKED', { teamId });
        res.json(selection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
