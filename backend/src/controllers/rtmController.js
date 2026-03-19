import rtmService from '../services/rtmService.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class RtmController {

    /**
     * Simplified: Just marks the RTM as used.
     */
    async useRtm(req, res) {
        try {
            const { team_id, player_id, price_matched } = req.body;
            const result = await rtmService.useRtm(team_id, player_id, price_matched);
            
            req.io.emit(SOCKET_EVENTS.RTM_USED, {
                 teamId: team_id,
                 playerId: player_id,
                 priceMatched: price_matched
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * Admin correction: Restore RTM.
     */
    async revertRtm(req, res) {
        try {
            const { teamId } = req.body;
            await rtmService.revertRtm(teamId);
            
            req.io.emit(SOCKET_EVENTS.ADMIN_CORRECTION, { 
                type: 'REVERT_RTM', 
                teamId 
            });

            res.json({ success: true, message: `RTM restored for team ${teamId}` });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new RtmController();
