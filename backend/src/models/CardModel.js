import pool from '../config/db.js';

class CardModel {
    /**
     * Finds if a team owns a specific powercard, and if it's unused.
     */
    async getUnusedCard(teamId, cardType) {
        const query = `
            SELECT * FROM team_powercards 
            WHERE team_id = $1 AND powercard_type = $2 AND is_used = false
            LIMIT 1
        `;
        const result = await pool.query(query, [teamId, cardType]);
        return result.rows[0];
    }

    /**
     * Marks a card as used.
     */
    async markCardUsed(cardId) {
        const query = `
            UPDATE team_powercards
            SET is_used = true, used_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [cardId]);
        return result.rows[0];
    }

    /**
     * Grants a powercard to a team (used during POWERCARD_BIDDING phase).
     */
    async grantCard(teamId, cardType) {
        const query = `
            INSERT INTO team_powercards (team_id, powercard_type, is_used)
            VALUES ($1, $2, false)
            RETURNING *
        `;
        const result = await pool.query(query, [teamId, cardType]);
        return result.rows[0];
    }
}

export default new CardModel();
