import SquadModel from '../models/SquadModel.js';
import QueueModel from '../models/QueueModel.js';
import LogModel from '../models/LogModel.js';
import AuctionStateModel from '../models/AuctionStateModel.js';
import AuditService from './AuditService.js';
import purseAccountingService from './purseAccountingService.js';

class AdminControlService {
    async undoPlayerAssignment(playerId) {
        // Find squad entry
        const squadResult = await SquadModel.pool.query('SELECT * FROM squads WHERE player_id = $1', [playerId]);
        if (!squadResult.rows || squadResult.rows.length === 0) {
            throw new Error(`Player ${playerId} is not currently assigned to any squad.`);
        }
        
        const squadEntry = squadResult.rows[0];
        const teamId = squadEntry.team_id;
        const price = squadEntry.purchase_price;

        // 1. Remove from squad
        await SquadModel.removePlayerFromSquad(teamId, playerId);

        // 2 & 3. Securely refund purse and log ADMIN_CORRECTION
        await purseAccountingService.refundPurse(
            teamId, 
            price, 
            'ADMIN_CORRECTION', 
            `[ADMIN UNDO] Refund for undone assignment of player ${playerId}`
        );

        // 4. Update queue status back to WAITING
        await QueueModel.updateStatus(playerId, 'WAITING');

        // 5. Restore as current player in state memory
        await AuctionStateModel.updateState('PLAYER_AUCTION', playerId);

        // 6. Audit log
        await AuditService.logAction(
            'UNDO_PLAYER_ASSIGNMENT', 
            'player', 
            playerId, 
            squadEntry, 
            null, 
            `Admin undid assignment of player ${playerId} to team ${teamId}`
        );

        return { teamId, playerId, refundedAmount: price };
    }

    async reassignPlayer(playerId, targetTeamId, newPrice) {
        const squadResult = await SquadModel.pool.query('SELECT * FROM squads WHERE player_id = $1', [playerId]);
        let oldSquadEntry = null;
        let oldTeamId = null;

        if (squadResult.rows && squadResult.rows.length > 0) {
            oldSquadEntry = squadResult.rows[0];
            oldTeamId = oldSquadEntry.team_id;
            
            // 1. Refund old team
            await purseAccountingService.refundPurse(
                oldTeamId, 
                oldSquadEntry.purchase_price, 
                'ADMIN_CORRECTION', 
                `[ADMIN REASSIGN] Refunding for removal of player ${playerId}`
            );
            await SquadModel.removePlayerFromSquad(oldTeamId, playerId);
        }

        // 2. Assign to new team
        await purseAccountingService.deductPurse(
            targetTeamId, 
            newPrice, 
            'ADMIN_CORRECTION', 
            `[ADMIN REASSIGN] Deducting for reassignment of player ${playerId}`, 
            false // allow bypass if needed? for correction we usually enforce or allow? 
        );
        
        const newSquadEntry = await SquadModel.addPlayerToSquad(targetTeamId, playerId, newPrice, 'NORMAL_AUCTION');
        await QueueModel.updateStatus(playerId, 'SOLD');

        // 3. Audit Log
        await AuditService.logAction(
            'REASSIGN_PLAYER',
            'player',
            playerId,
            oldSquadEntry,
            newSquadEntry,
            `Admin reassigned player ${playerId} from team ${oldTeamId} to team ${targetTeamId} at price ${newPrice}`
        );

        return { oldTeamId, targetTeamId, playerId, newPrice };
    }

    async correctPurchasePrice(playerId, newPrice) {
        const squadResult = await SquadModel.pool.query('SELECT * FROM squads WHERE player_id = $1', [playerId]);
        if (!squadResult.rows || squadResult.rows.length === 0) {
            throw new Error(`Player ${playerId} is not currently assigned to any squad.`);
        }
        
        const squadEntry = squadResult.rows[0];
        const teamId = squadEntry.team_id;
        const oldPrice = Number(squadEntry.purchase_price);

        const difference = oldPrice - newPrice;

        if (difference !== 0) {
            if (difference > 0) {
                await purseAccountingService.refundPurse(teamId, difference, 'ADMIN_CORRECTION', `[ADMIN CORRECTION] Adjusting price from ${oldPrice} to ${newPrice} for player ${playerId}`);
            } else {
                await purseAccountingService.deductPurse(teamId, Math.abs(difference), 'ADMIN_CORRECTION', `[ADMIN CORRECTION] Adjusting price from ${oldPrice} to ${newPrice} for player ${playerId}`, false);
            }

            await SquadModel.pool.query('UPDATE squads SET purchase_price = $1 WHERE team_id = $2 AND player_id = $3', [newPrice, teamId, playerId]);
            
            const updatedSquadEntry = { ...squadEntry, purchase_price: newPrice };

            // Audit Log
            await AuditService.logAction(
                'CORRECT_PRICE',
                'player',
                playerId,
                squadEntry,
                updatedSquadEntry,
                `Admin corrected price of player ${playerId} assigned to team ${teamId} from ${oldPrice} to ${newPrice}`
            );
        }

        return { teamId, playerId, oldPrice, newPrice };
    }

