import express from 'express';
const router = express.Router();
import prisma from '../config/db.js';

/**
 * @swagger
 * /api/public/auction/state:
 *   get:
 *     summary: Get current auction state
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Current auction state
 */
router.get('/state', async (req, res) => {
    try {
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
        res.json(state);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/public/auction/current-player:
 *   get:
 *     summary: Get current player details
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Current player details
 */
router.get('/current-player', async (req, res) => {
    try {
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
        if (!state || !state.current_player_id) {
            return res.status(404).json({ message: 'No current player' });
        }
        const player = await prisma.player.findUnique({
            where: { id: state.current_player_id }
        });
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
