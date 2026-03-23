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

/**
 * BaseScore = Σ(rating^1.15 for Top11) + captain_rating^1.2 + 0.5 × vc_rating^1.15
 */
function calcBaseScore(top11Players, captainRating, vcRating) {
    const sumRatings = top11Players.reduce((sum, p) => sum + Math.pow(p.rating, 1.15), 0);
    const captainBonus = Math.pow(captainRating, 1.2);
    const vcBonus = 0.5 * Math.pow(vcRating, 1.15);
    return sumRatings + captainBonus + vcBonus;
}

/**
 * BalanceBonus (max 40):
 * For each category, penalty = |actual_count - ideal_midpoint| × 3
 * BalanceBonus = max(0, 40 - total_penalty)
 */
function calcBalanceBonus(top11Players) {
    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
    top11Players.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });

    let totalPenalty = 0;
    for (const [cat, ideal] of Object.entries(IDEAL_MIDPOINTS)) {
        totalPenalty += Math.abs((counts[cat] || 0) - ideal) * 3;
    }
    return Math.max(0, 40 - totalPenalty);
}

/**
 * EfficiencyBonus (max 15):
 * RawTop11 = Σ(ratings of Top 11)
 * EffectiveSpent = max(total_spent, 60)
 * ExpectedTop11 = (EffectiveSpent / 120) × LeagueAverageTop11
 * EfficiencyDelta = RawTop11 - ExpectedTop11
 * Scaled 0–15 across all teams
 */
function calcEfficiencyBonus(rawTop11, totalSpent, allTeamData) {
    const effectiveSpent = Math.max(totalSpent, 60);

    // League average Top 11 raw rating
    const allRawTotals = allTeamData.map(t => t.rawTop11);
    const leagueAvg = allRawTotals.length > 0
        ? allRawTotals.reduce((a, b) => a + b, 0) / allRawTotals.length
        : rawTop11;

    const expectedTop11 = (effectiveSpent / 120) * leagueAvg;
    const delta = rawTop11 - expectedTop11;

    // Compute all deltas for scaling
    const allDeltas = allTeamData.map(t => {
        const effSpent = Math.max(t.totalSpent, 60);
        const expected = (effSpent / 120) * leagueAvg;
        return t.rawTop11 - expected;
    });

    const minDelta = Math.min(...allDeltas, delta);
    const maxDelta = Math.max(...allDeltas, delta);
    const range = maxDelta - minDelta;

    if (range === 0) return 7.5; // all same → middle
    return ((delta - minDelta) / range) * 15;
}

/**
 * OverseasBonus:
 * 3–4 overseas in Top 11 → +10
 * 5 overseas → +5
 * <3 overseas → 0
 */
function calcOverseasBonus(top11Players) {
    const count = top11Players.filter(p => p.nationality === 'OVERSEAS').length;
    if (count >= 3 && count <= 4) return 10;
    if (count === 5) return 5;
    return 0;
}

/**
 * BrandMultiplier (from franchise brand_score — NOT player legacy):
 * NormalizedBrandScore = team.brand_score / max_brand_score (across all teams)
 * BrandMultiplier = 1 + (NormalizedBrandScore × 0.05)
 */
