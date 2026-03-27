import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════
// RULEBOOK CONSTANTS
// ═══════════════════════════════════════════════════════════════

const MAX_SQUAD_SIZE = 15;
const MAX_OVERSEAS = 5;
const MIN_OVERSEAS = 3;
const POWER_CARD_COST = 1; // 1 CR per card

// Rulebook §5 — Role composition limits
const ROLE_LIMITS = {
    BAT: { min: 3, max: 5 },
    BOWL: { min: 5, max: 8 },
    AR: { min: 3, max: 6 },
    WK: { min: 1, max: 2 },
};

/**
 * Maps raw role from dataset to internal Category enum
 * @param {string} role - e.g. "WK-Batsman", "Bowling Allrounder"
 */
function mapRoleToCategory(role) {
    if (!role) return 'BAT';
    const r = role.toLowerCase();
    if (r.includes('wk') || r.includes('wicket')) return 'WK';
    if (r.includes('allrounder')) return 'AR';
    if (r.includes('bowler')) return 'BOWL';
    return 'BAT';
}

// Rulebook §4 — Bid increments (in CR)
const BID_INCREMENT_RULES = [
    { maxBid: 5, increment: 0.20 },
    { maxBid: Infinity, increment: 0.25 },
];

const MAX_BID = 25; // Triggers closed bidding

// ═══════════════════════════════════════════════════════════════
// VALID STATE MACHINE TRANSITIONS
// ═══════════════════════════════════════════════════════════════

