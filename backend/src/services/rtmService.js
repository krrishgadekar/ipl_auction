import TeamModel from '../models/TeamModel.js';
import pool from '../config/db.js';

class RtmService {

    /**
     * Simplified: Just marks the RTM as used for the team.
     * All physical bid-matching is done by the admin via sellPlayer.
     * Use this manually when a team officially invokes their Right-To-Match.
     */
    async useRtm(teamId, playerId, priceMatched = 0) {
        const team = await TeamModel.getById(teamId);
        if (!team) throw new Error("Team not found.");

        if (!team.rtm_available) {
             throw new Error(`Team ${teamId} does not have their Right-To-Match (RTM) available.`);
        }

        // 1. Mark RTM as Used
        await pool.query('UPDATE teams SET rtm_available = false WHERE team_id = $1', [teamId]);

        // 2. Log usage for transparency
        await pool.query(
            'INSERT INTO rtm_usage (team_id, player_id, price_matched) VALUES ($1, $2, $3)', 
            [teamId, playerId, priceMatched]
        );

        return { teamId, playerId, priceMatched, success: true };
    }

    /**
     * Ability for admin to revert an RTM use if mistaken.
     */
    async revertRtm(teamId) {
        await pool.query('UPDATE teams SET rtm_available = true WHERE team_id = $1', [teamId]);
    }
}

export default new RtmService();
