import auctionService from '../services/auctionService.js';
const { sellPlayer, usePowerCard, updateAuctionStatus } = auctionService;

export default (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Admin events
        socket.on('START_AUCTION', async () => {
            try {
                await updateAuctionStatus('LIVE');
                io.emit('AUCTION_STARTED');
            } catch (err) {
                socket.emit('ERROR', { message: err.message });
            }
        });

        socket.on('ASSIGN_PLAYER', (data) => {
            io.emit('PLAYER_ANNOUNCED', data);
        });

        socket.on('END_AUCTION', async () => {
            try {
                await updateAuctionStatus('POST_AUCTION');
                io.emit('AUCTION_ENDED');
            } catch (err) {
                socket.emit('ERROR', { message: err.message });
            }
        });

        // Bid updates
        socket.on('PLACE_BID', (data) => {
            io.emit('BID_UPDATED', data);
        });

        // Power Card
        socket.on('USE_POWER_CARD', async (data) => {
            const { teamId, type } = data;
            try {
                await usePowerCard(teamId, type);
                io.emit('POWER_CARD_USED', { teamId, type });
            } catch (error) {
                socket.emit('ERROR', { message: error.message });
            }
        });

        // Sell player (Admin triggered)
        socket.on('SELL_PLAYER', async (data) => {
            const { playerId, teamId, pricePaid } = data;
            try {
                await sellPlayer(playerId, teamId, pricePaid);
                io.emit('PLAYER_SOLD', { playerId, teamId, pricePaid });
                io.emit('PURSE_UPDATED', { teamId });
            } catch (error) {
                socket.emit('ERROR', { message: error.message });
            }
        });

        // Top 11
        socket.on('SELECT_TOP11', (data) => {
            // Logic handled in REST, but broadcast if needed
            io.emit('TOP11_LOCKED', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
