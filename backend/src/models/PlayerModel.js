import pool from '../config/db.js';

class PlayerModel {
    async getById(playerId) {
        const result = await pool.query('SELECT * FROM players WHERE player_id = $1', [playerId]);
        return result.rows[0];
    }

    async getAll() {
        const result = await pool.query('SELECT * FROM players ORDER BY player_id');
        return result.rows;
    }

    async getByRole(role) {
        const result = await pool.query('SELECT * FROM players WHERE role = $1', [role]);
        return result.rows;
    }
}

export default new PlayerModel();
