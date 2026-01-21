import { Team, BID_INCREMENTS, CLOSED_BIDDING_THRESHOLD, BUDGET_PER_TEAM, SQUAD_LIMITS } from '@/lib/db/schema';

// Validation error class
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Validate bid amount
export function validateBid(
    team: Team,
    amount: number,
    currentBid: number,
    increment: number
): { valid: boolean; error?: string } {
    // Check if increment is valid
    if (!BID_INCREMENTS.includes(increment)) {
        return {
            valid: false,
            error: `Invalid increment. Must be one of: ${BID_INCREMENTS.join(', ')} CR`,
        };
    }

    // Check if new bid is at least current bid + increment
    if (amount < currentBid + increment) {
        return {
            valid: false,
            error: `Bid must be at least ₹${currentBid + increment} CR (current bid + increment)`,
        };
    }

    // Check if team has sufficient budget
    if (amount > team.budget_remaining) {
        return {
            valid: false,
            error: `Insufficient budget. Team has ₹${team.budget_remaining} CR remaining`,
        };
    }

    return { valid: true };
}

// Validate squad purchase
export function validateSquadPurchase(
    team: Team,
    playerCount: number
): { valid: boolean; error?: string } {
    const newSquadCount = team.squad_count + playerCount;

    if (newSquadCount > SQUAD_LIMITS.max) {
        return {
            valid: false,
            error: `Cannot exceed maximum squad size of ${SQUAD_LIMITS.max} players`,
        };
    }

    return { valid: true };
}

// Validate Final XI selection
export function validateFinalXI(
    squadPlayerIds: number[],
    selectedPlayerIds: number[]
): { valid: boolean; error?: string } {
    // Check if exactly 11 players selected
    if (selectedPlayerIds.length !== SQUAD_LIMITS.finalXI) {
        return {
            valid: false,
            error: `Final XI must have exactly ${SQUAD_LIMITS.finalXI} players`,
        };
    }

    // Check if all selected players are in squad
    const invalidPlayers = selectedPlayerIds.filter(id => !squadPlayerIds.includes(id));
    if (invalidPlayers.length > 0) {
        return {
            valid: false,
            error: 'Selected players must be from the team squad',
        };
    }

    return { valid: true };
}

// Validate Captain/Vice-Captain selection
export function validateCaptainSelection(
    finalXIPlayerIds: number[],
    captainId: number,
    viceCaptainId: number
): { valid: boolean; error?: string } {
    // Check if captain is in Final XI
    if (!finalXIPlayerIds.includes(captainId)) {
        return {
            valid: false,
            error: 'Captain must be in Final XI',
        };
    }

    // Check if vice-captain is in Final XI
    if (!finalXIPlayerIds.includes(viceCaptainId)) {
        return {
            valid: false,
            error: 'Vice-Captain must be in Final XI',
        };
    }

    // Check if captain and vice-captain are different
    if (captainId === viceCaptainId) {
        return {
            valid: false,
            error: 'Captain and Vice-Captain must be different players',
        };
    }

    return { valid: true };
}

// Validate Power Card usage
export function validatePowerCardUsage(
    cardType: string,
    teamBudgetRemaining: number,
    cardPrice: number,
    cardAvailable: boolean,
    cardUsed: boolean
): { valid: boolean; error?: string } {
    // Check if card is available
    if (!cardAvailable) {
        return {
            valid: false,
            error: 'Power card not available for this team',
        };
    }

    // Check if card already used
    if (cardUsed) {
        return {
            valid: false,
            error: 'Power card already used',
        };
    }

    // Check if team has budget to use card
    if (teamBudgetRemaining < cardPrice) {
        return {
            valid: false,
            error: `Insufficient budget. Card costs ₹${cardPrice} CR`,
        };
    }

    return { valid: true };
}

// Validate RTM usage
export function validateRTM(
    teamFranchise: string,
    playerOriginalTeam: string,
    rtmAvailable: boolean,
    rtmUsed: boolean
): { valid: boolean; error?: string } {
    // Check if RTM available
    if (!rtmAvailable) {
        return {
            valid: false,
            error: 'RTM card not available',
        };
    }

    // Check if RTM already used
    if (rtmUsed) {
        return {
            valid: false,
            error: 'RTM card already used',
        };
    }

    // Check if player's original team matches team franchise
    if (teamFranchise !== playerOriginalTeam) {
        return {
            valid: false,
            error: `RTM can only be used on players from ${teamFranchise}`,
        };
    }

    return { valid: true };
}

// Check if closed bidding should be triggered
export function shouldTriggerClosedBidding(currentBid: number): boolean {
    return currentBid >= CLOSED_BIDDING_THRESHOLD;
}

// Validate budget after purchase
export function validateBudgetAfterPurchase(
    currentBudgetRemaining: number,
    purchasePrice: number,
    minimumPlayersNeeded: number
): { valid: boolean; error?: string } {
    const newBudgetRemaining = currentBudgetRemaining - purchasePrice;

    // Check if team will have enough budget for minimum required players
    // Assuming minimum base price of 0.5 CR
    const minBudgetNeeded = minimumPlayersNeeded * 0.5;

    if (newBudgetRemaining < minBudgetNeeded) {
        return {
            valid: false,
            error: `Purchase would leave insufficient budget for remaining ${minimumPlayersNeeded} players`,
        };
    }

    return { valid: true };
}

// Validate bid increment based on current bid
export function getRecommendedIncrement(currentBid: number): number {
    if (currentBid < 5) return 0.5;
    if (currentBid < 10) return 1;
    if (currentBid < 15) return 2;
    return 3;
}
