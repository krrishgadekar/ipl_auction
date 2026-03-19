// ═══════════════════════════════════════════════════════════════
// IPL Auction 2026 — Final Scoring Service
// Mathematical implementations EXACTLY as per the PDF Specification.
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/db.js';

const TOP11_RULES = {
    total: 11,
    BAT: { required: 4 },
    BOWL: { required: 4 },
    WK: { required: 1 },
    AR: { required: 2 },
    maxOverseas: 4,
};

async function validateTop11(teamId, playerIds, captainId, viceCaptainId) {
    const errors = [];
    if (!playerIds || playerIds.length !== 11) errors.push(`Select exactly 11 players.`);

    const squad = await prisma.teamPlayer.findMany({
        where: { team_id: teamId },
        include: { player: true },
    });
    
    // Core Rules Post-Auction Validation (15 players, role minimums)
    const totalSquad = squad.length;
    const squadCats = { BAT: 0, BOWL: 0, AR: 0, WK: 0, OVERSEAS: 0 };
    squad.forEach(tp => {
        squadCats[tp.player.category]++;
        if (tp.player.nationality === 'OVERSEAS') squadCats.OVERSEAS++;
    });

    const isEliminated = 
        totalSquad !== 15 || 
        squadCats.BAT < 3 || squadCats.BOWL < 3 || 
        squadCats.AR < 2 || squadCats.WK < 2 || 
        squadCats.OVERSEAS < 2 || squadCats.OVERSEAS > 5;
    
    if (isEliminated) errors.push("ELIMINATED: Squad composition violates strict 15-player rules.");

    const squadPlayerIds = new Set(squad.map(tp => tp.player_id));
    const invalid = playerIds.filter(id => !squadPlayerIds.has(id));
    if (invalid.length > 0) errors.push(`Players not in squad.`);

    const selected = squad.filter(s => playerIds.includes(s.player_id)).map(s => s.player);
    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
    selected.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);

    for (const [cat, rule] of Object.entries(TOP11_RULES)) {
        if (cat === 'total' || cat === 'maxOverseas') continue;
        if (counts[cat] !== rule.required) errors.push(`Need exactly ${rule.required} ${cat} for Top 11`);
    }

    const overseasCount = selected.filter(p => p.nationality === 'OVERSEAS').length;
    if (overseasCount > TOP11_RULES.maxOverseas) errors.push(`Max ${TOP11_RULES.maxOverseas} overseas in Top 11`);

    if (!captainId || !playerIds.includes(captainId)) errors.push('Valid Captain must be selected');
    if (!viceCaptainId || !playerIds.includes(viceCaptainId)) errors.push('Valid Vice-Captain must be selected');
    if (captainId === viceCaptainId && captainId) errors.push('Captain and Vice-Captain must be different');

    return { valid: errors.length === 0, errors, isEliminated };
}

// ── Formulas from PDF ────────────────────────────────────────

function calcBaseScore(top11Players) {
    const ROLE_WEIGHTS = { BAT: 1.00, AR: 1.00, WK: 1.00, BOWL: 0.96 };
    let sum = 0;
    for (const p of top11Players) {
        const weight = ROLE_WEIGHTS[p.category] || 1.00;
        sum += weight * Math.pow(p.rating, 1.15);
    }
    return sum;
}

function calcCaptainBonuses(captainRating, vcRating) {
    const captainBonus = Math.pow(captainRating, 1.15); // Adds +1x
    const vcBonus = 0.5 * Math.pow(vcRating, 1.15); // Adds +0.5x
    return { captainBonus, vcBonus };
}

function calcSquadBalanceBonus(fullSquadPlayers) {
    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0, OVERSEAS: 0 };
    fullSquadPlayers.forEach(p => {
        counts[p.category]++;
        if (p.nationality === 'OVERSEAS') counts.OVERSEAS++;
    });

    const penalty = 
        Math.abs(counts.BAT - 5) + 
        Math.abs(counts.BOWL - 5) + 
        Math.abs(counts.AR - 3) + 
        Math.abs(counts.WK - 2) + 
        Math.abs(counts.OVERSEAS - 3);

    return Math.max(0, 30 - penalty * 4);
}

function calcEfficiencyBonus(totalSpent) {
    return Math.max(0, 15 - Math.abs(totalSpent - 110) * 0.3);
}

function calcBrandBonus(teamBrandScore, allBrandScores) {
    const maxBrand = Math.max(...allBrandScores, 1);
    const normalized = Number(teamBrandScore) / maxBrand;
    return normalized * 5;
}

// ── Database Writes ──────────────────────────────────────────

async function lockLineup(teamId, playerIds, captainId, viceCaptainId) {
    const validation = await validateTop11(teamId, playerIds, captainId, viceCaptainId);
    if (!validation.valid) throw new Error(`Validation failed: ${validation.errors.join('; ')}`);

    return await prisma.$transaction(async (tx) => {
        await tx.top11Selection.upsert({
            where: { team_id: teamId },
            create: { team_id: teamId, player_ids: playerIds, captain_id: captainId, vice_captain_id: viceCaptainId },
            update: { player_ids: playerIds, captain_id: captainId, vice_captain_id: viceCaptainId, submitted_at: new Date() },
        });

        await tx.auditLog.create({
            data: { action: 'LOCK_LINEUP', details: { teamId, playerIds, captainId, viceCaptainId } },
        });

        return { success: true, teamId };
    });
}

