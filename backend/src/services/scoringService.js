// ═══════════════════════════════════════════════════════════════
// IPL Auction 2026 — Scoring Service (V3.1 Locked Formula)
//
// Post-auction each team selects Top 11, Captain, Vice-Captain.
// System validates composition, calculates locked V3.1 score.
// All calculations server-side; frontend displays results only.
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/db.js';

// ── Constants ────────────────────────────────────────────────

// ── Constants ────────────────────────────────────────────────

/** Top 11 playing-XI constraints (Step 2/3) */
const TOP11_RULES = {
    total: 11,
};

/** Full 15-player squad constraints (Step 1) */
const SQUAD_RULES = {
    total: 15,
    BAT: { min: 3, ideal: 5 },
    BOWL: { min: 3, ideal: 5 },
    AR: { min: 2, ideal: 3 },
    WK: { min: 2, ideal: 2 },
    overseas: { min: 2, max: 5, ideal: 3 },
};

/** Role weights for BaseScore */
const ROLE_WEIGHTS = {
    BAT: 1.00,
    AR: 1.00,
    WK: 1.00,
    BOWL: 0.96,
};

// ═══════════════════════════════════════════════════════════════
// §1 — VALIDATION (SQUAD & TOP 11)
// ═══════════════════════════════════════════════════════════════

/** Validate full 15-player squad */
async function validateSquad(teamId) {
    const errors = [];
    const squad = await prisma.teamPlayer.findMany({
        where: { team_id: teamId },
        include: { player: true },
    });

    if (squad.length !== SQUAD_RULES.total) {
        errors.push(`Squad must have exactly ${SQUAD_RULES.total} players (got ${squad.length})`);
    }

    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0, OVERSEAS: 0 };
    squad.forEach(tp => {
        counts[tp.player.category]++;
        if (tp.player.nationality === 'OVERSEAS') counts.OVERSEAS++;
    });

    if (counts.BAT < SQUAD_RULES.BAT.min) errors.push(`Min ${SQUAD_RULES.BAT.min} BAT required (have ${counts.BAT})`);
    if (counts.BOWL < SQUAD_RULES.BOWL.min) errors.push(`Min ${SQUAD_RULES.BOWL.min} BOWL required (have ${counts.BOWL})`);
    if (counts.AR < SQUAD_RULES.AR.min) errors.push(`Min ${SQUAD_RULES.AR.min} AR required (have ${counts.AR})`);
    if (counts.WK < SQUAD_RULES.WK.min) errors.push(`Min ${SQUAD_RULES.WK.min} WK required (have ${counts.WK})`);
    
    if (counts.OVERSEAS < SQUAD_RULES.overseas.min || counts.OVERSEAS > SQUAD_RULES.overseas.max) {
        errors.push(`Overseas players must be between ${SQUAD_RULES.overseas.min}–${SQUAD_RULES.overseas.max} (have ${counts.OVERSEAS})`);
    }

    return { valid: errors.length === 0, errors, counts };
}

/** Validate Top 11 selection */
async function validateTop11(teamId, playerIds, captainId, viceCaptainId) {
    const errors = [];

    // 1. Must have exactly 11
    if (!playerIds || playerIds.length !== 11) {
        errors.push(`Select exactly 11 players (got ${playerIds?.length || 0})`);
    }

    // 2. All selected must be in team's squad
    const squad = await prisma.teamPlayer.findMany({
        where: { team_id: teamId },
        include: { player: true },
    });
    const squadPlayerIds = new Set(squad.map(tp => tp.player_id));
    const invalid = (playerIds || []).filter(id => !squadPlayerIds.has(id));
    if (invalid.length > 0) {
        errors.push(`Players not in squad: ${invalid.join(', ')}`);
    }

    // 3. Captain / Vice-Captain
    if (!captainId) errors.push('Captain must be selected');
    else if (!playerIds.includes(captainId)) errors.push('Captain must be in Top 11');

    if (!viceCaptainId) errors.push('Vice-Captain must be selected');
    else if (!playerIds.includes(viceCaptainId)) errors.push('Vice-Captain must be in Top 11');

    if (captainId && viceCaptainId && captainId === viceCaptainId) {
        errors.push('Captain and Vice-Captain must be different');
    }

    return { valid: errors.length === 0, errors };
}

// ═══════════════════════════════════════════════════════════════
// §2 — SCORING FORMULAS
// ═══════════════════════════════════════════════════════════════

