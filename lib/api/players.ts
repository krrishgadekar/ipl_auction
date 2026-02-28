// ═══════════════════════════════════════════════════════════════
// Frontend API — Players
// Connects to real backend via NEXT_PUBLIC_API_URL
// Falls back to mock data if backend is unavailable
// ═══════════════════════════════════════════════════════════════

import { Player, mockPlayers } from '@/lib/mockData/players';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

/** Get all players — returns mock-compatible Player[] */
export async function getAllPlayers(filters?: {
    pool?: string;
    category?: string;
    grade?: string;
    search?: string;
}): Promise<Player[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.pool) params.set('pool', filters.pool);
        if (filters?.category) params.set('category', filters.category);
        if (filters?.grade) params.set('grade', filters.grade);
        if (filters?.search) params.set('search', filters.search);
        const qs = params.toString();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiPlayers = await fetchJSON<any[]>(`/api/players${qs ? `?${qs}` : ''}`);

        // Map API response to mock Player shape
        return apiPlayers.map((p, i) => {
            const mock = mockPlayers.find(m => m.rank === (p.rank ?? (i + 1)));
            return {
                rank: p.rank ?? (i + 1),
                player: p.name ?? p.player ?? '',
                team: p.team ?? '',
                category: p.category ?? p.role ?? 'Batsmen',
                grade: p.grade ?? 'C',
                pool: p.pool ?? 'BAT_WK',
                url: p.url ?? mock?.url ?? '',
                rating: p.rating ?? 0,
                basePrice: p.base_price ?? p.basePrice ?? 0,
                role: p.role ?? p.category ?? '',
                nationality: p.nationality ?? 'Indian',
                isRiddle: p.is_riddle ?? p.isRiddle ?? false,
                legacy: p.legacy ?? 0,
                sub_experience: mock?.sub_experience ?? 0,
            } as Player;
        });
    } catch {
        // Fallback to mock data
        console.warn('[api/players] Backend unavailable, using mock data');
        let result = [...mockPlayers];
        if (filters?.category) result = result.filter(p => p.category === filters.category);
        if (filters?.grade) result = result.filter(p => p.grade === filters.grade);
        if (filters?.pool) result = result.filter(p => p.pool === filters.pool);
        if (filters?.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(p => p.player.toLowerCase().includes(q));
        }
        return result;
    }
}

/** Get player by rank — returns mock-compatible Player */
export async function getPlayerByRank(rank: number): Promise<Player> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = await fetchJSON<any>(`/api/players/rank/${rank}`);
        const mock = mockPlayers.find(m => m.rank === (p.rank ?? rank));
        return {
            rank: p.rank ?? rank,
            player: p.name ?? p.player ?? '',
            team: p.team ?? '',
            category: p.category ?? p.role ?? 'Batsmen',
            grade: p.grade ?? 'C',
            pool: p.pool ?? 'BAT_WK',
            url: p.url ?? mock?.url ?? '',
            rating: p.rating ?? 0,
            basePrice: p.base_price ?? p.basePrice ?? 0,
            role: p.role ?? p.category ?? '',
            nationality: p.nationality ?? 'Indian',
            isRiddle: p.is_riddle ?? p.isRiddle ?? false,
            legacy: p.legacy ?? 0,
            sub_experience: mock?.sub_experience ?? 0,
        } as Player;
    } catch {
        const mock = mockPlayers.find(p => p.rank === rank);
        if (mock) return mock;
        throw new Error(`Player with rank ${rank} not found`);
    }
}

/** Get player by UUID */
export async function getPlayerById(id: string): Promise<Player> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = await fetchJSON<any>(`/api/players/${id}`);
    const mock = mockPlayers.find(m => m.rank === p.rank);
    return {
        rank: p.rank ?? 0,
        player: p.name ?? p.player ?? '',
        team: p.team ?? '',
        category: p.category ?? p.role ?? 'Batsmen',
        grade: p.grade ?? 'C',
        pool: p.pool ?? 'BAT_WK',
        url: p.url ?? mock?.url ?? '',
        rating: p.rating ?? 0,
        basePrice: p.base_price ?? p.basePrice ?? 0,
        role: p.role ?? p.category ?? '',
        nationality: p.nationality ?? 'Indian',
        isRiddle: p.is_riddle ?? p.isRiddle ?? false,
        legacy: p.legacy ?? 0,
        sub_experience: mock?.sub_experience ?? 0,
    } as Player;
}

/** Search players by name */
export async function searchPlayers(query: string): Promise<Player[]> {
    return getAllPlayers({ search: query });
}
