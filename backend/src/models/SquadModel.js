import pool from '../config/db.js';

class SquadModel {
    async addPlayerToSquad(teamId, playerId, purchasePrice, purchaseType = 'NORMAL_AUCTION') {
        const result = await pool.query(
            'INSERT INTO squads (team_id, player_id, purchase_price, purchase_type) VALUES ($1, $2, $3, $4) RETURNING *',
            [teamId, playerId, purchasePrice, purchaseType]
        );
        return result.rows[0];
    }

    async getSquadByTeam(teamId) {
        const result = await pool.query(`
            SELECT s.*, p.name, p.role, p.grade, p.foreign_status, p.overall_points 
            FROM squads s
            JOIN players p ON s.player_id = p.player_id
            WHERE s.team_id = $1
        `, [teamId]);
        return result.rows;
    }

    async removePlayerFromSquad(teamId, playerId) {
        const result = await pool.query(
            'DELETE FROM squads WHERE team_id = $1 AND player_id = $2 RETURNING *',
            [teamId, playerId]
        );
        return result.rows[0];
    }
}

export default new SquadModel();
