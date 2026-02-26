// ═══════════════════════════════════════════════════════════════
// Player Routes — Player data with serialized responses
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import prisma from '../config/db.js';
import { serializePlayer } from '../utils/serializer.js';

const router = Router();

/**
 * GET /api/players
 * Returns all players with optional filters (pool, category, grade, search)
 */
router.get('/', async (req, res) => {
    try {
        const { pool, category, grade, search } = req.query;
        const where = {};

        if (pool) where.pool = pool;
        if (category) where.category = category;
        if (grade) where.grade = grade;
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const players = await prisma.player.findMany({
            where,
            orderBy: { rank: 'asc' },
        });

        res.json(players.map(serializePlayer));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/players/rank/:rank
 * Returns player by rank (serialized)
 */
router.get('/rank/:rank', async (req, res) => {
    try {
        const player = await prisma.player.findFirst({
            where: { rank: parseInt(req.params.rank) },
        });
        if (!player) return res.status(404).json({ error: 'Player not found' });
        res.json(serializePlayer(player));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/players/:id
 * Returns player by UUID with auction status (serialized)
 */
router.get('/:id', async (req, res) => {
    try {
        const player = await prisma.player.findUnique({
            where: { id: req.params.id },
        });
        if (!player) return res.status(404).json({ error: 'Player not found' });

        // Include auction status if exists
        const auctionPlayer = await prisma.auctionPlayer.findFirst({
            where: { player_id: player.id },
            include: {
                sold_to_team: { select: { id: true, name: true, brand_key: true } },
            },
        });

        res.json({
            ...serializePlayer(player),
            auctionStatus: auctionPlayer?.status || 'PENDING',
            soldPrice: auctionPlayer?.sold_price ? Number(auctionPlayer.sold_price) : null,
            soldToTeam: auctionPlayer?.sold_to_team || null,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
