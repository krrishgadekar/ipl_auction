import pool from '../config/db.js';
import AuctionStateModel from '../models/AuctionStateModel.js';
import SquadModel from '../models/SquadModel.js';

class FinalXIService {
    
    /**
     * Validates and saves the Final XI for a team
     */
    async submitFinalXI(teamId, playerIds, captainId, viceCaptainId) {
        // 1. Validation
        const stateObj = await AuctionStateModel.getState();
        if (stateObj.current_state !== 'FINAL_XI_SELECTION') {
            throw new Error(`Submissions only allowed in FINAL_XI_SELECTION state. Current state: ${stateObj.current_state}`);
        }

        if (playerIds.length !== 11) {
            throw new Error("Exactly 11 players must be selected.");
        }

        if (!playerIds.includes(captainId)) {
            throw new Error("Captain must be part of the selected 11.");
        }

        if (!playerIds.includes(viceCaptainId)) {
            throw new Error("Vice-captain must be part of the selected 11.");
        }

        if (captainId === viceCaptainId) {
            throw new Error("Captain and vice-captain must be different players.");
        }

        // Verify squad ownership
        const squadPlayers = await SquadModel.getSquadByTeam(teamId);
        const squadIds = squadPlayers.map(p => p.player_id);
        
        for (const pid of playerIds) {
            if (!squadIds.includes(pid)) {
                throw new Error(`Player ID ${pid} does not belong to your squad.`);
            }
        }

        // 2. Execution (Transaction)
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Clear existing Final XI for this team
            await client.query('DELETE FROM final_xi WHERE team_id = $1', [teamId]);

            // Insert new Final XI
            const insertQuery = `
                INSERT INTO final_xi (team_id, player_id, is_captain, is_vice_captain)
                VALUES ($1, $2, $3, $4)
            `;

            for (const pid of playerIds) {
                await client.query(insertQuery, [
                    teamId, 
                    pid, 
                    pid === captainId, 
                    pid === viceCaptainId
                ]);
            }

            await client.query('COMMIT');
            return { success: true, teamId, playerIds, captainId, viceCaptainId };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    /**
     * Retrieves all Final XI submissions for admin review
     */
    async getAllSubmissions() {
        const query = `
            SELECT 
                t.team_id, 
                t.team_name,
                p.player_id, 
                p.name as player_name, 
                p.role,
                fx.is_captain, 
                fx.is_vice_captain
            FROM final_xi fx
            JOIN teams t ON fx.team_id = t.team_id
            JOIN players p ON fx.player_id = p.player_id
            ORDER BY t.team_id, fx.is_captain DESC, fx.is_vice_captain DESC
        `;
        const result = await pool.query(query);
        
        // Group by team
        const submissions = {};
        result.rows.forEach(row => {
            if (!submissions[row.team_id]) {
                submissions[row.team_id] = {
                    team_id: row.team_id,
                    team_name: row.team_name,
                    players: []
                };
            }
            submissions[row.team_id].players.push({
                player_id: row.player_id,
                player_name: row.player_name,
                role: row.role,
                is_captain: row.is_captain,
                is_vice_captain: row.is_vice_captain
            });
        });

        return Object.values(submissions);
    }
}

export default new FinalXIService();
