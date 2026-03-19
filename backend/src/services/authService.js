import pool from '../config/db.js';

class AuthService {
    
    /**
     * Authenticates a team by its name and password.
     * passwords in teams table are plaintext? Or hashed? 
     * Refresher says: "Teams are assigned passwords by the admin prior to the event."
     * Usually admin gives a string. 
     */
    async login(teamName, password) {
        const query = 'SELECT * FROM teams WHERE team_name = $1';
        const result = await pool.query(query, [teamName]);
        const team = result.rows[0];

        if (!team) {
            throw new Error("Team not found.");
        }

        // For this simple mock auction, we're using plaintext passwords as requested for Classroom simplicity
        if (team.password !== password) {
            throw new Error("Invalid password.");
        }

        return {
            role: 'TEAM',
            teamId: team.team_id,
            teamName: team.team_name,
            purseBalance: team.purse_balance
        };
    }

    /**
     * Authenticates the Master Admin using an environment-based secret.
     */
    async adminLogin(password) {
        const adminPass = process.env.ADMIN_PASSWORD || 'admin_secret';
        if (password !== adminPass) {
            throw new Error("Invalid Admin credentials.");
        }
        return { role: 'ADMIN', name: 'Master Admin' };
    }

    /**
     * Authenticates the Big Screen (Smartboard) view.
     */
    async screenLogin(password) {
        const screenPass = process.env.BIG_SCREEN_PASSWORD || 'screen_secret';
        if (password !== screenPass) {
            throw new Error("Invalid Screen credentials.");
        }
        return { role: 'SCREEN', name: 'Smartboard' };
    }
}

export default new AuthService();
