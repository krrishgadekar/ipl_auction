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

// ── Mock credentials for offline/dev use ─────────────────────
// These match the teams in lib/mockData/teams.ts
const MOCK_CREDENTIALS: Record<string, { password: string; teamId: number; teamName: string; shortName: string }> = {
    mi:   { password: 'mi2026',   teamId: 1,  teamName: 'Mumbai Indians',             shortName: 'MI' },
    csk:  { password: 'csk2026',  teamId: 2,  teamName: 'Chennai Super Kings',        shortName: 'CSK' },
    rcb:  { password: 'rcb2026',  teamId: 3,  teamName: 'Royal Challengers Bengaluru', shortName: 'RCB' },
    kkr:  { password: 'kkr2026',  teamId: 4,  teamName: 'Kolkata Knight Riders',      shortName: 'KKR' },
    dc:   { password: 'dc2026',   teamId: 5,  teamName: 'Delhi Capitals',             shortName: 'DC' },
    pbks: { password: 'pbks2026', teamId: 6,  teamName: 'Punjab Kings',               shortName: 'PBKS' },
    rr:   { password: 'rr2026',   teamId: 7,  teamName: 'Rajasthan Royals',           shortName: 'RR' },
    gt:   { password: 'gt2026',   teamId: 8,  teamName: 'Gujarat Titans',             shortName: 'GT' },
    srh:  { password: 'srh2026',  teamId: 9,  teamName: 'Sunrisers Hyderabad',        shortName: 'SRH' },
    lsg:  { password: 'lsg2026',  teamId: 10, teamName: 'Lucknow Super Giants',       shortName: 'LSG' },
};

function mockLogin(username: string, password: string): LoginResponse {
    const cred = MOCK_CREDENTIALS[username.toLowerCase()];
    if (!cred) throw new Error('Invalid username');
    if (cred.password !== password) throw new Error('Invalid password');

    return {
        success: true,
        teamId: String(cred.teamId),
        teamName: cred.teamName,
        sessionId: `mock-session-${Date.now()}`,
        brandKey: cred.shortName,
        franchiseName: cred.teamName,
    };
}

export async function loginTeam(username: string, password: string): Promise<LoginResponse> {
    // Try backend first
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Login failed' }));
            throw new Error(err.error || 'Invalid credentials');
        }

        return res.json();
    } catch (err: any) {
        // If backend unreachable (fetch error), fall back to mock
        if (err.message === 'Failed to fetch' || err.message?.includes('ECONNREFUSED')) {
            console.warn('Backend unavailable, using mock login');
            return mockLogin(username, password);
        }
        throw err;
    }
}
