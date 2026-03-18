import pool from '../config/db.js';

class QueueModel {
    async getNextPlayers(limit = 1) {
        // Fetch players that are WAITING, UNSOLD, or RELEASED, ordered by lowest queue_position
        const result = await pool.query(`
            SELECT pq.*, p.* 
            FROM player_queue pq 
            JOIN players p ON pq.player_id = p.player_id 
            WHERE pq.status IN ('WAITING', 'UNSOLD', 'RELEASED') 
            ORDER BY pq.queue_position ASC 
            LIMIT $1
        `, [limit]);
        return result.rows;
    }

    async incrementAppearance(playerId) {
        const result = await pool.query(
            'UPDATE player_queue SET appearance_count = appearance_count + 1 WHERE player_id = $1 RETURNING *',
            [playerId]
        );
        return result.rows[0];
    }

    async updateStatus(playerId, newStatus) {
        const result = await pool.query(
            'UPDATE player_queue SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE player_id = $2 RETURNING *',
            [newStatus, playerId]
        );
        return result.rows[0];
    }

    async moveToBack(playerId) {
        // Move the player to max queue position + 1 to ensure they are at the absolute end
        const maxQuery = await pool.query('SELECT MAX(queue_position) FROM player_queue');
        const nextPos = (maxQuery.rows[0].max || 0) + 1;

        const result = await pool.query(
            'UPDATE player_queue SET queue_position = $1, updated_at = CURRENT_TIMESTAMP WHERE player_id = $2 RETURNING *',
            [nextPos, playerId]
        );
        return result.rows[0];
    }
}

export default new QueueModel();
