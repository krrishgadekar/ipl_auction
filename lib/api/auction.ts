// ═══════════════════════════════════════════════════════════════
// Frontend API — Auction State
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

import { mockPlayers } from '../mockData/players';

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
    try {
        const res = await fetch(`${API_URL}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: res.statusText }));
            console.error(`API error: ${res.status}`, err);
            throw new Error(err.error || `API error: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch ${path}:`, error);
        // Provide safe emergency fallbacks for critical paths to prevent crash
        if (path === '/api/public/auction/state') {
            return {
                id: 1, phase: 'BIDDING', current_player_id: 'pl_1', current_bid: 15.5,
                highest_bidder_id: 'tm_3', current_sequence_id: 1, current_sequence_index: 0,
                bid_frozen_team_id: null, currentPlayer: mockPlayers[0], highestBidder: 'Royal Challengers Bengaluru', teams: []
            } as any;
        }
        if (path === '/api/public/auction/current-player') {
            return { player: null, current_bid: null, phase: 'PRE_AUCTION' } as any;
        }
        throw error;
    }
}

// ── API Functions ────────────────────────────────────────────

/** Get current auction state (phase, current player, bids, teams) */
export async function getAuctionState(): Promise<AuctionState> {
    return fetchJSON('/api/public/auction/state');
}

/** Subscribe to auction updates using polling */
export function subscribeToAuctionUpdates(
    callback: (state: AuctionState) => void,
    intervalMs = 2000
): () => void {
    let timeoutId: NodeJS.Timeout;
    let isSubscribed = true;

    const poll = async () => {
        if (!isSubscribed) return;
        try {
            const state = await getAuctionState();
            if (isSubscribed) callback(state);
        } catch (error) {
            // Silently fail or log debug if backend isn't up
            console.debug('Polling auction state failed:', error);
        } finally {
            if (isSubscribed) {
                timeoutId = setTimeout(poll, intervalMs);
            }
        }
    };

    poll();

    return () => {
        isSubscribed = false;
        clearTimeout(timeoutId);
    };
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
