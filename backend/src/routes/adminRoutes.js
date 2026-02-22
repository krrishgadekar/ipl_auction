import express from 'express';
const router = express.Router();
import prisma from '../config/db.js';

/**
 * @swagger
 * /api/admin/auction/start:
 *   post:
 *     summary: Start the auction
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Auction started
 */
router.post('/start', async (req, res) => {
    try {
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { auction_status: 'LIVE' }
        });
        res.json({ message: 'Auction started' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/admin/auction/assign-player:
 *   post:
 *     summary: Assign current player to auction
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player assigned
 */
router.post('/assign-player', async (req, res) => {
    const { playerId } = req.body;
    try {
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { current_player_id: playerId, auction_status: 'LIVE' }
        });
        res.json({ message: 'Player assigned' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
