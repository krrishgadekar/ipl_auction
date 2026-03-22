// MOCK DATA - TEMPORARY
// Auction dynamic state (separate from player master data)
// TODO: Replace with real-time WebSocket updates from backend

import { Player, mockPlayers, GRADE_BASE_PRICE } from './players';

// Auction phases (§8 state machine)
export type AuctionStatus =
    | 'IDLE'
    | 'ANNOUNCING'
    | 'BIDDING'
    | 'CLOSED_BIDDING'
    | 'SOLD'
    | 'UNSOLD';

/** Maximum open bid before Closed Bidding is triggered (§4) */
export const MAX_BID = 25;

export type AuctionPhase =
    | 'NOT_STARTED'
    | 'FRANCHISE_PHASE'
    | 'POWER_CARD_PHASE'
    | 'LIVE'
    | 'POST_AUCTION'
    | 'COMPLETED';

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
    phase: AuctionPhase;
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

    // Sequence
    currentSequenceId: number | null;
    currentSequenceIndex: number;
    currentItemId: string | null;

    // Timer
    timerSeconds: number;
    timerActive: boolean;

    // Power Cards (in-game usage)
    activePowerCard: string | null;
    activePowerCardTeam: string | null;
    bidFreezerTargetTeam: string | null;

    // Power Card Auction Phase
    active_power_card?: string;       // ID of the power card being auctioned
    highest_bidder_id?: number;       // team ID of current highest bidder
    current_bid?: number;             // current bid for the power card
}

// Initial mock auction state
export const mockAuctionState: AuctionState = {
    phase: 'LIVE',
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

    currentSequenceId: null,
    currentSequenceIndex: 0,
    currentItemId: null,

    timerSeconds: 30,
    timerActive: false,

    activePowerCard: null,
    activePowerCardTeam: null,
    bidFreezerTargetTeam: null,

    // Power Card Auction — test data
    active_power_card: 'gods_eye',
    highest_bidder_id: 1,
    current_bid: 3.5,
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

export function setMockPhase(phase: AuctionPhase, activePowerCard?: string): void {
    currentState = {
        ...currentState,
        phase,
        active_power_card: activePowerCard,
    };
}
