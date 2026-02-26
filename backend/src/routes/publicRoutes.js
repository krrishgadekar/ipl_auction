// ═══════════════════════════════════════════════════════════════
// Public Routes — Read-only auction state for all clients
// Uses serializer for frontend-compatible camelCase responses
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import prisma from '../config/db.js';
import { serializePlayer, serializeTeam, serializeAuctionState } from '../utils/serializer.js';

const router = Router();

/**
 * GET /api/public/auction/state
 * Returns full auction state with serialized data for frontend
 */
router.get('/state', async (req, res) => {
    try {
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });

        let currentPlayer = null;
        if (state?.current_player_id) {
            currentPlayer = await prisma.player.findUnique({
                where: { id: state.current_player_id },
            });
            // Hide riddle player identity during live auction
            if (currentPlayer?.is_riddle && state.phase === 'LIVE') {
                currentPlayer = {
                    ...currentPlayer,
                    name: '??? RIDDLE PLAYER ???',
                    team: '???',
                    url: null,
                    image_url: null,
                    // Keep category/pool/grade/rating visible
                };
            }
        }

        let highestBidder = null;
        if (state?.highest_bidder_id) {
            highestBidder = await prisma.team.findUnique({
                where: { id: state.highest_bidder_id },
                select: { id: true, name: true, brand_key: true },
            });
        }

        const teams = await prisma.team.findMany({
            orderBy: { purse_remaining: 'desc' },
        });

        res.json(serializeAuctionState(state, currentPlayer, highestBidder, teams));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/public/auction/current-player
 * Returns serialized current player being auctioned
 */
router.get('/current-player', async (req, res) => {
    try {
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });

        if (!state?.current_player_id) {
            return res.json({ player: null, message: 'No player currently assigned' });
        }

        let player = await prisma.player.findUnique({
            where: { id: state.current_player_id },
        });

        if (player?.is_riddle && state.phase === 'LIVE') {
            player = {
                ...player,
                name: '??? RIDDLE PLAYER ???',
                team: '???',
                url: null,
                image_url: null,
            };
        }

        res.json({
            player: serializePlayer(player),
            currentBid: Number(state.current_bid) || 0,
            status: state.phase,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/public/auction/last-sold
 * Returns the most recently sold player (serialized)
 */
router.get('/last-sold', async (req, res) => {
    try {
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });

        if (!state?.last_sold_player_id) {
            return res.json({ player: null, soldPrice: null, soldToTeam: null });
        }

        const player = await prisma.player.findUnique({
            where: { id: state.last_sold_player_id },
        });

        let soldToTeam = null;
        if (state.last_sold_team_id) {
            soldToTeam = await prisma.team.findUnique({
                where: { id: state.last_sold_team_id },
            });
        }

        res.json({
            player: serializePlayer(player),
            soldPrice: state.last_sold_price ? Number(state.last_sold_price) : null,
            soldToTeam: soldToTeam ? serializeTeam(soldToTeam) : null,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/public/auction/leaderboard
 * Returns serialized team standings
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            orderBy: { purse_remaining: 'desc' },
        });
        res.json(teams.map(serializeTeam));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
