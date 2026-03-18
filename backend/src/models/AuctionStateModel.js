import pool from '../config/db.js';

class AuctionStateModel {
    async getState() {
        const result = await pool.query('SELECT * FROM auction_state WHERE auction_id = 1');
        return result.rows[0];
    }

    async updateState(newState, current_player_id = null) {
        const result = await pool.query(
            'UPDATE auction_state SET current_state = $1, current_player_id = $2, updated_at = CURRENT_TIMESTAMP WHERE auction_id = 1 RETURNING *',
            [newState, current_player_id]
        );
        return result.rows[0];
    }
}

export default new AuctionStateModel();
