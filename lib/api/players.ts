// API Wrapper Layer
// This file provides a clean interface to fetch player data
// Currently uses MOCK data, easily switchable to real backend API

import { Player, mockPlayers, getMockPlayerByRank, getMockPlayersByPool, getMockPlayersByCategory } from '../mockData/players';

// Environment flag to switch between mock and real API
const USE_MOCK_DATA = true; // TODO: Change to false when backend is ready

/**
 * Get all players
 * TODO: Replace with real API call: GET /api/players
 */
export async function getAllPlayers(): Promise<Player[]> {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockPlayers;
    }

    // TODO: Real implementation
    const response = await fetch('/api/players');
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
}

/**
 * Get player by rank
 * TODO: Replace with real API call: GET /api/players/:rank
 */
export async function getPlayerByRank(rank: number): Promise<Player | null> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return getMockPlayerByRank(rank) || null;
    }

    // TODO: Real implementation
    const response = await fetch(`/api/players/${rank}`);
    if (!response.ok) return null;
    return response.json();
}

/**
 * Get players by pool
 * TODO: Replace with real API call: GET /api/players?pool=BAT_WK
 */
export async function getPlayersByPool(pool: 'BAT_WK' | 'BOWL' | 'AR'): Promise<Player[]> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return getMockPlayersByPool(pool);
    }

    // TODO: Real implementation
    const response = await fetch(`/api/players?pool=${pool}`);
    if (!response.ok) throw new Error('Failed to fetch players by pool');
    return response.json();
}

/**
 * Get current player being auctioned
 * TODO: Replace with real API call: GET /api/auction/current-player
 */
export async function getCurrentPlayer(): Promise<Player | null> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        // For mock, return first player
        return mockPlayers[0] || null;
    }

    // TODO: Real implementation
    const response = await fetch('/api/auction/current-player');
    if (!response.ok) return null;
    return response.json();
}

/**
 * Search players by name
 * TODO: Replace with real API call: GET /api/players/search?q=name
 */
export async function searchPlayers(query: string): Promise<Player[]> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const lowerQuery = query.toLowerCase();
        return mockPlayers.filter(p =>
            p.player.toLowerCase().includes(lowerQuery) ||
            p.team.toLowerCase().includes(lowerQuery)
        );
    }

    // TODO: Real implementation
    const response = await fetch(`/api/players/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search players');
    return response.json();
}
