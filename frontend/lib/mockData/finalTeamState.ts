// ──────────────────────────────────────────────────────────────
// Final Team Submission – State, Validation, Scoring (V3.1)
// ──────────────────────────────────────────────────────────────
// Post-auction each team selects Top 11, Captain, Vice-Captain.
// System validates composition, calculates locked V3.1 score.
// ──────────────────────────────────────────────────────────────

import { Player, PlayerCategory, mockPlayers, getMockPlayerByRank } from './players';
import { Team, mockTeams } from './teams';

// ═══════════════════════════════════════════════════════════════
// §1  COMPOSITION RULES
// ═══════════════════════════════════════════════════════════════

/** Full 15-player squad constraints (Rulebook §5) */
export const SQUAD_COMPOSITION = {
    total: 15,
    Batsmen: { min: 3, max: 5 },
    Bowlers: { min: 5, max: 8 },
    'All-rounders': { min: 3, max: 5 },
    Wicketkeepers: { min: 2, max: 4 },
    overseas: { min: 3, max: 5 },
    purse: 120,
} as const;

/** Top 11 playing-XI constraints (user-specified) */
export const TOP11_COMPOSITION = {
    total: 11,
    Batsmen: { required: 4 },
    Bowlers: { required: 4 },
    Wicketkeepers: { required: 1 },
    'All-rounders': { required: 2 },
    maxOverseas: 4,
} as const;

// Ideal midpoint for balance calculation
// (midpoint between min and max of squad rules for each category)
export const IDEAL_MIDPOINTS: Record<string, number> = {
    Batsmen: 4,   // midpoint of 3–5
    Bowlers: 6.5, // midpoint of 5–8
    'All-rounders': 4,   // midpoint of 3–5
    Wicketkeepers: 3,   // midpoint of 2–4
};

// ═══════════════════════════════════════════════════════════════
// §2  DATA MODEL
// ═══════════════════════════════════════════════════════════════

export interface FinalTeamSubmission {
    teamId: number;
    playing11: number[];         // 11 player ranks
    captainRank: number;
    viceCaptainRank: number;
    submitted: boolean;
    submittedAt?: number;        // timestamp
}

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
    team: Team;
    submission: FinalTeamSubmission;
    players: Player[];           // resolved Top 11
    captain: Player;
    viceCaptain: Player;
    score: ScoreBreakdown;
    rank: number;
}

// ═══════════════════════════════════════════════════════════════
// §3  VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export function validateTop11(
    selectedRanks: number[],
    captainRank: number | null,
    vcRank: number | null,
    teamPlayers: Player[],
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Must have exactly 11
    if (selectedRanks.length !== 11) {
        errors.push(`Select exactly 11 players (currently ${selectedRanks.length})`);
    }

    // All selected must be in team
    const teamRanks = new Set(teamPlayers.map(p => p.rank));
    const invalid = selectedRanks.filter(r => !teamRanks.has(r));
    if (invalid.length > 0) {
        errors.push(`Players not in your squad: ${invalid.join(', ')}`);
    }

    // Resolve players
    const selected = selectedRanks
        .map(r => teamPlayers.find(p => p.rank === r))
        .filter((p): p is Player => !!p);

    // Category counts
    const counts: Record<string, number> = {
        Batsmen: 0, Bowlers: 0, 'All-rounders': 0, Wicketkeepers: 0,
    };
    selected.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });

    const rules = TOP11_COMPOSITION;
    if (counts.Batsmen !== rules.Batsmen.required)
        errors.push(`Need ${rules.Batsmen.required} Batsmen (have ${counts.Batsmen})`);
    if (counts.Bowlers !== rules.Bowlers.required)
        errors.push(`Need ${rules.Bowlers.required} Bowlers (have ${counts.Bowlers})`);
    if (counts.Wicketkeepers !== rules.Wicketkeepers.required)
        errors.push(`Need ${rules.Wicketkeepers.required} Wicketkeeper (have ${counts.Wicketkeepers})`);
    if (counts['All-rounders'] !== rules['All-rounders'].required)
        errors.push(`Need ${rules['All-rounders'].required} All-rounders (have ${counts['All-rounders']})`);

    // Overseas count
    const overseasCount = selected.filter(p => p.nationality === 'Overseas').length;
    if (overseasCount > rules.maxOverseas)
        errors.push(`Max ${rules.maxOverseas} overseas (have ${overseasCount})`);

    // Captain / VC
    if (!captainRank)
        errors.push('Captain must be selected');
    else if (!selectedRanks.includes(captainRank))
        errors.push('Captain must be in the Top 11');

    if (!vcRank)
        errors.push('Vice-Captain must be selected');
    else if (!selectedRanks.includes(vcRank))
        errors.push('Vice-Captain must be in the Top 11');

    if (captainRank && vcRank && captainRank === vcRank)
        errors.push('Captain and Vice-Captain must be different players');

    return { valid: errors.length === 0, errors, warnings };
}