const ALL_PHASES = ['NOT_STARTED', 'FRANCHISE_PHASE', 'POWER_CARD_PHASE', 'LIVE', 'POST_AUCTION', 'COMPLETED'];
const VALID_TRANSITIONS = {
    'NOT_STARTED': ALL_PHASES,
    'FRANCHISE_PHASE': ALL_PHASES,
    'POWER_CARD_PHASE': ALL_PHASES,
    'LIVE': ALL_PHASES,
    'POST_AUCTION': ALL_PHASES,
    'COMPLETED': ALL_PHASES,
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Get role composition for a team
// ═══════════════════════════════════════════════════════════════

async function getTeamRoleCounts(tx, teamId) {
    const teamPlayers = await tx.teamPlayer.findMany({
        where: { team_id: teamId },
        include: { player: { select: { category: true } } },
    });

    const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
    for (const tp of teamPlayers) {
        counts[tp.player.category] = (counts[tp.player.category] || 0) + 1;
    }
    return counts;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Check if adding a player of given category would make
//         it impossible to fill remaining mandatory slots
// ═══════════════════════════════════════════════════════════════

function wouldViolateRoleLimits(currentCounts, playerCategory, currentSquadCount) {
    const simulated = { ...currentCounts };
    simulated[playerCategory] = (simulated[playerCategory] || 0) + 1;

    // Check hard max
    if (simulated[playerCategory] > ROLE_LIMITS[playerCategory].max) {
        return `Team already has maximum ${ROLE_LIMITS[playerCategory].max} ${playerCategory} players`;
    }

    return null;

    return null;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Validate bid increment
// ═══════════════════════════════════════════════════════════════

function getRequiredIncrement(currentBid) {
    for (const rule of BID_INCREMENT_RULES) {
        if (currentBid <= rule.maxBid) return rule.increment;
    }
    return BID_INCREMENT_RULES[BID_INCREMENT_RULES.length - 1].increment;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Compute minimum purse needed to fill remaining squad
// ═══════════════════════════════════════════════════════════════

function minimumPurseForRemainingSlots(currentSquadCount, priceOfCurrentPurchase) {
    const slotsNeededAfter = MAX_SQUAD_SIZE - currentSquadCount - 1;
    if (slotsNeededAfter <= 0) return 0;
    // Minimum base price is 0.2 CR (Grade D)
    return slotsNeededAfter * 0.2;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Log an audit event
// ═══════════════════════════════════════════════════════════════

async function logAudit(tx, action, details) {
    await tx.auditLog.create({
        data: { action, details },
    });
}

// ═══════════════════════════════════════════════════════════════
// CORE: SELL_PLAYER — Atomic DB Transaction
// ═══════════════════════════════════════════════════════════════

async function sellPlayer(playerId, teamId, pricePaid, isAdminOverride = false) {
    return await prisma.$transaction(async (tx) => {
        // 1. Validate auction phase
        const auctionState = await tx.auctionState.findUnique({ where: { id: 1 } });
        if (auctionState.phase !== 'LIVE') {
            throw new Error('Auction is not LIVE');
        }

        // 2. Validate player not already SOLD
        const auctionPlayer = await tx.auctionPlayer.findUnique({
            where: { player_id: playerId },
        });
        if (!auctionPlayer || auctionPlayer.status !== 'UNSOLD') {
            throw new Error('Player is either already sold or not in this auction');
        }

        // 3. Load team & player
        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');

        const player = await tx.player.findUnique({ where: { id: playerId } });
        if (!player) throw new Error('Player not found');

        const playerCategory = mapRoleToCategory(player.role);

        // 4. Validate team purse >= bid
        const purseRemaining = Number(team.purse_remaining);
        if (purseRemaining < pricePaid) {
            throw new Error(`Insufficient purse: ₹${purseRemaining} CR remaining, bid is ₹${pricePaid} CR`);
        }

        // 5. Validate squad size
        if (team.squad_count >= MAX_SQUAD_SIZE) {
            throw new Error(`Team already has maximum ${MAX_SQUAD_SIZE} players`);
        }

        // 7. Overseas limit
        if (player.nationality === 'OVERSEAS' && team.overseas_count >= MAX_OVERSEAS) {
            throw new Error(`Team already has maximum ${MAX_OVERSEAS} overseas players`);
        }

        // 8. Role composition check
        const roleCounts = await getTeamRoleCounts(tx, teamId);
        const roleError = wouldViolateRoleLimits(roleCounts, playerCategory, team.squad_count);
        if (roleError) {
            throw new Error(roleError);
        }

        // 9. Validate pricePaid >= base_price
        const basePrice = Number(player.base_price);
        if (pricePaid < basePrice) {
            throw new Error(`Bid ₹${pricePaid} CR is below base price ₹${basePrice} CR`);
        }

        // ── All validations passed. Execute sale. ────────────────

        // 11. Deduct purse + update counters
        const categoryKeyMap = {
            'BAT': 'batsmen_count',
            'BOWL': 'bowlers_count',
            'AR': 'ar_count',
            'WK': 'wk_count'
        };
        const categoryKey = categoryKeyMap[playerCategory];

        await tx.team.update({
            where: { id: teamId },
            data: {
                purse_remaining: { decrement: pricePaid },
                squad_count: { increment: 1 },
                overseas_count: player.nationality === 'OVERSEAS' ? { increment: 1 } : undefined,
                [categoryKey]: { increment: 1 }
            }
        });

        // 12. Insert into team_players
        await tx.teamPlayer.create({
            data: {
                team_id: teamId,
                player_id: playerId,
                price_paid: pricePaid,
            }
        });

        // 13. Update auction_players → SOLD
        await tx.auctionPlayer.update({
            where: { player_id: playerId },
            data: {
                status: 'SOLD',
                sold_price: pricePaid,
                sold_to_team_id: teamId,
            }
        });

        // 14. Reset auction state for next player + track last sold
        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_player_id: null,
                current_bid: null,
                highest_bidder_id: null,
                bid_history: [],
                active_power_card: null,
                active_power_card_team: null,
                bid_frozen_team_id: null,
                gods_eye_revealed: false,
                // Track last sold for frontend display
                last_sold_player_id: playerId,
                last_sold_price: pricePaid,
                last_sold_team_id: teamId,
                last_sold_team_name: team.name,
            }
        });

        // 15. Audit log
        await logAudit(tx, 'SELL_PLAYER', { playerId, teamId, pricePaid, playerName: player.name });

        return { success: true, message: 'Player sold successfully', playerId, teamId, pricePaid };
    });
}

// ═══════════════════════════════════════════════════════════════
// MARK UNSOLD — Transaction-wrapped
// ═══════════════════════════════════════════════════════════════

async function markUnsold(playerId) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });
        if (state.phase !== 'LIVE') {
            throw new Error(`Cannot mark unsold in phase: ${state.phase}`);
        }

        const auctionPlayer = await tx.auctionPlayer.findUnique({ where: { player_id: playerId } });
        if (!auctionPlayer || auctionPlayer.status !== 'UNSOLD') {
            throw new Error('Player is not in UNSOLD state');
        }

        // Reset auction state for next player
        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_player_id: null,
                current_bid: null,
                highest_bidder_id: null,
                bid_history: [],
                active_power_card: null,
                active_power_card_team: null,
                bid_frozen_team_id: null,
                gods_eye_revealed: false,
            }
        });

        // Push player back to the end of the current sequence
        if (state.current_sequence_id) {
            const sequence = await tx.auctionSequence.findUnique({
                where: { id: state.current_sequence_id }
            });
            if (sequence) {
                let currentItems = Array.isArray(sequence.sequence_items) ? sequence.sequence_items : [];
                const player = await tx.player.findUnique({ where: { id: playerId } });
                if (player) {
                    currentItems.push(player.rank);
                    await tx.auctionSequence.update({
                        where: { id: sequence.id },
                        data: { sequence_items: currentItems }
                    });
                }
            }
        }

        await logAudit(tx, 'MARK_UNSOLD', { playerId });

        return { success: true, playerId };
    });
}

// ═══════════════════════════════════════════════════════════════
// ASSIGN PLAYER — Transaction-wrapped
// ═══════════════════════════════════════════════════════════════

