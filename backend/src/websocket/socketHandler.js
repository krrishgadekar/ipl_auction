import auctionService from '../services/auctionService.js';
const { sellPlayer } = auctionService;

export default (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Admin events
        socket.on('START_AUCTION', () => {
            io.emit('AUCTION_STARTED');
        });

        socket.on('ASSIGN_PLAYER', (data) => {
            io.emit('PLAYER_ANNOUNCED', data);
        });

        // Bid updates
        socket.on('PLACE_BID', (data) => {
            // Broadcast bid to all clients
            io.emit('BID_UPDATED', data);
        });

        // Sell player (Admin triggered)
        socket.on('SELL_PLAYER', async (data) => {
            const { playerId, teamId, pricePaid } = data;
            try {
                const result = await sellPlayer(playerId, teamId, pricePaid);
                io.emit('PLAYER_SOLD', { playerId, teamId, pricePaid });
                io.emit('PURSE_UPDATED', { teamId }); // Clients should refetch team data
            } catch (error) {
                socket.emit('ERROR', { message: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
