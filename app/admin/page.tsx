// Admin Panel
// Main auctioneer control dashboard

'use client';

import { useEffect, useState } from 'react';
import { AuctionState } from '@/lib/mockData/auctionState';
import { Team } from '@/lib/mockData/teams';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import { getAllPlayers } from '@/lib/api/players';
import CurrentPlayerPreview from '@/components/admin/CurrentPlayerPreview';
import BidControls from '@/components/admin/BidControls';
import PlayerActions from '@/components/admin/PlayerActions';
import TeamBudgets from '@/components/admin/TeamBudgets';
import PowerCardPanel from '@/components/admin/PowerCardPanel';
import AuctionTimer from '@/components/AuctionTimer';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [totalPlayers, setTotalPlayers] = useState(8);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            try {
                const [state, teamsData, playersData] = await Promise.all([
                    getAuctionState(),
                    getAllTeams(),
                    getAllPlayers(),
                ]);

                setAuctionState(state);
                setTeams(teamsData);
                setTotalPlayers(playersData.length);
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

        // Refresh teams data periodically
        const teamsInterval = setInterval(async () => {
            const teamsData = await getAllTeams();
            setTeams(teamsData);
        }, 2000);

        return () => {
            unsubscribe();
            clearInterval(teamsInterval);
        };
    }, []);

    if (loading || !auctionState) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
                <div className="text-2xl text-white font-bold">Loading Admin Panel...</div>
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
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                IPL AUCTION 2026
                            </h1>
                            <p className="text-white/70">Admin Control Panel</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/big-screen"
                                target="_blank"
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
                            >
                                📺 Open Big Screen
                            </Link>
                            <Link
                                href="/display"
                                target="_blank"
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
                            >
                                🖥️ Open Display
                            </Link>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl">
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
                                <div className="text-white/60 text-sm">Auction Day</div>
                                <div className="text-lg font-bold text-white">{auctionState.auctionDay}</div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Status</div>
                                <div className="text-lg font-bold text-cyan-400">{auctionState.status}</div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Player Status</div>
                                <div className="text-lg font-bold text-white">{auctionState.playerStatus}</div>
                            </div>
                        </div>


                        {auctionState.timerActive && (
                            <div className="flex flex-col items-end">
                                <div className="text-white/60 text-xs mb-1">Time Remaining</div>
                                <AuctionTimer
                                    seconds={auctionState.timerSeconds}
                                    isActive={auctionState.timerActive}
                                    size="md"
                                />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Left Column - Current Player */}
                    <div className="lg:col-span-2">
                        <CurrentPlayerPreview player={auctionState.currentPlayer} />
                    </div>

                    {/* Right Column - Controls */}
                    <div className="space-y-6">
                        <BidControls
                            teams={teams}
                            currentBid={auctionState.currentBid}
                            baseBid={auctionState.baseBid}
                            status={auctionState.status}
                        />
                        <PowerCardPanel teams={teams} />
                        <PlayerActions
                            currentPlayerRank={auctionState.currentPlayerRank}
                            currentPlayer={auctionState.currentPlayer}
                            teams={teams}
                            highestBidder={auctionState.highestBidder}
                            highestBidderId={auctionState.boughtByTeamId ?? null}
                            totalPlayers={totalPlayers}
                        />
                    </div>
                </div>

                {/* Team Budgets */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <TeamBudgets teams={teams} />
                </motion.div>

                {/* Bid History */}
                {auctionState.bidHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Bid History</h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {auctionState.bidHistory.slice().reverse().map((bid, index) => (
                                <div
                                    key={`${bid.timestamp}-${index}`}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                            {bid.teamName.split(' ').map(w => w[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{bid.teamName}</div>
                                            <div className="text-xs text-white/60">
                                                {new Date(bid.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xl font-bold text-yellow-400">
                                        ₹{bid.amount} CR
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
