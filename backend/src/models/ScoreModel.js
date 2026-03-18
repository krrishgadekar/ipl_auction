import pool from '../config/db.js';

class ScoreModel {
    async setFinalXiPlayer(teamId, playerId, isCaptain = false, isViceCaptain = false) {
        const result = await pool.query(
            `INSERT INTO final_xi (team_id, player_id, is_captain, is_vice_captain) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (team_id, player_id) 
             DO UPDATE SET is_captain = EXCLUDED.is_captain, is_vice_captain = EXCLUDED.is_vice_captain 
             RETURNING *`,
            [teamId, playerId, isCaptain, isViceCaptain]
        );
        return result.rows[0];
    }

    async getTeamFinalXi(teamId) {
        const result = await pool.query(`
            SELECT f.*, p.name, p.role, p.overall_points 
            FROM final_xi f
            JOIN players p ON f.player_id = p.player_id
            WHERE f.team_id = $1
        `, [teamId]);
        return result.rows;
    }

    async updateLeaderboard(teamId, totalPoints, rank) {
         const result = await pool.query(
            `INSERT INTO leaderboard (team_id, total_points, rank) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (team_id) 
             DO UPDATE SET total_points = EXCLUDED.total_points, rank = EXCLUDED.rank, updated_at = CURRENT_TIMESTAMP 
             RETURNING *`,
            [teamId, totalPoints, rank]
        );
        return result.rows[0];
    }
    
    async getLeaderboard() {
        const result = await pool.query('SELECT * FROM leaderboard ORDER BY rank ASC, total_points DESC');
        return result.rows;
    }
}

export default new ScoreModel();
