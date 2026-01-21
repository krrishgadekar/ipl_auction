// Database Schema for IPL Auction System
// Tables: auctions, teams, players, squad_players, bids, power_cards, audit_logs

export interface Auction {
    id: number;
    day: 1 | 2;
    status: 'idle' | 'active' | 'paused' | 'completed';
    current_player_id: number | null;
    current_player_rank: number | null;
    current_bid_amount: number;
    current_bidding_team_id: number | null;
    auction_state: 'idle' | 'announcing' | 'bidding' | 'closed_bidding' | 'sold' | 'unsold';
    timer_seconds: number;
    created_at: string;
    updated_at: string;
}

export interface Team {
    id: number;
    auction_id: number;
    name: string;
    franchise: string; // IPL franchise for RTM matching
    budget_total: number;
    budget_remaining: number;
    budget_spent: number;
    rtm_available: boolean;
    rtm_used: boolean;
    squad_count: number;
    final_xi_locked: boolean;
    captain_player_id: number | null;
    vice_captain_player_id: number | null;
    final_rating: number;
    created_at: string;
    updated_at: string;
}

export interface Player {
    id: number;
    rank: number; // 1-246, primary key from CSV
    name: string;
    team: string; // Current IPL franchise
    role: string; // Raw role string
    category: 'Batsmen' | 'Bowlers' | 'All-rounders' | 'Wicketkeepers';
    pool: 'BAT_WK' | 'BOWL' | 'AR'; // CRUCIAL for logic
    rating: number; // 40-99, PRIMARY rating
    grade: 'A' | 'B' | 'C' | 'D'; // Derived from rating
    legacy: number; // 0-10, bonus points
    profile_url: string;

    // Sub-ratings (shared)
    sub_experience: number; // Based on matches, capped at 100

    // Pool-specific sub-ratings (nullable based on pool)
    // BAT_WK
    sub_scoring: number | null;
    sub_impact: number | null;
    sub_consistency: number | null;

    // BOWL
    sub_wicket_taking: number | null;
    sub_economy: number | null;
    sub_efficiency: number | null;

    // AR
    sub_batting: number | null;
    sub_bowling: number | null;
    sub_versatility: number | null; // Lower of batting/bowling

    base_price: number; // In crores
    is_riddle: boolean;
    riddle_text: string | null;
    is_unsold: boolean;
    reintroduced: boolean;
    reduced_base_price: number | null;

    created_at: string;
}

export interface SquadPlayer {
    id: number;
    team_id: number;
    player_id: number;
    player_rank: number; // Denormalized for quick lookup
    purchase_price: number; // In crores
    purchased_at: string;
    is_final_xi: boolean;
    is_captain: boolean;
    is_vice_captain: boolean;

    // Join fields (not in DB, populated by queries)
    player?: Player;
}

export interface Bid {
    id: number;
    auction_id: number;
    player_id: number;
    player_rank: number;
    team_id: number;
    amount: number; // In crores
    bid_type: 'open' | 'closed';
    timestamp: string;

    // Join fields
    team?: Team;
    player?: Player;
}

export interface PowerCard {
    id: number;
    team_id: number;
    card_type: 'final_strike' | 'bid_freezer' | 'gods_eye' | 'mulligan';
    card_name: string;
    price: number; // Deduction amount
    available: boolean;
    used: boolean;
    used_at: string | null;
    used_on_player_id: number | null;
    effect_data: string | null; // JSON for additional context

    created_at: string;
}

export interface AuditLog {
    id: number;
    auction_id: number;
    action: string; // e.g., 'bid_placed', 'player_sold', 'power_card_used', 'undo', 'manual_override'
    user_role: 'super_admin' | 'auctioneer' | 'admin_operator' | 'team' | 'viewer';
    entity_type: string; // 'player', 'team', 'bid', 'power_card', etc.
    entity_id: number | null;
    data: string; // JSON snapshot of the action
    timestamp: string;
}

export interface UndoAction {
    id: number;
    auction_id: number;
    action_type: string;
    reverse_action: string; // SQL or JSON describing how to undo
    data_snapshot: string; // JSON of state before action
    can_undo: boolean;
    created_at: string;
}

// Grade calculation helper
export function calculateGrade(rating: number): 'A' | 'B' | 'C' | 'D' {
    if (rating >= 85) return 'A';
    if (rating >= 70) return 'B';
    if (rating >= 55) return 'C';
    return 'D';
}

// Final Rating calculation
export interface FinalRatingInput {
    squad: SquadPlayer[];
    captainPlayerId: number;
    viceCaptainPlayerId: number;
}

export function calculateFinalRating(input: FinalRatingInput): number {
    const { squad, captainPlayerId, viceCaptainPlayerId } = input;

    // Filter to Final XI (should be exactly 11)
    const finalXI = squad.filter(sp => sp.is_final_xi);

    if (finalXI.length !== 11) {
        throw new Error('Final XI must have exactly 11 players');
    }

    let totalRating = 0;
    let totalLegacy = 0;
    let captainBonus = 0;
    let viceCaptainBonus = 0;

    finalXI.forEach(sp => {
        const player = sp.player;
        if (!player) return;

        totalRating += player.rating;
        totalLegacy += player.legacy;

        if (sp.player_id === captainPlayerId) {
            captainBonus = player.rating * 2; // 2× captain rating
        }

        if (sp.player_id === viceCaptainPlayerId) {
            viceCaptainBonus = player.rating * 1.5; // 1.5× vice-captain rating
        }
    });

    // Formula: Sum(11 ratings) + Sum(11 legacy) + Captain(2×) + Vice-Captain(1.5×)
    const finalRating = totalRating + totalLegacy + captainBonus + viceCaptainBonus;

    return Math.round(finalRating * 100) / 100; // Round to 2 decimal places
}

// Bid increment rules
export const BID_INCREMENTS = [0.5, 1, 2, 3]; // In crores

export const CLOSED_BIDDING_THRESHOLD = 17; // ₹17 CR

export const BUDGET_PER_TEAM = 100; // ₹100 Crores

export const SQUAD_LIMITS = {
    min: 11,
    max: 18,
    finalXI: 11,
};

export const POWER_CARD_PRICES = {
    final_strike: 7,
    bid_freezer: 5,
    gods_eye: 4,
    mulligan: 3,
};

export const POWER_CARD_NAMES = {
    final_strike: 'Final Strike',
    bid_freezer: 'Bid Freezer',
    gods_eye: "God's Eye",
    mulligan: 'Mulligan',
};
