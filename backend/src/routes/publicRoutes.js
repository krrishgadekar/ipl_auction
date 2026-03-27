// ═══════════════════════════════════════════════════════════════
// Public Routes — Read-only auction state for all clients
// Uses serializer for frontend-compatible camelCase responses
// ═══════════════════════════════════════════════════════════════
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/db.js';
import { serializePlayer, serializeTeam, serializeAuctionState } from '../utils/serializer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// ── Riddle Clues Parsing ─────────────────────────────────────
// Reads sequence_1_riddles.txt and parses into structured data.
// Format: "Riddle Card N: Title\n\nQuestion: ...\n\nAnswer: ..."
let _riddleCluesCache = null;

function parseRiddleClues() {
    if (_riddleCluesCache) return _riddleCluesCache;
    try {
        const filePath = path.resolve(__dirname, '../../resources/sequence_1_riddles.txt');
        const raw = fs.readFileSync(filePath, 'utf-8');
        const blocks = raw.split(/Riddle Card \d+:\s*/i).filter(b => b.trim());
        _riddleCluesCache = blocks.map((block, idx) => {
            const lines = block.split(/\r?\n/).filter(l => l.trim());
            const title = lines[0]?.trim() || `Riddle ${idx + 1}`;
            const questionLine = lines.find(l => /^Question:/i.test(l));
            const question = questionLine ? questionLine.replace(/^Question:\s*/i, '').trim() : '';
            // NOTE: Answer is NEVER included in public responses
            return { id: idx + 1, title, question };
        });
        return _riddleCluesCache;
    } catch {
        return [];
    }
}

/**
 * GET /api/public/auction/riddle-clues
 * Returns all riddle clues (questions only, no answers — ever)
 */
router.get('/riddle-clues', (req, res) => {
    res.json(parseRiddleClues());
});

/**
 * GET /api/public/auction/state
 * Returns full auction state with serialized data for frontend
 */
router.get('/state', async (req, res) => {
    try {
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });

        let currentPlayer = null;
        let riddleClue = null;
        if (state?.current_player_id) {
            currentPlayer = await prisma.player.findUnique({
                where: { id: state.current_player_id },
            });
            // Hide riddle player identity until unveiled
            if (currentPlayer?.is_riddle) {
                riddleClue = {
                    title: currentPlayer.riddle_title || 'Mystery Player',
                    question: currentPlayer.riddle_question || 'Identity Locked. Solve the riddle to reveal.'
                };
                // Identity fields are now masked in serializePlayer
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
            include: {
                power_cards: true,
                team_players: { include: { player: true } },
            },
            orderBy: { purse_remaining: 'desc' },
        });

        const serialized = serializeAuctionState(state, currentPlayer, highestBidder, teams);
        // Attach riddle clue if present
        if (riddleClue) {
            serialized.riddleClue = riddleClue;
        }
        res.json(serialized);
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
