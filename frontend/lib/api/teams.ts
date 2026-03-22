// ═══════════════════════════════════════════════════════════════
// Frontend API — Teams
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PowerCard {
    name: string;
    cost: number;
    available: boolean;
    used: boolean;
}

export interface Team {
    id: string | number;
    name: string;
    shortName: string;
    logo: string;
    budgetRemaining: number;
    budgetUsed: number;
    totalBudget: number;
    squadCount: number;
    squadLimit: number;
    players: number[]; // Array of player ranks
    powerCards: Record<string, PowerCard>;
}

export interface TeamWithSquad extends Team {
    team_players: { player: any; price_paid: number }[];
}

async function fetchJSON<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `API error: ${res.status}`);
    }
    return res.json();
}
/** Get all teams */
export async function getAllTeams(): Promise<Team[]> {
    return fetchJSON('/api/teams');
}

/** Get team by ID with full squad and power cards */
export async function getTeamById(id: string): Promise<TeamWithSquad> {
    return fetchJSON(`/api/teams/${id}`);
}

/** Get a team's squad */
export async function getTeamSquad(id: string) {
    return fetchJSON<{ player: import('./auction').Player; price_paid: number }[]>(`/api/teams/${id}/squad`);
}

/** Get a team's power cards */
export async function getTeamPowerCards(id: string): Promise<PowerCard[]> {
    return fetchJSON(`/api/teams/${id}/power-cards`);
}

/** Get leaderboard (teams ranked by purse remaining) */
export async function getTeamLeaderboard(): Promise<Team[]> {
    return fetchJSON('/api/public/auction/leaderboard');
}
