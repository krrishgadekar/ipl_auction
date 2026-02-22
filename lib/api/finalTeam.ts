// API Wrapper — Final Team Submissions
// Provides interface for submitting Top 11, fetching leaderboard
// Currently uses MOCK data, switchable to real backend

import {
    FinalTeamSubmission,
    LeaderboardEntry,
    ValidationResult,
    validateTop11,
    submitFinalTeam as mockSubmit,
    getSubmission as mockGetSubmission,
    getAllSubmissions as mockGetAllSubmissions,
    getLeaderboard as mockGetLeaderboard,
} from '../mockData/finalTeamState';
import { Player, getMockPlayerByRank } from '../mockData/players';
import { getMockTeamById } from '../mockData/teams';

const USE_MOCK_DATA = true;

/**
 * Validate a Top 11 selection before submission
 */
export function validateSelection(
    selectedRanks: number[],
    captainRank: number | null,
    vcRank: number | null,
    teamId: number,
): ValidationResult {
    const team = getMockTeamById(teamId);
    if (!team) return { valid: false, errors: ['Team not found'], warnings: [] };

    const teamPlayers = team.players
        .map(r => getMockPlayerByRank(r))
        .filter((p): p is Player => !!p);

    return validateTop11(selectedRanks, captainRank, vcRank, teamPlayers);
}

/**
 * Submit final team (admin only)
 */
export async function submitTeam(
    teamId: number,
    playing11: number[],
    captainRank: number,
    viceCaptainRank: number,
): Promise<FinalTeamSubmission> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockSubmit(teamId, playing11, captainRank, viceCaptainRank);
    }

    const response = await fetch('/api/final-team/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, playing11, captainRank, viceCaptainRank }),
    });
    if (!response.ok) throw new Error('Failed to submit final team');
    return response.json();
}

/**
 * Get submission for a specific team
 */
export async function getTeamSubmission(teamId: number): Promise<FinalTeamSubmission | null> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return mockGetSubmission(teamId);
    }

    const response = await fetch(`/api/final-team/${teamId}`);
    if (!response.ok) return null;
    return response.json();
}

/**
 * Get leaderboard with all scores
 */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockGetLeaderboard();
    }

    const response = await fetch('/api/final-team/leaderboard');
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
}