async function assignPlayer(playerIdOrRank) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });
        if (state.phase !== 'LIVE') {
            throw new Error(`Cannot assign player in phase: ${state.phase}`);
        }

        let player;
        if (typeof playerIdOrRank === 'number') {
            player = await tx.player.findUnique({ where: { rank: playerIdOrRank } });
        } else {
            player = await tx.player.findUnique({ where: { id: playerIdOrRank } });
        }
        if (!player) throw new Error('Player not found');

        // Verify player is still unsold
        const ap = await tx.auctionPlayer.findUnique({ where: { player_id: player.id } });
        if (!ap || ap.status !== 'UNSOLD') {
            throw new Error('Player is not available for auction');
        }

        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_player_id: player.id,
                current_bid: Number(player.base_price),
                highest_bidder_id: null,
                bid_history: [],
                bid_frozen_team_id: null,
                active_power_card: null,
                active_power_card_team: null,
                gods_eye_revealed: false,
            }
        });

        await logAudit(tx, 'ASSIGN_PLAYER', { playerId: player.id, playerName: player.name, rank: player.rank });

        return { success: true, player };
    });
}

// ═══════════════════════════════════════════════════════════════
// POWER CARD: Use (with actual game logic)
// ═══════════════════════════════════════════════════════════════

async function usePowerCard(teamId, type, targetTeamId = null) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });
        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');

        // Find the power card
        const powerCard = await tx.powerCard.findFirst({
            where: { team_id: teamId, type, is_used: false }
        });
        if (!powerCard) throw new Error('Power card not available or already used');

        // Validate purse for card cost
        const purse = Number(team.purse_remaining);
        if (purse < POWER_CARD_COST) {
            throw new Error(`Insufficient purse for power card: need ₹${POWER_CARD_COST} CR, have ₹${purse} CR`);
        }

        // Type-specific validations
        switch (type) {
            case 'GOD_EYE':
                throw new Error("God's Eye is disabled as closed bidding has been removed");
                break;

            case 'MULLIGAN':
                if (state.phase !== 'LIVE') {
                    throw new Error('Mulligan can only be used during LIVE bidding');
                }
                if (!state.current_player_id) {
                    throw new Error('No player currently being auctioned');
                }
                break;

            case 'FINAL_STRIKE':
                if (state.phase !== 'LIVE') {
                    throw new Error('Final Strike can only be used during LIVE bidding');
                }
                break;

            case 'BID_FREEZER':
                if (state.phase !== 'LIVE') {
                    throw new Error('Bid Freezer can only be used during LIVE bidding');
                }
                if (!targetTeamId) {
                    throw new Error('Bid Freezer requires a target team');
                }
                if (targetTeamId === teamId) {
                    throw new Error('Cannot freeze your own team');
                }
                break;

            case 'RIGHT_TO_MATCH':
                // RTM is handled physically during the auction.
                // Admin marks it used via toggle-powercard endpoint.
                throw new Error('RTM is handled physically. Use the toggle-powercard endpoint to mark it as used.');

            default:
                throw new Error(`Unknown power card type: ${type}`);
        }

        // Mark card as used
        await tx.powerCard.update({
            where: { id: powerCard.id },
            data: { is_used: true }
        });

        // Deduct cost
        await tx.team.update({
            where: { id: teamId },
            data: { purse_remaining: { decrement: POWER_CARD_COST } },
        });

        // Apply card-specific effects
        let effect = {};

        if (type === 'BID_FREEZER') {
            await tx.auctionState.update({
                where: { id: 1 },
                data: { bid_frozen_team_id: targetTeamId },
            });
            effect.frozenTeamId = targetTeamId;
        }



        if (type === 'MULLIGAN') {
            // Reset current player's auction — send back to sequence
            await tx.auctionState.update({
                where: { id: 1 },
                data: {
                    current_player_id: null,
                    current_bid: null,
                    highest_bidder_id: null,
                },
            });

            // Push player back to sequence
            if (state.current_sequence_id && state.current_player_id) {
                const sequence = await tx.auctionSequence.findUnique({
                    where: { id: state.current_sequence_id }
                });
                if (sequence) {
                    let currentItems = Array.isArray(sequence.sequence_items) ? sequence.sequence_items : [];
                    const player = await tx.player.findUnique({ where: { id: state.current_player_id } });
                    if (player) {
                        currentItems.push(player.rank);
                        await tx.auctionSequence.update({
                            where: { id: sequence.id },
                            data: { sequence_items: currentItems }
                        });
                    }
                }
            }

            effect.playerReset = true;
        }

        await logAudit(tx, 'USE_POWER_CARD', { teamId, type, targetTeamId, effect });

        return { success: true, type, teamId, effect };
    });
}



// ═══════════════════════════════════════════════════════════════
// STATE MACHINE: Auction Phase Transitions
// ═══════════════════════════════════════════════════════════════

