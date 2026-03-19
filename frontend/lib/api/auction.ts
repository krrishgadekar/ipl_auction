// ═══════════════════════════════════════════════════════════════
// Frontend API — Auction State
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Types ────────────────────────────────────────────────────

export interface AuctionState {
    id: number;
    phase: string;
    current_player_id: string | null;
    current_bid: number | null;
    highest_bidder_id: string | null;
    current_sequence_id: number | null;
    current_sequence_index: number;
    bid_frozen_team_id: string | null;
    currentPlayer: Player | null;
    highestBidder: { id: string; name: string; brand_key: string } | null;
    teams: TeamSummary[];
}

export interface Player {
    id: string;
    rank: number;
    name: string;
    team: string;
    role: string;
    category: string;
    pool: string;
    grade: string;
    rating: number;
    nationality: string;
    base_price: number;
    legacy: number;
    is_riddle: boolean;
    url?: string;
    image_url?: string;
    matches?: number;
    bat_runs?: number;
    bat_sr?: number;
    bat_average?: number;
    bowl_wickets?: number;
    bowl_eco?: number;
    bowl_avg?: number;
}

export interface TeamSummary {
    id: string;
    name: string;
    brand_key: string | null;
    franchise_name: string | null;
    purse_remaining: number;
    squad_count: number;
    overseas_count: number;
    logo: string | null;
    primary_color: string | null;
}

// ── Fetch Helpers ────────────────────────────────────────────

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `API error: ${res.status}`);
    }
    return res.json();
}

// ── API Functions ────────────────────────────────────────────

/** Get current auction state (phase, current player, bids, teams) */
export async function getAuctionState(): Promise<AuctionState> {
    return fetchJSON('/api/public/auction/state');
}

/** Get current player being auctioned */
export async function getCurrentPlayer() {
    return fetchJSON<{ player: Player | null; current_bid: number | null; phase: string }>('/api/public/auction/current-player');
}

/** Get last sold player info */
export async function getLastSold() {
    return fetchJSON<{ player: Player | null; soldPrice: number | null; soldToTeam: TeamSummary | null }>('/api/public/auction/last-sold');
}

/** Get leaderboard (by purse remaining) */
export async function getLeaderboard() {
    return fetchJSON<TeamSummary[]>('/api/public/auction/leaderboard');
}

/** Health check */
export async function checkHealth() {
    return fetchJSON<{ status: string; timestamp: string }>('/api/health');
}
export async function markPlayerUnsold() {
    return fetchJSON('/api/admin/auction/unsold', {
        method: 'POST',
    });
}

/** Set the current player being auctioned (by rank) */
export async function setCurrentPlayer(rank: number) {
    return fetchJSON('/api/admin/auction/set-player', {
        method: 'POST',
        body: JSON.stringify({ rank }),
    });
}

/** Trigger a power card for a team */
export async function triggerPowerCard(teamId: string | number, cardType: string) {
    return fetchJSON('/api/admin/auction/power-card', {
        method: 'POST',
        body: JSON.stringify({ teamId, cardType }),
    });
}

// ── WebSocket ───────────────────────────────────────────────

const socket = io(API_URL, { autoConnect: false });

let socketConnected = false;

function ensureSocket() {
    if (!socketConnected) {
        socket.connect();
        socketConnected = true;
    }
}

/** Subscribe to real-time auction state updates */
export function subscribeToAuctionUpdates(callback: (state: AuctionState) => void) {
    ensureSocket();

    socket.on('STATE_UPDATE', (data: AuctionState) => {
        callback(data);
    });

    return () => {
        socket.off('STATE_UPDATE');
    };
}
