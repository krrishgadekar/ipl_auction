// MOCK DATA - TEMPORARY
// This file contains sample players matching the EXACT schema from MongoDB
// TODO: Replace with real API calls to backend when ready

export type PlayerPool = 'BAT_WK' | 'BOWL' | 'AR';
export type PlayerGrade = 'A' | 'B' | 'C';
export type PlayerCategory = 'Batsmen' | 'Bowlers' | 'All-rounders' | 'Wicketkeepers';
export type PlayerNationality = 'Indian' | 'Overseas';

// Base prices by grade (rulebook §3)
export const GRADE_BASE_PRICE: Record<PlayerGrade, number> = {
    A: 2.0,
    B: 1.0,
    C: 0.5,
};

export interface Player {
    // Core Fields
    id?: string;               // UUID from backend (optional, not in mock data)
    rank: number;              // unique
    player: string;            // name
    team: string;              // IPL franchise
    role: string;              // raw role string
    category: PlayerCategory;  // categorized role
    pool: PlayerPool;          // BAT_WK / BOWL / AR
    url: string;               // profile link
    nationality: PlayerNationality; // Indian / Overseas
    nationality_raw?: string;
    isRiddle?: boolean;        // riddle player - identity hidden on big screen

    // Rating System (FC25-Style)
    rating: number;            // 40-99 (PRIMARY)
    grade: PlayerGrade;        // A / B / C / D
    basePrice: number;         // Starting bid in CR (from grade)
    legacy: number;            // 0-10
    imageUrl?: string;         // Optional player photo URL

    // Sub-Ratings (0-100, DISPLAY ONLY)
    // Shared across all pools
    sub_experience: number;

    // BAT_WK Pool Only
    sub_scoring?: number;
    sub_impact?: number;
    sub_consistency?: number;

    // BOWL Pool Only
    sub_wicket_taking?: number;
    sub_economy?: number;
    sub_efficiency?: number;

    // AR Pool Only
    sub_batting?: number;
    sub_bowling?: number;
    sub_versatility?: number;
}

export const mockPlayers: Player[] = [
    // ── GRADE A — Gold / Legendary ──
    {
        rank: 1,
        player: 'Virat Kohli',
        team: 'Royal Challengers Bengaluru',
        role: 'Batsman',
        category: 'Batsmen',
        pool: 'BAT_WK',
        url: 'https://www.cricbuzz.com/profiles/1413/virat-kohli',
        imageUrl: '/player_photos/1.avif',
        nationality: 'Indian',
        nationality_raw: 'Indian',
        rating: 99,
        grade: 'A',
        basePrice: 2.0,
        legacy: 10,
        sub_experience: 99,
        sub_scoring: 99,
        sub_impact: 67,
        sub_consistency: 98,
    },

    // ── GRADE B — Teal / Elite ──
    {
        rank: 14,
        player: 'Shubman Gill',
        team: 'Gujarat Titans',
        role: 'Batsman',
        category: 'Batsmen',
        pool: 'BAT_WK',
        url: 'https://www.cricbuzz.com/profiles/15107/shubman-gill',
        imageUrl: '/player_photos/14.avif',
        nationality: 'Indian',
        nationality_raw: 'Indian',
        rating: 82,
        grade: 'B',
        basePrice: 1.0,
        legacy: 5,
        sub_experience: 65,
        sub_scoring: 88,
        sub_impact: 78,
        sub_consistency: 80,
    },

    // ── GRADE C — Steel Blue / Skilled ──
    {
        rank: 35,
        player: 'Deepak Hooda',
        team: 'Lucknow Super Giants',
        role: 'Batting Allrounder',
        category: 'All-rounders',
        pool: 'AR',
        url: 'https://www.cricbuzz.com/profiles/7592/deepak-hooda',
        imageUrl: '/player_photos/35.avif',
        nationality: 'Indian',
        nationality_raw: 'Indian',
        rating: 68,
        grade: 'C',
        basePrice: 0.5,
        legacy: 3,
        sub_experience: 60,
        sub_batting: 70,
        sub_bowling: 55,
        sub_versatility: 62,
    },

    // ── GRADE C (formerly D) — Slate / Prospect ──
    {
        rank: 72,
        player: 'Arjun Tendulkar',
        team: 'Mumbai Indians',
        role: 'Bowler',
        category: 'Bowlers',
        pool: 'BOWL',
        url: 'https://www.cricbuzz.com/profiles/19893/arjun-tendulkar',
        imageUrl: '/player_photos/72.avif',
        nationality: 'Indian',
        nationality_raw: 'Indian',
        rating: 48,
        grade: 'C',
        basePrice: 0.5,
        legacy: 1,
        sub_experience: 20,
        sub_wicket_taking: 45,
        sub_economy: 50,
        sub_efficiency: 42,
    },
];

// Helper to get player by rank
export function getMockPlayerByRank(rank: number): Player | undefined {
    return mockPlayers.find(p => p.rank === rank);
}

// Helper to get players by pool
export function getMockPlayersByPool(pool: PlayerPool): Player[] {
    return mockPlayers.filter(p => p.pool === pool);
}

// Helper to get players by category
export function getMockPlayersByCategory(category: PlayerCategory): Player[] {
    return mockPlayers.filter(p => p.category === category);
}
