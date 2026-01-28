// MOCK DATA - TEMPORARY
// This file contains sample players matching the EXACT schema from MongoDB
// TODO: Replace with real API calls to backend when ready

export type PlayerPool = 'BAT_WK' | 'BOWL' | 'AR';
export type PlayerGrade = 'A' | 'B' | 'C' | 'D';
export type PlayerCategory = 'Batsmen' | 'Bowlers' | 'All-rounders' | 'Wicketkeepers';

export interface Player {
    // Core Fields
    rank: number;              // unique
    player: string;            // name
    team: string;              // IPL franchise
    role: string;              // raw role string
    category: PlayerCategory;  // categorized role
    pool: PlayerPool;          // BAT_WK / BOWL / AR
    url: string;               // profile link

    // Rating System (FC25-Style)
    rating: number;            // 40-99 (PRIMARY)
    grade: PlayerGrade;        // A / B / C / D
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
    sub_wickettaking?: number;
    sub_economy?: number;
    sub_efficiency?: number;

    // AR Pool Only
    sub_batting?: number;
    sub_bowling?: number;
    sub_versatility?: number;
}

// Mock Players (5-10 samples covering all 3 pools)
export const mockPlayers: Player[] = [
    // BAT_WK Pool Players
    {
        rank: 1,
        player: 'Virat Kohli',
        team: 'Royal Challengers Bangalore',
        role: 'Batsman',
        category: 'Batsmen',
        pool: 'BAT_WK',
        url: 'https://www.iplt20.com/players/virat-kohli',
        rating: 95,
        grade: 'A',
        legacy: 10,
        imageUrl: '/players/virat-kohli.png',
        sub_experience: 98,
        sub_scoring: 95,
        sub_impact: 92,
        sub_consistency: 96,
    },
    {
        rank: 2,
        player: 'MS Dhoni',
        team: 'Chennai Super Kings',
        role: 'Wicketkeeper-Batsman',
        category: 'Wicketkeepers',
        pool: 'BAT_WK',
        url: 'https://www.iplt20.com/players/ms-dhoni',
        rating: 92,
        grade: 'A',
        legacy: 10,
        sub_experience: 100,
        sub_scoring: 87,
        sub_impact: 95,
        sub_consistency: 90,
    },
    {
        rank: 5,
        player: 'KL Rahul',
        team: 'Lucknow Super Giants',
        role: 'Wicketkeeper-Batsman',
        category: 'Wicketkeepers',
        pool: 'BAT_WK',
        url: 'https://www.iplt20.com/players/kl-rahul',
        rating: 91,
        grade: 'A',
        legacy: 7,
        sub_experience: 85,
        sub_scoring: 93,
        sub_impact: 88,
        sub_consistency: 91,
    },

    // BOWL Pool Players
    {
        rank: 3,
        player: 'Jasprit Bumrah',
        team: 'Mumbai Indians',
        role: 'Bowler',
        category: 'Bowlers',
        pool: 'BOWL',
        url: 'https://www.iplt20.com/players/jasprit-bumrah',
        rating: 96,
        grade: 'A',
        legacy: 8,
        sub_experience: 88,
        sub_wickettaking: 97,
        sub_economy: 94,
        sub_efficiency: 95,
    },
    {
        rank: 6,
        player: 'Rashid Khan',
        team: 'Gujarat Titans',
        role: 'Bowler',
        category: 'Bowlers',
        pool: 'BOWL',
        url: 'https://www.iplt20.com/players/rashid-khan',
        rating: 93,
        grade: 'A',
        legacy: 8,
        sub_experience: 86,
        sub_wickettaking: 94,
        sub_economy: 96,
        sub_efficiency: 92,
    },

    // AR Pool Players
    {
        rank: 4,
        player: 'Hardik Pandya',
        team: 'Gujarat Titans',
        role: 'All-rounder',
        category: 'All-rounders',
        pool: 'AR',
        url: 'https://www.iplt20.com/players/hardik-pandya',
        rating: 94,
        grade: 'A',
        legacy: 7,
        sub_experience: 82,
        sub_batting: 89,
        sub_bowling: 85,
        sub_versatility: 93,
    },
    {
        rank: 7,
        player: 'Ravindra Jadeja',
        team: 'Chennai Super Kings',
        role: 'All-rounder',
        category: 'All-rounders',
        pool: 'AR',
        url: 'https://www.iplt20.com/players/ravindra-jadeja',
        rating: 92,
        grade: 'A',
        legacy: 9,
        sub_experience: 90,
        sub_batting: 84,
        sub_bowling: 88,
        sub_versatility: 91,
    },
    {
        rank: 8,
        player: 'Andre Russell',
        team: 'Kolkata Knight Riders',
        role: 'All-rounder',
        category: 'All-rounders',
        pool: 'AR',
        url: 'https://www.iplt20.com/players/andre-russell',
        rating: 90,
        grade: 'A',
        legacy: 8,
        sub_experience: 87,
        sub_batting: 92,
        sub_bowling: 86,
        sub_versatility: 89,
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
