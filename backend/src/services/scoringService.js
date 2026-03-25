// ═══════════════════════════════════════════════════════════════
// IPL Auction 2026 — Scoring Service (V3.1 Locked Formula)
//
// Post-auction each team selects Top 11, Captain, Vice-Captain.
// System validates composition, calculates locked V3.1 score.
// All calculations server-side; frontend displays results only.
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/db.js';

// ── Constants ────────────────────────────────────────────────

/** Top 11 playing-XI constraints */
const TOP11_RULES = {
    total: 11,
    BAT: { required: 4 },
    BOWL: { required: 4 },
    WK: { required: 1 },
    AR: { required: 2 },
    maxOverseas: 4,
};

/** Ideal midpoints for balance (midpoint of full squad min–max) */
const IDEAL_MIDPOINTS = { BAT: 4, BOWL: 6.5, AR: 4, WK: 3 };

// ═══════════════════════════════════════════════════════════════
// §1 — VALIDATE TOP 11
// ═══════════════════════════════════════════════════════════════

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
    const invalid = playerIds.filter(id => !squadPlayerIds.has(id));
    if (invalid.length > 0) {
        errors.push(`Players not in squad: ${invalid.join(', ')}`);
    }

    // 3. Resolve selected players
    const selected = [];
    for (const id of playerIds) {
        const tp = squad.find(s => s.player_id === id);
        if (tp) selected.push(tp.player);
    }

    // 4. Category counts
    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
    selected.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });

    for (const [cat, rule] of Object.entries(TOP11_RULES)) {
        if (cat === 'total' || cat === 'maxOverseas') continue;
        if (counts[cat] !== rule.required) {
            errors.push(`Need ${rule.required} ${cat} (have ${counts[cat] || 0})`);
        }
    }

    // 5. Overseas limit in Top 11
    const overseasCount = selected.filter(p => p.nationality === 'OVERSEAS').length;
    if (overseasCount > TOP11_RULES.maxOverseas) {
        errors.push(`Max ${TOP11_RULES.maxOverseas} overseas in Top 11 (have ${overseasCount})`);
    }

    // 6. Captain / Vice-Captain
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
// §2 — V3.1 SCORING FORMULA (LOCKED)
// ═══════════════════════════════════════════════════════════════

function isSquadValid(fullSquadPlayers) {
    if (fullSquadPlayers.length !== 15) return false;
    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
    let overseas = 0;
    
    fullSquadPlayers.forEach(p => { 
        counts[p.category] = (counts[p.category] || 0) + 1;
        if (p.nationality === 'OVERSEAS') overseas++;
    });

    if (counts.BAT < 3) return false;
    if (counts.BOWL < 3) return false;
    if (counts.AR < 2) return false;
    if (counts.WK < 2) return false;
    if (overseas < 2 || overseas > 5) return false;

    return true;
}

/**
 * BaseScore = Σ (role_weight × rating^1.15)
 * Role weights: BAT = 1.00, AR = 1.00, WK = 1.00, BOWL = 0.96
 */
function calcBaseScore(top11Players) {
    return top11Players.reduce((sum, p) => {
        const weight = p.category === 'BOWL' ? 0.96 : 1.00;
        return sum + (weight * Math.pow(p.rating, 1.15));
    }, 0);
}

/**
 * CaptainBonus = rating_captain^1.15
 */
function calcCaptainBonus(captainRating) {
    return Math.pow(captainRating, 1.15);
}

/**
 * ViceCaptainBonus = 0.5 × rating_vc^1.15
 */
function calcVCBonus(vcRating) {
    return 0.5 * Math.pow(vcRating, 1.15);
}

/**
 * SquadBalanceBonus = max(0, 30 - Penalty × 4)
 * Based on full 15 squad.
 */
function calcBalanceBonus(fullSquadPlayers) {
    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
    let overseas = 0;
    
    fullSquadPlayers.forEach(p => { 
        counts[p.category] = (counts[p.category] || 0) + 1;
        if (p.nationality === 'OVERSEAS') overseas++;
    });

    const penalty = Math.abs((counts.BAT || 0) - 5) + 
                    Math.abs((counts.BOWL || 0) - 5) + 
                    Math.abs((counts.AR || 0) - 3) + 
                    Math.abs((counts.WK || 0) - 2) + 
                    Math.abs(overseas - 3);

    return Math.max(0, 30 - penalty * 4);
}

