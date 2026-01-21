// MOCK DATA - TEMPORARY
// Auction dynamic state (separate from player master data)
// TODO: Replace with real-time WebSocket updates from backend

import { Player, mockPlayers } from './players';

export type AuctionStatus = 'IDLE' | 'ANNOUNCING' | 'BIDDING' | 'CLOSED_BIDDING' | 'RTM_DECISION' | 'SOLD' | 'UNSOLD';
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
    rtmTeamDeciding: string | null;
}

// Initial mock auction state
export const mockAuctionState: AuctionState = {
    auctionDay: 'Day 1',
    status: 'BIDDING',

    currentPlayer: mockPlayers[0], // Virat Kohli
    currentPlayerRank: 1,
    playerStatus: 'AVAILABLE',

    currentBid: 2.0,
    baseBid: 2.0,
    highestBidder: 'Mumbai Mavericks',
    bidHistory: [
        {
            teamId: 1,
            teamName: 'Mumbai Mavericks',
            amount: 2.0,
            timestamp: Date.now() - 5000,
        },
    ],

    timerSeconds: 30,
    timerActive: true,

    activePowerCard: null,
    rtmTeamDeciding: null,
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
