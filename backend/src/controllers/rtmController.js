import rtmService from '../services/rtmService.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class RtmController {
    async useRtm(req, res) {
        try {
            const { team_id, player_id } = req.body;
            
            // Execute RTM logic mapping dual-wallets
            const result = await rtmService.useRtm(team_id, player_id);
            
            // Broadcast successful execution events
            req.io.emit(SOCKET_EVENTS.RTM_USED, {
                teamId: result.teamId,
                playerId: result.playerId,
                oldTeamId: result.oldTeamId
            });

            // Emit the transfer mapping accurately
            req.io.emit(SOCKET_EVENTS.PLAYER_RELEASED, { player_id: result.playerId });
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { 
                squadEntry: result.newSquadEntry,
                squadSummary: result.newSquadSummary
            });
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { 
                team_id: result.oldTeamId, 
                removed_player_id: result.playerId,
                squadSummary: result.oldSquadSummary
            });

            // Emit both wallet balance changes
            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team: result.newTeam });
            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { team: result.oldTeam });

            res.json({ success: true, data: result });

        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new RtmController();
