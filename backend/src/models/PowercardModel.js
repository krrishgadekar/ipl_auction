import pool from '../config/db.js';

class PowercardModel {
    async getTeamCards(teamId) {
        const result = await pool.query(
            'SELECT * FROM team_powercards WHERE team_id = $1',
            [teamId]
        );
        return result.rows;
    }

    async markCardUsed(teamId, powercardType) {
        // Mark one specific card of this type as used
        const result = await pool.query(`
            UPDATE team_powercards 
            SET is_used = TRUE, used_at = CURRENT_TIMESTAMP
            WHERE id = (
                SELECT id FROM team_powercards 
                WHERE team_id = $1 AND powercard_type = $2 AND is_used = FALSE 
                LIMIT 1
            ) RETURNING *
        `, [teamId, powercardType]);
        return result.rows[0];
    }

    async logCardUsage(teamId, powercardType, targetTeamId = null, targetPlayerId = null) {
        const result = await pool.query(
            'INSERT INTO card_usage_log (team_id, powercard_type, target_team_id, target_player_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [teamId, powercardType, targetTeamId, targetPlayerId]
        );
        return result.rows[0];
    }

    async logRtmUsage(teamId, playerId, priceMatched) {
        const result = await pool.query(
            'INSERT INTO rtm_usage (team_id, player_id, price_matched) VALUES ($1, $2, $3) RETURNING *',
            [teamId, playerId, priceMatched]
        );
        return result.rows[0];
    }
}

export default new PowercardModel();
