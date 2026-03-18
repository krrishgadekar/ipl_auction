import auctionService from '../services/auctionService.js';
import adminControlService from '../services/adminControlService.js';
import leaderboardService from '../services/leaderboardService.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class AdminController {
    
    async changeState(req, res) {
        try {
            const { new_state } = req.body;
            const updatedState = await auctionService.changeState(new_state);
            
            // Broadcast event
            req.io.emit(SOCKET_EVENTS.AUCTION_STATE_CHANGED, updatedState);
            
            res.json({ success: true, state: updatedState });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async introduceNextPlayer(req, res) {
        try {
            const result = await auctionService.introduceNextPlayer();
            
            req.io.emit(SOCKET_EVENTS.PLAYER_INTRODUCED, result);
            
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async sellPlayer(req, res) {
        try {
            const { player_id, team_id, price } = req.body;
            const result = await auctionService.assignPlayerToTeam(player_id, team_id, price);
            
            // Check if player was a riddle player to trigger unmask
            const playerModel = (await import('../models/PlayerModel.js')).default;
            const queueModel = (await import('../models/QueueModel.js')).default;
            // The service already modified queue status, but we pull full player info to broadcast their revealing identity
            const fullPlayer = await playerModel.getById(player_id);
            // We fetch appearance count from DB to be safe
            const queueRow = await queueModel.pool.query('SELECT appearance_count FROM player_queue WHERE player_id = $1', [player_id]);
            const appCount = queueRow.rows[0]?.appearance_count;

            if (fullPlayer && fullPlayer.is_riddle_player && appCount === 1) {
                req.io.emit(SOCKET_EVENTS.RIDDLE_REVEALED, fullPlayer);
            }

            req.io.emit(SOCKET_EVENTS.PLAYER_SOLD, result);
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

    async markPlayerUnsold(req, res) {
        try {
            const { player_id } = req.body;
            const result = await auctionService.markPlayerUnsold(player_id);
            
            req.io.emit(SOCKET_EVENTS.PLAYER_UNSOLD, { player_id });
            
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async releasePlayer(req, res) {
        try {
            const { player_id } = req.body;
            const result = await auctionService.releasePlayer(player_id);
            
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

    // --- Admin Error Correction ---

    async undoPlayerAssignment(req, res) {
        try {
            const { player_id } = req.body;
            const result = await adminControlService.undoPlayerAssignment(player_id);

            // Tell frontends a squad shrunk, purse grew
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { team_id: result.teamId, removed_player_id: player_id });
            req.io.emit(SOCKET_EVENTS.PLAYER_RELEASED, { player_id }); 

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async correctPurchasePrice(req, res) {
        try {
            const { player_id, new_price } = req.body;
            const result = await adminControlService.correctPurchasePrice(player_id, new_price);
            
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { team_id: result.teamId, updated_price: new_price, player_id });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // --- Results & Leaderboard ---

    async computeResults(req, res) {
        try {
            const leaderboard = await leaderboardService.computeAndPublishResults(req.io);
            res.json({ success: true, data: leaderboard });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async getLeaderboard(req, res) {
        try {
            const leaderboard = await leaderboardService.getLeaderboard();
            res.json({ success: true, data: leaderboard });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // --- Audit & Corrections ---

    async getAuditLogs(req, res) {
        try {
            const auditService = (await import('../services/AuditService.js')).default;
            const logs = await auditService.getAuditLogs(req.query);
            res.json({ success: true, data: logs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async reassignPlayer(req, res) {
        try {
            const { player_id, team_id, price } = req.body;
            const result = await adminControlService.reassignPlayer(player_id, team_id, price);
            
            // Re-fetch squad summaries for both
            const squadValidationService = (await import('../services/squadValidationService.js')).default;
            const targetSummary = await squadValidationService.getSquadSummary(team_id);
            const oldSummary = result.oldTeamId ? await squadValidationService.getSquadSummary(result.oldTeamId) : null;

            // Broadcast updates
            req.io.emit(SOCKET_EVENTS.PLAYER_RELEASED, { player_id });
            req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { team_id, player_id, updated_summary: targetSummary });
            if (result.oldTeamId) {
                req.io.emit(SOCKET_EVENTS.SQUAD_UPDATED, { team_id: result.oldTeamId, removed_player_id: player_id, updated_summary: oldSummary });
            }
            
            req.io.emit(SOCKET_EVENTS.ADMIN_CORRECTION, { type: 'REASSIGN_PLAYER', data: result });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async correctPurse(req, res) {
        try {
            const { team_id, new_balance, description } = req.body;
            const result = await adminControlService.correctPurse(team_id, new_balance, description);
            
            req.io.emit(SOCKET_EVENTS.TEAM_PURSE_UPDATED, { 
                team: { team_id, purse_balance: new_balance }
            });
            req.io.emit(SOCKET_EVENTS.ADMIN_CORRECTION, { type: 'CORRECT_PURSE', data: result });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async revertPowercard(req, res) {
        try {
            const { usage_id } = req.body;
            const result = await adminControlService.revertPowercardUsage(usage_id);
            
            req.io.emit(SOCKET_EVENTS.ADMIN_CORRECTION, { type: 'REVERT_POWERCARD', data: result });
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new AdminController();
