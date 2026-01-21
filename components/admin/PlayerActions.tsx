// Player Actions Component
// Controls for managing player status and navigation

'use client';

import { useState } from 'react';
import { Team } from '@/lib/mockData/teams';
import { markPlayerSold, markPlayerUnsold, setCurrentPlayer } from '@/lib/api/auction';
import { Player } from '@/lib/mockData/players';

interface PlayerActionsProps {
    currentPlayerRank: number | null;
    teams: Team[];
    highestBidder: string | null;
    totalPlayers: number;
}

export default function PlayerActions({
    currentPlayerRank,
    teams,
    highestBidder,
    totalPlayers = 8
}: PlayerActionsProps) {
    const [processing, setProcessing] = useState(false);

    const handleNextPlayer = async () => {
        if (!currentPlayerRank) return;

        setProcessing(true);
        try {
            const nextRank = currentPlayerRank < totalPlayers ? currentPlayerRank + 1 : 1;
            await setCurrentPlayer(nextRank);
        } catch (error) {
            console.error('Failed to set next player:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleMarkSold = async () => {
        if (!highestBidder) {
            alert('No bidder selected! Place a bid first.');
            return;
        }

        const team = teams.find(t => t.name === highestBidder);
        if (!team) return;

        const confirmed = window.confirm(
            `Mark player as SOLD to ${team.name}?\n\nThis action will update budgets and move to next player.`
        );

        if (!confirmed) return;

        setProcessing(true);
        try {
            await markPlayerSold(team.id, team.name);
            // Auto-advance to next player after a delay
            setTimeout(() => handleNextPlayer(), 2000);
        } catch (error) {
            console.error('Failed to mark player as sold:', error);
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
            await markPlayerUnsold();
            // Auto-advance to next player after a delay
            setTimeout(() => handleNextPlayer(), 2000);
        } catch (error) {
            console.error('Failed to mark player as unsold:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Player Actions</h2>

            <div className="space-y-3">
                {/* Mark as SOLD */}
                <button
                    onClick={handleMarkSold}
                    disabled={processing || !highestBidder}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${highestBidder && !processing
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }`}
                >
                    ✓ Mark as SOLD
                    {highestBidder && ` to ${highestBidder}`}
                </button>

                {/* Mark as UNSOLD */}
                <button
                    onClick={handleMarkUnsold}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ✗ Mark as UNSOLD
                </button>

                {/* Next Player */}
                <button
                    onClick={handleNextPlayer}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    → Next Player
                </button>
            </div>

            {/* Player Counter */}
            {currentPlayerRank && (
                <div className="mt-4 p-3 bg-white/5 rounded-xl text-center">
                    <div className="text-white/60 text-sm">Current Player</div>
                    <div className="text-2xl font-bold text-white">
                        #{currentPlayerRank} / {totalPlayers}
                    </div>
                </div>
            )}
        </div>
    );
}