/**
 * EfficiencyBonus = max(0, 15 - |TotalSpent - 110| × 0.3)
 */
function calcEfficiencyBonus(totalSpent) {
    return Math.max(0, 15 - Math.abs(totalSpent - 110) * 0.3);
}

/**
 * BrandBonus = NormalizedBrand × 5
 */
function calcBrandBonus(teamBrandScore, allTeamBrandScores) {
    const maxBrand = Math.max(...allTeamBrandScores, 1);
    const normalized = Number(teamBrandScore) / maxBrand;
    return normalized * 5;
}

// ═══════════════════════════════════════════════════════════════
// §3 — LOCK LINEUP (Transaction-wrapped)
// ═══════════════════════════════════════════════════════════════

async function lockLineup(teamId, playerIds, captainId, viceCaptainId) {
    // Validate first
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
    // 1. Fetch all submitted Top 11 selections
    const selections = await prisma.top11Selection.findMany({
        include: { team: true },
    });

    if (selections.length === 0) return [];

    // 2. Resolve all players and compute per-team data
    const teamData = [];

    for (const sel of selections) {
        const top11Players = await prisma.player.findMany({
            where: { id: { in: sel.player_ids } },
        });

        const captain = top11Players.find(p => p.id === sel.captain_id);
        const vc = top11Players.find(p => p.id === sel.vice_captain_id);
        if (!captain || !vc) continue;

        // Fetch full squad
        const squadRecords = await prisma.teamPlayer.findMany({
            where: { team_id: sel.team.id },
            include: { player: true },
        });
        const fullSquad = squadRecords.map(tp => tp.player);

        // Filter out eliminated teams
        if (!isSquadValid(fullSquad)) continue;

        const totalSpent = 120 - Number(sel.team.purse_remaining);

        teamData.push({
            team: sel.team,
            selection: sel,
            top11Players,
            fullSquad,
            captain,
            vc,
            totalSpent,
        });
    }

    // 3. Compute scores for each team
    const allBrandScores = teamData.map(t => Number(t.team.brand_score));

    const entries = teamData.map(td => {
        const baseScore = calcBaseScore(td.top11Players);
        const captainBonus = calcCaptainBonus(td.captain.rating);
        const vcBonus = calcVCBonus(td.vc.rating);
        const balanceBonus = calcBalanceBonus(td.fullSquad);
        const efficiencyBonus = calcEfficiencyBonus(td.totalSpent);
        const brandBonus = calcBrandBonus(td.team.brand_score, allBrandScores);

        const finalScore = baseScore + captainBonus + vcBonus + balanceBonus + efficiencyBonus + brandBonus;

        return {
            teamId: td.team.id,
            teamName: td.team.name,
            brandKey: td.team.brand_key,
            franchiseName: td.team.franchise_name,
            purseRemaining: td.team.purse_remaining,
            squadCount: td.team.squad_count,
            top11: td.top11Players.map(p => ({
                id: p.id,
                name: p.name,
                rank: p.rank,
                rating: p.rating,
                category: p.category,
                nationality: p.nationality,
            })),
            captain: { id: td.captain.id, name: td.captain.name, rating: td.captain.rating },
            viceCaptain: { id: td.vc.id, name: td.vc.name, rating: td.vc.rating },
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
        };
    });

    // 4. Sort by finalScore descending, then apply tie-breakers
    entries.sort((a, b) => {
        // Primary: final score
        if (b.score.finalScore !== a.score.finalScore) {
            return b.score.finalScore - a.score.finalScore;
        }
        // Tie-breaker 1: BaseScore (higher wins)
        if (b.score.baseScore !== a.score.baseScore) {
            return b.score.baseScore - a.score.baseScore;
        }

        // Tie-breaker 2: balance bonus (higher wins)
        if (b.score.balanceBonus !== a.score.balanceBonus) {
            return b.score.balanceBonus - a.score.balanceBonus;
        }

        // Tie-breaker 3: purse remaining (higher wins)
        if (Number(b.purseRemaining) !== Number(a.purseRemaining)) {
            return Number(b.purseRemaining) - Number(a.purseRemaining);
        }

        // Tie-breaker 4: captain rating (higher wins)
        return b.captain.rating - a.captain.rating;
    });

    // 5. Assign ranks
    entries.forEach((entry, i) => {
        if (i > 0 && entry.score.finalScore === entries[i - 1].score.finalScore) {
            entry.rank = entries[i - 1].rank;
        } else {
            entry.rank = i + 1;
        }
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
