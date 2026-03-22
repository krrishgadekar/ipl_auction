// ═══════════════════════════════════════════════════════════════
// Frontend API — Auction State
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Player {
    id: string;
    rank: number;
    player: string;
    category: string;
    grade: string;
    rating: number;
    basePrice: number;
    imageUrl: string;
    nationality: string;
    team?: string;
    role?: string;
    pool?: string;
    legacy?: number;
    isRiddle?: boolean;
    // Sub-ratings (Performance Metrics)
    sub_experience?: number;
    sub_scoring?: number;
    sub_impact?: number;
    sub_consistency?: number;
    sub_wickettaking?: number;
    sub_economy?: number;
    sub_efficiency?: number;
    sub_batting?: number;
    sub_bowling?: number;
    sub_versatility?: number;
}

export interface TeamSummary {
    id: string | number;
    name: string;
    shortName: string;
    logo: string;
    budgetRemaining: number;
    squadCount: number;
    squadLimit: number;
}

export interface AuctionState {
    status: 'IDLE' | 'BIDDING' | 'SOLD' | 'UNSOLD' | 'PRE_AUCTION' | 'POST_AUCTION' | 'COMPLETED' | string;
    phase: string;
    auctionDay: string;
    currentPlayer: Player | null;
    currentPlayerRank: number | null;
    currentBid: number;
    baseBid: number;
    highestBidder: string | null;
    highestBidderId: string | null;
    bidHistory: any[];
    teams: any[];
    activePowerCard?: string | null;
    activePowerCardTeam?: string | null;
    playerStatus?: string;
    timerSeconds?: number;
    timerActive?: boolean;
    bidFreezerTargetTeam?: string | number | null;
}

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
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
