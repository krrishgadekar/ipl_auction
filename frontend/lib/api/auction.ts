// ═══════════════════════════════════════════════════════════════
// Frontend API — Auction State
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

import { mockPlayers } from '../mockData/players';
import type { Player } from '../mockData/players';
import type { Team as TeamSummary } from '../mockData/teams';
import type { AuctionState } from '../mockData/auctionState';
import { getMockAuctionState } from '../mockData/auctionState';

export type { AuctionState, Player, TeamSummary };

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
        // Provide safe emergency fallbacks for critical paths to prevent crash
        if (path === '/api/public/auction/state') {
            console.warn(`Backend unreachable for ${path}, falling back to mock API`);
            try {
                const mockRes = await fetch('/api/mock/state');
                if (mockRes.ok) return (await mockRes.json()) as any;
            } catch {}
            return getMockAuctionState() as any;
        }
        if (path === '/api/public/auction/current-player') {
            console.warn(`Backend unreachable for ${path}, falling back to mock player`);
            return { player: null, current_bid: null, phase: 'PRE_AUCTION', status: 'PRE_AUCTION' } as any;
        }
        console.error(`Failed to fetch ${path}:`, error);
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
    return fetchJSON<{ player: Player | null; current_bid: number | null; phase: string; status: string }>('/api/public/auction/current-player');
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

// ── Admin Functions ───────────────────────────────────────────

export async function placeBid(teamId: string, teamName: string, amount: number) {
    return fetchJSON('/api/auction/bid', {
        method: 'POST',
        body: JSON.stringify({ teamId, teamName, amount }),
    });
}

export async function updateAuctionStatus(status: string) {
    return fetchJSON('/api/auction/status', {
        method: 'POST',
        body: JSON.stringify({ status }),
    });
}

export async function setCurrentPlayer(playerId: string) {
    return fetchJSON('/api/auction/current-player', {
        method: 'POST',
        body: JSON.stringify({ playerId }),
    });
}

export async function markPlayerSold(playerId: string, teamId: string, amount: number) {
    return fetchJSON('/api/auction/sold', {
        method: 'POST',
        body: JSON.stringify({ playerId, teamId, amount }),
    });
}

export async function markPlayerUnsold(playerId: string) {
    return fetchJSON('/api/auction/unsold', {
        method: 'POST',
        body: JSON.stringify({ playerId }),
    });
}

export async function triggerPowerCard(teamId: string, cardType: string, targetTeamId?: string) {
    return fetchJSON('/api/auction/power-card', {
        method: 'POST',
        body: JSON.stringify({ teamId, cardType, targetTeamId }),
    });
}

/** Update mock auction state (used when backend is unavailable) */
export async function updateMockState(updates: Record<string, any>) {
    const res = await fetch('/api/mock/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update mock state');
    return res.json();
}