/**
 * BaseScore = Σ(role_weight × rating^1.15) for Top11
 */
function calcBaseScore(top11Players) {
    return top11Players.reduce((sum, p) => {
        const weight = ROLE_WEIGHTS[p.category] || 1.0;
        return sum + (weight * Math.pow(p.rating, 1.15));
    }, 0);
}

/**
 * BalanceBonus (max 30):
 * Penalty = |BAT-5| + |BOWL-5| + |AR-3| + |WK-2| + |OVERSEAS-3|
 * SquadBalanceBonus = max(0, 30 - Penalty × 4)
 */
function calcBalanceBonus(squadCounts) {
    const penalty = 
        Math.abs(squadCounts.BAT - SQUAD_RULES.BAT.ideal) +
        Math.abs(squadCounts.BOWL - SQUAD_RULES.BOWL.ideal) +
        Math.abs(squadCounts.AR - SQUAD_RULES.AR.ideal) +
        Math.abs(squadCounts.WK - SQUAD_RULES.WK.ideal) +
        Math.abs(squadCounts.OVERSEAS - SQUAD_RULES.overseas.ideal);

    return Math.max(0, 30 - penalty * 4);
}

/**
 * EfficiencyBonus (max 15):
 * TotalSpent = 120 - purse_remaining
 * EfficiencyBonus = max(0, 15 - |TotalSpent - 110| × 0.3)
 */
function calcEfficiencyBonus(purseRemaining) {
    const totalSpent = 120 - Number(purseRemaining);
    return Math.max(0, 15 - Math.abs(totalSpent - 110) * 0.3);
}

/**
 * BrandBonus (max 5):
 * NormalizedBrand = team.brand_score / max(all brand_scores)
 * BrandBonus = NormalizedBrand × 5
 */
function calcBrandBonus(teamBrandScore, maxBrandScore) {
    const normalized = maxBrandScore > 0 ? Number(teamBrandScore) / maxBrandScore : 0;
    return normalized * 5;
}

// ═══════════════════════════════════════════════════════════════
// §3 — LOCK LINEUP (Transaction-wrapped)
// ═══════════════════════════════════════════════════════════════

