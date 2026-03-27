// Player Actions Component
// Controls for managing player status and navigation
// Enhanced: overseas limit check + squad composition warning before SOLD

'use client';

import { useState } from 'react';
import { Team } from '@/lib/api/teams';
import { Player, getAllPlayers } from '@/lib/api/players';
import { advanceToNextObject, stepBackToPreviousObject, sellPlayer, markUnsold } from '@/lib/api/admin';

// Composition rules from rulebook §5
const COMPOSITION_MAX: Record<string, number> = {
    BAT: 5,
    BOWL: 8,
    AR: 5,
    WK: 4,
};

function mapRoleToCategory(role: string): string {
    if (!role) return 'BAT';
    const r = role.toLowerCase();
    if (r.includes('wk') || r.includes('wicket')) return 'WK';
    if (r.includes('allrounder')) return 'AR';
    if (r.includes('bowler')) return 'BOWL';
    return 'BAT';
}

const OVERSEAS_MAX = 5;

interface PlayerActionsProps {
    currentPlayerRank: number | null;
    currentPlayer?: Player | null;
    teams: Team[];
    highestBidder: string | null;
    highestBidderId?: string | null;
    totalPlayers: number;
    currentBid: number;
}

export default function PlayerActions({
    currentPlayerRank,
    currentPlayer,
    teams,
    highestBidder,
    highestBidderId,
    totalPlayers = 246,
    currentBid
}: PlayerActionsProps) {
    const [processing, setProcessing] = useState(false);

    const handleNextPlayer = async () => {
        if (!currentPlayerRank) return;
        setProcessing(true);
        try {
            await advanceToNextObject();
        } catch (error) {
            console.error('Failed to set next player:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handlePrevPlayer = async () => {
        setProcessing(true);
        try {
            await stepBackToPreviousObject();
        } catch (error: any) {
            console.error('Failed to set prev player:', error);
            alert(`Cannot go back: ${error.message || error}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleMarkSold = async () => {
        if (!highestBidder) {
            alert('No bidder selected! Place a bid first.');
            return;
        }

        const team = teams.find(t => t.name === highestBidder || t.id === highestBidderId);
        if (!team) return;

        // ── Overseas check ──────────────────────────────────────────
        const warnings: string[] = [];

        if (currentPlayer?.nationality?.toUpperCase() === 'OVERSEAS') {
            if (team.overseasCount >= OVERSEAS_MAX) {
                warnings.push(`⚠️ OVERSEAS LIMIT VIOLATION\n${team.shortName} already has ${team.overseasCount}/${OVERSEAS_MAX} overseas players. Selling this player will violate the rule!`);
            } else {
                warnings.push(`ℹ️ Overseas player — ${team.shortName} will have ${team.overseasCount + 1}/${OVERSEAS_MAX} overseas players after this.`);
            }
        }

        // ── Squad composition check ─────────────────────────────────
        if (currentPlayer?.role || currentPlayer?.category) {
            const role = currentPlayer.role || currentPlayer.category;
            const cat = mapRoleToCategory(role);
            const max = COMPOSITION_MAX[cat];
            
            if (max !== undefined) {
                // Determine current count in this category
                // Prefer counts pre-calculated on the team object if available
                const countKeyMap: Record<string, string> = {
                    'BAT': 'batsmanCount',
                    'BOWL': 'bowlerCount',
                    'AR': 'allrounderCount',
                    'WK': 'wicketkeeperCount'
                };
                const countKey = countKeyMap[cat];
                const categoryCount = (team as any)[countKey] || 0;

                if (categoryCount >= max) {
                    warnings.push(`⚠️ COMPOSITION VIOLATION\n${team.shortName} already has ${categoryCount}/${max} ${cat}. This purchase would exceed the maximum!`);
                }
            }
        }

        // Build confirm message
        const warningText = warnings.length > 0 ? `\n\n${warnings.join('\n\n')}` : '';
        const confirmed = window.confirm(
            `Mark ${currentPlayer?.player ?? 'player'} as SOLD to ${team.name}?${warningText}\n\nThis action will update budgets and move to next player.`
        );

        if (!confirmed) return;

        setProcessing(true);
        try {
            const playerId = currentPlayer?.id || currentPlayer?.rank?.toString() || '';
            await sellPlayer(playerId, team.id.toString(), currentBid);
            // Auto-advance to next player after a delay
            setTimeout(() => handleNextPlayer(), 2000);
        } catch (error: any) {
            console.error('Failed to mark player as sold:', error);
            alert(`Purchase Failed: ${error.message || error}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleMarkUnsold = async () => {
        const confirmed = window.confirm(
            'Mark player as UNSOLD?\n\nPlayer will be added to unsold pool.'
        );
        if (!confirmed) return;

        setProcessing(true);
        try {
            const playerId = currentPlayer?.id || currentPlayer?.rank?.toString() || '';
            if (playerId) {
                await markUnsold(playerId);
            }
            // Auto-advance to next player after a delay
            setTimeout(() => handleNextPlayer(), 2000);
        } catch (error) {
            console.error('Failed to mark player as unsold:', error);
        } finally {
            setProcessing(false);
        }
    };

    const team = highestBidder ? teams.find(t => t.name === highestBidder) : null;

    return (
        <div className="backdrop-blur-md rounded-2xl p-6" style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(43,181,204,0.15)' }}>
            <h2 className="text-2xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Cinzel', serif" }}>Player Actions</h2>

            {/* Overseas indicator */}
            {currentPlayer?.nationality?.toUpperCase() === 'OVERSEAS' && (
                <div className="mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(14,77,94,0.15)', border: '1px solid rgba(43,181,204,0.25)' }}>
                    <span className="text-xs font-bold" style={{ color: '#2bb5cc' }}>🌍 OVERSEAS PLAYER</span>
                    {team && (
                        <span className="text-xs ml-2" style={{ color: 'rgba(122,148,176,0.6)' }}>
                            {team.shortName}: {team.overseasCount}/{OVERSEAS_MAX} overseas
                            {team.overseasCount >= OVERSEAS_MAX && (
                                <span className="font-bold ml-1" style={{ color: '#e74c5e' }}>— LIMIT REACHED!</span>
                            )}
                        </span>
                    )}
                </div>
            )}

            <div className="space-y-3">
                {/* Mark as SOLD */}
                <button
                    onClick={handleMarkSold}
                    disabled={processing || !highestBidder}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all"
                    style={{
                        background: highestBidder && !processing ? 'linear-gradient(135deg, #1a6a52, #2dd4a0)' : 'rgba(43,181,204,0.05)',
                        color: highestBidder && !processing ? '#fff' : 'rgba(122,148,176,0.4)',
                        cursor: !highestBidder || processing ? 'not-allowed' : 'pointer',
                        boxShadow: highestBidder && !processing ? '0 4px 20px rgba(45,212,160,0.2)' : 'none',
                        fontFamily: "'Cinzel', serif",
                    }}
                >
                    ✓ Mark as SOLD
                    {highestBidder && ` to ${highestBidder}`}
                </button>

                {/* Mark as UNSOLD */}
                <button
                    onClick={handleMarkUnsold}
                    disabled={processing}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #6b0a1a, #e74c5e)', color: '#fff', boxShadow: '0 4px 20px rgba(231,76,94,0.2)', fontFamily: "'Cinzel', serif" }}
                >
                    ✗ Mark as UNSOLD
                </button>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handlePrevPlayer}
                        disabled={processing}
                        className="flex-1 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Cinzel', serif" }}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleNextPlayer}
                        disabled={processing}
                        className="flex-1 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #0e4d5e, #1a8a9e)', color: '#fff', boxShadow: '0 4px 20px rgba(43,181,204,0.2)', fontFamily: "'Cinzel', serif" }}
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* Player Counter */}
            {currentPlayerRank && (
                <div className="mt-4 p-3 rounded-xl text-center" style={{ background: 'rgba(14,77,94,0.15)', border: '1px solid rgba(43,181,204,0.15)' }}>
                    <div className="text-sm" style={{ color: 'rgba(122,148,176,0.7)' }}>Current Player</div>
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                        #{currentPlayerRank} / {totalPlayers}
                    </div>
                </div>
            )}
        </div>
    );
}
