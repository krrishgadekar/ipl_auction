import pool from '../config/db.js';

class TeamModel {
    async getById(teamId) {
        const result = await pool.query('SELECT * FROM teams WHERE team_id = $1', [teamId]);
        return result.rows[0];
    }

    async updatePurse(teamId, amount) {
        const result = await pool.query(
            'UPDATE teams SET purse_balance = purse_balance + $1 WHERE team_id = $2 RETURNING *',
            [amount, teamId]
        );
        return result.rows[0];
    }

    async updateFranchise(teamId, franchiseId) {
        const result = await pool.query(
            'UPDATE teams SET franchise_id = $1 WHERE team_id = $2 RETURNING *',
            [franchiseId, teamId]
        );
        return result.rows[0];
    }

    async setRtmAvailable(teamId, status) {
        const result = await pool.query(
            'UPDATE teams SET rtm_available = $1 WHERE team_id = $2 RETURNING *',
            [status, teamId]
        );
        return result.rows[0];
    }
}

export default new TeamModel();
