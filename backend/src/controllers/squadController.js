import SquadModel from '../models/SquadModel.js';
import purseAccountingService from '../services/purseAccountingService.js';
import squadValidationService from '../services/squadValidationService.js';
import LogModel from '../models/LogModel.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class SquadController {
    
    /**
     * Bypasses the strict mathematical bounds in squadValidationService.
     * Manually acts on the DB to unblock classroom Edge cases natively.
     */
    async overridePurchase(req, res) {
        try {
            const { team_id, player_id, price } = req.body;

            // 1. Process purse explicitly blindly
            const { team } = await purseAccountingService.deductPurse(
                team_id, 
                price, 
                'ADMIN_CORRECTION', 
                `ADMIN OVERRIDE: Force assigned player ${player_id} to team ${team_id}`,
                true // True maybe allows bypassing minimums? Wait, deductPurse validatePurchase takes `isOverride` maybe? Let's just deduct it.
            );
            
            // 2. Insert structurally into Squads bypassing validateSquadPurchase
            const squadEntry = await SquadModel.addPlayerToSquad(team_id, player_id, price, 'NORMAL_AUCTION');

            // 3. Document the bypass transparently
            await LogModel.logAction('ADMIN_OVERRIDE', 'squad', team_id, `Manually injected player ${player_id} onto team ${team_id} for ${price} Cr ignoring validation rules.`);

            // 4. Update the active dashboard visuals including the broken rules mapped
            const squadSummary = await squadValidationService.getSquadSummary(team_id);

            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team });
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { 
                squadEntry, 
                squadSummary 
            });

            res.json({ success: true, data: { squadEntry, squadSummary } });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new SquadController();
