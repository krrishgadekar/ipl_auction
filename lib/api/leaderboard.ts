// ═══════════════════════════════════════════════════════════════
// Frontend API — Leaderboard (bridging mock → API)
// ═══════════════════════════════════════════════════════════════

import { getLeaderboard as getMockLeaderboard, LeaderboardEntry } from '@/lib/mockData/finalTeamState';

/**
 * Fetch leaderboard data.
 * Currently returns mock leaderboard; swap to real API when backend supports it.
 */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    // TODO: Replace with real API call:
    // return fetchJSON<LeaderboardEntry[]>('/api/scoring/leaderboard');
    return getMockLeaderboard();
}
