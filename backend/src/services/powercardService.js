import CardModel from '../models/CardModel.js';
import purseAccountingService from './purseAccountingService.js';
import AuctionStateModel from '../models/AuctionStateModel.js';
import SquadModel from '../models/SquadModel.js';
import LogModel from '../models/LogModel.js';
import auctionService from './auctionService.js'; // To release player for Mulligan

class PowercardService {
    
    /**
     * Helper to verify if physical auction conditions allow card usage.
     */
    async _checkIfTeamIsFrozen(teamId) {
        const state = await AuctionStateModel.getState();
        if (state.frozen_team_id === teamId) {
            throw new Error(`Execution blocked: Team ${teamId} is currently frozen by Bid Freezer.`);
        }
    }

    async grantPowercard(teamId, cardType, price) {
        // Auction deduction
        const { team, transaction } = await purseAccountingService.deductPurse(
            teamId,
            price,
            'POWERCARD_PURCHASE',
            `Purchased ${cardType} Powercard at auction`,
            false
        );

        // Grant ownership
        const card = await CardModel.grantCard(teamId, cardType);
        
        return { team, transaction, card };
    }

    /**
     * Executes God's Eye.
     * Overrides and awards the player matching the 25Cr threshold.
     */
    async useGodsEye(teamId, playerId, highestBid) {
        await this._checkIfTeamIsFrozen(teamId);

        const stateObj = await AuctionStateModel.getState();
        if (stateObj.current_state !== 'PLAYER_AUCTION' || stateObj.current_player_id !== playerId) {
            throw new Error("Target player is not currently active in PLAYER_AUCTION phase.");
        }

        if (highestBid < 25) {
            throw new Error("God's Eye can only be used during closed bidding (Bid >= 25 Cr).");
        }

        const card = await CardModel.getUnusedCard(teamId, 'GodsEye');
        if (!card) throw new Error("Team does not own an unused God's Eye card.");

        // Mark Used and Execute
        await CardModel.markCardUsed(card.id);
        
        // Match bid and win via normal route but overridden winner
        const result = await auctionService.assignPlayerToTeam(playerId, teamId, highestBid);
        
        // Log explicitly what just happened
        await LogModel.logAction('GODS_EYE', 'card', card.id, `Team ${teamId} used God's Eye to match ${highestBid} Cr for player ${playerId}`);
        
        return result;
    }

    /**
     * Executes Final Strike.
     * Takes player for highestBid + 2Cr.
     */
    async useFinalStrike(teamId, playerId, highestBid) {
        await this._checkIfTeamIsFrozen(teamId);

        if (highestBid < 10 || highestBid >= 25) {
            throw new Error("Final Strike can only be used when the highest bid is between 10 Cr and 25 Cr.");
        }

        const stateObj = await AuctionStateModel.getState();
        if (stateObj.current_state !== 'PLAYER_AUCTION' || stateObj.current_player_id !== playerId) {
            throw new Error("Target player is not currently active in PLAYER_AUCTION phase.");
        }

        const card = await CardModel.getUnusedCard(teamId, 'FinalStrike');
        if (!card) throw new Error("Team does not own an unused Final Strike card.");

        const finalPrice = highestBid + 2.0;

        await CardModel.markCardUsed(card.id);
        const result = await auctionService.assignPlayerToTeam(playerId, teamId, finalPrice);

        await LogModel.logAction('FINAL_STRIKE', 'card', card.id, `Team ${teamId} used Final Strike on player ${playerId} for ${finalPrice} Cr (${highestBid} + 2)`);
        
        return result;
    }

    /**
     * Executes Mulligan.
     * Abuses releasePlayer internally mapping to refund the purse.
     */
    async useMulligan(teamId, playerId) {
        const card = await CardModel.getUnusedCard(teamId, 'Mulligan');
        if (!card) throw new Error("Team does not own an unused Mulligan card.");

        // Validate player is in their squad
        const squad = await SquadModel.getSquadByTeam(teamId);
        const playerInSquad = squad.some(s => s.player_id === playerId);
        if (!playerInSquad) {
             throw new Error("Cannot use Mulligan on a player not currently in your squad.");
        }

        await CardModel.markCardUsed(card.id);
        
        // Reuse auction service generic release
        const result = await auctionService.releasePlayer(playerId);

        await LogModel.logAction('MULLIGAN', 'card', card.id, `Team ${teamId} used Mulligan releasing player ${playerId}`);

        return result;
    }

    /**
     * Executes Bid Freezer.
     * Sets the frozen_team_id dynamically in DB restricting future overrides.
     */
    async useBidFreezer(teamId, targetTeamId) {
        await this._checkIfTeamIsFrozen(teamId);

        const stateObj = await AuctionStateModel.getState();
        if (stateObj.current_state !== 'PLAYER_AUCTION') {
            throw new Error("Bid Freezer can only be used during the PLAYER_AUCTION phase.");
        }

        if (stateObj.frozen_team_id) {
             throw new Error(`Another team is already frozen (Team ${stateObj.frozen_team_id}). Cannot apply multiple freezers.`);
        }

        const card = await CardModel.getUnusedCard(teamId, 'BidFreezer');
        if (!card) throw new Error("Team does not own an unused Bid Freezer card.");

        await CardModel.markCardUsed(card.id);

        // Update global auction state modifying tracking column
        await AuctionStateModel.pool.query('UPDATE auction_state SET frozen_team_id = $1 WHERE auction_id = 1', [targetTeamId]);

        await LogModel.logAction('BID_FREEZER', 'card', card.id, `Team ${teamId} froze team ${targetTeamId} from using overrides internally for the active player.`);

        // Return current active player object so UI knows what instance the freeze applies to
        return { frozen_team_id: targetTeamId, current_player_id: stateObj.current_player_id };
    }

    async clearBidFreezer() {
         await AuctionStateModel.pool.query('UPDATE auction_state SET frozen_team_id = NULL WHERE auction_id = 1');
    }
}

export default new PowercardService();
