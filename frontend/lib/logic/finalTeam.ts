import { Player } from '../api/players';
import { Team } from '../api/teams';

// ═══════════════════════════════════════════════════════════════
// §1  COMPOSITION RULES
// ═══════════════════════════════════════════════════════════════

/** Full 15-player squad constraints (Rulebook §5) */
export const SQUAD_COMPOSITION = {
    total: 15,
    BAT: { min: 3, max: 5 },
    BOWL: { min: 5, max: 8 },
    AR: { min: 3, max: 5 },
    WK: { min: 2, max: 4 },
    overseas: { min: 3, max: 5 },
    purse: 120,
} as const;

/** Top 11 playing-XI constraints (user-specified) */
export const TOP11_COMPOSITION = {
    total: 11,
    BAT: { required: 4 },
    BOWL: { required: 4 },
    WK: { required: 1 },
    AR: { required: 2 },
} as const;

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
        BAT: 0, BOWL: 0, AR: 0, WK: 0,
    };
    
    selected.forEach(p => {
        const cat = p.category as keyof typeof counts;
        if (counts[cat] !== undefined) counts[cat]++;
    });

    const rules = TOP11_COMPOSITION;
    // Removed rigid role restrictions (BAT, BOWL, WK, AR) to allow any combination of 11 valid squad players.

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
