// ═══════════════════════════════════════════════════════════════
// Admin API Service
// Wraps all admin actions and automatically injects the auth token.
// Token format: base64(username:password)
// ═══════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:5000/api/admin/auction';

function getAuthToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('ipl_admin_token') || '';
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };
}

async function fetchAdmin(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers,
        }
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Admin request failed');
    }
    return data;
}

// ── Authentication ───────────────────────────────────────────

/**
 * Verify admin credentials by hitting the dedicated /verify endpoint.
 * Encodes username:password as base64 for the Bearer token.
 */
export async function verifyAdminCredentials(username: string, password: string) {
    const token = btoa(`${username}:${password}`);
    const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return token; // Return the token to store in localStorage
}

// Legacy alias (kept for compatibility, but prefer verifyAdminCredentials)
export async function verifyAdminToken(token: string) {
    const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Invalid password');
    return true;
}

// ── State Management ─────────────────────────────────────────

export async function setPhase(phase: string) {
    return fetchAdmin('/phase', { method: 'POST', body: JSON.stringify({ phase }) });
}

export async function setAuctionDay(day: string) {
    return fetchAdmin('/auction-day', { method: 'POST', body: JSON.stringify({ day }) });
}

export async function advanceToNextPlayer() {
    return fetchAdmin('/next-player', { method: 'POST' });
}

// ── Franchise Assignment ─────────────────────────────────────

export async function assignFranchise(teamId: string, franchiseId: number) {
    return fetchAdmin('/assign-franchise', { method: 'POST', body: JSON.stringify({ teamId, franchiseId }) });
}

// ── Player Assignment ────────────────────────────────────────

export async function assignPlayer(playerId: string) {
    return fetchAdmin('/assign-player', { method: 'POST', body: JSON.stringify({ playerId }) });
}

export async function deassignPlayer(playerId: string) {
    return fetchAdmin('/deassign-player', { method: 'POST', body: JSON.stringify({ playerId }) });
}

export async function sellPlayer(playerId: string, teamId: string, pricePaid: number) {
    return fetchAdmin('/sell', { method: 'POST', body: JSON.stringify({ playerId, teamId, pricePaid }) });
}

export async function markUnsold(playerId: string) {
    return fetchAdmin('/unsold', { method: 'POST', body: JSON.stringify({ playerId }) });
}

// ── Bidding ──────────────────────────────────────────────────
export async function logBid(teamId: string, teamName: string, amount: number) {
    return fetchAdmin('/log-bid', { method: 'POST', body: JSON.stringify({ teamId, teamName, amount }) });
}

// ── Powercard Assignment ─────────────────────────────────────

export async function assignPowerCard(teamId: string, type: string) {
    return fetchAdmin('/assign-powercard', { method: 'POST', body: JSON.stringify({ teamId, type }) });
}

export async function deassignPowerCard(teamId: string, type: string) {
    return fetchAdmin('/deassign-powercard', { method: 'POST', body: JSON.stringify({ teamId, type }) });
}

// ── Riddle Player ────────────────────────────────────────────

export async function unveilRiddlePlayer(playerId: string) {
    return fetchAdmin('/unveil-riddle', { method: 'POST', body: JSON.stringify({ playerId }) });
}
