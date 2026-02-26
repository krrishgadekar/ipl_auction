// ═══════════════════════════════════════════════════════════════
// Team Routes — Public team info endpoints
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

/**
 * GET /api/teams
 * Returns all teams with squad counts and remaining purse
 */
router.get('/', async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            select: {
                id: true, name: true, brand_key: true, franchise_name: true,
                purse_remaining: true, squad_count: true, overseas_count: true,
                logo: true, primary_color: true, brand_score: true,
            },
            orderBy: { name: 'asc' },
        });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/teams/:id
 * Returns a single team by ID with power cards and squad
 */
router.get('/:id', async (req, res) => {
    try {
        const team = await prisma.team.findUnique({
            where: { id: req.params.id },
            include: {
                power_cards: true,
                team_players: {
                    include: { player: true },
                    orderBy: { price_paid: 'desc' },
                },
            },
        });
        if (!team) return res.status(404).json({ error: 'Team not found' });

        // Remove sensitive auth fields
        const { password_hash, active_session_id, ...safeTeam } = team;
        res.json(safeTeam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/teams/:id/squad
 * Returns a team's current squad
 */
router.get('/:id/squad', async (req, res) => {
    try {
        const squad = await prisma.teamPlayer.findMany({
            where: { team_id: req.params.id },
            include: { player: true },
            orderBy: { price_paid: 'desc' },
        });
        res.json(squad);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/teams/:id/power-cards
 * Returns a team's power cards
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