    async correctPurse(teamId, newBalance, description) {
        const teamResult = await SquadModel.pool.query('SELECT purse_balance FROM teams WHERE team_id = $1', [teamId]);
        if (teamResult.rows.length === 0) throw new Error("Team not found");
        
        const oldBalance = Number(teamResult.rows[0].purse_balance);
        
        await SquadModel.pool.query('UPDATE teams SET purse_balance = $1 WHERE team_id = $2', [newBalance, teamId]);
        
        // Log transaction for visibility in ledger
        const transactionModel = (await import('../models/TransactionModel.js')).default;
        await transactionModel.createTransaction(teamId, 'ADMIN_CORRECTION', newBalance - oldBalance, description || 'Admin manual purse correction');

        // Audit Log
        await AuditService.logAction(
            'CORRECT_PURSE',
            'team',
            teamId,
            { purse_balance: oldBalance },
            { purse_balance: newBalance },
            description || 'Admin manual purse correction'
        );

        return { teamId, oldBalance, newBalance };
    }

    async revertPowercardUsage(usageId) {
        const usageResult = await SquadModel.pool.query('SELECT * FROM card_usage_log WHERE usage_id = $1', [usageId]);
        if (usageResult.rows.length === 0) throw new Error("Usage log entry not found");
        
        const usageGroup = usageResult.rows[0];
        const { team_id, powercard_type } = usageGroup;

        // Restore the card
        await SquadModel.pool.query(
            'UPDATE team_powercards SET is_used = false, used_at = NULL WHERE team_id = $1 AND powercard_type = $2',
            [team_id, powercard_type]
        );

        // Audit Log
        await AuditService.logAction(
            'REVERT_POWERCARD',
            'powercard',
            team_id,
            { is_used: true },
            { is_used: false },
            `Admin reverted ${powercard_type} usage (ID: ${usageId}) for team ${team_id}`
        );

        return { teamId: team_id, powercardType: powercard_type, usageId };
    }

    /**
     * Sells a franchise (MI, CSK, RCB) to a team at a bid price.
     * Deducts purse and assigns the brand.
     */
    async sellFranchise(teamId, franchiseId, price) {
        const franchiseResult = await SquadModel.pool.query('SELECT * FROM franchises WHERE franchise_id = $1', [franchiseId]);
        if (franchiseResult.rows.length === 0) throw new Error("Franchise not found");
        const franchise = franchiseResult.rows[0];

        // 1. Deduct Purse
        const { team, transaction } = await purseAccountingService.deductPurse(
            teamId,
            price,
            'FRANCHISE_PURCHASE',
            `Purchased franchise ${franchise.franchise_name} for ${price} Cr`,
            false
        );

        // 2. Assign Franchise
        await SquadModel.pool.query(
            'UPDATE teams SET franchise_id = $1, brand_score = $2 WHERE team_id = $3',
            [franchiseId, franchise.bonus_points, teamId]
        );

        await AuditService.logAction(
            'SELL_FRANCHISE',
            'team',
            teamId,
            null,
            { franchise_id: franchiseId, name: franchise.franchise_name, price },
            `Team ${teamId} bought franchise ${franchise.franchise_name} for ${price} Cr`
        );

        return { team, franchiseName: franchise.franchise_name, price };
    }
    /**
     * Assigns a franchise (MI, CSK, etc) to a participant team.
     */
    async assignFranchise(teamId, franchiseId) {
        const franchiseResult = await SquadModel.pool.query('SELECT * FROM franchises WHERE franchise_id = $1', [franchiseId]);
        if (franchiseResult.rows.length === 0) throw new Error("Franchise not found");
        const franchise = franchiseResult.rows[0];

        await SquadModel.pool.query(
            'UPDATE teams SET franchise_id = $1 WHERE team_id = $2',
            [franchiseId, teamId]
        );

        await AuditService.logAction(
            'ASSIGN_FRANCHISE',
            'team',
            teamId,
            null,
            { franchise_id: franchiseId, name: franchise.franchise_name },
            `Admin assigned franchise ${franchise.franchise_name} to team ${teamId}`
        );

        return { teamId, franchiseId, franchiseName: franchise.franchise_name };
    }

    /**
     * Physically removes a powercard from a team's account.
     */
    async deletePowercard(cardId) {
        const result = await SquadModel.pool.query('DELETE FROM team_powercards WHERE id = $1 RETURNING *', [cardId]);
        if (result.rows.length === 0) throw new Error("Card not found");
        
        const card = result.rows[0];
        await AuditService.logAction('DELETE_POWERCARD', 'card', cardId, card, null, `Admin physically deleted card ${card.powercard_type} from team ${card.team_id}`);
        
        return card;
    }
}

export default new AdminControlService();
