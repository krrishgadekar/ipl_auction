// MOCK DATA - TEMPORARY
// Auction dynamic state (separate from player master data)
// TODO: Replace with real-time WebSocket updates from backend

import { Player, mockPlayers, GRADE_BASE_PRICE } from './players';

// Auction phases (§8 state machine)
export type AuctionStatus =
    | 'IDLE'
    | 'ANNOUNCING'
    | 'BIDDING'
    | 'SOLD'
    | 'UNSOLD';

export type PlayerStatus = 'AVAILABLE' | 'SOLD' | 'UNSOLD';
export type AuctionDay = 'Day 1' | 'Day 2';



export interface Bid {
    teamId: number;
    teamName: string;
    amount: number;
    timestamp: number;
}

export interface AuctionState {
    // Meta
    auctionDay: AuctionDay;
    status: AuctionStatus;

    // Current Player
    currentPlayer: Player | null;
    currentPlayerRank: number | null;
    playerStatus: PlayerStatus;

    // Bidding
    currentBid: number;
    baseBid: number;
    highestBidder: string | null;
    bidHistory: Bid[];

    // Sold Info
    soldPrice?: number;
    boughtBy?: string;
    boughtByTeamId?: number;

    // Timer
    timerSeconds: number;
    timerActive: boolean;

    // Power Cards
    activePowerCard: string | null;
    activePowerCardTeam: string | null;
    bidFreezerTargetTeam: string | null;
}

// Initial mock auction state
export const mockAuctionState: AuctionState = {
    auctionDay: 'Day 1',
    status: 'BIDDING',

    currentPlayer: mockPlayers[0], // Virat Kohli
    currentPlayerRank: 1,
    playerStatus: 'AVAILABLE',

    currentBid: mockPlayers[0]?.basePrice ?? 2.0,
    baseBid: mockPlayers[0]?.basePrice ?? 2.0,
    highestBidder: 'Mumbai Indians',
    bidHistory: [
        {
            teamId: 1,
            teamName: 'Mumbai Indians',
            amount: mockPlayers[0]?.basePrice ?? 2.0,
            timestamp: Date.now() - 5000,
        },
    ],

    timerSeconds: 30,
    timerActive: false,

    activePowerCard: null,
    activePowerCardTeam: null,
    bidFreezerTargetTeam: null,
};

// Helper to update auction state (for mock purposes)
let currentState = { ...mockAuctionState };

export function getMockAuctionState(): AuctionState {
    return currentState;
}

export function updateMockAuctionState(updates: Partial<AuctionState>): void {
    currentState = { ...currentState, ...updates };
}

export function setMockCurrentPlayer(rank: number): void {
    const player = mockPlayers.find(p => p.rank === rank);
    if (player) {
        currentState = {
            ...currentState,
            currentPlayer: player,
            currentPlayerRank: rank,
            playerStatus: 'AVAILABLE',
            currentBid: 2.0, // Default base bid
            baseBid: 2.0,
            highestBidder: null,
            bidHistory: [],
        };
    }
}

export function addMockBid(teamId: number, teamName: string, amount: number): void {
    currentState = {
        ...currentState,
        currentBid: amount,
        highestBidder: teamName,
        bidHistory: [
            ...currentState.bidHistory,
            {
                teamId,
                teamName,
                amount,
                timestamp: Date.now(),
            },
        ],
    };
}

export function markMockPlayerSold(teamId: number, teamName: string): void {
    currentState = {
        ...currentState,
        status: 'SOLD',
        playerStatus: 'SOLD',
        soldPrice: currentState.currentBid,
        boughtBy: teamName,
        boughtByTeamId: teamId,
    };
}

export function markMockPlayerUnsold(): void {
    currentState = {
        ...currentState,
        status: 'UNSOLD',
        playerStatus: 'UNSOLD',
    };
}
