// ═══════════════════════════════════════════════════════════════
// WebSocket Handler — Broadcast-only, no client mutations
// All mutations go through REST admin routes only.
// WebSocket is used for:
//   1. Real-time state broadcasting (after REST commits)
//   2. Client reconnection / state sync
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/db.js';

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        // Send current state on connect (reconnection support)
        socket.on('REQUEST_STATE', async () => {
            try {
                const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
                let currentPlayer = null;
                if (state?.current_player_id) {
                    currentPlayer = await prisma.player.findUnique({
                        where: { id: state.current_player_id },
                    });
                    // Hide riddle player identity
                    if (currentPlayer?.is_riddle) {
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
                    select: {
                        id: true, name: true, brand_key: true, franchise_name: true,
                        purse_remaining: true, squad_count: true, overseas_count: true,
                        logo: true, primary_color: true,
                    },
                    orderBy: { name: 'asc' },
                });
                socket.emit('STATE_SYNC', {
                    ...state,
                    currentPlayer,
                    highestBidder,
                    teams,
                });
            } catch (err) {
                socket.emit('ERROR', { message: err.message });
            }
        });

        // Request team-specific data (for team dashboard)
        socket.on('REQUEST_TEAM_STATE', async ({ teamId }) => {
            try {
                const team = await prisma.team.findUnique({
                    where: { id: teamId },
                    include: {
                        power_cards: true,
                        team_players: { include: { player: true } },
                        top11_selection: true,
                    },
                });
                if (!team) {
                    socket.emit('ERROR', { message: 'Team not found' });
                    return;
                }
                socket.emit('TEAM_STATE_SYNC', team);
            } catch (err) {
                socket.emit('ERROR', { message: err.message });
            }
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
}
