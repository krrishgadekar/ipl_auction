// ═══════════════════════════════════════════════════════════════
// Admin API Service
// Wraps all admin actions and automatically injects the auth token.
// Token format: base64(username:password)
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE = `${API_URL}/api/admin/auction`;

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

/** Admin Login */
export async function verifyAdminCredentials(username: string, password: string): Promise<string> {
    const res = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    return data.sessionId; 
}

// ── State Management ─────────────────────────────────────────

export async function setPhase(phase: string) {
    return fetchAdmin('/phase', { method: 'POST', body: JSON.stringify({ phase }) });
}

export async function setAuctionDay(day: string) {
    return fetchAdmin('/auction-day', { method: 'POST', body: JSON.stringify({ day }) });
}

export async function advanceToNextObject() {
    return fetchAdmin('/next-item', { method: 'POST' });
}

export async function stepBackToPreviousObject() {
    return fetchAdmin('/prev-item', { method: 'POST' });
}

export async function selectSequence(sequenceId: number) {
    return fetchAdmin('/select-sequence', { method: 'POST', body: JSON.stringify({ sequenceId }) });
}

export async function getAllSequences() {
    return fetchAdmin('/sequences', { method: 'GET' });
}

export async function getAllFranchises() {
    return fetchAdmin('/franchises', { method: 'GET' });
}

// ── Franchise Assignment ─────────────────────────────────────

export async function assignFranchise(teamId: string, franchiseId: number, price: number) {
    return fetchAdmin('/assign-franchise', { method: 'POST', body: JSON.stringify({ teamId, franchiseId, price }) });
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

export async function assignPowerCard(teamId: string, cardType: string, price: number) {
    return fetchAdmin('/assign-powercard', { method: 'POST', body: JSON.stringify({ teamId, cardType, price }) });
}

export async function deassignPowerCard(teamId: string, type: string) {
    return fetchAdmin('/deassign-powercard', { method: 'POST', body: JSON.stringify({ teamId, type }) });
}

// ── Riddle Player ────────────────────────────────────────────

export async function unveilRiddlePlayer(playerId: string) {
    return fetchAdmin('/unveil-riddle', { method: 'POST', body: JSON.stringify({ playerId }) });
}

export async function fineTeam(teamId: string, amount: number, reason: string) {
    return fetchAdmin('/fine-team', { method: 'POST', body: JSON.stringify({ teamId, amount, reason }) });
}

export async function togglePowerCard(teamId: string, type: string, isUsed: boolean) {
    return fetchAdmin('/toggle-powercard', { method: 'POST', body: JSON.stringify({ teamId, type, isUsed }) });
}

export async function markItemUnsold(itemId: string, itemType: 'FRANCHISE' | 'POWERCARD') {
    return fetchAdmin('/unsold-item', { method: 'POST', body: JSON.stringify({ itemId, itemType }) });
}

export async function addPurse(teamId: string, amount: number, reason: string) {
    return fetchAdmin('/add-purse', { method: 'POST', body: JSON.stringify({ teamId, amount, reason }) });
}
