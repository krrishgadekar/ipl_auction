// ═══════════════════════════════════════════════════════════════
// EVENTS / CONSTANTS
// ═══════════════════════════════════════════════════════════════
export const SOCKET_EVENTS = {
    AUCTION_STATE_CHANGED: 'auction_state_changed',
    PLAYER_INTRODUCED: 'player_introduced',
    PLAYER_SOLD: 'player_sold',
    PLAYER_UNSOLD: 'player_unsold',
    PLAYER_RELEASED: 'player_released',
    TEAM_PURSE_UPDATED: 'team_purse_updated',
    SQUAD_UPDATED: 'squad_updated',
    CARD_USED: 'card_used',
    POWERCARD_USED: 'powercard_used',
    PLAYER_OVERRIDDEN: 'player_overridden',
    BID_FREEZE_APPLIED: 'bid_freeze_applied',
    RTM_USED: 'rtm_used',
    FINAL_XI_SUBMITTED: 'final_xi_submitted',
    LEADERBOARD_UPDATED: 'leaderboard_updated',
    ADMIN_CORRECTION: 'admin_correction',
    RIDDLE_REVEALED: 'riddle_revealed',

    // Client -> Server events (if necessary, though backend is primarily the source of truth)
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
};
