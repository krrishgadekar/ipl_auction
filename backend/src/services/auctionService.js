import AuctionStateModel from '../models/AuctionStateModel.js';
import QueueModel from '../models/QueueModel.js';
import SquadModel from '../models/SquadModel.js';
import PlayerModel from '../models/PlayerModel.js';
import playerQueueService from './playerQueueService.js';
import purseAccountingService from './purseAccountingService.js';
import squadValidationService from './squadValidationService.js';
import LogModel from '../models/LogModel.js';

// The valid state transitions graph
const VALID_TRANSITIONS = {
    'FRANCHISE_BIDDING': ['POWERCARD_BIDDING'],
    'POWERCARD_BIDDING': ['PLAYER_AUCTION'],
    'PLAYER_AUCTION': ['AUCTION_ENDED'],
    'AUCTION_ENDED': ['FINAL_XI_SELECTION'],
    'FINAL_XI_SELECTION': ['RESULTS_PUBLISHED'],
    'RESULTS_PUBLISHED': []
};

class AuctionService {
    
    async changeState(newState) {
        const currentStateObj = await AuctionStateModel.getState();
        if (!currentStateObj) {
            throw new Error("Auction state not initialized");
        }
        
        const currentState = currentStateObj.current_state;
        const allowedNextStates = VALID_TRANSITIONS[currentState] || [];
        
        if (!allowedNextStates.includes(newState)) {
            throw new Error(`Invalid state transition from ${currentState} to ${newState}`);
        }
        
        const updatedState = await AuctionStateModel.updateState(newState, null);
        return updatedState;
    }

    async introduceNextPlayer() {
        const currentStateObj = await AuctionStateModel.getState();
        if (currentStateObj.current_state !== 'PLAYER_AUCTION') {
            throw new Error("Cannot introduce player: Not in PLAYER_AUCTION state");
        }

        const nextPlayers = await QueueModel.getNextPlayers(1);
        if (!nextPlayers || nextPlayers.length === 0) {
            throw new Error("Queue is empty. No more players to introduce.");
        }

        let nextPlayer = nextPlayers[0];
        
        // 1. Increment appearance tally in the DB
        const updatedQueueRow = await QueueModel.incrementAppearance(nextPlayer.player_id);
        
        // Merge the incremented count for evaluation
        nextPlayer = { ...nextPlayer, appearance_count: updatedQueueRow.appearance_count };

        // 2. Conditionally blur riddle data
        const maskedPlayer = playerQueueService.maskPlayerIfRiddle(nextPlayer);

        // 3. Update Queue status to CURRENT
        await QueueModel.updateStatus(nextPlayer.player_id, 'CURRENT');
        
        // 4. Update AuctionState singleton active ID
        const updatedState = await AuctionStateModel.updateState('PLAYER_AUCTION', nextPlayer.player_id);
        
        return {
            player: maskedPlayer,
            state: updatedState
        };
    }

    async assignPlayerToTeam(playerId, teamId, price) {
        const currentStateObj = await AuctionStateModel.getState();
        if (currentStateObj.current_state !== 'PLAYER_AUCTION') {
            throw new Error("Cannot assign player: Not in PLAYER_AUCTION state");
        }
        if (currentStateObj.current_player_id !== playerId) {
            throw new Error("Cannot assign player: Player is not the current active player");
        }
        if (currentStateObj.frozen_team_id === teamId) {
             throw new Error(`Cannot assign player: Team ${teamId} is currently blocked by Bid Freezer.`);
        }

        // 1. Verify mathematically allowed to buy this player without breaking 15-cap or roles
        await squadValidationService.validateSquadPurchase(teamId, playerId);

        // 2. Validate & Deduct purse, and log transaction via strict ledger
        const { team, transaction } = await purseAccountingService.deductPurse(
            teamId, 
            price, 
            'PLAYER_PURCHASE', 
            `Purchased player ${playerId} for ${price} Cr`,
            true // isPlayerPurchase
        );

        // 2. Add player to squad
        const squadEntry = await SquadModel.addPlayerToSquad(teamId, playerId, price, 'NORMAL_AUCTION');

        // 3. Update Queue status to SOLD
        await QueueModel.updateStatus(playerId, 'SOLD');

        // 4. Clear current player correctly
        const updatedState = await AuctionStateModel.updateState('PLAYER_AUCTION', null);

        // 5. Get metrics for the purchasing team
        const squadSummary = await squadValidationService.getSquadSummary(teamId);

        return {
            squadEntry,
            team,
            transaction,
            state: updatedState,
            squadSummary
        };
    }

    async markPlayerUnsold(playerId) {
        const currentStateObj = await AuctionStateModel.getState();
        if (currentStateObj.current_state !== 'PLAYER_AUCTION') {
            throw new Error("Cannot mark unsold: Not in PLAYER_AUCTION state");
        }
        if (currentStateObj.current_player_id !== playerId) {
            throw new Error("Cannot mark unsold: Player is not the current active player");
        }

        // Update queue: move to back and set status to UNSOLD
        await QueueModel.moveToBack(playerId);
        await QueueModel.updateStatus(playerId, 'UNSOLD');

        // Riddle players lose their status when going to back of queue
        await PlayerModel.clearRiddleStatus(playerId);

        // Clear active player
        const updatedState = await AuctionStateModel.updateState('PLAYER_AUCTION', null);

        return {
            state: updatedState
        };
    }

    async releasePlayer(playerId) {
        // Can be part of Mulligan or admin correction
        
        // Find squad entry to get teamId and price
        const squadResult = await SquadModel.pool.query('SELECT * FROM squads WHERE player_id = $1', [playerId]); // Need to access pool directly or create getSquadByPlayer
        
        if (squadResult.rows && squadResult.rows.length > 0) {
            const squadEntry = squadResult.rows[0];
            const { team_id: teamId, purchase_price: price } = squadEntry;

            // Remove from squad
            await SquadModel.removePlayerFromSquad(teamId, playerId);

            // Refund purse & log transaction securely
            const { team: updatedTeam } = await purseAccountingService.refundPurse(
                teamId, 
                price, 
                'MULLIGAN_REFUND', 
                `Refund for releasing player ${playerId}`
            );
            
            // Move to back of queue and set status RELEASED
            await QueueModel.moveToBack(playerId);
            await QueueModel.updateStatus(playerId, 'RELEASED');

            // Riddle players lose their status when going to back of queue
            await PlayerModel.clearRiddleStatus(playerId);
            
            return {
                releasedTeam: updatedTeam,
                refundedPrice: price
            };
        } else {
             // If not in squad, just ensure queue is released
             await QueueModel.moveToBack(playerId);
             await QueueModel.updateStatus(playerId, 'RELEASED');
             return {
                 releasedTeam: null,
                 refundedPrice: 0
             }
        }
    }
}

export default new AuctionService();
