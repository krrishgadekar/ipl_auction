// /app/display/page.tsx
// Live Auction Display — secondary monitor / tablet view
// Shows current bidding action in real time (for audience / teams watching)

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockAuctionState } from '@/lib/mockData/auctionState';
import { Team, getTeamLeaderboard } from '@/lib/api/teams';
import TeamAvatar from '@/components/team/TeamAvatar';
import { mockTeams } from '@/lib/mockData/teams';

// Polling interval (ms)
const POLL_MS = 2000;

// Grade colors
const GRADE_COLORS: Record<string, string> = {
    A: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/40',
    B: 'text-cyan-400 bg-cyan-400/20 border-cyan-400/40',
    C: 'text-purple-400 bg-purple-400/20 border-purple-400/40',
    D: 'text-slate-400 bg-slate-400/20 border-slate-400/40',
};

// Pulsing live indicator
function LivePulse() {
    return (
        <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-400 font-bold text-sm tracking-widest uppercase">Live</span>
        </div>
    );
}

// Small team card for the leaderboard
function TeamRow({ team, rank }: { team: Team; rank: number }) {
    const pctSpent = team.budgetUsed / team.totalBudget;
    return (
        <motion.div
            layout
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
        >
            <span className="text-white/30 font-bold text-sm w-5 text-center">{rank}</span>
            <TeamAvatar team={team} size={24} />
            <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm truncate">{team.shortName}</div>
                <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                        style={{ width: `${pctSpent * 100}%` }}
                    />
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="text-yellow-400 font-bold text-sm">₹{team.budgetRemaining}</div>
                <div className="text-white/30 text-xs">CR left</div>
            </div>
            <div className="text-white/50 font-bold text-xs w-8 text-center">
                <div className="text-white/80">{team.squadCount}</div>
                <div className="text-white/30 text-xs">/{team.squadLimit}</div>
            </div>
        </motion.div>
    );
}

export default function DisplayPage() {
    const [state, setState] = useState(mockAuctionState);
    const [teams, setTeams] = useState<any[]>(mockTeams);
    const [tick, setTick] = useState(0);

    // Mock poll
    useEffect(() => {
        const id = setInterval(() => {
            setState({ ...mockAuctionState });
            setTeams([...mockTeams] as any[]);
            setTick(t => t + 1);
        }, POLL_MS);
        return () => clearInterval(id);
    }, []);

    const player = state.currentPlayer;
    const isClosedBidding = state.status === 'CLOSED_BIDDING';
    const isSold = state.status === 'SOLD';
    const isUnsold = state.status === 'UNSOLD';

    // Sort teams by squad count desc for leaderboard
    const sortedTeams = [...teams].sort((a, b) => b.squadCount - a.squadCount);

    return (
        <div className="min-h-screen bg-[#0a0a14] text-white relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[160px]" />
                <div className="absolute bottom-[-20%] left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-12 gap-6 min-h-screen">

                {/* ── Left: Current Player ── */}
                <div className="col-span-8 flex flex-col gap-6">

                    {/* Top bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl font-black text-white">🏏 IPL 2026</div>
                            <div className="text-white/40">|</div>
                            <div className="text-white/60">{state.auctionDay}</div>
                        </div>
                        <LivePulse />
                    </div>

                    {/* Status Banner */}
                    <AnimatePresence mode="wait">
                        {(isSold || isUnsold || isClosedBidding) && (
                            <motion.div
                                key={state.status}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className={`text-center py-4 rounded-2xl font-black text-2xl tracking-widest uppercase border ${isSold
                                    ? 'bg-green-500/20 border-green-500 text-green-400'
                                    : isUnsold
                                        ? 'bg-red-500/20 border-red-500 text-red-400'
                                        : 'bg-purple-500/20 border-purple-500 text-purple-300'
                                    }`}
                            >
                                {isSold ? '✅ SOLD' : isUnsold ? '❌ UNSOLD' : '🔒 CLOSED BIDDING'}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Player Card */}
                    {player ? (
                        <motion.div
                            key={player.rank}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 flex gap-8"
                        >
                            {/* Avatar + Grade */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-6xl font-black text-white">
                                    {player.isRiddle ? '❓' : player.player.charAt(0)}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-lg font-black border ${GRADE_COLORS[player.grade]}`}>
                                    Grade {player.grade}
                                </span>
                                <div className="text-5xl font-black text-white">{player.rating}</div>
                                <div className="text-white/40 text-xs">Rating</div>
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <h2 className="text-4xl font-black text-white mb-1">
                                    {player.isRiddle ? '??? (Riddle Player)' : player.player}
                                </h2>
                                <div className="flex items-center gap-3 text-white/60 mb-6">
                                    <span>{player.role}</span>
                                    <span>•</span>
                                    <span>{player.team}</span>
                                    {player.nationality === 'Overseas' && (
                                        <>
                                            <span>•</span>
                                            <span className="text-cyan-400 font-bold">🌍 Overseas</span>
                                        </>
                                    )}
                                </div>

                                {/* Current Bid — BIG */}
                                <div className="mb-6">
                                    <div className="text-white/50 text-sm mb-1 uppercase tracking-widest">Current Bid</div>
                                    <motion.div
                                        key={state.currentBid}
                                        initial={{ scale: 1.15, color: '#fbbf24' }}
                                        animate={{ scale: 1, color: '#ffffff' }}
                                        transition={{ duration: 0.4 }}
                                        className="text-7xl font-black"
                                    >
                                        ₹{state.currentBid.toFixed(2)}
                                        <span className="text-3xl text-white/50 ml-2">CR</span>
                                    </motion.div>
                                    <div className="text-white/40 text-sm mt-1">Base: ₹{state.baseBid.toFixed(2)} CR</div>
                                </div>

                                {/* Leading Team */}
                                {state.highestBidder && (
                                    <div className="flex items-center gap-3">
                                        <div className="text-white/50 text-sm">Highest Bidder:</div>
                                        <motion.div
                                            key={state.highestBidder}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/50 rounded-xl text-yellow-400 font-bold"
                                        >
                                            {state.highestBidder}
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-white/30 text-2xl font-bold">
                            Awaiting next player...
                        </div>
                    )}

                    {/* Bid History */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                        <h3 className="text-white/70 font-bold text-sm uppercase tracking-widest mb-4">Bid History</h3>
                        {state.bidHistory.length === 0 ? (
                            <div className="text-white/30 text-sm text-center py-4">No bids yet</div>
                        ) : (
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {[...state.bidHistory].reverse().map((bid, i) => (
                                    <motion.div
                                        key={`${bid.teamId}-${bid.amount}-${i}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${i === 0 ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-white/5'}`}
                                    >
                                        <span className={`font-bold text-sm ${i === 0 ? 'text-yellow-400' : 'text-white/70'}`}>
                                            {bid.teamName}
                                        </span>
                                        <span className={`font-black ${i === 0 ? 'text-yellow-400' : 'text-white/60'}`}>
                                            ₹{bid.amount.toFixed(2)} CR
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right: Leaderboard ── */}
                <div className="col-span-4 flex flex-col gap-4">
                    <div>
                        <h3 className="text-white/70 font-bold uppercase tracking-widest text-xs mb-3">Team Budgets</h3>
                        <div className="space-y-2">
                            {sortedTeams.map((team, i) => (
                                <TeamRow key={team.id} team={team} rank={i + 1} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
