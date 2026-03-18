import pool from '../config/db.js';

class LogModel {
    async logAction(adminAction, entityType = null, entityId = null, description = null, previousValue = null, newValue = null) {
        const result = await pool.query(
            'INSERT INTO audit_log (admin_action, entity_type, entity_id, description, previous_value, new_value) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [adminAction, entityType, entityId, description, previousValue, newValue]
        );
        return result.rows[0];
    }

    async getRecentLogs(limit = 50) {
        const result = await pool.query(
            'SELECT * FROM audit_log ORDER BY created_at DESC LIMIT $1',
            [limit]
        );
        return result.rows;
    }
}

export default new LogModel();
