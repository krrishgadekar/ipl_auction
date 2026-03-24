// ═══════════════════════════════════════════════════════════════
// Team Routes — Team data with serialized responses
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import prisma from '../config/db.js';
import { serializeTeam, serializePlayer } from '../utils/serializer.js';
import teamAuth from '../middleware/teamAuth.js';

const router = Router();

// Apply auth to all team-specific GET routes except the list
// The list /api/teams is public (used by dashboard/admin)
// The specific /api/teams/:id is used by the team dashboard
router.use('/:id', teamAuth);
router.use('/:id/squad', teamAuth);
router.use('/:id/power-cards', teamAuth);

/**
 * GET /api/teams
 * Returns all teams with serialized camelCase fields
 */
router.get('/', async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            include: {
                power_cards: true,
                team_players: {
                    include: { player: true },
                },
            },
            orderBy: { purse_remaining: 'desc' },
        });
        res.json(teams.map(serializeTeam));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/teams/:id
 * Returns single team with full squad and power cards
 */
router.get('/:id', async (req, res) => {
    try {
        const team = await prisma.team.findUnique({
            where: { id: req.params.id },
            include: {
                power_cards: true,
                team_players: {
                    include: { player: true },
                },
            },
        });
        if (!team) return res.status(404).json({ error: 'Team not found' });
        res.json(serializeTeam(team));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/teams/:id/squad
 * Returns team's squad (player details + price paid)
 */
router.get('/:id/squad', async (req, res) => {
    try {
        const teamPlayers = await prisma.teamPlayer.findMany({
            where: { team_id: req.params.id },
            include: { player: true },
        });
        res.json(teamPlayers.map(tp => ({
            player: serializePlayer(tp.player),
            pricePaid: Number(tp.price_paid),
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/teams/:id/power-cards
 * Returns team's power cards (serialized)
 */
router.get('/:id/power-cards', async (req, res) => {
    try {
        const cards = await prisma.powerCard.findMany({
            where: { team_id: req.params.id },
        });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