async function lockLineup(teamId, playerIds, captainId, viceCaptainId) {
    // Validate Top 11 selection
    const validation = await validateTop11(teamId, playerIds, captainId, viceCaptainId);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join('; ')}`);
    }

    // Check auction phase
    const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
    if (state.phase !== 'POST_AUCTION' && state.phase !== 'COMPLETED') {
        throw new Error(`Cannot lock lineup in phase: ${state.phase}`);
    }

    return await prisma.$transaction(async (tx) => {
        // Upsert Top 11 selection
        await tx.top11Selection.upsert({
            where: { team_id: teamId },
            create: {
                team_id: teamId,
                player_ids: playerIds,
                captain_id: captainId,
                vice_captain_id: viceCaptainId,
            },
            update: {
                player_ids: playerIds,
                captain_id: captainId,
                vice_captain_id: viceCaptainId,
                submitted_at: new Date(),
            },
        });

        await tx.auditLog.create({
            data: {
                action: 'LOCK_LINEUP',
                details: { teamId, playerIds, captainId, viceCaptainId },
            },
        });

        return { success: true, teamId };
    });
}

// ═══════════════════════════════════════════════════════════════
// §4 — CALCULATE FULL LEADERBOARD
// ═══════════════════════════════════════════════════════════════

async function calculateLeaderboard() {
    // 1. Fetch all teams and their submissions
    const teams = await prisma.team.findMany({
        include: { top11_selection: true },
    });

    if (teams.length === 0) return [];

    const maxBrandScore = Math.max(...teams.map(t => Number(t.brand_score)), 1);
    const entries = [];

    for (const team of teams) {
        // Step 1: Validate Squad
        const squadValidation = await validateSquad(team.id);
        
        // Resolve Top 11 (if submitted)
        const sel = team.top11_selection;
        let players = [];
        let captain = null;
        let vc = null;
        let selectionErrors = [];

        if (sel) {
            players = await prisma.player.findMany({
                where: { id: { in: sel.player_ids } },
            });
            captain = players.find(p => p.id === sel.captain_id);
            vc = players.find(p => p.id === sel.vice_captain_id);
            
            const top11Validation = await validateTop11(team.id, sel.player_ids, sel.captain_id, sel.vice_captain_id);
            selectionErrors = top11Validation.errors;
        } else {
            selectionErrors.push('No Top 11 selection submitted');
        }

        // Check if team is ELIMINATED
        const isEliminated = !squadValidation.valid || !sel || selectionErrors.length > 0;

        if (isEliminated) {
            entries.push({
                teamId: team.id,
                teamName: team.name,
                brandKey: team.brand_key,
                franchiseName: team.franchise_name,
                purseRemaining: team.purse_remaining,
                squadCount: team.squad_count,
                status: 'ELIMINATED',
                errors: [...squadValidation.errors, ...selectionErrors],
                score: { baseScore: 0, balanceBonus: 0, efficiencyBonus: 0, captainBonus: 0, vcBonus: 0, brandBonus: 0, finalScore: 0 },
                rank: 999,
                top11: [],
                captain: null,
                viceCaptain: null,
            });
            continue;
        }

        // Step 4-6: Compute Score
        const baseScore = calcBaseScore(players);
        const captainBonus = Math.pow(captain.rating, 1.15);
        const vcBonus = 0.5 * Math.pow(vc.rating, 1.15);
        const balanceBonus = calcBalanceBonus(squadValidation.counts);
        const efficiencyBonus = calcEfficiencyBonus(team.purse_remaining);
        const brandBonus = calcBrandBonus(team.brand_score, maxBrandScore);

        const finalScore = baseScore + captainBonus + vcBonus + balanceBonus + efficiencyBonus + brandBonus;

        entries.push({
            teamId: team.id,
            teamName: team.name,
            brandKey: team.brand_key,
            franchiseName: team.franchise_name,
            purseRemaining: team.purse_remaining,
            squadCount: team.squad_count,
            status: 'ACTIVE',
            top11: players.map(p => ({
                id: p.id,
                name: p.name,
                rank: p.rank,
                rating: p.rating,
                category: p.category,
                nationality: p.nationality,
            })),
            captain: { id: captain.id, name: captain.name, rating: captain.rating },
            viceCaptain: { id: vc.id, name: vc.name, rating: vc.rating },
            score: {
                baseScore: Math.round(baseScore * 100) / 100,
                captainBonus: Math.round(captainBonus * 100) / 100,
                vcBonus: Math.round(vcBonus * 100) / 100,
                balanceBonus: Math.round(balanceBonus * 100) / 100,
                efficiencyBonus: Math.round(efficiencyBonus * 100) / 100,
                brandBonus: Math.round(brandBonus * 100) / 100,
                finalScore: Math.round(finalScore * 100) / 100,
            },
            rank: 0,
        });
    }

    // Sort: ACTIVE first, then FinalScore desc, then tie-breakers
    entries.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'ACTIVE' ? -1 : 1;
        if (a.status === 'ELIMINATED') return 0;

        // Primary: FinalScore
        if (b.score.finalScore !== a.score.finalScore) return b.score.finalScore - a.score.finalScore;

        // Tie-breaker 1: BaseScore
        if (b.score.baseScore !== a.score.baseScore) return b.score.baseScore - a.score.baseScore;

        // Tie-breaker 2: SquadBalanceBonus
        if (b.score.balanceBonus !== a.score.balanceBonus) return b.score.balanceBonus - a.score.balanceBonus;

        // Tie-breaker 3: purse_remaining
        if (Number(b.purseRemaining) !== Number(a.purseRemaining)) return Number(b.purseRemaining) - Number(a.purseRemaining);

        // Tie-breaker 4: captain rating
        return b.captain.rating - a.captain.rating;
    });

    // Assign ranks
    let currentRank = 1;
    entries.forEach((entry, i) => {
        if (entry.status === 'ELIMINATED') {
            entry.rank = 999;
            return;
        }
        if (i > 0 && entry.score.finalScore === entries[i - 1].score.finalScore && entries[i-1].status === 'ACTIVE') {
            entry.rank = entries[i - 1].rank;
        } else {
            entry.rank = currentRank;
        }
        currentRank++;
    });

    return entries;
}

// ═══════════════════════════════════════════════════════════════
// §5 — GET SINGLE TEAM SCORE
// ═══════════════════════════════════════════════════════════════

async function getTeamScore(teamId) {
    const leaderboard = await calculateLeaderboard();
    return leaderboard.find(e => e.teamId === teamId) || null;
}

export default {
    validateTop11,
    lockLineup,
    calculateLeaderboard,
    getTeamScore,
    TOP11_RULES,
};