async function updateAuctionPhase(newPhase) {
    return await prisma.$transaction(async (tx) => {
        const currentState = await tx.auctionState.findUnique({ where: { id: 1 } });

        const allowed = VALID_TRANSITIONS[currentState.phase];
        if (!allowed || !allowed.includes(newPhase)) {
            throw new Error(`Invalid transition: ${currentState.phase} → ${newPhase}`);
        }

        const updated = await tx.auctionState.update({
            where: { id: 1 },
            data: { phase: newPhase }
        });

        // AUTO-SELECT SEQUENCE based on phase
        const phaseToSequence = {
            'FRANCHISE_PHASE': 1,
            'POWER_CARD_PHASE': 2,
            'LIVE': 3
        };
        const sequenceId = phaseToSequence[newPhase];
        if (sequenceId) {
            const sequence = await tx.auctionSequence.findUnique({ where: { id: sequenceId } });
            if (sequence) {
                await tx.auctionState.update({
                    where: { id: 1 },
                    data: {
                        current_sequence_id: sequenceId,
                        current_sequence_index: 0,
                        current_item_id: null,
                        current_player_id: null
                    }
                });
            }
        }

        await logAudit(tx, 'PHASE_TRANSITION', {
            from: currentState.phase,
            to: newPhase,
        });

        return updated;
    });
}

// ═══════════════════════════════════════════════════════════════
// SEQUENCE: Advance to next player in active sequence
// ═══════════════════════════════════════════════════════════════

async function advanceToNextInSequence() {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });

        if (!state.current_sequence_id) {
            throw new Error('No auction sequence selected. Admin must select a sequence first.');
        }

        const sequence = await tx.auctionSequence.findUnique({
            where: { id: state.current_sequence_id }
        });
        if (!sequence) throw new Error('Selected sequence not found');

        let nextIndex = state.current_sequence_index;
        const items = sequence.sequence_items;

        if (sequence.type === 'PLAYER') {
            if (state.phase !== 'LIVE') throw new Error('Player sequences can only be run in LIVE phase');
            
            let foundPlayer = null;
            while (nextIndex < items.length) {
                const rank = Number(items[nextIndex]);
                const player = await tx.player.findUnique({ where: { rank } });
                if (player) {
                    const ap = await tx.auctionPlayer.findUnique({ where: { player_id: player.id } });
                    if (ap && ap.status === 'UNSOLD') {
                        foundPlayer = player;
                        break;
                    }
                }
                nextIndex++;
            }

            if (!foundPlayer) {
                await tx.auctionState.update({
                    where: { id: 1 },
                    data: {
                        current_player_id: null,
                        current_item_id: null,
                        current_bid: null,
                        highest_bidder_id: null,
                        current_sequence_index: nextIndex,
                        phase: 'POST_AUCTION',
                    }
                });
                return { success: true, finished: true, message: 'All players in sequence have been auctioned' };
            }

            await tx.auctionState.update({
                where: { id: 1 },
                data: {
                    current_player_id: foundPlayer.id,
                    current_item_id: null,
                    current_bid: Number(foundPlayer.base_price),
                    highest_bidder_id: null,
                    current_sequence_index: nextIndex + 1,
                    bid_frozen_team_id: null,
                }
            });

            await logAudit(tx, 'ADVANCE_PLAYER', {
                playerId: foundPlayer.id,
                playerName: foundPlayer.name,
                sequencePosition: nextIndex + 1,
            });

            return {
                success: true,
                finished: false,
                item: foundPlayer,
                type: 'PLAYER',
                sequencePosition: nextIndex + 1,
                totalInSequence: items.length,
            };
        }

        // Generic handling for FRANCHISE and POWER_CARD
        if (nextIndex >= items.length) {
            const nextPhaseMap = { 'FRANCHISE_PHASE': 'POWER_CARD_PHASE', 'POWER_CARD_PHASE': 'LIVE' };
            const nextPhase = nextPhaseMap[state.phase] || state.phase;

            await tx.auctionState.update({
                where: { id: 1 },
                data: {
                    current_player_id: null,
                    current_item_id: null,
                    current_bid: null,
                    highest_bidder_id: null,
                    phase: nextPhase,
                    current_sequence_id: null, // Reset for next phase
                    current_sequence_index: 0,
                }
            });
            return { success: true, finished: true, message: 'Sequence finished' };
        }

        const currentItem = items[nextIndex];
        
        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_player_id: null,
                current_item_id: String(currentItem),
                current_bid: sequence.type === 'FRANCHISE' ? 3 : (sequence.type === 'POWER_CARD' ? 1 : 0),
                highest_bidder_id: null,
                current_sequence_index: nextIndex + 1,
            }
        });

        await logAudit(tx, 'ADVANCE_SEQUENCE_ITEM', {
            type: sequence.type,
            item: currentItem,
            sequencePosition: nextIndex + 1,
        });

        return {
            success: true,
            finished: false,
            item: currentItem,
            type: sequence.type,
            sequencePosition: nextIndex + 1,
            totalInSequence: items.length,
        };
    });
}

