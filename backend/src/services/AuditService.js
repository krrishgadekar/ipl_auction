import LogModel from '../models/LogModel.js';

class AuditService {
    /**
     * Records an admin action in the audit log.
     */
    async logAction(action, entityType, entityId, previousValue, newValue, description) {
        const prevStr = previousValue ? (typeof previousValue === 'object' ? JSON.stringify(previousValue) : String(previousValue)) : null;
        const newStr = newValue ? (typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue)) : null;
        
        return await LogModel.logAction(
            action,
            entityType,
            entityId,
            description,
            prevStr,
            newStr
        );
    }

    /**
     * Retrieves audit logs based on filters.
     */
    async getAuditLogs(filters = {}) {
        const { entity_type, entity_id, team_id, action_type } = filters;
        let query = 'SELECT * FROM audit_log WHERE 1=1';
        const params = [];

        if (entity_type) {
            params.push(entity_type);
            query += ` AND entity_type = $${params.length}`;
        }
        if (entity_id) {
            params.push(entity_id);
            query += ` AND entity_id = $${params.length}`;
        }
        if (action_type) {
            params.push(action_type);
            query += ` AND admin_action = $${params.length}`;
        }

        query += ' ORDER BY created_at DESC LIMIT 100';
        
        const result = await LogModel.pool.query(query, params);
        return result.rows;
    }
}

export default new AuditService();
