// ═══════════════════════════════════════════════════════════════
// Frontend API — Players
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

import type { Player } from './auction';

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

/** Get all players (optional filters: pool, category, grade, search) */
export async function getAllPlayers(filters?: {
    pool?: string;
    category?: string;
    grade?: string;
    search?: string;
}): Promise<Player[]> {
    const params = new URLSearchParams();
    if (filters?.pool) params.set('pool', filters.pool);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.grade) params.set('grade', filters.grade);
    if (filters?.search) params.set('search', filters.search);
    const qs = params.toString();
    return fetchJSON(`/api/players${qs ? `?${qs}` : ''}`);
}

/** Get player by rank */
export async function getPlayerByRank(rank: number): Promise<Player> {
    return fetchJSON(`/api/players/rank/${rank}`);
}

/** Get player by UUID */
export async function getPlayerById(id: string): Promise<Player> {
    return fetchJSON(`/api/players/${id}`);
}

/** Search players by name */
export async function searchPlayers(query: string): Promise<Player[]> {
    return getAllPlayers({ search: query });
}
