import express from 'express';
const router = express.Router();
import prisma from '../config/db.js';

/**
 * @swagger
 * /api/admin/auction/start:
 *   post:
 *     summary: Start the auction
 *     tags: [Admin]
 */
router.post('/start', async (req, res) => {
    try {
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { auction_status: 'LIVE' }
        });
        req.io.emit('AUCTION_STARTED');
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
 */
router.post('/assign-player', async (req, res) => {
    const { playerId } = req.body;
    try {
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { current_player_id: playerId, auction_status: 'LIVE' }
        });
        req.io.emit('PLAYER_ANNOUNCED', { playerId });
        res.json({ message: 'Player assigned' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/admin/auction/use-power-card:
 *   post:
 *     summary: Admin manually triggers power card usage
 *     tags: [Admin]
 */
router.post('/use-power-card', async (req, res) => {
    const { teamId, type } = req.body;
    try {
        await prisma.powerCard.updateMany({
            where: { team_id: teamId, type, is_used: false },
            data: { is_used: true }
        });
        req.io.emit('POWER_CARD_USED', { teamId, type });
        res.json({ message: 'Power card used' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/admin/auction/end:
 *   post:
 *     summary: End the auction
 *     tags: [Admin]
 */
router.post('/end', async (req, res) => {
    try {
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { auction_status: 'POST_AUCTION' }
        });
        req.io.emit('AUCTION_ENDED');
        res.json({ message: 'Auction ended' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