// ── Calculate Final Leaderboard ──────────────────────────────

async function calculateLeaderboard() {
    const selections = await prisma.top11Selection.findMany({ include: { team: true } });
    if (selections.length === 0) return [];

    const teamData = [];
    const allTeamsCount = await prisma.team.count();
    
    // Resolve players
    for (const sel of selections) {
        // Top 11
        const top11 = await prisma.player.findMany({ where: { id: { in: sel.player_ids } } });
        // Full Squad (15)
        const teamPlayers = await prisma.teamPlayer.findMany({ 
            where: { team_id: sel.team_id }, include: { player: true } 
        });
        const fullSquad = teamPlayers.map(tp => tp.player);

        const captain = top11.find(p => p.id === sel.captain_id);
        const vc = top11.find(p => p.id === sel.vice_captain_id);
        if (!captain || !vc) continue;

        // Squad Elimination Validation
        let isEliminated = false;
        let counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0, OVERSEAS: 0 };
        fullSquad.forEach(p => {
            counts[p.category]++;
            if (p.nationality === 'OVERSEAS') counts.OVERSEAS++;
        });

        if (
            fullSquad.length !== 15 || 
            counts.BAT < 3 || counts.BOWL < 3 || counts.AR < 2 || counts.WK < 2 || 
            counts.OVERSEAS < 2 || counts.OVERSEAS > 5
        ) {
            isEliminated = true;
        }

        const totalSpent = Number(120 - Number(sel.team.purse_remaining));

        teamData.push({
            team: sel.team,
            selection: sel,
            top11,
            fullSquad,
            captain,
            vc,
            totalSpent,
            isEliminated
        });
    }

    const allBrandScores = teamData.map(t => Number(t.team.brand_score));

    const entries = teamData.map(td => {
        let finalScore = 0;
        let baseScore = 0;
        let captainBonus = 0, vcBonus = 0, squadBalanceBonus = 0, efficiencyBonus = 0, brandBonus = 0;

        if (!td.isEliminated) {
            baseScore = calcBaseScore(td.top11);
            const cb = calcCaptainBonuses(td.captain.rating, td.vc.rating);
            captainBonus = cb.captainBonus;
            vcBonus = cb.vcBonus;
            squadBalanceBonus = calcSquadBalanceBonus(td.fullSquad);
            efficiencyBonus = calcEfficiencyBonus(td.totalSpent);
            brandBonus = calcBrandBonus(td.team.brand_score, allBrandScores);

            finalScore = baseScore + captainBonus + vcBonus + squadBalanceBonus + efficiencyBonus + brandBonus;
        }

        return {
            teamId: td.team.id,
            teamName: td.team.name,
            purseRemaining: td.team.purse_remaining,
            squadCount: td.team.squad_count,
            top11: td.top11.map(p => ({ id: p.id, name: p.name, rating: p.rating, category: p.category })),
            captain: { id: td.captain.id, name: td.captain.name, rating: td.captain.rating },
            viceCaptain: { id: td.vc.id, name: td.vc.name, rating: td.vc.rating },
            score: {
                baseScore: Math.round(baseScore * 100) / 100,
                captainBonus: Math.round(captainBonus * 100) / 100,
                vcBonus: Math.round(vcBonus * 100) / 100,
                balanceBonus: Math.round(squadBalanceBonus * 100) / 100,
                efficiencyBonus: Math.round(efficiencyBonus * 100) / 100,
                brandBonus: Math.round(brandBonus * 100) / 100,
                finalScore: Math.round(finalScore * 100) / 100,
            },
            isEliminated: td.isEliminated,
            rank: 0,
        };
    });

    // ── Tie-Breaker Logic (PDF Rules) ──
    entries.sort((a, b) => {
        if (a.isEliminated && !b.isEliminated) return 1;
        if (!a.isEliminated && b.isEliminated) return -1;
        if (a.isEliminated && b.isEliminated) return 0;

        if (b.score.finalScore !== a.score.finalScore) return b.score.finalScore - a.score.finalScore;
        if (b.score.baseScore !== a.score.baseScore) return b.score.baseScore - a.score.baseScore;
        if (b.score.balanceBonus !== a.score.balanceBonus) return b.score.balanceBonus - a.score.balanceBonus;
        if (Number(b.purseRemaining) !== Number(a.purseRemaining)) return Number(b.purseRemaining) - Number(a.purseRemaining);
        return b.captain.rating - a.captain.rating;
    });

    entries.forEach((entry, i) => {
        if (i > 0 && entry.score.finalScore === entries[i - 1].score.finalScore && !entry.isEliminated) {
            entry.rank = entries[i - 1].rank;
        } else {
            entry.rank = entry.isEliminated ? '-' : i + 1;
        }
    });

    return entries;
}

export default {
    validateTop11,
    lockLineup,
    calculateLeaderboard,
    TOP11_RULES,
};
