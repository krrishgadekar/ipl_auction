import pool from '../config/db.js';

class FranchiseModel {
    async getById(franchiseId) {
        const result = await pool.query('SELECT * FROM franchises WHERE franchise_id = $1', [franchiseId]);
        return result.rows[0];
    }

    async getAll() {
        const result = await pool.query('SELECT * FROM franchises ORDER BY franchise_id');
        return result.rows;
    }
}

export default new FranchiseModel();