function calcBrandMultiplier(teamBrandScore, allTeamBrandScores) {
    const maxBrand = Math.max(...allTeamBrandScores, 1); // avoid /0
    const normalized = Number(teamBrandScore) / maxBrand;
    return 1 + (normalized * 0.05);
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
// §4 — SUBMIT BY RANKS (For frontend compatibility)
// ═══════════════════════════════════════════════════════════════

async function submitTeamByRanks(teamId, playerRanks, captainRank, viceCaptainRank) {
    // 1. Resolve team UUID if numeric index provided
    let realTeamId = String(teamId);
    if (!isNaN(Number(teamId)) && Number(teamId) <= 10) {
        // Assuming teamId 1-10 corresponds to specific teams in the DB
        // If the DB uses UUIDs, we might need a lookup table or a specific team lookup by some property.
        // However, looking at the schema, Team.id is a UUID.
        // Let's find the team by some other means if it's numeric, or assume it's already a UUID if it fails.
        const teams = await prisma.team.findMany({ orderBy: { created_at: 'asc' } });
        const target = teams[Number(teamId) - 1];
        if (target) realTeamId = target.id;
    }

    // 2. Resolve players by rank
    const players = await prisma.player.findMany({
        where: { rank: { in: [ ...playerRanks, captainRank, viceCaptainRank ] } }
    });

    const getUuid = (rank) => players.find(p => p.rank === rank)?.id;

    const playerIds = playerRanks.map(getUuid).filter(Boolean);
    const captainId = getUuid(captainRank);
    const viceCaptainId = getUuid(viceCaptainRank);

    if (playerIds.length !== 11) throw new Error("Could not resolve all 11 player ranks to IDs");
    if (!captainId) throw new Error("Could not resolve captain rank to ID");
    if (!viceCaptainId) throw new Error("Could not resolve vice-captain rank to ID");

    return await lockLineup(realTeamId, playerIds, captainId, viceCaptainId);
}

// ═══════════════════════════════════════════════════════════════
// §5 — CALCULATE FULL LEADERBOARD
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
        const players = await prisma.player.findMany({
            where: { id: { in: sel.player_ids } },
        });

        const captain = players.find(p => p.id === sel.captain_id);
        const vc = players.find(p => p.id === sel.vice_captain_id);
        if (!captain || !vc) continue;

        // Total spent = 120 - purse_remaining
        const totalSpent = 120 - Number(sel.team.purse_remaining);
        const rawTop11 = players.reduce((sum, p) => sum + p.rating, 0);

        teamData.push({
            team: sel.team,
            selection: sel,
            players,
            captain,
            vc,
            totalSpent,
            rawTop11,
        });
    }

    // 3. Compute scores for each team
    const allBrandScores = teamData.map(t => Number(t.team.brand_score));

    const entries = teamData.map(td => {
        const baseScore = calcBaseScore(td.players, td.captain.rating, td.vc.rating);
        const balanceBonus = calcBalanceBonus(td.players);
        const efficiencyBonus = calcEfficiencyBonus(td.rawTop11, td.totalSpent, teamData);
        const overseasBonus = calcOverseasBonus(td.players);
        const brandMultiplier = calcBrandMultiplier(td.team.brand_score, allBrandScores);

        const rawTotal = baseScore + balanceBonus + efficiencyBonus + overseasBonus;
        const finalScore = rawTotal * brandMultiplier;

        return {
            teamId: td.team.id,
            teamName: td.team.name,
            brandKey: td.team.brand_key,
            franchiseName: td.team.franchise_name,
            purseRemaining: td.team.purse_remaining,
            squadCount: td.team.squad_count,
            top11: td.players.map(p => ({
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
                balanceBonus: Math.round(balanceBonus * 100) / 100,
                efficiencyBonus: Math.round(efficiencyBonus * 100) / 100,
                overseasBonus,
                brandMultiplier: Math.round(brandMultiplier * 1000) / 1000,
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
        // Tie-breaker 1: raw Top 11 sum (higher wins)
        const aRaw = a.top11.reduce((s, p) => s + p.rating, 0);
        const bRaw = b.top11.reduce((s, p) => s + p.rating, 0);
        if (bRaw !== aRaw) return bRaw - aRaw;

        // Tie-breaker 2: balance bonus (higher wins)
        if (b.score.balanceBonus !== a.score.balanceBonus) {
            return b.score.balanceBonus - a.score.balanceBonus;
        }

        // Tie-breaker 3: purse remaining (higher wins)
        return Number(b.purseRemaining) - Number(a.purseRemaining);
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
    submitTeamByRanks,
    calculateLeaderboard,
    getTeamScore,
    TOP11_RULES,
};