// ═══════════════════════════════════════════════════════════════
// SEQUENCE: Step backward to previous item in active sequence
// ═══════════════════════════════════════════════════════════════

async function stepBackInSequence() {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });

        if (!state.current_sequence_id) {
            throw new Error('No auction sequence selected.');
        }

        const sequence = await tx.auctionSequence.findUnique({
            where: { id: state.current_sequence_id }
        });
        if (!sequence) throw new Error('Selected sequence not found');

        let targetIndex = state.current_sequence_index - 2;
        if (targetIndex < 0) {
            throw new Error('Already at the beginning of the sequence.');
        }

        const items = sequence.sequence_items;

        if (sequence.type === 'PLAYER') {
            if (state.phase !== 'LIVE') throw new Error('Player sequences can only be run in LIVE phase');
            
            let foundPlayer = null;
            while (targetIndex >= 0) {
                const rank = Number(items[targetIndex]);
                const player = await tx.player.findUnique({ where: { rank } });
                if (player) {
                    const ap = await tx.auctionPlayer.findUnique({ where: { player_id: player.id } });
                    if (ap && ap.status === 'UNSOLD') {
                        foundPlayer = player;
                        break;
                    }
                }
                targetIndex--;
            }

            if (!foundPlayer) {
                throw new Error('No previous unsold players found. Earlier players may have already been sold.');
            }

            await tx.auctionState.update({
                where: { id: 1 },
                data: {
                    current_player_id: foundPlayer.id,
                    current_item_id: null,
                    current_bid: Number(foundPlayer.base_price),
                    highest_bidder_id: null,
                    current_sequence_index: targetIndex + 1,
                    bid_frozen_team_id: null,
                }
            });

            await logAudit(tx, 'STEP_BACK_PLAYER', {
                playerId: foundPlayer.id,
                playerName: foundPlayer.name,
                sequencePosition: targetIndex + 1,
            });

            return {
                success: true,
                finished: false,
                item: foundPlayer,
                type: 'PLAYER',
                sequencePosition: targetIndex + 1,
                totalInSequence: items.length,
            };
        }

        const currentItem = items[targetIndex];
        
        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_player_id: null,
                current_item_id: String(currentItem),
                current_bid: sequence.type === 'FRANCHISE' ? 3 : (sequence.type === 'POWER_CARD' ? 1 : 0),
                highest_bidder_id: null,
                current_sequence_index: targetIndex + 1,
            }
        });

        await logAudit(tx, 'STEP_BACK_SEQUENCE_ITEM', {
            type: sequence.type,
            item: currentItem,
            sequencePosition: targetIndex + 1,
        });

        return {
            success: true,
            finished: false,
            item: currentItem,
            type: sequence.type,
            sequencePosition: targetIndex + 1,
            totalInSequence: items.length,
        };
    });
}

// ═══════════════════════════════════════════════════════════════
// SEQUENCE: Select which sequence to use (1–5)
// ═══════════════════════════════════════════════════════════════

async function selectSequence(sequenceId) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });
        // Relaxed for admin flexibility: Allow changing sequence in any phase
        // if (state.phase !== 'NOT_STARTED' && state.phase !== 'FRANCHISE_PHASE' && state.phase !== 'POWER_CARD_PHASE') {
        //     throw new Error(`Cannot change sequence in phase: ${state.phase}`);
        // }

        const sequence = await tx.auctionSequence.findUnique({ where: { id: sequenceId } });
        if (!sequence) throw new Error(`Sequence ${sequenceId} not found`);

        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_sequence_id: sequenceId,
                current_sequence_index: 0,
            }
        });

        await logAudit(tx, 'SELECT_SEQUENCE', { sequenceId, sequenceName: sequence.name });

        return { success: true, sequence: sequence.name, totalItems: sequence.sequence_items.length };
    });
}

// ═══════════════════════════════════════════════════════════════
// BID: Place a bid with increment validation
// ═══════════════════════════════════════════════════════════════

async function placeBid(teamId, bidAmount) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });

        // Relaxed for all bidding phases
        const BIDDING_PHASES = ['FRANCHISE_PHASE', 'POWER_CARD_PHASE', 'LIVE'];
        if (!BIDDING_PHASES.includes(state.phase)) {
            throw new Error(`Can only bid during bidding phases (current: ${state.phase})`);
        }

        // Check if team is frozen by Bid Freezer
        if (state.bid_frozen_team_id === teamId) {
            throw new Error('Team is frozen by Bid Freezer and cannot bid on this player');
        }

        const currentBid = Number(state.current_bid) || 0;
        const requiredIncrement = getRequiredIncrement(currentBid);

        // Validate minimum increment
        if (bidAmount < currentBid + requiredIncrement) {
            throw new Error(`Bid must be at least ₹${(currentBid + requiredIncrement).toFixed(2)} CR (current ₹${currentBid} + increment ₹${requiredIncrement})`);
        }
        // Validate team purse
        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');
        if (Number(team.purse_remaining) < bidAmount) {
            throw new Error(`Insufficient purse: ₹${team.purse_remaining} CR remaining`);
        }

        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_bid: bidAmount,
                highest_bidder_id: teamId,
            }
        });

        await logAudit(tx, 'PLACE_BID', {
            teamId, bidAmount, previousBid: currentBid
        });

        return {
            success: true,
            currentBid: bidAmount,
            teamId,
        };
    });
}



