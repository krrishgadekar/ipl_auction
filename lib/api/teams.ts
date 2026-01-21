// API Wrapper Layer - Teams
// Provides interface to team data
// Currently uses MOCK data, easily switchable to real backend

import { Team, mockTeams, getMockTeamById, getMockTeamByName } from '../mockData/teams';

const USE_MOCK_DATA = true; // TODO: Change to false when backend is ready

/**
 * Get all teams
 * TODO: Replace with real API call: GET /api/teams
 */
export async function getAllTeams(): Promise<Team[]> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return mockTeams;
    }

    // TODO: Real implementation
    const response = await fetch('/api/teams');
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
}

/**
 * Get team by ID
 * TODO: Replace with real API call: GET /api/teams/:id
 */
export async function getTeamById(id: number): Promise<Team | null> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return getMockTeamById(id) || null;
    }

    // TODO: Real implementation
    const response = await fetch(`/api/teams/${id}`);
    if (!response.ok) return null;
    return response.json();
}

/**
 * Get team by name
 * TODO: Replace with real API call: GET /api/teams/by-name/:name
 */
export async function getTeamByName(name: string): Promise<Team | null> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return getMockTeamByName(name) || null;
    }

    // TODO: Real implementation
    const response = await fetch(`/api/teams/by-name/${encodeURIComponent(name)}`);
    if (!response.ok) return null;
    return response.json();
}

/**
 * Get team squad (players)
 * TODO: Replace with real API call: GET /api/teams/:id/squad
 */
export async function getTeamSquad(teamId: number): Promise<number[]> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const team = getMockTeamById(teamId);
        return team?.players || [];
    }

    // TODO: Real implementation
    const response = await fetch(`/api/teams/${teamId}/squad`);
    if (!response.ok) throw new Error('Failed to fetch team squad');
    return response.json();
}

/**
 * Get leaderboard (teams sorted by budget used or other criteria)
 * TODO: Replace with real API call: GET /api/leaderboard
 */
export async function getLeaderboard(): Promise<Team[]> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        // Sort by budget used (descending)
        return [...mockTeams].sort((a, b) => b.budgetUsed - a.budgetUsed);
    }

    // TODO: Real implementation
    const response = await fetch('/api/leaderboard');
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
}
