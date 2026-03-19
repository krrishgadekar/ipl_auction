import CardModel from '../models/CardModel.js';
import purseAccountingService from './purseAccountingService.js';
import AuctionStateModel from '../models/AuctionStateModel.js';
import LogModel from '../models/LogModel.js';

class PowercardService {
    
    /**
     * Grants a powercard to a team (used during POWERCARD_BIDDING phase).
     */
    async grantPowercard(teamId, cardType, price) {
        // Auction deduction
        const { team, transaction } = await purseAccountingService.deductPurse(
            teamId,
            price,
            'POWERCARD_PURCHASE',
            `Purchased ${cardType} Powercard at auction`,
            false
        );

        // Grant ownership
        const card = await CardModel.grantCard(teamId, cardType);
        
        return { team, transaction, card };
    }

    /**
     * Simplified: Just marks a card as used in the DB.
     * Everything else is handled physically by the admin.
     */
    async usePowercard(teamId, cardType) {
        const card = await CardModel.getUnusedCard(teamId, cardType);
        if (!card) throw new Error(`Team ${teamId} does not own an unused ${cardType} card.`);

        const updatedCard = await CardModel.markCardUsed(card.id);
        
        await LogModel.logAction('POWERCARD_USED', 'card', card.id, `Team ${teamId} used ${cardType} card (marked manually by admin)`);

        return updatedCard;
    }

    /**
     * Ability for admin to revert a used card if a mistake was made.
     */
    async revertPowercard(cardId) {
        const result = await AuctionStateModel.pool.query(
            'UPDATE team_powercards SET is_used = false, used_at = NULL WHERE id = $1 RETURNING *',
            [cardId]
        );
        return result.rows[0];
    }

    /**
     * Sells a powercard to a team at a bid price.
     * Deducts purse and grants ownership.
     */
    async sellPowercard(teamId, cardType, price) {
        // 1. Deduct Purse
        const { team, transaction } = await purseAccountingService.deductPurse(
            teamId,
            price,
            'POWERCARD_PURCHASE',
            `Purchased ${cardType} Powercard for ${price} Cr`,
            false
        );

        // 2. Grant ownership
        const card = await CardModel.grantCard(teamId, cardType);
        
        await LogModel.logAction('SELL_POWERCARD', 'card', card.id, `Team ${teamId} bought ${cardType} for ${price} Cr`);
        
        return { team, transaction, card };
    }
}

export default new PowercardService();
