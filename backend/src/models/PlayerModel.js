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

    async clearRiddleStatus(playerId) {
        const result = await pool.query(
            'UPDATE players SET is_riddle_player = false WHERE player_id = $1 RETURNING *',
            [playerId]
        );
        return result.rows[0];
    }
}

export default new PlayerModel();
