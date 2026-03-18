import pool from '../config/db.js';
import AuctionStateModel from '../models/AuctionStateModel.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

class LeaderboardService {
    
    /**
     * Computes scores for all teams, ranks them, and publishes results.
     */
    async computeAndPublishResults(io) {
        const stateObj = await AuctionStateModel.getState();
        if (stateObj.current_state !== 'FINAL_XI_SELECTION') {
            throw new Error(`Results can only be computed in FINAL_XI_SELECTION state. Current state: ${stateObj.current_state}`);
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Fetch all teams with their franchise and purse info
            const teamsResult = await client.query(`
                SELECT t.team_id, t.team_name, t.purse_balance, f.bonus_points as franchise_bonus
                FROM teams t
                LEFT JOIN franchises f ON t.franchise_id = f.franchise_id
            `);
            const teams = teamsResult.rows;

            const teamScores = [];

            for (const team of teams) {
                // 2. Fetch Final XI for this team
                const xiResult = await client.query(`
                    SELECT p.overall_points, p.sub_overall_points, fx.is_captain, fx.is_vice_captain
                    FROM final_xi fx
                    JOIN players p ON fx.player_id = p.player_id
                    WHERE fx.team_id = $1
                `, [team.team_id]);

                let totalPlayerPoints = 0;
                xiResult.rows.forEach(player => {
                    const basePoints = Number(player.overall_points) + Number(player.sub_overall_points);
                    let multiplier = 1.0;
                    if (player.is_captain) multiplier = 2.0;
                    else if (player.is_vice_captain) multiplier = 1.5;
                    
                    totalPlayerPoints += (basePoints * multiplier);
                });

                // 3. Compute bonuses
                const franchiseBonus = Number(team.franchise_bonus || 0);
                const purseBonus = (Number(team.purse_balance) / 120.0) * 5.0; // 5 points max for 120 Cr remaining

                const totalPoints = totalPlayerPoints + franchiseBonus + purseBonus;
                teamScores.push({
                    team_id: team.team_id,
                    team_name: team.team_name,
                    total_points: Number(totalPoints.toFixed(2))
                });
            }

            // 4. Rank Teams
            teamScores.sort((a, b) => b.total_points - a.total_points);
            teamScores.forEach((score, index) => {
                score.rank = index + 1;
            });

            // 5. Store in Leaderboard
            await client.query('DELETE FROM leaderboard'); // Clear old data
            const insertLeaderboardQuery = `
                INSERT INTO leaderboard (team_id, total_points, rank)
                VALUES ($1, $2, $3)
            `;
            for (const score of teamScores) {
                await client.query(insertLeaderboardQuery, [score.team_id, score.total_points, score.rank]);
            }

            // 6. Update Auction State
            await AuctionStateModel.updateState('RESULTS_PUBLISHED', null);

            await client.query('COMMIT');

            // 7. Broadcast via Socket
            if (io) {
                io.emit(SOCKET_EVENTS.LEADERBOARD_UPDATED, teamScores);
            }

            return teamScores;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    /**
     * Returns the current leaderboard entries ordered by rank.
     */
    async getLeaderboard() {
        const query = `
            SELECT l.team_id, t.team_name, l.total_points, l.rank
            FROM leaderboard l
            JOIN teams t ON l.team_id = t.team_id
            ORDER BY l.rank ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    }
}

export default new LeaderboardService();
