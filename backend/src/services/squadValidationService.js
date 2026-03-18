import SquadModel from '../models/SquadModel.js';
import pool from '../config/db.js';

class SquadValidationService {
    
    // Core Rules
    MAX_SQUAD_SIZE = 15;
    MAX_FOREIGN = 5;
    MIN_FOREIGN = 2;
    MIN_ROLES = {
        BAT: 3,
        BOWL: 3,
        AR: 2,
        WK: 2
    };

    /**
     * Calculates the current squad breakdown for a team
     */
    async getSquadSummary(teamId) {
        // Fetch current squad joined with player details
        const query = `
            SELECT p.role, p.foreign_status 
            FROM squads s
            JOIN players p ON s.player_id = p.player_id
            WHERE s.team_id = $1
        `;
        const result = await pool.query(query, [teamId]);
        
        const summary = {
            total_players: result.rows.length,
            batsmen_count: 0,
            bowlers_count: 0,
            allrounders_count: 0,
            wicketkeepers_count: 0,
            foreign_players: 0,
            domestic_players: 0
        };

        result.rows.forEach(player => {
            if (player.role === 'BAT') summary.batsmen_count++;
            if (player.role === 'BOWL') summary.bowlers_count++;
            if (player.role === 'AR') summary.allrounders_count++;
            if (player.role === 'WK') summary.wicketkeepers_count++;
            
            if (player.foreign_status) summary.foreign_players++;
            else summary.domestic_players++;
        });

        return summary;
    }

    /**
     * Projects whether a proposed purchase violates strict constraints natively.
     */
    async validateSquadPurchase(teamId, playerId) {
        const summary = await this.getSquadSummary(teamId);
        
        // 1. Fetch proposed player details
        const playerResult = await pool.query('SELECT role, foreign_status FROM players WHERE player_id = $1', [playerId]);
        const player = playerResult.rows[0];
        if (!player) throw new Error("Validation Error: Player not found.");

        const isForeign = player.foreign_status;
        const role = player.role;

        // 2. Hard Cap Filters
        if (summary.total_players >= this.MAX_SQUAD_SIZE) {
            throw new Error(`Squad is full. Maximum limit of ${this.MAX_SQUAD_SIZE} reached.`);
        }
        
        if (isForeign && summary.foreign_players >= this.MAX_FOREIGN) {
            throw new Error(`Foreign player limit reached. Maximum limit of ${this.MAX_FOREIGN} foreign players allowed.`);
        }

        // 3. Projective Capacity Filters
        // Simulate adding the new player
        const projectedSummary = { ...summary };
        projectedSummary.total_players++;
        if (role === 'BAT') projectedSummary.batsmen_count++;
        if (role === 'BOWL') projectedSummary.bowlers_count++;
        if (role === 'AR') projectedSummary.allrounders_count++;
        if (role === 'WK') projectedSummary.wicketkeepers_count++;
        if (isForeign) projectedSummary.foreign_players++;
        else projectedSummary.domestic_players++;

        // Calculate minimum mandatory slots still needed after this purchase
        const neededBat = Math.max(0, this.MIN_ROLES.BAT - projectedSummary.batsmen_count);
        const neededBowl = Math.max(0, this.MIN_ROLES.BOWL - projectedSummary.bowlers_count);
        const neededAR = Math.max(0, this.MIN_ROLES.AR - projectedSummary.allrounders_count);
        const neededWK = Math.max(0, this.MIN_ROLES.WK - projectedSummary.wicketkeepers_count);
        
        const totalRoleSlotsNeeded = neededBat + neededBowl + neededAR + neededWK;
        const availableSlotsRemaining = this.MAX_SQUAD_SIZE - projectedSummary.total_players;

        if (totalRoleSlotsNeeded > availableSlotsRemaining) {
            throw new Error(
                `Purchase blocked mathematically mapping constraints. ` +
                `This player consumes a slot required to meet mandatory role minimums (` +
                `Needs ${neededBat} BAT, ${neededBowl} BOWL, ${neededAR} AR, ${neededWK} WK in ${availableSlotsRemaining} slots).`
            );
        }

        // Foreign Floor Check
        const neededForeign = Math.max(0, this.MIN_FOREIGN - projectedSummary.foreign_players);
        if (neededForeign > availableSlotsRemaining) {
            throw new Error(
                `Purchase blocked. Must acquire at least ${neededForeign} more foreign players in the remaining ${availableSlotsRemaining} squad slots.`
            );
        }

        return true;
    }
}

export default new SquadValidationService();
