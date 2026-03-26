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
    nationality_raw?: string;
    team?: string;
    role?: string;
    pool?: string;
    legacy?: number;
    isRiddle?: boolean;
    riddleTitle?: string;
    riddleQuestion?: string;
    // Sub-ratings (Performance Metrics)
    sub_experience?: number;
    sub_scoring?: number;
    sub_impact?: number;
    sub_consistency?: number;
    sub_wicket_taking?: number;
    sub_economy?: number;
    sub_efficiency?: number;
    sub_batting?: number;
    sub_bowling?: number;
    sub_versatility?: number;
    name?: string; // Backend-only variant
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

export type AuctionStatus = 'IDLE' | 'ANNOUNCING' | 'BIDDING' | 'CLOSED_BIDDING' | 'SOLD' | 'UNSOLD' | 'PRE_AUCTION' | 'POST_AUCTION' | 'COMPLETED';
export type AuctionPhase = 'NOT_STARTED' | 'FRANCHISE_PHASE' | 'POWER_CARD_PHASE' | 'LIVE' | 'POST_AUCTION' | 'COMPLETED';
export type PlayerStatus = 'AVAILABLE' | 'SOLD' | 'UNSOLD';
export type AuctionDay = 'Day 1' | 'Day 2';

export interface AuctionState {
    status: AuctionStatus | string;
    phase: AuctionPhase | string;
    auctionDay: AuctionDay | string;
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
    currentItemId?: string | null;
    currentSequenceId?: number | null;
    currentSequenceIndex?: number | null;
    godsEyeRevealed?: boolean;
    riddleClue?: { id: number; title: string; question: string } | null;
}

// No mock data fallback in production

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options?.headers as Record<string, string>),
        };

        // Attach admin session token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('ipl_admin_token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const finalUrl = `${API_URL}${path}`;
        console.log(`🚀 [API Request] Fetching: ${finalUrl}`, { method: options?.method || 'GET' });

        const res = await fetch(finalUrl, {
            ...options,
            headers,
        });
        
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: res.statusText }));
            console.error(`API error: ${res.status}`, err);
            throw new Error(err.error || `API error: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        console.error(`🚀 [API Error] ${path}:`, error);
        throw error;
    }
}

/** Admin Login */
export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; sessionId: string; username: string; role: string }> {
    return fetchJSON('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
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

export async function placeBid(teamId: string, amount: number) {
    return fetchJSON('/api/admin/auction/bid', {
        method: 'POST',
        body: JSON.stringify({ teamId, bidAmount: amount }),
    });
}

export async function updateAuctionPhase(phase: string) {
    return fetchJSON('/api/admin/auction/phase', {
        method: 'POST',
        body: JSON.stringify({ phase }),
    });
}

export async function selectSequence(sequenceId: number) {
    return fetchJSON('/api/admin/auction/select-sequence', {
        method: 'POST',
        body: JSON.stringify({ sequenceId }),
    });
}

export async function advanceToNextItem() {
    return fetchJSON('/api/admin/auction/next-item', {
        method: 'POST',
    });
}

export async function markPlayerSold(playerId: string, teamId: string, pricePaid: number) {
    return fetchJSON('/api/admin/auction/sell', {
        method: 'POST',
        body: JSON.stringify({ playerId, teamId, pricePaid }),
    });
}

export async function markPlayerUnsold(playerId: string) {
    return fetchJSON('/api/admin/auction/unsold', {
        method: 'POST',
        body: JSON.stringify({ playerId }),
    });
}

export async function unveilRiddle(rank?: number, playerId?: string) {
    return fetchJSON('/api/admin/auction/unveil-riddle', {
        method: 'POST',
        body: JSON.stringify({ rank, playerId }),
    });
}

export async function triggerPowerCard(teamId: string, type: string, targetTeamId?: string) {
    return fetchJSON('/api/admin/auction/power-card', {
        method: 'POST',
        body: JSON.stringify({ teamId, type, targetTeamId }),
    });
}
