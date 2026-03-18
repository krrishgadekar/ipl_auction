import pool from '../config/db.js';

class TransactionModel {
    async logTransaction(teamId, transactionType, amount, description) {
        const result = await pool.query(
            'INSERT INTO purse_transactions (team_id, transaction_type, amount, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [teamId, transactionType, amount, description]
        );
        return result.rows[0];
    }

    async getTeamTransactions(teamId) {
        const result = await pool.query(
            'SELECT * FROM purse_transactions WHERE team_id = $1 ORDER BY created_at DESC',
            [teamId]
        );
        return result.rows;
    }
}

export default new TransactionModel();
