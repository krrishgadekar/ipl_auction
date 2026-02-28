// ═══════════════════════════════════════════════════════════════
// Frontend API — Teams
// Connects to real backend via NEXT_PUBLIC_API_URL
// Falls back to mock data if backend is unavailable
// ═══════════════════════════════════════════════════════════════
//
// NOTE: The frontend UI is built around the mock Team type
// (lib/mockData/teams.ts). The API returns snake_case fields.
// We transform the API response to match the mock shape.
// ═══════════════════════════════════════════════════════════════

import { Team, mockTeams, PowerCard } from '@/lib/mockData/teams';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Raw API types (snake_case from backend) ─────────────────
export interface ApiTeam {
    id: string;
    name: string;
    brand_key: string | null;
    franchise_name: string | null;
    purse_remaining: number;
    squad_count: number;
    overseas_count: number;
    logo: string | null;
    primary_color: string | null;
    brand_score: number;
}

export interface ApiTeamWithSquad extends ApiTeam {
    power_cards: ApiPowerCard[];
    team_players: { player: import('@/lib/mockData/players').Player; price_paid: number }[];
}

export interface ApiPowerCard {
    id: string;
    team_id: string;
    type: string;
    is_used: boolean;
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

/** Default power card factory */
function defaultPowerCards(): Team['powerCards'] {
    return {
        finalStrike: { name: 'Final Strike', cost: 1, available: true, used: false },
        bidFreezer: { name: 'Bid Freezer', cost: 1, available: true, used: false },
        godsEye: { name: "God's Eye", cost: 1, available: true, used: false },
        mulligan: { name: 'Mulligan', cost: 1, available: true, used: false },
    };
}

/** Map raw API team → frontend mock Team shape */
function mapApiTeamToMockTeam(api: ApiTeam, index: number): Team {
    // Try to find a matching mock team for extra fields like logo/color
    const mock = mockTeams.find(m => m.name === api.name || String(m.id) === String(api.id));

    const purseTotal = 120; // rulebook constant
    const budgetRemaining = api.purse_remaining ?? (mock?.budgetRemaining ?? purseTotal);
    const budgetUsed = purseTotal - budgetRemaining;

    return {
        id: mock?.id ?? (index + 1),
        name: api.name,
        shortName: mock?.shortName ?? api.name.split(' ').map(w => w[0]).join(''),
        logo: mock?.logo ?? (api.logo || '🏏'),
        color: mock?.color ?? (api.primary_color || '#2bb5cc'),
        primaryColor: mock?.primaryColor ?? (api.primary_color || '#2bb5cc'),
        totalBudget: purseTotal,
        budgetRemaining,
        budgetUsed,
        squadCount: api.squad_count ?? (mock?.squadCount ?? 0),
        squadLimit: mock?.squadLimit ?? 15,
        powerCards: mock?.powerCards ?? defaultPowerCards(),
        players: mock?.players ?? [],
        overseasCount: api.overseas_count ?? (mock?.overseasCount ?? 0),
        franchiseName: api.franchise_name ?? mock?.franchiseName,
    };
}

/** Get all teams — returns mock-compatible Team[] */
export async function getAllTeams(): Promise<Team[]> {
    try {
        const apiTeams = await fetchJSON<ApiTeam[]>('/api/teams');
        return apiTeams.map(mapApiTeamToMockTeam);
    } catch {
        // Fallback to mock data if backend is unavailable
        console.warn('[api/teams] Backend unavailable, using mock data');
        return mockTeams;
    }
}

/** Get team by ID with full squad and power cards */
export async function getTeamById(id: string): Promise<ApiTeamWithSquad> {
    return fetchJSON(`/api/teams/${id}`);
}

/** Get a team's squad */
export async function getTeamSquad(id: string) {
    return fetchJSON<{ player: import('@/lib/mockData/players').Player; price_paid: number }[]>(`/api/teams/${id}/squad`);
}

/** Get a team's power cards */
export async function getTeamPowerCards(id: string): Promise<ApiPowerCard[]> {
    return fetchJSON(`/api/teams/${id}/power-cards`);
}

/** Get leaderboard (teams ranked by purse remaining) */
export async function getTeamLeaderboard(): Promise<Team[]> {
    try {
        const apiTeams = await fetchJSON<ApiTeam[]>('/api/public/auction/leaderboard');
        return apiTeams.map(mapApiTeamToMockTeam);
    } catch {
        console.warn('[api/teams] Backend unavailable, using mock data');
        return [...mockTeams].sort((a, b) => b.budgetRemaining - a.budgetRemaining);
    }
}
