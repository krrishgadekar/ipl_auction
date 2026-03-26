// ═══════════════════════════════════════════════════════════════
// WebSocket Handler — Broadcast-only (no client mutations)
// Uses serializer for frontend-compatible responses
// ═══════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/db.js';
import { serializeAuctionState, serializeTeam, serializePlayer } from '../utils/serializer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Riddle Clues (shared with publicRoutes) ──────────────────
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
            return { id: idx + 1, title, question };
        });
        return _riddleCluesCache;
    } catch { return []; }
}

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log(`📡 Socket connected: ${socket.id}`);

        // ── REQUEST_STATE: Full auction state sync ───────────
        socket.on('REQUEST_STATE', async () => {
            try {
                const state = await prisma.auctionState.findUnique({ where: { id: 1 } });

                let currentPlayer = null;
                let riddleClue = null;
                if (state?.current_player_id) {
                    currentPlayer = await prisma.player.findUnique({
                        where: { id: state.current_player_id },
                    });
                    // Fetch riddle content directly from the DB player record
                    if (currentPlayer?.is_riddle) {
                        riddleClue = {
                            title: currentPlayer.riddle_title || 'Mystery Player',
                            question: currentPlayer.riddle_question || 'Identity Locked. Solve the riddle to reveal.'
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
                    include: {
                        power_cards: true,
                        team_players: { include: { player: true } },
                    },
                    orderBy: { purse_remaining: 'desc' },
                });

                const serialized = serializeAuctionState(state, currentPlayer, highestBidder, teams);
                if (riddleClue) serialized.riddleClue = riddleClue;
                socket.emit('STATE_SYNC', serialized);
            } catch (err) {
                socket.emit('ERROR', { message: err.message });
            }
        });

        // ── REQUEST_TEAM_STATE: Single team sync ─────────────
        socket.on('REQUEST_TEAM_STATE', async (data) => {
            try {
                const team = await prisma.team.findUnique({
                    where: { id: data?.teamId },
                    include: {
                        power_cards: true,
                        team_players: { include: { player: true } },
                    },
                });
                if (!team) {
                    socket.emit('ERROR', { message: 'Team not found' });
                    return;
                }
                socket.emit('TEAM_STATE_SYNC', serializeTeam(team));
            } catch (err) {
                socket.emit('ERROR', { message: err.message });
            }
        });

        socket.on('disconnect', () => {
            console.log(`📡 Socket disconnected: ${socket.id}`);
        });
    });
}
