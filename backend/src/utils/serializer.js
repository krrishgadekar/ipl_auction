// ═══════════════════════════════════════════════════════════════
// Response Serializer — Transforms backend snake_case to
// frontend-compatible camelCase with computed fields
// ═══════════════════════════════════════════════════════════════

const TOTAL_BUDGET = 120;
const SQUAD_LIMIT = 15;

// ── Category mapping (backend → frontend display names) ──────
const CATEGORY_DISPLAY = {
    BAT: 'Batsmen',
    BOWL: 'Bowlers',
    AR: 'All-rounders',
    WK: 'Wicketkeepers',
};

const NATIONALITY_DISPLAY = {
    INDIAN: 'Indian',
    OVERSEAS: 'Overseas',
};

// ── Player serializer ────────────────────────────────────────

export function serializePlayer(p) {
    if (!p) return null;
    return {
        // Original fields (snake_case preserved for backend consumers)
        ...p,
        // camelCase aliases for frontend
        player: p.name,
        basePrice: Number(p.base_price),
        imageUrl: `/player_photos/${p.rank}.avif`,
        isRiddle: p.is_riddle,
        // Display category/nationality
        category: CATEGORY_DISPLAY[p.category] || p.category,
        nationality: NATIONALITY_DISPLAY[p.nationality] || p.nationality,
        // Keep raw for backend use
        _rawCategory: p.category,
        _rawNationality: p.nationality,
    };
}

// ── Team serializer ──────────────────────────────────────────

export function serializeTeam(t) {
    if (!t) return null;
    return {
        ...t,
        // camelCase aliases
        shortName: t.brand_key || t.name?.substring(0, 3).toUpperCase(),
        primaryColor: t.primary_color,
        franchiseName: t.franchise_name,
        budgetRemaining: Number(t.purse_remaining),
        budgetUsed: TOTAL_BUDGET - Number(t.purse_remaining),
        totalBudget: TOTAL_BUDGET,
        squadCount: t.squad_count,
        squadLimit: SQUAD_LIMIT,
        overseasCount: t.overseas_count,
        brandScore: Number(t.brand_score),
        logo: t.logo || '🏏', // fallback emoji
        // Power cards transform (array → named object for frontend)
        ...(t.power_cards ? {
            powerCards: transformPowerCards(t.power_cards),
        } : {}),
        // Players (ranks array for frontend)
        ...(t.team_players ? {
            players: t.team_players.map(tp => tp.player?.rank || tp.player_id),
        } : {}),
    };
}

function transformPowerCards(cards) {
    if (!Array.isArray(cards)) return cards;
    const mapped = {
        finalStrike: { name: 'Final Strike', cost: 1, available: false, used: false },
        bidFreezer: { name: 'Bid Freezer', cost: 1, available: false, used: false },
        godsEye: { name: "God's Eye", cost: 1, available: false, used: false },
        mulligan: { name: 'Mulligan', cost: 1, available: false, used: false },
        rightToMatch: { name: 'Right to Match', cost: 1, available: false, used: false },
    };
    const TYPE_MAP = {
        FINAL_STRIKE: 'finalStrike',
        BID_FREEZER: 'bidFreezer',
        GOD_EYE: 'godsEye',
        MULLIGAN: 'mulligan',
        RIGHT_TO_MATCH: 'rightToMatch',
    };
    for (const card of cards) {
        const key = TYPE_MAP[card.type];
        if (key) {
            mapped[key] = {
                name: mapped[key].name,
                cost: 1,
                available: true,
                used: card.is_used,
            };
        }
    }
    return mapped;
}

// ── AuctionState serializer ──────────────────────────────────

export function serializeAuctionState(state, currentPlayer, highestBidder, teams) {
    if (!state) return null;
    return {
        // Phase as status (frontend expects 'status')
        status: mapPhaseToStatus(state.phase, currentPlayer),
        phase: state.phase,
        auctionDay: state.auction_day,

        // Current player
        currentPlayer: currentPlayer ? serializePlayer(currentPlayer) : null,
        currentPlayerRank: currentPlayer?.rank || null,
        playerStatus: currentPlayer ? 'AVAILABLE' : 'IDLE',

        // Bidding
        currentBid: Number(state.current_bid) || 0,
        baseBid: currentPlayer ? Number(currentPlayer.base_price) : 0,
        highestBidder: highestBidder?.name || null,
        highestBidderId: state.highest_bidder_id,
        bidHistory: Array.isArray(state.bid_history) ? state.bid_history : [],

        // Sold info
        soldPrice: state.last_sold_price ? Number(state.last_sold_price) : undefined,
        boughtBy: state.last_sold_team_name || undefined,
        boughtByTeamId: state.last_sold_team_id || undefined,

        // Power cards
        activePowerCard: state.active_power_card,
        activePowerCardTeam: state.active_power_card_team,
        bidFreezerTargetTeam: state.bid_frozen_team_id,
        sealedBids: {},
        godsEyeRevealed: state.gods_eye_revealed,

        // Teams
        teams: teams ? teams.map(serializeTeam) : [],
    };
}

/**
 * Map backend AuctionPhase to frontend-compatible status strings
 */
function mapPhaseToStatus(phase, currentPlayer) {
    if (phase === 'LIVE' && currentPlayer) return 'BIDDING';
    if (phase === 'LIVE' && !currentPlayer) return 'IDLE';
    if (phase === 'POST_AUCTION') return 'POST_AUCTION';
    if (phase === 'COMPLETED') return 'COMPLETED';
    return phase; // NOT_STARTED, FRANCHISE_PHASE, POWER_CARD_PHASE
}

export default {
    serializePlayer,
    serializeTeam,
    serializeAuctionState,
};