// ═══════════════════════════════════════════════════════════════
// FRANCHISE: Assign franchise to team (during FRANCHISE_PHASE)
// ═══════════════════════════════════════════════════════════════

async function assignFranchise(teamId, franchiseId, price) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });
        if (state.phase !== 'FRANCHISE_PHASE') {
            throw new Error(`Franchises can only be assigned during FRANCHISE_PHASE (current: ${state.phase})`);
        }

        const franchise = await tx.franchise.findUnique({ where: { id: franchiseId } });
        if (!franchise) throw new Error('Franchise not found');

        // Check franchise not already taken
        const existing = await tx.team.findFirst({ where: { brand_key: franchise.short_name } });
        if (existing) {
            throw new Error(`Franchise ${franchise.short_name} already taken by ${existing.name}`);
        }

        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');
        if (team.brand_key) {
            throw new Error(`Team ${team.name} already has franchise ${team.brand_key}`);
        }

        // Validate purse
        const finalPrice = Number(price) || 3.0;
        if (Number(team.purse_remaining) < finalPrice) {
            throw new Error(`Insufficient purse: ₹${team.purse_remaining} CR remaining`);
        }

        const updatedTeam = await tx.team.update({
            where: { id: teamId },
            data: {
                brand_key: franchise.short_name,
                franchise_name: franchise.name,
                brand_score: franchise.brand_score,
                logo: franchise.logo,
                primary_color: franchise.primary_color,
                purse_remaining: { decrement: finalPrice }
            },
        });

        // AUTO-RTM: Assign one RTM card of this franchise to the team
        await tx.powerCard.create({
            data: {
                team_id: teamId,
                type: 'RIGHT_TO_MATCH',
                is_used: false
            }
        });

        await logAudit(tx, 'ASSIGN_FRANCHISE', {
            teamId, franchiseId, price: finalPrice, brandKey: franchise.short_name
        });

        return { success: true, team: updatedTeam.name, franchise: franchise.name, price: finalPrice };
    });
}

// ═══════════════════════════════════════════════════════════════
// POWER CARD: Assign power card to team (during POWER_CARD_PHASE)
// ═══════════════════════════════════════════════════════════════

async function assignPowerCard(teamId, cardType, price) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });
        if (state.phase !== 'POWER_CARD_PHASE') {
            throw new Error(`Power Cards can only be assigned during POWER_CARD_PHASE (current: ${state.phase})`);
        }

        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');

        // Validate purse
        const finalPrice = Number(price) || 1.0;
        if (Number(team.purse_remaining) < finalPrice) {
            throw new Error(`Insufficient purse: ₹${team.purse_remaining} CR remaining`);
        }

        // Create power card
        const card = await tx.powerCard.create({
            data: {
                team_id: teamId,
                type: cardType,
                is_used: false
            }
        });

        // Charge team
        const updatedTeam = await tx.team.update({
            where: { id: teamId },
            data: { purse_remaining: { decrement: finalPrice } }
        });

        await logAudit(tx, 'ASSIGN_POWERCARD', {
            teamId, cardType, price: finalPrice
        });

        return { success: true, team: updatedTeam.name, cardType, price: finalPrice };
    });
}


// ═══════════════════════════════════════════════════════════════
// AUTH: Login
// ═══════════════════════════════════════════════════════════════


async function loginTeam(username, password, reqBody = {}) {
    const team = await prisma.team.findUnique({ where: { username } });
    if (!team) throw new Error('Invalid username');

    const valid = await bcrypt.compare(password, team.password_hash);
    if (!valid) throw new Error('Invalid password');

    // Block second login if session is active (unless 'force' is provided)
    if (team.active_session_id && !reqBody?.force) {
        throw new Error('This team is already logged in on another device.');
    }

    // Generate session token
    const sessionId = crypto.randomUUID();

    await prisma.team.update({
        where: { id: team.id },
        data: { active_session_id: sessionId },
    });

    return {
        success: true,
        teamId: team.id,
        teamName: team.name,
        sessionId,
        brandKey: team.brand_key,
        franchiseName: team.franchise_name,
    };
}

