// Big Screen Display Page
// Optimized for 1920×1080 projector (16:9 aspect ratio)
// READ-ONLY - No interactive elements

'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/lib/mockData/players';
import { Team } from '@/lib/mockData/teams';
import { AuctionState } from '@/lib/mockData/auctionState';
import { getAllPlayers } from '@/lib/api/players';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import PlayerCardLarge from '@/components/big-screen/PlayerCardLarge';
import LiveLeaderboard from '@/components/big-screen/LiveLeaderboard';
import CurrentBidDisplay from '@/components/big-screen/CurrentBidDisplay';
import AuctionTimer from '@/components/AuctionTimer';
import { motion } from 'framer-motion';

export default function BigScreenPage() {
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
            // Trigger confetti if player was just sold
            if (auctionState?.status === 'BIDDING' && newState.status === 'SOLD') {
                import('canvas-confetti').then((confetti) => {
                    const duration = 3000;
                    const end = Date.now() + duration;

                    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

                    (function frame() {
                        confetti.default({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: colors
                        });
                        confetti.default({
                            particleCount: 5,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: colors
                        });

                        if (Date.now() < end) {
                            requestAnimationFrame(frame);
                        }
                    }());
                });
            }
            setAuctionState(newState);
        });

        return () => unsubscribe();
    }, [auctionState]);

    if (loading || !auctionState) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
                <div className="text-4xl text-white font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 overflow-hidden">
            {/* Fixed aspect ratio container for 1920×1080 */}
            <div className="w-screen h-screen p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                        >
                            IPL AUCTION 2026
                        </motion.h1>

                        <div className="flex items-center gap-6">
                            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                <span className="text-white/70 text-xl mr-3">Day</span>
                                <span className="text-2xl font-bold text-white">{auctionState.auctionDay}</span>
                            </div>

                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center gap-2 px-6 py-3 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/50"
                            >
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-xl font-bold text-red-400">LIVE</span>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-3 gap-6 h-[calc(100%-120px)]">
                    {/* Left Column - Player Card (2 columns width) */}
                    <div className="col-span-2 space-y-6">
                        {auctionState.currentPlayer ? (
                            <>
                                <PlayerCardLarge player={auctionState.currentPlayer} />
                                <CurrentBidDisplay
                                    amount={auctionState.currentBid}
                                    teamName={auctionState.highestBidder}
                                    status={auctionState.status as any}
                                />
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">⏳</div>
                                    <div className="text-3xl text-white/70 font-bold">Waiting for next player...</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Leaderboard */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 overflow-y-auto">
                        <LiveLeaderboard teams={teams} />
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="absolute bottom-4 left-8 right-8">
                    <div className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                        <div className="flex items-center gap-8">
                            <div>
                                <div className="text-white/60 text-sm">Total Teams</div>
                                <div className="text-2xl font-bold text-white">{teams.length}</div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Players Sold</div>
                                <div className="text-2xl font-bold text-green-400">
                                    {teams.reduce((sum, t) => sum + t.squadCount, 0)}
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Total Spent</div>
                                <div className="text-2xl font-bold text-yellow-400">
                                    ₹{teams.reduce((sum, t) => sum + t.budgetUsed, 0).toFixed(1)} CR
                                </div>
                            </div>
                        </div>



                        {auctionState.timerActive && (
                            <div className="flex items-center gap-3">
                                <div className="text-white/60 text-sm">Timer</div>
                                <AuctionTimer
                                    seconds={auctionState.timerSeconds}
                                    isActive={auctionState.timerActive}
                                    size="md"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
