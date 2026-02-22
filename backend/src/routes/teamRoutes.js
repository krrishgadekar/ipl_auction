import express from 'express';
const router = express.Router();
import prisma from '../config/db.js';

/**
 * @swagger
 * /api/team/{id}:
 *   get:
 *     summary: Get team profile and roster
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team profile
 */
router.get('/:id', async (req, res) => {
    try {
        const team = await prisma.team.findUnique({
            where: { id: req.params.id },
            include: { teamPlayers: { include: { player: true } } }
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *               playerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               captainId:
 *                 type: string
 *               viceCaptainId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Top 11 selection saved
 */
router.post('/top11', async (req, res) => {
    const { teamId, playerIds, captainId, viceCaptainId } = req.body;

    if (playerIds.length !== 11) {
        return res.status(400).json({ message: 'Must select exactly 11 players' });
    }

    try {
        const selection = await prisma.top11Selection.upsert({
            where: { teamId },
            update: { playerIds, captainId, viceCaptainId },
            create: { teamId, playerIds, captainId, viceCaptainId }
        });
        res.json(selection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