// Admin login
async function loginAdmin(username, password) {
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) throw new Error('Invalid admin username');

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) throw new Error('Invalid password');

    const sessionId = crypto.randomUUID();
    await prisma.adminUser.update({
        where: { id: admin.id },
        data: { active_session_id: sessionId },
    });

    return {
        success: true,
        sessionId,
        username: admin.username,
        role: admin.role,
    };
}
// ═══════════════════════════════════════════════════════════════
// DISPLAY CONTROLS — Admin uses these to update frontend display
// ═══════════════════════════════════════════════════════════════

/**
 * Add a bid entry to the bid history display log.
 * Since bidding is physical, admin logs bids manually.
 */
async function addBidToHistory(teamId, teamName, amount) {
    const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
    const currentHistory = Array.isArray(state.bid_history) ? state.bid_history : [];

    const newEntry = {
        teamId,
        teamName,
        amount,
        timestamp: Date.now(),
    };

    await prisma.auctionState.update({
        where: { id: 1 },
        data: {
            bid_history: [...currentHistory, newEntry],
            current_bid: amount,
            highest_bidder_id: teamId,
        },
    });

    return newEntry;
}


/**
 * Set auction day
 */
async function setAuctionDay(day) {
    return await prisma.auctionState.update({
        where: { id: 1 },
        data: { auction_day: day },
    });
}

/**
 * Generic display state update (power cards, god's eye, etc.)
 */
async function updateDisplayState(updates) {
    const allowedFields = [
        'active_power_card',
        'active_power_card_team',
        'gods_eye_revealed',
        'auction_day',
    ];

    const data = {};
    for (const [key, val] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            data[key] = val;
        }
    }

    return await prisma.auctionState.update({
        where: { id: 1 },
        data,
    });
}

// ═══════════════════════════════════════════════════════════════
// DEASSIGN PLAYER — Admin Only
// ═══════════════════════════════════════════════════════════════
async function deassignPlayer(playerIdOrRank) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });
        
        let player;
        if (typeof playerIdOrRank === 'number' || !isNaN(Number(playerIdOrRank))) {
            player = await tx.player.findUnique({ where: { rank: Number(playerIdOrRank) } });
        } else {
            player = await tx.player.findUnique({ where: { id: playerIdOrRank } });
        }

        if (!player) throw new Error('Player not found');
        const playerId = player.id;

        const auctionPlayer = await tx.auctionPlayer.findUnique({ where: { player_id: playerId } });
        if (!auctionPlayer || auctionPlayer.status !== 'SOLD') {
            throw new Error('Player is not sold yet or not found');
        }

        const teamId = auctionPlayer.sold_to_team_id;
        const pricePaid = Number(auctionPlayer.sold_price);
        
        const team = await tx.team.findUnique({ where: { id: teamId } });
        player = await tx.player.findUnique({ where: { id: playerId } });
        
        // 1. Refund purse & update squad counts
        const playerCategory = mapRoleToCategory(player.role);
        const categoryKeyMap = {
            'BAT': 'batsmen_count',
            'BOWL': 'bowlers_count',
            'AR': 'ar_count',
            'WK': 'wk_count'
        };
        const categoryKey = categoryKeyMap[playerCategory];

        console.log(`[DEASSIGN] Refunding Team ${team.name} (ID: ${teamId}): ₹${pricePaid} CR for Player #${player.rank}`);

        await tx.team.update({
            where: { id: teamId },
            data: {
                purse_remaining: { increment: pricePaid },
                squad_count: { decrement: 1 },
                overseas_count: player.nationality === 'OVERSEAS' ? { decrement: 1 } : undefined,
                [categoryKey]: { decrement: 1 }
            }
        });

        // 2. Remove team_player link
        await tx.teamPlayer.deleteMany({
            where: { team_id: teamId, player_id: playerId }
        });

        // 3. Set auctionPlayer back to UNSOLD
        await tx.auctionPlayer.update({
            where: { player_id: playerId },
            data: {
                status: 'UNSOLD',
                sold_price: null,
                sold_to_team_id: null,
            }
        });

        // 4. Push player back to the end of the current sequence
        if (state.current_sequence_id) {
            const sequence = await tx.auctionSequence.findUnique({
                where: { id: state.current_sequence_id }
            });

            if (sequence) {
                let currentItems = Array.isArray(sequence.sequence_items) ? sequence.sequence_items : [];
                currentItems.push(player.rank);
                
                await tx.auctionSequence.update({
                    where: { id: sequence.id },
                    data: { sequence_items: currentItems }
                });
            }
        }

        await logAudit(tx, 'DEASSIGN_PLAYER', { playerId, teamId, refunded: pricePaid, playerName: player.name });

        return { success: true, message: 'Player deassigned', playerId, teamId };
    });
}

// ═══════════════════════════════════════════════════════════════
// ASSIGN & DEASSIGN POWERCARD — Admin Only
// ═══════════════════════════════════════════════════════════════

