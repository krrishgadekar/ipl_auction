// ═══════════════════════════════════════════════════════════════
// Frontend API — Team Authentication
// Calls backend POST /api/auth/login, with mock fallback
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface LoginResponse {
    success: boolean;
    teamId: string;
    teamName: string;
    sessionId: string;
    brandKey: string | null;
    franchiseName: string | null;
}

export interface TeamData {
    id: string;
    name: string;
    username: string;
    shortName: string;
}

// ── Mock credentials for offline/dev use ─────────────────────
const MOCK_CREDENTIALS: Record<string, { password: string; teamId: string; teamName: string; shortName: string }> = {
    alpha:   { password: 'alpha2026',   teamId: '1', teamName: 'Team Alpha',   shortName: 'Alpha' },
    bravo:   { password: 'bravo2026',   teamId: '2', teamName: 'Team Bravo',   shortName: 'Bravo' },
    charlie: { password: 'charlie2026', teamId: '3', teamName: 'Team Charlie', shortName: 'Charlie' },
    delta:   { password: 'delta2026',   teamId: '4', teamName: 'Team Delta',   shortName: 'Delta' },
    echo:    { password: 'echo2026',    teamId: '5', teamName: 'Team Echo',    shortName: 'Echo' },
    foxtrot: { password: 'foxtrot2026', teamId: '6', teamName: 'Team Foxtrot', shortName: 'Foxtrot' },
    golf:    { password: 'golf2026',    teamId: '7', teamName: 'Team Golf',    shortName: 'Golf' },
    hotel:   { password: 'hotel2026',   teamId: '8', teamName: 'Team Hotel',   shortName: 'Hotel' },
    india:   { password: 'india2026',   teamId: '9', teamName: 'Team India',   shortName: 'India' },
    juliet:  { password: 'juliet2026',  teamId: '10', teamName: 'Team Juliet',  shortName: 'Juliet' },
};

/**
 * Fetch list of teams from the database (via leaderboard endpoint)
 * This allows the frontend to discover teams dynamically.
 */
export async function fetchDatabaseTeams(): Promise<TeamData[]> {
    try {
        const res = await fetch(`${API_URL}/api/public/auction/leaderboard`);
        if (!res.ok) return [];
        const teams = await res.json();
        return teams.map((t: any) => ({
            id: t.id,
            name: t.name,
            username: t.username,
            shortName: t.shortName,
        }));
    } catch (err) {
        console.error('Failed to fetch teams from DB:', err);
        return [];
    }
}

function mockLogin(username: string, password: string, force?: boolean): LoginResponse {
    const cred = MOCK_CREDENTIALS[username.toLowerCase()];
    if (!cred) throw new Error('Invalid username');
    if (cred.password !== password) throw new Error('Invalid password');

    return {
        success: true,
        teamId: String(cred.teamId),
        teamName: cred.teamName,
        sessionId: `mock-session-${Date.now()}${force ? '-forced' : ''}`,
        brandKey: cred.shortName,
        franchiseName: cred.teamName,
    };
}

export async function loginTeam(username: string, password: string, force?: boolean): Promise<LoginResponse> {
    // Try backend first
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, force }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Login failed' }));
            throw new Error(err.error || 'Invalid credentials');
        }

        return res.json();
    } catch (err: any) {
        throw err;
    }
}
