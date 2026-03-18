import powercardService from '../services/powercardService.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class CardController {
    
    async grantPowercard(req, res) {
        try {
            const { team_id, card_type, price } = req.body;
            const result = await powercardService.grantPowercard(team_id, card_type, price);
            
            // Broadcast the purchase logically
            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team: result.team });
            
            res.json({ success: true, data: result.card });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async useGodsEye(req, res) {
        try {
            const { team_id, player_id, highest_bid } = req.body;
            const result = await powercardService.useGodsEye(team_id, player_id, highest_bid);
            
            // 1. Alert that a card was used
            req.io.emit(SOCKET_EVENTS.POWERCARD_USED, {
                 cardType: 'GodsEye',
                 teamId: team_id,
                 playerId: player_id
            });
            // 2. Alert that a player assignment was forcefully overridden (similar to player sold)
            req.io.emit(SOCKET_EVENTS.PLAYER_OVERRIDDEN, result);
            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team: result.team });
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { 
                squadEntry: result.squadEntry,
                squadSummary: result.squadSummary
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async useFinalStrike(req, res) {
        try {
            const { team_id, player_id, highest_bid } = req.body;
            const result = await powercardService.useFinalStrike(team_id, player_id, highest_bid);
            
            req.io.emit(SOCKET_EVENTS.POWERCARD_USED, {
                 cardType: 'FinalStrike',
                 teamId: team_id,
                 playerId: player_id
            });

            req.io.emit(SOCKET_EVENTS.PLAYER_OVERRIDDEN, result);
            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team: result.team });
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { 
                squadEntry: result.squadEntry,
                squadSummary: result.squadSummary
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async useMulligan(req, res) {
        try {
            const { team_id, player_id } = req.body;
            const result = await powercardService.useMulligan(team_id, player_id);
            
            req.io.emit(SOCKET_EVENTS.POWERCARD_USED, {
                 cardType: 'Mulligan',
                 teamId: team_id,
                 playerId: player_id
            });

            req.io.emit(SOCKET_EVENTS.PLAYER_RELEASED, { player_id, ...result });
            if (result.releasedTeam) {
                req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team: result.releasedTeam });
                req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { 
                    team_id: result.releasedTeam.team_id, 
                    removed_player_id: player_id,
                    squadSummary: result.squadSummary
                });
            }

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async useBidFreezer(req, res) {
        try {
            const { team_id, target_team_id } = req.body;
            // The service will modify auction state DB
            const result = await powercardService.useBidFreezer(team_id, target_team_id);
            
            req.io.emit(SOCKET_EVENTS.POWERCARD_USED, {
                 cardType: 'BidFreezer',
                 teamId: team_id,
                 targetTeamId: target_team_id
            });
            
            // Critical broadcast telling specific clients they can't bid
            req.io.emit(SOCKET_EVENTS.BID_FREEZE_APPLIED, result);

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new CardController();
