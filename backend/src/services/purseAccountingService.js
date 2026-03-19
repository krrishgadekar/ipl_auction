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

        // Minimum Reserve Rule Removed (User requested freedom to spend)
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
