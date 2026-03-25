// ═══════════════════════════════════════════════════════════════
// Frontend API — Scoring / Final Team
// Connects to real backend via NEXT_PUBLIC_API_URL
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ScoreBreakdown {
    baseScore: number;
    captainBonus: number;
    vcBonus: number;
    balanceBonus: number;
    efficiencyBonus: number;
    brandBonus: number;
    finalScore: number;
}

export interface LeaderboardEntry {
    teamId: string;
    teamName: string;
    brandKey: string | null;
    franchiseName: string | null;
    purseRemaining: number;
    squadCount: number;
    top11: { id: string; name: string; rank: number; rating: number; category: string; nationality: string }[];
    captain: { id: string; name: string; rating: number };
    viceCaptain: { id: string; name: string; rating: number };
    score: ScoreBreakdown;
    rank: number;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `API error: ${res.status}`);
    }
    return res.json();
}

/** Validate a Top 11 selection without locking */
export async function validateTop11(
    teamId: string,
    playerIds: string[],
    captainId: string,
    viceCaptainId: string,
): Promise<ValidationResult> {
    return fetchJSON('/api/scoring/validate', {
        method: 'POST',
        body: JSON.stringify({ teamId, playerIds, captainId, viceCaptainId }),
    });
}

/** Lock lineup for scoring */
export async function lockLineup(
    teamId: string,
    playerIds: string[],
    captainId: string,
    viceCaptainId: string,
): Promise<{ success: boolean; teamId: string }> {
    return fetchJSON('/api/scoring/lock-lineup', {
        method: 'POST',
        body: JSON.stringify({ teamId, playerIds, captainId, viceCaptainId }),
    });
}

/** Submit a team's lineup (alias for lockLineup but for ranks) */
export async function submitTeam(
    teamId: string | number,
    playerRanks: number[],
    captainRank: number,
    viceCaptainRank: number,
): Promise<any> {
    return fetchJSON('/api/scoring/submit-team', {
        method: 'POST',
        body: JSON.stringify({ teamId, playerRanks, captainRank, viceCaptainRank }),
    });
}

/** Alias for validateTop11 */
export const validateSelection = validateTop11;

/** Get scored leaderboard */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    return fetchJSON('/api/scoring/leaderboard');
}

/** Get single team's score */
export async function getTeamScore(teamId: string): Promise<LeaderboardEntry | null> {
    return fetchJSON(`/api/scoring/team/${teamId}`);
}

// ── Auth ─────────────────────────────────────────────────────

export interface LoginResponse {
    success: boolean;
    teamId: string;
    teamName: string;
    sessionId: string;
    brandKey: string | null;
    franchiseName: string | null;
}

/** Team login */
export async function login(username: string, password: string): Promise<LoginResponse> {
    return fetchJSON('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}
