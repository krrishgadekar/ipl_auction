// ═══════════════════════════════════════════════════════════════
// Player Routes — Public player data endpoints
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

/**
 * GET /api/players
 * Returns all players. Supports filters: ?pool=BAT_WK&category=BAT&grade=A&search=Kohli
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
        res.json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/players/rank/:rank
 * Returns a single player by rank
 */
router.get('/rank/:rank', async (req, res) => {
    try {
        const rank = parseInt(req.params.rank, 10);
        const player = await prisma.player.findUnique({ where: { rank } });
        if (!player) return res.status(404).json({ error: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/players/:id
 * Returns a single player by UUID
 */
router.get('/:id', async (req, res) => {
    try {
        const player = await prisma.player.findUnique({
            where: { id: req.params.id },
            include: {
                auction_players: { select: { status: true, sold_price: true, sold_to_team_id: true } },
            },
        });
        if (!player) return res.status(404).json({ error: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