// ═══════════════════════════════════════════════════════════════
// §4  SCORING ENGINE — LOCKED FORMULA V3.1
// ═══════════════════════════════════════════════════════════════

/** rating ^ power  */
function pow(rating: number, exp: number): number {
    return Math.pow(rating, exp);
}

/**
 * BaseScore = Σ(rating^1.15 for Top11) + captain^1.2 + 0.5 × vc^1.15
 */
function calcBaseScore(top11: Player[], captain: Player, vc: Player): number {
    const sumRatings = top11.reduce((sum, p) => sum + pow(p.rating, 1.15), 0);
    const captainBonus = pow(captain.rating, 1.2);
    const vcBonus = 0.5 * pow(vc.rating, 1.15);
    return sumRatings + captainBonus + vcBonus;
}

/**
 * BalanceBonus (max 40):
 * For each category, penalty = |actual_count - ideal_midpoint| × 3
 * Total penalty = sum of all category penalties
 * BalanceBonus = max(0, 40 - total_penalty)
 */
function calcBalanceBonus(top11: Player[]): number {
    const counts: Record<string, number> = {
        Batsmen: 0, Bowlers: 0, 'All-rounders': 0, Wicketkeepers: 0,
    };
    top11.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });

    let totalPenalty = 0;
    for (const [cat, ideal] of Object.entries(IDEAL_MIDPOINTS)) {
        totalPenalty += Math.abs((counts[cat] || 0) - ideal) * 3;
    }

    return Math.max(0, 40 - totalPenalty);
}

/**
 * EfficiencyBonus (max 15):
 * RawTop11 = sum of raw ratings for Top 11
 * EffectiveSpent = max(total_spent, 60)
 * ExpectedTop11 = (EffectiveSpent / 120) × LeagueAverageTop11
 * EfficiencyDelta = RawTop11 - ExpectedTop11
 * Scaled 0–15 across all teams in the universe
 */
function calcEfficiencyBonus(
    top11: Player[],
    team: Team,
    allSubmissions: { top11: Player[]; team: Team }[],
): number {
    const rawTop11 = top11.reduce((sum, p) => sum + p.rating, 0);
    const totalSpent = team.budgetUsed;
    const effectiveSpent = Math.max(totalSpent, 60);

    // League average Top 11 raw rating (across all submitted teams)
    const allRawTotals = allSubmissions.map(s =>
        s.top11.reduce((sum, p) => sum + p.rating, 0)
    );
    const leagueAvgTop11 = allRawTotals.length > 0
        ? allRawTotals.reduce((a, b) => a + b, 0) / allRawTotals.length
        : rawTop11;

    const expectedTop11 = (effectiveSpent / 120) * leagueAvgTop11;
    const delta = rawTop11 - expectedTop11;

    // Scale across all deltas (0–15)
    const allDeltas = allSubmissions.map(s => {
        const raw = s.top11.reduce((sum, p) => sum + p.rating, 0);
        const spent = Math.max(s.team.budgetUsed, 60);
        const expected = (spent / 120) * leagueAvgTop11;
        return raw - expected;
    });

    const minDelta = Math.min(...allDeltas, delta);
    const maxDelta = Math.max(...allDeltas, delta);
    const range = maxDelta - minDelta;

    if (range === 0) return 7.5; // all same → middle

    return ((delta - minDelta) / range) * 15;
}

/**
 * OverseasBonus: 3–4 overseas → +10 | 5 → +5 | <3 → 0
 */
function calcOverseasBonus(top11: Player[]): number {
    const count = top11.filter(p => p.nationality === 'Overseas').length;
    if (count >= 3 && count <= 4) return 10;
    if (count === 5) return 5;
    return 0;
}

/**
 * BrandMultiplier = 1 + (NormalizedBrandScore × 0.05)
 * Brand score = legacy sum of Top 11, normalized 0–1 across all teams
 */
