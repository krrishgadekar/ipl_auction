import finalXIService from '../services/finalXIService.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class FinalXIController {
    
    async submitFinalXI(req, res) {
        try {
            // team_id should be extracted from auth middleware in a real app
            // For now, it's expected in the body or params
            const { teamId, players, captain, vice_captain } = req.body;
            
            const result = await finalXIService.submitFinalXI(teamId, players, captain, vice_captain);
            
            // Broadcast event for admins
            req.io.emit(SOCKET_EVENTS.FINAL_XI_SUBMITTED, {
                team_id: teamId,
                selected_players: players,
                captain: captain,
                vice_captain: vice_captain
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async getSubmissions(req, res) {
        try {
            const submissions = await finalXIService.getAllSubmissions();
            res.json({ success: true, data: submissions });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new FinalXIController();
