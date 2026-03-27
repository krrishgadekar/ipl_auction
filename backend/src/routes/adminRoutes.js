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

// ── Verify Credentials ──────────────────────────────────────

/**
 * POST /api/admin/auction/verify
 * A lightweight endpoint to verify admin credentials.
 * If the middleware passes, credentials are valid.
 */
router.post('/verify', (req, res) => {
    res.json({ success: true, message: 'Authenticated' });
});

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
 * Body: { teamId, franchiseId, price }
 */
router.post('/assign-franchise', async (req, res) => {
    try {
        const { teamId, franchiseId, price } = req.body;
        const result = await auctionService.assignFranchise(teamId, franchiseId, price);
        const team = await prisma.team.findUnique({ where: { id: teamId } });
        req.io.emit('FRANCHISE_ASSIGNED', { ...result, team });
        req.io.emit('STATE_SYNC'); // Sync purse
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/assign-powercard
 * Body: { teamId, cardType, price }
 */
router.post('/assign-powercard', async (req, res) => {
    try {
        const { teamId, cardType, price } = req.body;
        const result = await auctionService.assignPowerCard(teamId, cardType, price);
        req.io.emit('STATE_SYNC'); // Sync purse
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
 * POST /api/admin/auction/next-item
 * Advance to next item in the selected sequence (Player/Franchise/PowerCard)
 */
router.post('/next-item', async (req, res) => {
    try {
        const result = await auctionService.advanceToNextInSequence();
        if (result.finished) {
            req.io.emit('AUCTION_FINISHED', result);
        } else {
            // Mapping for compatibility with frontend events
            const eventName = result.type === 'PLAYER' ? 'PLAYER_ANNOUNCED' : 'ITEM_ANNOUNCED';
            req.io.emit(eventName, result);
        }
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/prev-item
 * Step back to the previous item in the selected sequence
 */
router.post('/prev-item', async (req, res) => {
    try {
        const result = await auctionService.stepBackInSequence();
        if (result.finished) {
            req.io.emit('AUCTION_FINISHED', result);
        } else {
            const eventName = result.type === 'PLAYER' ? 'PLAYER_ANNOUNCED' : 'ITEM_ANNOUNCED';
            req.io.emit(eventName, result);
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
        const { playerId, teamId, pricePaid, isAdminOverride } = req.body;
        const override = isAdminOverride === true;
        const result = await auctionService.sellPlayer(playerId, teamId, pricePaid, override);
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

// RTM is handled physically during the auction.
// Admin marks RTM as used via POST /api/admin/auction/toggle-powercard

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

/**
 * POST /api/admin/auction/fine-team
 * Manually deduct purse. Body: { teamId, amount, reason }
 */
router.post('/fine-team', async (req, res) => {
    try {
        const { teamId, amount, reason } = req.body;
        const result = await auctionService.deductPurse(teamId, amount, reason);
        req.io.emit('STATE_SYNC');
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/toggle-powercard
 * Manually mark powercard as used/unused. Body: { teamId, type, isUsed }
 */
router.post('/toggle-powercard', async (req, res) => {
    try {
        const { teamId, type, isUsed } = req.body;
        const result = await auctionService.togglePowerCardStatus(teamId, type, isUsed);
        req.io.emit('STATE_SYNC');
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


/**
 * POST /api/admin/auction/unsold-item
 * Mark a franchise or powercard as unsold and re-queue it.
 * Body: { itemId, itemType: 'FRANCHISE' | 'POWERCARD' }
 */
router.post('/unsold-item', async (req, res) => {
    try {
        const { itemId, itemType } = req.body;
        const result = await auctionService.markItemUnsold(itemId, itemType);
        req.io.emit('ITEM_UNSOLD', { itemId, itemType });
        req.io.emit('STATE_SYNC');
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/admin/auction/add-purse
 * Manually add purse to a team. Body: { teamId, amount, reason }
 */
router.post('/add-purse', async (req, res) => {
    try {
        const { teamId, amount, reason } = req.body;
        const result = await auctionService.addPurse(teamId, amount, reason);
        req.io.emit('STATE_SYNC');
        req.io.emit('PURSE_UPDATED', { teamId, purse_remaining: result.newPurse });
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

/**
 * POST /api/admin/auction/unveil-riddle
 * Unveil a riddle player — sets is_riddle to false, revealing their identity.
 * Body: { playerId: uuid } or { rank: number }
 * Emits RIDDLE_UNVEILED + STATE_SYNC so big screen animates the reveal.
 */
router.post('/unveil-riddle', async (req, res) => {
    try {
        const { playerId, rank } = req.body;

        let player;
        if (rank) {
            player = await prisma.player.findFirst({ where: { rank: parseInt(rank) } });
        } else if (playerId) {
            player = await prisma.player.findUnique({ where: { id: playerId } });
        }

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        if (!player.is_riddle) {
            return res.status(400).json({ error: 'Player is not a riddle player' });
        }

        // Flip the riddle flag
        const updated = await prisma.player.update({
            where: { id: player.id },
            data: { is_riddle: false },
        });

        // Broadcast reveal to all clients
        req.io.emit('RIDDLE_UNVEILED', {
            playerId: updated.id,
            rank: updated.rank,
            name: updated.name,
            imageUrl: `/player_photos/${updated.rank}.avif`,
        });
        // Also trigger full state sync so polling clients get the update immediately
        req.io.emit('STATE_SYNC');

        res.json({ success: true, player: updated });
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
