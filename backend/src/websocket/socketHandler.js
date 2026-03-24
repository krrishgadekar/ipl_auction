// ═══════════════════════════════════════════════════════════════
// WebSocket Handler — Broadcast-only (no client mutations)
// Uses serializer for frontend-compatible responses
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/db.js';
import { serializeAuctionState, serializeTeam, serializePlayer } from '../utils/serializer.js';

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log(`📡 Socket connected: ${socket.id}`);

        // ── REQUEST_STATE: Full auction state sync ───────────
        socket.on('REQUEST_STATE', async () => {
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
                    include: { power_cards: true },
                    orderBy: { purse_remaining: 'desc' },
                });

                socket.emit('STATE_SYNC', serializeAuctionState(state, currentPlayer, highestBidder, teams));
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