async function deassignPowerCard(teamId, type) {
    return await prisma.$transaction(async (tx) => {
        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');

        const card = await tx.powerCard.findFirst({
            where: { team_id: teamId, type, is_used: false }
        });
        if (!card) throw new Error('Unused powercard not found for team');

        await tx.powerCard.delete({
            where: { id: card.id }
        });

        await logAudit(tx, 'DEASSIGN_POWERCARD', { teamId, type, teamName: team.name });
        return { success: true, message: 'Powercard deassigned' };
    });
}

// ═══════════════════════════════════════════════════════════════
// MANUAL PURSE DEDUCTION (FINES) — Admin Only
// ═══════════════════════════════════════════════════════════════
async function deductPurse(teamId, amount, reason) {
    return await prisma.$transaction(async (tx) => {
        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');

        const updated = await tx.team.update({
            where: { id: teamId },
            data: { 
                purse_remaining: { decrement: Number(amount) } 
            }
        });

        await logAudit(tx, 'PURSE_DEDUCTION', { teamId, amount, reason, teamName: team.name });
        return { success: true, purse_remaining: Number(updated.purse_remaining) };
    });
}

// ═══════════════════════════════════════════════════════════════
// TOGGLE POWERCARD STATUS — Admin Only
// ═══════════════════════════════════════════════════════════════
async function togglePowerCardStatus(teamId, type, isUsed) {
    return await prisma.$transaction(async (tx) => {
        const card = await tx.powerCard.findUnique({
            where: { team_id_type: { team_id: teamId, type } }
        });
        if (!card) throw new Error('Powercard not assigned to this team');

        const updated = await tx.powerCard.update({
            where: { id: card.id },
            data: { is_used: isUsed }
        });

        await logAudit(tx, 'TOGGLE_POWERCARD', { teamId, type, isUsed });
        return { success: true, is_used: updated.is_used };
    });
}

// ═══════════════════════════════════════════════════════════════
// MARK ITEM UNSOLD — for Franchises & Power Cards
// Pushes the unsold item back to the end of the current sequence.
// ═══════════════════════════════════════════════════════════════

async function markItemUnsold(itemId, itemType) {
    return await prisma.$transaction(async (tx) => {
        const state = await tx.auctionState.findUnique({ where: { id: 1 } });

        if (itemType === 'FRANCHISE' && state.phase !== 'FRANCHISE_PHASE') {
            throw new Error(`Cannot mark franchise unsold in phase: ${state.phase}`);
        }
        if (itemType === 'POWERCARD' && state.phase !== 'POWER_CARD_PHASE') {
            throw new Error(`Cannot mark powercard unsold in phase: ${state.phase}`);
        }

        // Reset auction state for next item
        await tx.auctionState.update({
            where: { id: 1 },
            data: {
                current_item_id: null,
                current_bid: null,
                highest_bidder_id: null,
                bid_history: [],
            }
        });

        // Push item back to end of current sequence
        if (state.current_sequence_id) {
            const sequence = await tx.auctionSequence.findUnique({
                where: { id: state.current_sequence_id }
            });
            if (sequence) {
                let currentItems = Array.isArray(sequence.sequence_items) ? sequence.sequence_items : [];
                currentItems.push(itemId);
                await tx.auctionSequence.update({
                    where: { id: sequence.id },
                    data: { sequence_items: currentItems }
                });
            }
        }

        await logAudit(tx, 'MARK_ITEM_UNSOLD', { itemId, itemType });

        return { success: true, message: `${itemType} marked as unsold and re-queued` };
    });
}

// ═══════════════════════════════════════════════════════════════
// ADD PURSE — Increment team purse (admin error correction)
// ═══════════════════════════════════════════════════════════════

async function addPurse(teamId, amount, reason) {
    return await prisma.$transaction(async (tx) => {
        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team) throw new Error('Team not found');

        const updated = await tx.team.update({
            where: { id: teamId },
            data: { purse_remaining: { increment: amount } },
        });

        await logAudit(tx, 'ADD_PURSE', {
            teamId,
            teamName: team.name,
            amount,
            reason,
            newPurse: Number(updated.purse_remaining),
        });

        return {
            success: true,
            teamId,
            newPurse: Number(updated.purse_remaining),
        };
    });
}

export default {
    sellPlayer,
    markUnsold,
    markItemUnsold,
    addPurse,
    assignPlayer,
    usePowerCard,

    updateAuctionPhase,
    advanceToNextInSequence,
    stepBackInSequence,
    selectSequence,
    placeBid,
    assignFranchise,
    loginTeam,
    addBidToHistory,
    setAuctionDay,
    updateDisplayState,
    getRequiredIncrement,
    MAX_SQUAD_SIZE,
    MAX_OVERSEAS,
    MIN_OVERSEAS,
    ROLE_LIMITS,
    POWER_CARD_COST,
    deassignPlayer,
    assignPowerCard,
    deassignPowerCard,
    loginAdmin,
    deductPurse,
    togglePowerCardStatus,
};

