// API Wrapper Layer - Auction State
// Provides interface to auction state with WebSocket support
// Currently uses MOCK data, easily switchable to real backend

import {
    AuctionState,
    AuctionStatus,
    mockAuctionState,
    getMockAuctionState,
    updateMockAuctionState,
    setMockCurrentPlayer,
    addMockBid,
    markMockPlayerSold,
    markMockPlayerUnsold
} from '../mockData/auctionState';

const USE_MOCK_DATA = true; // TODO: Change to false when backend is ready

/**
 * Get current auction state
 * TODO: Replace with real API call: GET /api/auction/state
 */
export async function getAuctionState(): Promise<AuctionState> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return getMockAuctionState();
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/state');
    if (!response.ok) throw new Error('Failed to fetch auction state');
    return response.json();
}

/**
 * Subscribe to real-time auction updates via WebSocket/SSE
 * TODO: Replace with real WebSocket connection
 */
export function subscribeToAuctionUpdates(
    callback: (state: AuctionState) => void
): () => void {
    if (USE_MOCK_DATA) {
        // Mock: Poll every second for changes
        const interval = setInterval(async () => {
            const state = getMockAuctionState();
            callback(state);
        }, 1000);

        return () => clearInterval(interval);
    }

    // TODO: Real WebSocket implementation
    // const ws = new WebSocket('ws://your-backend/auction/stream');
    // ws.onmessage = (event) => {
    //   const state = JSON.parse(event.data);
    //   callback(state);
    // };
    // return () => ws.close();

    return () => { };
}

/**
 * Update auction status (admin only)
 * TODO: Replace with real API call: PATCH /api/auction/status
 */
export async function updateAuctionStatus(status: AuctionStatus): Promise<void> {
    if (USE_MOCK_DATA) {
        updateMockAuctionState({ status });
        return;
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update auction status');
}

/**
 * Set current player (admin only)
 * TODO: Replace with real API call: POST /api/auction/set-player
 */
export async function setCurrentPlayer(rank: number): Promise<void> {
    if (USE_MOCK_DATA) {
        setMockCurrentPlayer(rank);
        return;
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/set-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rank }),
    });
    if (!response.ok) throw new Error('Failed to set current player');
}

/**
 * Place a bid (admin only)
 * TODO: Replace with real API call: POST /api/auction/bid
 */
export async function placeBid(teamId: number, teamName: string, amount: number): Promise<void> {
    if (USE_MOCK_DATA) {
        addMockBid(teamId, teamName, amount);
        return;
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, teamName, amount }),
    });
    if (!response.ok) throw new Error('Failed to place bid');
}

/**
 * Mark player as sold (admin only)
 * TODO: Replace with real API call: POST /api/auction/sold
 */
export async function markPlayerSold(teamId: number, teamName: string): Promise<void> {
    if (USE_MOCK_DATA) {
        markMockPlayerSold(teamId, teamName);
        return;
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/sold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, teamName }),
    });
    if (!response.ok) throw new Error('Failed to mark player as sold');
}

/**
 * Mark player as unsold (admin only)
 * TODO: Replace with real API call: POST /api/auction/unsold
 */
export async function markPlayerUnsold(): Promise<void> {
    if (USE_MOCK_DATA) {
        markMockPlayerUnsold();
        return;
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/unsold', {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to mark player as unsold');
}

/**
 * Trigger power card (admin only)
 * TODO: Replace with real API call: POST /api/auction/power-card
 */
export async function triggerPowerCard(teamId: number, cardName: string, targetTeamId?: number): Promise<void> {
    if (USE_MOCK_DATA) {
        updateMockAuctionState({
            activePowerCard: cardName,
            activePowerCardTeam: String(teamId),
            bidFreezerTargetTeam: targetTeamId ? String(targetTeamId) : null,
        });
        return;
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/power-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, cardName, targetTeamId }),
    });
    if (!response.ok) throw new Error('Failed to trigger power card');
}

