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
    const isRiddle = !!p.is_riddle;
    
    return {
        // Original fields (snake_case preserved for backend consumers)
        ...p,
        // camelCase aliases for frontend
        player: isRiddle ? '??? RIDDLE PLAYER ???' : p.name,
        basePrice: isRiddle ? null : Number(p.base_price),
        grade: isRiddle ? '?' : p.grade,
        imageUrl: isRiddle ? null : `/player_photos/${p.rank}.avif`,
        isRiddle: isRiddle,
        nationality_raw: isRiddle ? 'Overseas' : p.nationality_raw, // Mask specific nationality too
        riddleTitle: p.riddle_title,
        riddleQuestion: p.riddle_question,
        // Display category/nationality
        category: isRiddle ? '???' : (CATEGORY_DISPLAY[p.category] || p.category),
        nationality: isRiddle ? '???' : (NATIONALITY_DISPLAY[p.nationality] || p.nationality),
        // Mask all numeric stats if riddle
        ...(isRiddle ? {
            rating: 0, matches: 0, bat_runs: 0, bat_sr: 0, bat_average: 0,
            bowl_wickets: 0, bowl_eco: 0, bowl_avg: 0,
            sub_experience: 0, sub_scoring: 0, sub_impact: 0, sub_consistency: 0,
            sub_wicket_taking: 0, sub_economy: 0, sub_efficiency: 0,
            sub_batting: 0, sub_bowling: 0, sub_versatility: 0,
            legacy: 0
        } : {}),
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
        shortName: t.brand_key || (t.name?.startsWith('Team ') ? t.name.split(' ').slice(1).join(' ') : t.name?.substring(0, 4).toUpperCase()),
        primaryColor: t.primary_color,
        franchiseName: t.franchise_name,
        budgetRemaining: Number(t.purse_remaining),
        budgetUsed: TOTAL_BUDGET - Number(t.purse_remaining),
        totalBudget: TOTAL_BUDGET,
        squadCount: t.squad_count,
        squadLimit: SQUAD_LIMIT,
        overseasCount: t.overseas_count,
        batsmanCount: t.batsmen_count,
        bowlerCount: t.bowlers_count,
        allrounderCount: t.ar_count,
        wicketkeeperCount: t.wk_count,
        brandScore: Number(t.brand_score),
        logo: t.logo || (t.brand_key ? `/teams/${t.brand_key.toLowerCase()}.png` : null), // Auto-derive from brand_key
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

        // Sequence / Active Item
        currentItemId: state.current_item_id,
        currentSequenceId: state.current_sequence_id,
        currentSequenceIndex: state.current_sequence_index,

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
