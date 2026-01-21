// Bid Controls Component
// Interface for placing bids with team selection and amount input

'use client';

import { useState } from 'react';
import { Team } from '@/lib/mockData/teams';
import { placeBid } from '@/lib/api/auction';

interface BidControlsProps {
    teams: Team[];
    currentBid: number;
    baseBid: number;
}

export default function BidControls({ teams, currentBid, baseBid }: BidControlsProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<number>(teams[0]?.id || 1);
    const [bidAmount, setBidAmount] = useState<number>(currentBid + 0.5);
    const [placing, setPlacing] = useState(false);

    const selectedTeam = teams.find(t => t.id === selectedTeamId);

    const handleQuickIncrement = (amount: number) => {
        setBidAmount(prev => prev + amount);
    };

    const handlePlaceBid = async () => {
        if (!selectedTeam) return;

        setPlacing(true);
        try {
            await placeBid(selectedTeam.id, selectedTeam.name, bidAmount);
            // Bid placed successfully, state will update via polling
        } catch (error) {
            console.error('Failed to place bid:', error);
        } finally {
            setPlacing(false);
        }
    };

    const canPlaceBid = bidAmount > currentBid && selectedTeam && selectedTeam.budgetRemaining >= bidAmount;

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Bid Controls</h2>

            {/* Current Bid Display */}
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                <div className="text-white/70 text-sm mb-1">Current Bid</div>
                <div className="text-4xl font-black text-yellow-400">₹{currentBid} CR</div>
                {currentBid > baseBid && (
                    <div className="text-sm text-white/60 mt-1">Base: ₹{baseBid} CR</div>
                )}
            </div>

            {/* Team Selector */}
            <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Select Team</label>
                <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    {teams.map(team => (
                        <option key={team.id} value={team.id} className="bg-slate-900">
                            {team.name} (₹{team.budgetRemaining} CR)
                        </option>
                    ))}
                </select>
            </div>

            {/* Bid Amount Input */}
            <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Bid Amount (CR)</label>
                <input
                    type="number"
                    step="0.5"
                    min={currentBid + 0.5}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>

            {/* Quick Increment Buttons */}
            <div className="mb-6">
                <label className="block text-white/70 text-sm mb-2">Quick Increment</label>
                <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1, 2, 3].map(amount => (
                        <button
                            key={amount}
                            onClick={() => handleQuickIncrement(amount)}
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold transition-all"
                        >
                            +₹{amount}
                        </button>
                    ))}
                </div>
            </div>

            {/* Place Bid Button */}
            <button
                onClick={handlePlaceBid}
                disabled={!canPlaceBid || placing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${canPlaceBid && !placing
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
            >
                {placing ? 'Placing Bid...' : 'Place Bid'}
            </button>

            {/* Budget Warning */}
            {selectedTeam && bidAmount > selectedTeam.budgetRemaining && (
                <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <div className="text-red-400 text-sm">
                        ⚠️ Insufficient budget! Team has only ₹{selectedTeam.budgetRemaining} CR remaining.
                    </div>
                </div>
            )}
        </div>
    );
}
