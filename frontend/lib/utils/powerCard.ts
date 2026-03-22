// Power Card Utility — Image Mapping & Logic
// Maps card keys to the high-quality assets in /public/power_cards/

export const POWER_CARD_IMAGES: Record<string, string> = {
    finalStrike: '/power_cards/FINAL_STRIKE.png',
    bidFreezer: '/power_cards/BID_FREEZER.png',
    godsEye: '/power_cards/GODS_EYE.png',
    mulligan: '/power_cards/SECOND_CHANCE.png', // SECOND_CHANCE is the new name for Mulligan asset
};

/**
 * Get the image path for a power card.
 * Handles franchise-specific RTM cards.
 */
export function getPowerCardImage(cardKey: string, shortName?: string): string {
    // Handle Right to Match (RTM) - franchise specific
    if (cardKey === 'rtm' || cardKey === 'rightToMatch') {
        if (!shortName) return '/power_cards/FINAL_STRIKE.png'; // Fallback
        return `/power_cards/${shortName.toLowerCase()}_rtm.png`;
    }

    // Default mapping for other cards
    return POWER_CARD_IMAGES[cardKey] || '/power_cards/FINAL_STRIKE.png';
}

/**
 * Get the display name for a power card.
 */
export function getPowerCardName(cardKey: string): string {
    const names: Record<string, string> = {
        finalStrike: 'Final Strike',
        bidFreezer: 'Bid Freezer',
        godsEye: "God's Eye",
        mulligan: 'Mulligan',
        rightToMatch: 'Right to Match',
        rtm: 'Right to Match',
    };
    return names[cardKey] || cardKey;
}
