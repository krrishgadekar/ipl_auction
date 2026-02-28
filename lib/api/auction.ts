// ═══════════════════════════════════════════════════════════════
// Frontend API — Auction State
// Connects to real backend via NEXT_PUBLIC_API_URL
// Falls back to mock data if backend is unavailable
// ═══════════════════════════════════════════════════════════════

import {
    AuctionState,
    mockAuctionState,
    getMockAuctionState,
} from '@/lib/mockData/auctionState';
import { mockPlayers } from '@/lib/mockData/players';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Raw API types (what the backend actually returns) ────────

export interface ApiAuctionState {
    id: number;
    phase: string;
    current_player_id: string | null;
    current_bid: number | null;
    highest_bidder_id: string | null;
    current_sequence_id: number | null;
    current_sequence_index: number;
    bid_frozen_team_id: string | null;
    currentPlayer: ApiPlayer | null;
    highestBidder: { id: string; name: string; brand_key: string } | null;
    teams: ApiTeamSummary[];
}

export interface ApiPlayer {
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

export interface ApiTeamSummary {
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

// ── Mapping helpers (API → mock-compatible) ──────────────────

function mapApiPlayerToMock(api: ApiPlayer) {
    const mock = mockPlayers.find(p => p.rank === api.rank);
    return {
        rank: api.rank,
        player: api.name,
        team: api.team,
        category: api.category as import('@/lib/mockData/players').PlayerCategory,
        grade: api.grade as import('@/lib/mockData/players').PlayerGrade,
        pool: api.pool as import('@/lib/mockData/players').PlayerPool,
        rating: api.rating,
        basePrice: api.base_price,
        role: api.role,
        url: api.url ?? mock?.url ?? '',
        nationality: api.nationality as 'Indian' | 'Overseas',
        isRiddle: api.is_riddle,
        legacy: api.legacy,
        sub_experience: mock?.sub_experience ?? 0,
        // Pool-specific sub-ratings (optional)
        ...(mock ? {
            sub_scoring: mock.sub_scoring,
            sub_impact: mock.sub_impact,
            sub_consistency: mock.sub_consistency,
            sub_wickettaking: mock.sub_wickettaking,
            sub_economy: mock.sub_economy,
            sub_efficiency: mock.sub_efficiency,
            sub_batting: mock.sub_batting,
            sub_bowling: mock.sub_bowling,
            sub_versatility: mock.sub_versatility,
        } : {}),
    } as import('@/lib/mockData/players').Player;
}

function mapApiStateToMock(api: ApiAuctionState): AuctionState {
    const currentPlayer = api.currentPlayer ? mapApiPlayerToMock(api.currentPlayer) : null;
    const basePrice = currentPlayer?.basePrice ?? 2.0;

    return {
        auctionDay: 'Day 1',
        status: (api.phase as AuctionState['status']) || 'IDLE',
        currentPlayer,
        currentPlayerRank: currentPlayer?.rank ?? null,
        playerStatus: 'AVAILABLE',
        currentBid: api.current_bid ?? basePrice,
        baseBid: basePrice,
        highestBidder: api.highestBidder?.name ?? null,
        bidHistory: [],
        timerSeconds: 30,
        timerActive: false,
        activePowerCard: null,
        activePowerCardTeam: null,
        bidFreezerTargetTeam: api.bid_frozen_team_id ?? null,
        sealedBids: {},
        godsEyeRevealed: false,
    };
}

// ── API Functions ────────────────────────────────────────────

/** Get current auction state — returns mock-compatible AuctionState */
export async function getAuctionState(): Promise<AuctionState> {
    try {
        const api = await fetchJSON<ApiAuctionState>('/api/public/auction/state');
        return mapApiStateToMock(api);
    } catch {
        console.warn('[api/auction] Backend unavailable, using mock data');
        return getMockAuctionState();
    }
}

/** Get current player being auctioned */
export async function getCurrentPlayer() {
    return fetchJSON<{ player: ApiPlayer | null; current_bid: number | null; phase: string }>('/api/public/auction/current-player');
}

/** Get last sold player info */
export async function getLastSold() {
    return fetchJSON<{ player: ApiPlayer | null; soldPrice: number | null; soldToTeam: ApiTeamSummary | null }>('/api/public/auction/last-sold');
}

/** Get leaderboard (by purse remaining) */
export async function getLeaderboard() {
    return fetchJSON<ApiTeamSummary[]>('/api/public/auction/leaderboard');
}

/** Health check */
export async function checkHealth() {
    return fetchJSON<{ status: string; timestamp: string }>('/api/health');
}

// ── Admin Action Stubs ───────────────────────────────────────
// These POST to the backend and are used by admin components.

/** Place a bid for a team */
export async function placeBid(teamId: number | string, teamName: string, amount: number) {
    return fetchJSON<{ success: boolean }>('/api/admin/auction/bid', {
        method: 'POST',
        body: JSON.stringify({ teamId: String(teamId), teamName, amount }),
    });
}

/** Update auction status (BIDDING, CLOSED_BIDDING, etc.) */
export async function updateAuctionStatus(status: string) {
    return fetchJSON<{ success: boolean }>('/api/admin/auction/status', {
        method: 'POST',
        body: JSON.stringify({ status }),
    });
}

/** Mark current player as sold */
export async function markPlayerSold(teamId: number | string, teamName: string) {
    return fetchJSON<{ success: boolean }>('/api/admin/auction/sell', {
        method: 'POST',
        body: JSON.stringify({ teamId: String(teamId), teamName }),
    });
}

/** Mark current player as unsold */
export async function markPlayerUnsold() {
    return fetchJSON<{ success: boolean }>('/api/admin/auction/unsold', {
        method: 'POST',
    });
}

/** Set the current player by rank */
export async function setCurrentPlayer(rank: number) {
    return fetchJSON<{ success: boolean }>('/api/admin/auction/set-player', {
        method: 'POST',
        body: JSON.stringify({ rank }),
    });
}

/** Trigger a power card */
export async function triggerPowerCard(teamId: number | string, cardType: string, targetTeamId?: number | string) {
    return fetchJSON<{ success: boolean }>('/api/admin/auction/power-card', {
        method: 'POST',
        body: JSON.stringify({
            teamId: String(teamId),
            cardType,
            targetTeamId: targetTeamId ? String(targetTeamId) : undefined,
        }),
    });
}

/**
 * Subscribe to auction state updates via polling.
 * Returns an unsubscribe function.
 * TODO: Replace with real WebSocket when backend supports it.
 */
export function subscribeToAuctionUpdates(
    callback: (state: AuctionState) => void,
    intervalMs = 2000,
): () => void {
    let active = true;
    const poll = async () => {
        while (active) {
            try {
                const state = await getAuctionState();
                if (active) callback(state);
            } catch {
                // silently retry
            }
            await new Promise(r => setTimeout(r, intervalMs));
        }
    };
    poll();
    return () => { active = false; };
}
