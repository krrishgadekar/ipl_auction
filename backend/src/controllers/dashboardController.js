import AuctionStateModel from '../models/AuctionStateModel.js';
import PlayerModel from '../models/PlayerModel.js';
import TeamModel from '../models/TeamModel.js';
import SquadModel from '../models/SquadModel.js';
import PowercardModel from '../models/PowercardModel.js';
import playerQueueService from '../services/playerQueueService.js';
import pool from '../config/db.js';

class DashboardController {

    /**
     * View 1: Big Screen (Classroom Smartboard)
     * Returns: Active player info + Team leaderboard (sorted by purse).
     */
    async getBigScreenData(req, res) {
        try {
            const state = await AuctionStateModel.getState();
            let activePlayer = null;

            if (state.current_player_id) {
                const player = await PlayerModel.getById(state.current_player_id);
                // Also get the appearance count from queue for riddle logic
                const queueResult = await pool.query('SELECT appearance_count FROM player_queue WHERE player_id = $1', [state.current_player_id]);
                const playerWithQueue = { ...player, appearance_count: queueResult.rows[0]?.appearance_count };
                
                activePlayer = playerQueueService.maskPlayerIfRiddle(playerWithQueue);
            }

            // Teams sorted by purse
            const teamsResult = await pool.query('SELECT team_id, team_name, purse_balance FROM teams ORDER BY purse_balance DESC, team_name ASC');
            const leaderboard = teamsResult.rows;

            res.json({
                success: true,
                data: {
                    state: state.current_state,
                    activePlayer,
                    leaderboard
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * View 2: Team Dashboard
     * Returns: Team details, squad, cards, and full leaderboard.
     */
    async getTeamDashboardData(req, res) {
        try {
            const { teamId } = req.params;

            // 1. Team basic info (Purse, RTM)
            const team = await TeamModel.getById(teamId);
            if (!team) return res.status(404).json({ success: false, error: "Team not found" });

            // 2. Squad list
            const squad = await SquadModel.getSquadByTeam(teamId);

            // 3. Powercards status
            const cards = await PowercardModel.getTeamCards(teamId);

            // 4. Global Leaderboard (Sorted by Purse)
            const teamsResult = await pool.query('SELECT team_id, team_name, purse_balance FROM teams ORDER BY purse_balance DESC, team_name ASC');
            
            // 5. Global Auction State (to know if Final XI is enabled)
            const state = await AuctionStateModel.getState();

            res.json({
                success: true,
                data: {
                    team: {
                        id: team.team_id,
                        name: team.team_name,
                        purse: team.purse_balance,
                        rtm_available: team.rtm_available
                    },
                    squad,
                    cards,
                    leaderboard: teamsResult.rows,
                    auctionState: state.current_state
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * View 3: Admin Master View
     * Returns: EVERYTHING. Full queue, Teams, Cards, Leaderboard.
     */
    async getAdminDashboardData(req, res) {
        try {
            // 1. Full Player Queue status
            const queueResult = await pool.query(`
                SELECT pq.queue_position, pq.status, p.name, p.player_id, p.role, p.is_riddle_player
                FROM player_queue pq
                JOIN players p ON pq.player_id = p.player_id
                ORDER BY pq.queue_position ASC
            `);

            // 2. All Teams with full details
            const teamsResult = await pool.query(`
                SELECT t.team_id, t.team_name, t.purse_balance, f.franchise_name
                FROM teams t
                LEFT JOIN franchises f ON t.franchise_id = f.franchise_id
                ORDER BY t.team_id ASC
            `);
            const teams = teamsResult.rows;

            // 3. For each team, get their squad and cards
            for (let team of teams) {
                const squad = await SquadModel.getSquadByTeam(team.team_id);
                const cards = await PowercardModel.getTeamCards(team.team_id);
                team.squad = squad;
                team.cards = cards;
            }

            // 4. State
            const state = await AuctionStateModel.getState();

            res.json({
                success: true,
                data: {
                    state,
                    queue: queueResult.rows,
                    teams
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new DashboardController();
