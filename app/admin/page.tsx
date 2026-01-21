"use client";

import { useEffect, useState } from 'react';
import { useAuctionStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PlayerCard from '@/components/PlayerCard';

export default function AdminPanel() {
    const router = useRouter();
    const { auction, teams, currentPlayer, fetchAuction, fetchTeams, refreshCurrentPlayer } = useAuctionStore();

    const [auctionId, setAuctionId] = useState(1);
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
    const [bidAmount, setBidAmount] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

    useEffect(() => {
        fetchAuction(auctionId);
        fetchTeams(auctionId);
    }, [auctionId]);

    useEffect(() => {
        if (auction?.current_player_id) {
            refreshCurrentPlayer();
        }
    }, [auction?.current_player_id]);

    const handlePlaceBid = async () => {
        if (!selectedTeam || !bidAmount || !currentPlayer) {
            alert('Please select team and enter bid amount');
            return;
        }

        try {
            const response = await fetch('/api/admin/bid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auctionId,
                    playerId: currentPlayer.id,
                    playerRank: currentPlayer.rank,
                    teamId: selectedTeam,
                    amount: parseFloat(bidAmount),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Failed to place bid');
                return;
            }

            // Refresh data
            fetchAuction(auctionId);
            fetchTeams(auctionId);
            setBidAmount('');
        } catch (error) {
            alert('Error placing bid');
            console.error(error);
        }
    };

    const handleSold = async () => {
        if (!selectedTeam || !currentPlayer) {
            alert('Please select winning team');
            return;
        }

        const finalAmount = auction?.current_bid_amount || parseFloat(bidAmount) || currentPlayer.base_price;

        try {
            const response = await fetch('/api/admin/sold', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auctionId,
                    playerId: currentPlayer.id,
                    playerRank: currentPlayer.rank,
                    teamId: selectedTeam,
                    finalAmount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Failed to assign player');
                return;
            }

            alert('✅ Player SOLD!');

            // Refresh and reset
            fetchAuction(auctionId);
            fetchTeams(auctionId);
            setBidAmount('');
            setSelectedTeam(null);
        } catch (error) {
            alert('Error assigning player');
            console.error(error);
        }
    };

    const handleUnsold = async () => {
        if (!currentPlayer) return;

        try {
            const response = await fetch('/api/admin/unsold', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auctionId,
                    playerId: currentPlayer.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Failed to mark unsold');
                return;
            }

            alert('Player marked as UNSOLD');

            // Refresh and reset
            fetchAuction(auctionId);
            setBidAmount('');
            setSelectedTeam(null);
        } catch (error) {
            alert('Error marking unsold');
            console.error(error);
        }
    };

    const quickIncrements = [0.5, 1, 2, 3];

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="gradient-text mb-2">Admin Control Panel</h1>
                    <p className="text-text-secondary text-lg">Auction Day {auction?.day || 1} • Status: {auction?.status || 'Idle'}</p>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left: Current Player Card */}
                    <div className="xl:col-span-2">
                        {currentPlayer ? (
                            <PlayerCard
                                player={currentPlayer}
                                currentBid={auction?.current_bid_amount || 0}
                                isRiddle={currentPlayer.is_riddle}
                            />
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <div className="text-6xl mb-4">🏏</div>
                                <h3 className="text-2xl font-bold mb-2">No Player Selected</h3>
                                <p className="text-text-secondary">Select a player to begin auction</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Controls */}
                    <div className="space-y-6">
                        {/* Bid Entry */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold mb-4">Place Bid</h3>

                            {/* Team Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Select Team</label>
                                <select
                                    value={selectedTeam || ''}
                                    onChange={(e) => setSelectedTeam(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-neon-blue focus:outline-none"
                                >
                                    <option value="">Choose team...</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name} (₹{team.budget_remaining} CR)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bid Amount */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Bid Amount (₹ CR)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="Enter amount..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-neon-blue focus:outline-none"
                                />
                            </div>

                            {/* Quick Increments */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Quick Increment</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {quickIncrements.map((inc) => (
                                        <button
                                            key={inc}
                                            onClick={() => {
                                                const current = auction?.current_bid_amount || currentPlayer?.base_price || 0;
                                                setBidAmount((current + inc).toString());
                                            }}
                                            className="btn-secondary py-2 text-sm"
                                        >
                                            +₹{inc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Place Bid Button */}
                            <button
                                onClick={handlePlaceBid}
                                disabled={!selectedTeam || !bidAmount}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                📢 Place Bid
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold mb-4">Player Actions</h3>

                            <button
                                onClick={handleSold}
                                disabled={!selectedTeam}
                                className="w-full btn-success mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ✅ SOLD
                            </button>

                            <button
                                onClick={handleUnsold}
                                disabled={!currentPlayer}
                                className="w-full btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ❌ UNSOLD
                            </button>
                        </div>

                        {/* Team Budgets */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold mb-4">Team Budgets</h3>
                            <div className="space-y-3">
                                {teams.map((team) => (
                                    <div
                                        key={team.id}
                                        className={`p-3 rounded-xl ${selectedTeam === team.id
                                                ? 'bg-accent-neon-blue/20 border-2 border-accent-neon-blue'
                                                : 'bg-white/5 border border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{team.name}</p>
                                                <p className="text-xs text-text-secondary">
                                                    Squad: {team.squad_count}/18
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-accent-gold">₹{team.budget_remaining}</p>
                                                <p className="text-xs text-text-secondary">Remaining</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
