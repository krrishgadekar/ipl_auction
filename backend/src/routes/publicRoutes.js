// ═══════════════════════════════════════════════════════════════
// Public Routes — Read-only auction state for all clients
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

/**
 * GET /api/public/auction/state
 * Returns current auction state with current player details
 */
router.get('/state', async (req, res) => {
    try {
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });

        let currentPlayer = null;
        if (state?.current_player_id) {
            currentPlayer = await prisma.player.findUnique({
                where: { id: state.current_player_id },
            });
            // Hide riddle player identity during bidding
            if (currentPlayer?.is_riddle && state.phase === 'LIVE') {
                currentPlayer = {
                    ...currentPlayer,
                    name: '??? RIDDLE PLAYER ???',
                    team: '???',
                    url: null,
                    image_url: null,
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

        res.json({ ...state, currentPlayer, highestBidder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/public/auction/current-player
 * Returns details of the player currently being auctioned
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

        // Hide riddle player identity
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
            player,
            current_bid: state.current_bid,
            phase: state.phase,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/public/auction/last-sold
 * Returns the most recently sold player
 */
router.get('/last-sold', async (req, res) => {
    try {
        const lastSold = await prisma.auctionPlayer.findFirst({
            where: { status: 'SOLD' },
            include: {
                player: true,
                sold_to_team: { select: { id: true, name: true, brand_key: true } },
            },
            orderBy: { id: 'desc' },
        });

        if (!lastSold) return res.json({ lastSold: null });

        res.json({
            player: lastSold.player,
            soldPrice: lastSold.sold_price,
            soldToTeam: lastSold.sold_to_team,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/public/auction/leaderboard
 * Returns team standings with squad info
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            include: {
                _count: { select: { team_players: true } },
            },
            orderBy: { purse_remaining: 'desc' },
        });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
