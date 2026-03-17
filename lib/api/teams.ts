// ═══════════════════════════════════════════════════════════════
// Frontend API — Teams
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

import { mockTeams } from '../mockData/teams';
import { mockPlayers } from '../mockData/players';

import { Team, PowerCard } from '../mockData/teams';

export type { Team, PowerCard };

export interface TeamWithSquad extends Team {
    team_players: { player: import('../mockData/players').Player; price_paid: number }[];
}

async function fetchJSON<T>(path: string): Promise<T> {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: res.statusText }));
            throw new Error(err.error || `API error: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch ${path}:`, error);
        // Fallback to mock data for the UI to work
        if (path === '/api/teams') return mockTeams as any;
        
        if (path.startsWith('/api/teams/') && path.endsWith('/squad')) return [] as any;
        if (path.startsWith('/api/teams/') && path.endsWith('/power-cards')) return [] as any;
        
        const teamMatch = path.match(/^\/api\/teams\/(\d+)$/);
        if (teamMatch) {
            const teamId = Number(teamMatch[1]);
            const mockTeam = mockTeams.find(t => t.id === teamId);
            if (mockTeam) return mockTeam as any;
        }

        return null as any;
    }
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
