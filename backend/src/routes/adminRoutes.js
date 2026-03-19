// ═══════════════════════════════════════════════════════════════
// Admin Routes — Auction control endpoints (auctioneer only)
// All mutations go through REST only. WebSocket is broadcast-only.
// Protected by ADMIN_PASSWORD env variable.
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import prisma from '../config/db.js';
import auctionService from '../services/auctionService.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

// Apply admin auth to ALL routes in this router
router.use(adminAuth);

// ── Phase Transitions ────────────────────────────────────────

/**
 * POST /api/admin/auction/phase
 * Transition to a new phase. Body: { phase: 'FRANCHISE_PHASE' | ... }
 */
router.post('/phase', async (req, res) => {
    try {
        const { phase } = req.body;
        const result = await auctionService.updateAuctionPhase(phase);
        req.io.emit('PHASE_CHANGED', result);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ── Franchise Assignment ─────────────────────────────────────

/**
 * POST /api/admin/auction/assign-franchise
 * Body: { teamId, franchiseId }
 */
router.post('/assign-franchise', async (req, res) => {
    try {
        const { teamId, franchiseId } = req.body;
        const result = await auctionService.assignFranchise(teamId, franchiseId);
        const team = await prisma.team.findUnique({ where: { id: teamId } });
        req.io.emit('FRANCHISE_ASSIGNED', { ...result, team });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /api/admin/auction/franchises
 * Returns all 10 franchises with assignment status
 */
router.get('/franchises', async (req, res) => {
    try {
        const franchises = await prisma.franchise.findMany({ orderBy: { id: 'asc' } });
        const teams = await prisma.team.findMany({
            where: { brand_key: { not: null } },
            select: { brand_key: true, name: true, id: true },
        });
        const taken = {};
        for (const t of teams) taken[t.brand_key] = { teamId: t.id, teamName: t.name };

        res.json(franchises.map(f => ({
            ...f,
            assignedTo: taken[f.short_name] || null,
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Sequence Selection ───────────────────────────────────────

/**
 * POST /api/admin/auction/select-sequence
 * Body: { sequenceId: 1-5 }
 */
router.post('/select-sequence', async (req, res) => {
    try {
        const { sequenceId } = req.body;
        const result = await auctionService.selectSequence(sequenceId);
        req.io.emit('SEQUENCE_SELECTED', result);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /api/admin/auction/sequences
 * Returns all 5 auction sequences
 */
router.get('/sequences', async (req, res) => {
    try {
        const sequences = await prisma.auctionSequence.findMany({ orderBy: { id: 'asc' } });
        res.json(sequences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Player Management ────────────────────────────────────────

/**
 * POST /api/admin/auction/next-player
 * Advance to next unsold player in the selected sequence
 */
router.post('/next-player', async (req, res) => {
    try {
        const result = await auctionService.advanceToNextPlayer();
        if (result.finished) {
            req.io.emit('AUCTION_FINISHED', result);
        } else {
            req.io.emit('PLAYER_ANNOUNCED', result);
        }
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/assign-player
 * Manually assign a specific player. Body: { playerId: uuid } or { rank: number }
 */
router.post('/assign-player', async (req, res) => {
    try {
        const { playerId, rank } = req.body;
        const result = await auctionService.assignPlayer(rank ? rank : playerId);
        req.io.emit('PLAYER_ANNOUNCED', { player: result.player });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ── Bidding ──────────────────────────────────────────────────

/**
 * POST /api/admin/auction/bid
 * Place a bid. Body: { teamId, bidAmount }
 */
router.post('/bid', async (req, res) => {
    try {
        const { teamId, bidAmount } = req.body;
        const result = await auctionService.placeBid(teamId, bidAmount);
        const team = await prisma.team.findUnique({ where: { id: teamId } });
        req.io.emit('BID_UPDATED', { ...result, teamName: team?.name, teamBrandKey: team?.brand_key });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ── Sale / Unsold / Deassign ─────────────────────────────────

/**
 * POST /api/admin/auction/sell
 * Sell current player. Body: { playerId, teamId, pricePaid }
 */
router.post('/sell', async (req, res) => {
    try {
        const { playerId, teamId, pricePaid } = req.body;
        const result = await auctionService.sellPlayer(playerId, teamId, pricePaid);
        const team = await prisma.team.findUnique({ where: { id: teamId } });
        const player = await prisma.player.findUnique({ where: { id: playerId } });

        req.io.emit('PLAYER_SOLD', { ...result, team, player });
        req.io.emit('PURSE_UPDATED', { teamId, purse_remaining: team.purse_remaining });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/unsold
 * Mark current player as unsold. Body: { playerId }
 */
router.post('/unsold', async (req, res) => {
    try {
        const { playerId } = req.body;
        const result = await auctionService.markUnsold(playerId);
        req.io.emit('PLAYER_UNSOLD', { playerId });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/deassign-player
 * Deassigns a currently sold player. Body: { playerId }
 */
router.post('/deassign-player', async (req, res) => {
    try {
        const { playerId } = req.body;
        const result = await auctionService.deassignPlayer(playerId);
        req.io.emit('PLAYER_UNSOLD', { playerId });
        req.io.emit('STATE_SYNC');
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ── Power Cards ──────────────────────────────────────────────

/**
 * POST /api/admin/auction/power-card
 * Use a power card. Body: { teamId, type, targetTeamId? }
 */
router.post('/power-card', async (req, res) => {
    try {
        const { teamId, type, targetTeamId } = req.body;
        const result = await auctionService.usePowerCard(teamId, type, targetTeamId);
        const team = await prisma.team.findUnique({ where: { id: teamId } });

        req.io.emit('POWER_CARD_USED', { ...result, teamName: team?.name });
        if (type === 'MULLIGAN') {
            req.io.emit('PLAYER_RESET', { teamName: team?.name });
        }
        if (type === 'BID_FREEZER') {
            req.io.emit('TEAM_FROZEN', { targetTeamId, frozenBy: team?.name });
        }
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/rtm
 * Use RTM. Body: { teamId, playerId, finalBid }
 */
router.post('/rtm', async (req, res) => {
    try {
        const { teamId, playerId, finalBid } = req.body;
        const result = await auctionService.useRTM(teamId, playerId, finalBid);
        const team = await prisma.team.findUnique({ where: { id: teamId } });
        const player = await prisma.player.findUnique({ where: { id: playerId } });

        req.io.emit('RTM_USED', { ...result, teamName: team?.name, playerName: player?.name });
        req.io.emit('PLAYER_SOLD', { playerId, teamId, pricePaid: finalBid, team, player, rtm: true });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/assign-powercard
 * Assign a powercard to a team manually. Body: { teamId, type }
 */
router.post('/assign-powercard', async (req, res) => {
    try {
        const { teamId, type } = req.body;
        const result = await auctionService.assignPowerCard(teamId, type);
        req.io.emit('STATE_SYNC');
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/deassign-powercard
 * Deassign an unused powercard from a team. Body: { teamId, type }
 */
router.post('/deassign-powercard', async (req, res) => {
    try {
        const { teamId, type } = req.body;
        const result = await auctionService.deassignPowerCard(teamId, type);
        req.io.emit('STATE_SYNC');
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



// ── Riddle Player Configuration ──────────────────────────────

/**
 * POST /api/admin/auction/set-riddle
 * Set riddle players. Body: { playerIds: [uuid1, uuid2] } or { ranks: [r1, r2] }
 */
router.post('/set-riddle', async (req, res) => {
    try {
        const { playerIds, ranks } = req.body;

        // First clear all riddle flags
        await prisma.player.updateMany({ data: { is_riddle: false } });

        if (ranks && ranks.length > 0) {
            await prisma.player.updateMany({
                where: { rank: { in: ranks } },
                data: { is_riddle: true },
            });
        } else if (playerIds && playerIds.length > 0) {
            await prisma.player.updateMany({
                where: { id: { in: playerIds } },
                data: { is_riddle: true },
            });
        }

        res.json({ success: true, message: 'Riddle players updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ── Display Controls ─────────────────────────────────────────

/**
 * POST /api/admin/auction/log-bid
 * Log a bid entry to the display history (bidding is physical).
 * Body: { teamId, teamName, amount }
 */
router.post('/log-bid', async (req, res) => {
    try {
        const { teamId, teamName, amount } = req.body;
        const entry = await auctionService.addBidToHistory(teamId, teamName, amount);
        req.io.emit('BID_UPDATED', entry);
        res.json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


/**
 * POST /api/admin/auction/auction-day
 * Set the auction day. Body: { day: "Day 1" | "Day 2" }
 */
router.post('/auction-day', async (req, res) => {
    try {
        const { day } = req.body;
        await auctionService.setAuctionDay(day);
        req.io.emit('DAY_CHANGED', { day });
        res.json({ success: true, day });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/display-state
 * Generic display state update (power card active, god's eye, etc.)
 * Body: { active_power_card?, active_power_card_team?, gods_eye_revealed?, ... }
 */
router.post('/display-state', async (req, res) => {
    try {
        await auctionService.updateDisplayState(req.body);
        req.io.emit('STATE_SYNC');
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