function calcBrandMultiplier(
    top11: Player[],
    allSubmissions: { top11: Player[] }[],
): number {
    const brandScore = top11.reduce((sum, p) => sum + (p.legacy || 0), 0);

    const allBrands = allSubmissions.map(s =>
        s.top11.reduce((sum, p) => sum + (p.legacy || 0), 0)
    );

    const minBrand = Math.min(...allBrands, brandScore);
    const maxBrand = Math.max(...allBrands, brandScore);
    const range = maxBrand - minBrand;

    const normalized = range === 0 ? 0.5 : (brandScore - minBrand) / range;
    return 1 + (normalized * 0.05);
}

/**
 * Full V3.1 score calculation
 */
export function calculateScore(
    submission: FinalTeamSubmission,
    team: Team,
    allSubmissions: { submission: FinalTeamSubmission; team: Team }[],
): ScoreBreakdown {
    // Resolve players
    const top11 = submission.playing11
        .map(r => getMockPlayerByRank(r))
        .filter((p): p is Player => !!p);

    const captain = getMockPlayerByRank(submission.captainRank)!;
    const vc = getMockPlayerByRank(submission.viceCaptainRank)!;

    // Resolve all submissions for relative calculations
    const allResolved = allSubmissions.map(s => ({
        top11: s.submission.playing11
            .map(r => getMockPlayerByRank(r))
            .filter((p): p is Player => !!p),
        team: s.team,
    }));

    const baseScore = calcBaseScore(top11, captain, vc);
    const balanceBonus = calcBalanceBonus(top11);
    const efficiencyBonus = calcEfficiencyBonus(top11, team, allResolved);
    const overseasBonus = calcOverseasBonus(top11);
    const brandMultiplier = calcBrandMultiplier(
        top11,
        allResolved.map(s => ({ top11: s.top11 })),
    );

    const rawTotal = baseScore + balanceBonus + efficiencyBonus + overseasBonus;
    const finalScore = rawTotal * brandMultiplier;

    return {
        baseScore: Math.round(baseScore * 100) / 100,
        captainBonus: Math.round(Math.pow(captain.rating, 1.2) * 100) / 100, 
        vcBonus: Math.round((0.5 * Math.pow(vc.rating, 1.15)) * 100) / 100, 
        balanceBonus: Math.round(balanceBonus * 100) / 100,
        efficiencyBonus: Math.round(efficiencyBonus * 100) / 100,
        brandBonus: Math.round((brandMultiplier - 1) * 1000) / 1000, 
        finalScore: Math.round(finalScore * 100) / 100,
    };
}

// ═══════════════════════════════════════════════════════════════
// §5  MOCK STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

const submissions: Map<number, FinalTeamSubmission> = new Map();

export function getSubmission(teamId: number): FinalTeamSubmission | null {
    return submissions.get(teamId) ?? null;
}

export function getAllSubmissions(): FinalTeamSubmission[] {
    return Array.from(submissions.values());
}

export function submitFinalTeam(
    teamId: number,
    playing11: number[],
    captainRank: number,
    viceCaptainRank: number,
): FinalTeamSubmission {
    const sub: FinalTeamSubmission = {
        teamId,
        playing11,
        captainRank,
        viceCaptainRank,
        submitted: true,
        submittedAt: Date.now(),
    };
    submissions.set(teamId, sub);
    return sub;
}

export function getLeaderboard(): LeaderboardEntry[] {
    const subs = getAllSubmissions();
    if (subs.length === 0) return [];

    // Resolve all for relative scoring
    const allWithTeams = subs.map(s => ({
        submission: s,
        team: mockTeams.find(t => t.id === s.teamId)!,
    })).filter(s => !!s.team);

    const entries: LeaderboardEntry[] = allWithTeams.map(({ submission, team }) => {
        const players = submission.playing11
            .map(r => getMockPlayerByRank(r))
            .filter((p): p is Player => !!p);

        const captain = getMockPlayerByRank(submission.captainRank)!;
        const vc = getMockPlayerByRank(submission.viceCaptainRank)!;

        const score = calculateScore(submission, team, allWithTeams);

        return { team, submission, players, captain, viceCaptain: vc, score, rank: 0 };
    });

    // Sort by final score descending
    entries.sort((a, b) => b.score.finalScore - a.score.finalScore);

    // Assign ranks (handle ties)
    entries.forEach((entry, i) => {
        if (i > 0 && entry.score.finalScore === entries[i - 1].score.finalScore) {
            entry.rank = entries[i - 1].rank;
        } else {
            entry.rank = i + 1;
        }
    });

    return entries;
}
