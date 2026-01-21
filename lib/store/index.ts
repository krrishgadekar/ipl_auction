import { create } from 'zustand';
import { Auction, Team, Player, Bid, SquadPlayer, PowerCard } from '@/lib/db/schema';

interface AuctionState {
    // Current auction data
    auction: Auction | null;
    teams: Team[];
    players: Player[];
    currentPlayer: Player | null;
    currentBids: Bid[];
    leaderboard: Team[];

    // UI state
    loading: boolean;
    error: string | null;

    // Actions
    setAuction: (auction: Auction) => void;
    setTeams: (teams: Team[]) => void;
    setPlayers: (players: Player[]) => void;
    setCurrentPlayer: (player: Player | null) => void;
    setCurrentBids: (bids: Bid[]) => void;
    setLeaderboard: (teams: Team[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Fetch actions
    fetchAuction: (auctionId: number) => Promise<void>;
    fetchTeams: (auctionId: number) => Promise<void>;
    fetchPlayers: () => Promise<void>;
    refreshCurrentPlayer: () => Promise<void>;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
    // Initial state
    auction: null,
    teams: [],
    players: [],
    currentPlayer: null,
    currentBids: [],
    leaderboard: [],
    loading: false,
    error: null,

    // Setters
    setAuction: (auction) => set({ auction }),
    setTeams: (teams) => set({ teams }),
    setPlayers: (players) => set({ players }),
    setCurrentPlayer: (player) => set({ currentPlayer: player }),
    setCurrentBids: (bids) => set({ currentBids: bids }),
    setLeaderboard: (teams) => set({ leaderboard: teams }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Fetch auction
    fetchAuction: async (auctionId: number) => {
        try {
            set({ loading: true, error: null });
            const response = await fetch(`/api/auction/${auctionId}`);
            if (!response.ok) throw new Error('Failed to fetch auction');
            const data = await response.json();
            set({ auction: data, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    // Fetch teams
    fetchTeams: async (auctionId: number) => {
        try {
            set({ loading: true, error: null });
            const response = await fetch(`/api/auction/${auctionId}/teams`);
            if (!response.ok) throw new Error('Failed to fetch teams');
            const data = await response.json();
            set({ teams: data, leaderboard: data, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    // Fetch players
    fetchPlayers: async () => {
        try {
            set({ loading: true, error: null });
            const response = await fetch('/api/players');
            if (!response.ok) throw new Error('Failed to fetch players');
            const data = await response.json();
            set({ players: data, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    // Refresh current player
    refreshCurrentPlayer: async () => {
        const { auction } = get();
        if (!auction?.current_player_id) {
            set({ currentPlayer: null });
            return;
        }

        try {
            const response = await fetch(`/api/players/${auction.current_player_id}`);
            if (!response.ok) throw new Error('Failed to fetch current player');
            const data = await response.json();
            set({ currentPlayer: data });
        } catch (error) {
            set({ error: (error as Error).message });
        }
    },
}));

// Team-specific store
interface TeamState {
    team: Team | null;
    squad: SquadPlayer[];
    powerCards: PowerCard[];
    loading: boolean;
    error: string | null;

    setTeam: (team: Team) => void;
    setSquad: (squad: SquadPlayer[]) => void;
    setPowerCards: (cards: PowerCard[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchTeamData: (teamId: number) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
    team: null,
    squad: [],
    powerCards: [],
    loading: false,
    error: null,

    setTeam: (team) => set({ team }),
    setSquad: (squad) => set({ squad }),
    setPowerCards: (cards) => set({ powerCards: cards }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchTeamData: async (teamId: number) => {
        try {
            set({ loading: true, error: null });

            // Fetch team
            const teamRes = await fetch(`/api/teams/${teamId}`);
            if (!teamRes.ok) throw new Error('Failed to fetch team');
            const teamData = await teamRes.json();

            // Fetch squad
            const squadRes = await fetch(`/api/teams/${teamId}/squad`);
            if (!squadRes.ok) throw new Error('Failed to fetch squad');
            const squadData = await squadRes.json();

            // Fetch power cards
            const cardsRes = await fetch(`/api/teams/${teamId}/power-cards`);
            if (!cardsRes.ok) throw new Error('Failed to fetch power cards');
            const cardsData = await cardsRes.json();

            set({
                team: teamData,
                squad: squadData,
                powerCards: cardsData,
                loading: false,
            });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
}));
