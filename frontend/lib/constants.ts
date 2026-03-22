/**
 * Auction Rules & Constants (§4, §5, §8)
 */

export const MAX_BID = 25;
export const OVERSEAS_MAX = 5;
export const SQUAD_LIMIT = 13;

export const COMPOSITION_MAX: Record<string, number> = {
    BAT: 5,
    BOWL: 8,
    AR: 5,
    WK: 4,
};

export const INCREMENT_THRESHOLD = 5.0;
export const LOW_INCREMENT = 0.20;
export const HIGH_INCREMENT = 0.25;

/** Returns the correct increment per rulebook §4 */
export function getIncrement(currentBid: number): number {
    return currentBid < INCREMENT_THRESHOLD ? LOW_INCREMENT : HIGH_INCREMENT;
}

/** Round to 2 decimal places to avoid floating point drift */
export function roundToCr(n: number): number {
    return Math.round(n * 100) / 100;
}
