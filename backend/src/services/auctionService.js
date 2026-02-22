import prisma from '../config/db.js';

/**
 * SELL_PLAYER() (core function)
 * Every sale = ONE DB transaction
 */
async function sellPlayer(playerId, teamId, pricePaid) {
    return await prisma.$transaction(async (tx) => {
        // 1. Lock auction_state row
        // Note: Prisma doesn't have a direct "SELECT FOR UPDATE" yet, 
        // but updating the state row acts as a lock.
        const auctionState = await tx.auctionState.update({
            where: { id: 1 },
            data: {} // Just to lock the row
        });

        // 2. Validate auction_status == LIVE
        if (auctionState.auction_status !== 'LIVE') {
            throw new Error('Auction is not LIVE');
        }

        // 3. Validate player not already SOLD
        const auctionPlayer = await tx.auctionPlayer.findFirst({
            where: { playerId, status: 'UNSOLD' }
        });
        if (!auctionPlayer) {
            throw new Error('Player is either already sold or not in this auction');
        }

        // 4. Validate team purse >= bid
        const team = await tx.team.findUnique({
            where: { id: teamId }
        });
        if (!team || team.purseRemaining < pricePaid) {
            throw new Error('Insufficient purse for this team');
        }

        // 5. Validate role + overseas constraints
        const player = await tx.player.findUnique({
            where: { id: playerId }
        });
        if (player.nationality === 'OS' && team.isOverseasCount >= 4) {
            throw new Error('Team already has maximum overseas players (4)');
        }

        // 6. Deduct purse
        await tx.team.update({
            where: { id: teamId },
            data: {
                purseRemaining: { decrement: pricePaid },
                isOverseasCount: player.nationality === 'OS' ? { increment: 1 } : undefined
            }
        });

        // 7. Insert into team_players
        await tx.teamPlayer.create({
            data: {
                teamId,
                playerId,
                pricePaid
            }
        });

        // 8. Update auction_players (SOLD)
        await tx.auctionPlayer.update({
            where: { id: auctionPlayer.id },
            data: {
                status: 'SOLD',
                soldPrice: pricePaid,
                soldToTeamId: teamId
            }
        });

        // 9. Update auction_state.current_player_id
        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_player_id: null,
                auction_status: 'SOLD'
            }
        });

        return { success: true, message: 'Player sold successfully' };
    });
}

async function updateAuctionStatus(newStatus) {
    const validTransitions = {
        'NOT_STARTED': ['LIVE'],
        'LIVE': ['SOLD', 'POST_AUCTION'],
        'SOLD': ['LIVE', 'POST_AUCTION'],
        'POST_AUCTION': ['LOCKED'],
        'LOCKED': []
    };

    return await prisma.$transaction(async (tx) => {
        const currentState = await tx.auctionState.findUnique({ where: { id: 1 } });
        if (!validTransitions[currentState.auction_status].includes(newStatus)) {
            throw new Error(`Invalid state transition from ${currentState.auction_status} to ${newStatus}`);
        }

        return await tx.auctionState.update({
            where: { id: 1 },
            data: { auction_status: newStatus }
        });
    });
}

export default {
    sellPlayer,
    updateAuctionStatus
};
