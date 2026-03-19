// ═══════════════════════════════════════════════════════════════
// Squad Validation Service (Post-Auction Rules)
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/db.js';

class SquadValidationService {
    /**
     * Calculates the current squad breakdown for a team
     */
    async getSquadSummary(teamId) {
        const squad = await prisma.teamPlayer.findMany({
            where: { team_id: teamId },
            include: { player: true },
        });

        const summary = {
            total_players: squad.length,
            batsmen_count: 0,
            bowlers_count: 0,
            allrounders_count: 0,
            wicketkeepers_count: 0,
            foreign_players: 0,
            domestic_players: 0
        };

        squad.forEach(tp => {
            const player = tp.player;
            if (player.category === 'BAT') summary.batsmen_count++;
            if (player.category === 'BOWL') summary.bowlers_count++;
            if (player.category === 'AR') summary.allrounders_count++;
            if (player.category === 'WK') summary.wicketkeepers_count++;
            
            if (player.nationality === 'OVERSEAS') summary.foreign_players++;
            else summary.domestic_players++;
        });

        return summary;
    }

    /**
     * Used during the live auction to prevent invalid bids.
     */
    async validateSquadPurchase(teamId, playerId) {
        const summary = await this.getSquadSummary(teamId);
        
        // 1. Fetch proposed player details
        const player = await prisma.player.findUnique({ where: { id: playerId } });
        if (!player) throw new Error("Validation Error: Player not found.");

        const isForeign = player.nationality === 'OVERSEAS';
        const role = player.category;

        // 2. Hard Cap Filters
        if (summary.total_players >= 15) {
            throw new Error(`Squad is full. Maximum limit of 15 reached.`);
        }
        
        if (isForeign && summary.foreign_players >= 5) {
            throw new Error(`Foreign player limit reached. Maximum limit of 5 foreign players allowed.`);
        }

        // Projective Capacity Filters Removed (User requested freedom to buy)
        return true;
    }
}

export default new SquadValidationService();
