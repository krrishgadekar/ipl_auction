// Display Page
// Simplified operator view for monitoring the auction
// More compact than big-screen, optimized for desktop/laptop

'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/lib/mockData/players';
import { Team } from '@/lib/mockData/teams';
import { AuctionState } from '@/lib/mockData/auctionState';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import PlayerCard from '@/components/PlayerCard';
import { motion } from 'framer-motion';

export default function DisplayPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            try {
                const [state, teamsData] = await Promise.all([
                    getAuctionState(),
                    getAllTeams(),
                ]);

                setAuctionState(state);
                setTeams(teamsData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToAuctionUpdates((newState) => {
            setAuctionState(newState);
        });

        return () => unsubscribe();
    }, []);

    if (loading || !auctionState) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
                <div className="text-2xl text-white font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            IPL AUCTION 2026
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                <span className="text-white/70 mr-2">Day</span>
                                <span className="text-lg font-bold text-white">{auctionState.auctionDay}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/50">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="font-bold text-red-400">LIVE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-white/60 text-sm">Status</div>
                                <div className="text-lg font-bold text-white">{auctionState.status}</div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Player Status</div>
                                <div className="text-lg font-bold text-white">{auctionState.playerStatus}</div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Current Bid</div>
                                <div className="text-lg font-bold text-yellow-400">₹{auctionState.currentBid} CR</div>
                            </div>
                            {auctionState.highestBidder && (
                                <>
                                    <div className="w-px h-8 bg-white/20" />
                                    <div>
                                        <div className="text-white/60 text-sm">Highest Bidder</div>
                                        <div className="text-lg font-bold text-white">{auctionState.highestBidder}</div>
                                    </div>
                                </>
                            )}
                        </div>
                        {auctionState.timerActive && (
                            <div className="text-2xl font-mono font-bold text-white">
                                00:{auctionState.timerSeconds.toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Current Player */}
                    <div className="lg:col-span-2">
                        {auctionState.currentPlayer ? (
                            <PlayerCard player={auctionState.currentPlayer} />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">⏳</div>
                                    <div className="text-xl text-white/70 font-bold">Waiting for next player...</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
                        <div className="space-y-3">
                            {teams
                                .sort((a, b) => b.budgetRemaining - a.budgetRemaining)
                                .map((team, index) => (
                                    <motion.div
                                        key={team.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-3 bg-white/5 rounded-xl border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="text-lg font-bold text-white/50">#{index + 1}</div>
                                                <div className="font-bold text-white">{team.name}</div>
                                            </div>
                                            <div className="text-sm font-mono text-green-400">
                                                ₹{team.budgetRemaining} CR
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-white/60">
                                            <div>Squad: {team.squadCount}/18</div>
                                            <div>Used: ₹{team.budgetUsed} CR</div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Statistics Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                >
                    <div className="flex items-center justify-around">
                        <div className="text-center">
                            <div className="text-white/60 text-sm">Total Teams</div>
                            <div className="text-2xl font-bold text-white">{teams.length}</div>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-white/60 text-sm">Players Sold</div>
                            <div className="text-2xl font-bold text-green-400">
                                {teams.reduce((sum, t) => sum + t.squadCount, 0)}
                            </div>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-white/60 text-sm">Total Spent</div>
                            <div className="text-2xl font-bold text-yellow-400">
                                ₹{teams.reduce((sum, t) => sum + t.budgetUsed, 0).toFixed(1)} CR
                            </div>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-white/60 text-sm">Budget Remaining</div>
                            <div className="text-2xl font-bold text-cyan-400">
                                ₹{teams.reduce((sum, t) => sum + t.budgetRemaining, 0).toFixed(1)} CR
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
