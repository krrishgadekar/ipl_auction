import powercardService from '../services/powercardService.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class CardController {
    
    async grantPowercard(req, res) {
        try {
            const { team_id, card_type, price } = req.body;
            const result = await powercardService.grantPowercard(team_id, card_type, price);
            
            // Broadcast the purchase logically
            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team: result.team });
            req.io.emit(SOCKET_EVENTS.POWERCARD_GRANTED, result.card);
            
            res.json({ success: true, data: result.card });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * Simplified: Just marks a card as used.
     */
    async usePowercard(req, res) {
        try {
            const { teamId, cardType } = req.body;
            const result = await powercardService.usePowercard(teamId, cardType);
            
            req.io.emit(SOCKET_EVENTS.POWERCARD_USED, {
                 cardType,
                 teamId,
                 card: result
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * Admin correction: Undo a card usage.
     */
    async revertPowercard(req, res) {
        try {
            const { cardId } = req.body;
            const result = await powercardService.revertPowercard(cardId);
            
            req.io.emit(SOCKET_EVENTS.ADMIN_CORRECTION, { 
                type: 'REVERT_POWERCARD', 
                card: result 
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new CardController();
