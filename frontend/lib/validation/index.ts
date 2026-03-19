// ═══════════════════════════════════════════════════════════════
// Frontend Validation — Client-side checks (mirrors backend rules)
// These are for UX (disable buttons, show warnings).
// Authoritative validation happens on the backend.
// ═══════════════════════════════════════════════════════════════

// ── Constants (must match backend auctionService.js) ─────────

export const MAX_SQUAD_SIZE = 15;
export const MAX_OVERSEAS = 5;
export const MIN_OVERSEAS = 3;
export const POWER_CARD_COST = 1; // CR
export const MAX_BID = 25; // CR — triggers closed bidding
export const PURSE = 120; // CR

export const ROLE_LIMITS = {
    BAT: { min: 3, max: 5 },
    BOWL: { min: 5, max: 8 },
    AR: { min: 3, max: 5 },
    WK: { min: 2, max: 4 },
} as const;

export const TOP11_RULES = {
    total: 11,
    BAT: { required: 4 },
    BOWL: { required: 4 },
    WK: { required: 1 },
    AR: { required: 2 },
    maxOverseas: 4,
} as const;

// ── Bid Increments ───────────────────────────────────────────

export function getRecommendedIncrement(currentBid: number): number {
    if (currentBid <= 5) return 0.20;
    return 0.25;
}

export function getMinimumNextBid(currentBid: number): number {
    return currentBid + getRecommendedIncrement(currentBid);
}

export function shouldTriggerClosedBidding(bidAmount: number): boolean {
    return bidAmount >= MAX_BID;
}

// ── Bid Validation ───────────────────────────────────────────

export function validateBid(
    bidAmount: number,
    currentBid: number,
    teamPurse: number,
): { valid: boolean; error?: string } {
    const minBid = getMinimumNextBid(currentBid);
    if (bidAmount < minBid) {
        return { valid: false, error: `Bid must be at least ₹${minBid.toFixed(2)} CR` };
    }
    if (bidAmount > MAX_BID) {
        return { valid: false, error: `Open bid cannot exceed ₹${MAX_BID} CR` };
    }
    if (bidAmount > teamPurse) {
        return { valid: false, error: `Insufficient purse (₹${teamPurse} CR remaining)` };
    }
    return { valid: true };
}

// ── Squad Validation ─────────────────────────────────────────

export function canBuyPlayer(
    teamSquadCount: number,
    teamOverseasCount: number,
    teamPurse: number,
    playerCategory: string,
    playerNationality: string,
    bidAmount: number,
    roleCounts: Record<string, number>,
): { valid: boolean; error?: string } {
    // Squad full
    if (teamSquadCount >= MAX_SQUAD_SIZE) {
        return { valid: false, error: 'Squad is full (15 players)' };
    }
    // Overseas limit
    if (playerNationality === 'OVERSEAS' && teamOverseasCount >= MAX_OVERSEAS) {
        return { valid: false, error: `Maximum ${MAX_OVERSEAS} overseas players` };
    }
    // Purse check
    if (bidAmount > teamPurse) {
        return { valid: false, error: 'Insufficient purse' };
    }
    // Role max check
    const cat = playerCategory as keyof typeof ROLE_LIMITS;
    if (ROLE_LIMITS[cat] && (roleCounts[cat] || 0) >= ROLE_LIMITS[cat].max) {
        return { valid: false, error: `Maximum ${ROLE_LIMITS[cat].max} ${cat} players` };
    }
    // Min purse for remaining slots
    const slotsLeft = MAX_SQUAD_SIZE - teamSquadCount - 1;
    const purseAfter = teamPurse - bidAmount;
    const minNeeded = slotsLeft * 0.2; // Grade D base price
    if (purseAfter < minNeeded) {
        return { valid: false, error: `Would leave ₹${purseAfter.toFixed(2)} CR, need ₹${minNeeded.toFixed(2)} for ${slotsLeft} more slots` };
    }
    return { valid: true };
}

// ── Top 11 Validation (client-side preview) ──────────────────

export function validateTop11ClientSide(
    selected: { id: string; category: string; nationality: string }[],
    captainId: string | null,
    vcId: string | null,
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (selected.length !== 11) {
        errors.push(`Select exactly 11 players (have ${selected.length})`);
    }

    const counts: Record<string, number> = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
    selected.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });

    for (const [cat, rule] of Object.entries(TOP11_RULES)) {
        if (cat === 'total' || cat === 'maxOverseas') continue;
        const r = rule as { required: number };
        if (counts[cat] !== r.required) {
            errors.push(`Need ${r.required} ${cat} (have ${counts[cat] || 0})`);
        }
    }

    const overseas = selected.filter(p => p.nationality === 'OVERSEAS').length;
    if (overseas > TOP11_RULES.maxOverseas) {
        errors.push(`Max ${TOP11_RULES.maxOverseas} overseas (have ${overseas})`);
    }

    if (!captainId) errors.push('Select a Captain');
    if (!vcId) errors.push('Select a Vice-Captain');
    if (captainId && vcId && captainId === vcId) {
        errors.push('Captain and Vice-Captain must be different');
    }

    return { valid: errors.length === 0, errors };
}
