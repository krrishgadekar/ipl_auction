import TeamModel from '../models/TeamModel.js';
import SquadModel from '../models/SquadModel.js';
import TransactionModel from '../models/TransactionModel.js';

class PurseAccountingService {

    /**
     * Validates if a team has enough purse for a purchase, keeping in mind the 15-player minimum squad rule.
     * @param {number} teamId 
     * @param {number} amount 
     * @param {boolean} isPlayerPurchase Whether this purchase inherently fills a squad slot.
     * @throws {Error} if validation fails
     */
    async validatePurchase(teamId, amount, isPlayerPurchase = true) {
        const team = await TeamModel.getById(teamId);
        if (!team) throw new Error("Team not found");

        const currentPurse = Number(team.purse_balance);
        if (currentPurse < amount) {
            throw new Error(`Insufficient purse. Required: ${amount} Cr, Available: ${currentPurse} Cr`);
        }

        // Validate Minimum Purse Rule (15 players @ 0.2 Cr minimum)
        const squad = await SquadModel.getSquadByTeam(teamId);
        const currentSquadSize = squad ? squad.length : 0;
        
        if (currentSquadSize < 15) {
            let playersNeeded = 15 - currentSquadSize;
            if (isPlayerPurchase) {
                playersNeeded -= 1; // This purchase will occupy one of the needed slots
            }
            
            // Cannot have negative slots needed if they are above 15
            playersNeeded = Math.max(0, playersNeeded);

            const minimumReservedPurse = playersNeeded * 0.2;
            const amountAfterPurchase = currentPurse - amount;

            if (amountAfterPurchase < minimumReservedPurse) {
                throw new Error(
                    `Minimum purse rule violation. Team needs ${playersNeeded} more players after this. Required reserve: ${minimumReservedPurse.toFixed(2)} Cr, Remaining after purchase: ${amountAfterPurchase.toFixed(2)} Cr`
                );
            }
        }

        return team;
    }

    /**
     * Dedicated routine to securely deduct a purse AND record the ledger transaction atomically.
     * @returns {Object} { team, transaction }
     */
    async deductPurse(teamId, amount, transactionType, description = '', isPlayerPurchase = true) {
        // 1. Validate
        await this.validatePurchase(teamId, amount, isPlayerPurchase);

        // 2. Deduct
        const updatedTeam = await TeamModel.updatePurse(teamId, -amount);

        // 3. Log
        const transaction = await TransactionModel.logTransaction(teamId, transactionType, amount, description);

        return { team: updatedTeam, transaction };
    }

    /**
     * Dedicated routine to securely refund a purse AND record the ledger transaction atomically.
     * @returns {Object} { team, transaction }
     */
    async refundPurse(teamId, amount, transactionType, description = '') {
        // Validation trivially passes for refunds since balance logically goes up.
        
        // 1. Refund
        const updatedTeam = await TeamModel.updatePurse(teamId, amount);

        // 2. Log
        const transaction = await TransactionModel.logTransaction(teamId, transactionType, amount, description);

        return { team: updatedTeam, transaction };
    }
}

export default new PurseAccountingService();
