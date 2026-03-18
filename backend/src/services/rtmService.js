import purseAccountingService from './purseAccountingService.js';
import AuctionStateModel from '../models/AuctionStateModel.js';
import SquadModel from '../models/SquadModel.js';
import TeamModel from '../models/TeamModel.js';
import QueueModel from '../models/QueueModel.js';
import squadValidationService from './squadValidationService.js';
import pool from '../config/db.js';

class RtmService {

    async useRtm(teamId, playerId) {
        // 1. Fetch relevant models
        const stateObj = await AuctionStateModel.getState();
        const team = await TeamModel.getById(teamId);
        
        if (!team) throw new Error("Team not found.");

        const playerResult = await pool.query('SELECT * FROM players WHERE player_id = $1', [playerId]);
        const player = playerResult.rows[0];

        if (!player) throw new Error("Player not found.");

        // 2. Validate Queue Status (Must be exactly SOLD)
        const queueResult = await QueueModel.pool.query('SELECT status FROM player_queue WHERE player_id = $1', [playerId]);
        const queueStatus = queueResult.rows[0]?.status;

        if (queueStatus !== 'SOLD') {
             throw new Error("RTM can only be used on players who were just SOLD.");
        }

        // 3. Validate RTM availability
        if (!team.rtm_available) {
             throw new Error(`Team ${teamId} does not have their Right-To-Match (RTM) available.`);
        }

        // 4. Validate Franchise Ownership
        if (!player.franchise_id || player.franchise_id !== team.franchise_id) {
             throw new Error("Player does not belong to the franchise owned by this team.");
        }

        // 5. Fetch Squad Entry (Identifies original winner and price)
        const squadResult = await SquadModel.pool.query('SELECT * FROM squads WHERE player_id = $1', [playerId]);
        const squadEntry = squadResult.rows[0];

        if (!squadEntry) {
             throw new Error("Player is not currently assigned to any squad.");
        }

        const oldTeamId = squadEntry.team_id;
        const highestBid = Number(squadEntry.purchase_price);

        if (oldTeamId === teamId) {
             throw new Error("Cannot use RTM on a player your team already won.");
        }

        // 6. Check Auction Flow Rules (Closed Bidding cutoff and Bid Freezers)
        if (highestBid >= 25) {
             throw new Error("RTM cannot be used during closed bidding (>= 25 Cr).");
        }

        if (stateObj.frozen_team_id === teamId) {
             throw new Error(`RTM Execution blocked: Team ${teamId} is currently frozen by Bid Freezer.`);
        }

        // 7. Prevent the RTM if it breaks the new team's 15-Player math or Role minimums dynamically
        await squadValidationService.validateSquadPurchase(teamId, playerId);

        // ===== EXECUTION MATRIX =====

        // 8. Process Financials via Ledger (Will throw if the new team cannot afford it)
        // Deduct new team first to ensure they can mathematically afford it to avoid half-states
        const { team: newTeam } = await purseAccountingService.deductPurse(teamId, highestBid, 'RTM_USAGE', `Used RTM to match ${highestBid} Cr for player ${playerId}`);

        // Refund original team
        const { team: oldTeam } = await purseAccountingService.refundPurse(oldTeamId, highestBid, 'PLAYER_PURCHASE_REFUND', `Refunded ${highestBid} Cr as player ${playerId} was taken via RTM`);

        // 8. Overwrite Squad Assignment
        await SquadModel.removePlayerFromSquad(oldTeamId, playerId);
        const newSquadEntry = await SquadModel.addPlayerToSquad(teamId, playerId, highestBid, 'RTM');

        // 9. Mark RTM as Used for Team
        await pool.query('UPDATE teams SET rtm_available = false WHERE team_id = $1', [teamId]);

        // 10. Log formal usage into rtm_usage
        await pool.query('INSERT INTO rtm_usage (team_id, player_id, price_matched) VALUES ($1, $2, $3)', [teamId, playerId, highestBid]);

        const newSquadSummary = await squadValidationService.getSquadSummary(teamId);
        const oldSquadSummary = await squadValidationService.getSquadSummary(oldTeamId);

        return {
             newTeam,
             oldTeam,
             newSquadEntry,
             oldTeamId,
             teamId,
             playerId,
             newSquadSummary,
             oldSquadSummary
        };
    }
}

export default new RtmService();
