// Display Page - PREMIUM PLEY-STYLE
// Operator monitoring view with immersive animations
// More compact than big-screen, optimized for desktop/laptop

'use client';

import { useEffect, useState } from 'react';
import { Team } from '@/lib/mockData/teams';
import { AuctionState } from '@/lib/mockData/auctionState';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';

// Floating Particles
function FloatingParticles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        background: ['#00d9ff', '#b537f2', '#ffd700'][Math.floor(Math.random() * 3)],
                        borderRadius: '50%',
                        animationDuration: `${Math.random() * 15 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.3 + 0.1,
                    }}
                />
            ))}
        </div>
    );
}

// Premium Player Display Card
function PlayerDisplayCard({ player, status }: { player: AuctionState['currentPlayer']; status: string }) {
    if (!player) return null;

    const gradeConfig = {
        A: {
            bg: 'from-yellow-900/50 via-amber-800/30 to-yellow-900/50',
            border: 'border-yellow-400',
            glow: 'shadow-[0_0_50px_rgba(255,215,0,0.4)]',
            badge: '✨ LEGENDARY',
            badgeBg: 'bg-gradient-to-r from-yellow-500 to-amber-500',
            textColor: 'text-yellow-300',
        },
        B: {
            bg: 'from-purple-900/50 via-indigo-800/30 to-purple-900/50',
            border: 'border-purple-400',
            glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]',
            badge: '💎 RARE',
            badgeBg: 'bg-purple-500',
            textColor: 'text-purple-300',
        },
        C: {
            bg: 'from-cyan-900/40 via-blue-800/20 to-cyan-900/40',
            border: 'border-cyan-400/60',
            glow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]',
            badge: '⚡ UNCOMMON',
            badgeBg: 'bg-cyan-500',
            textColor: 'text-cyan-300',
        },
        D: {
            bg: 'from-slate-800/40 via-gray-700/20 to-slate-800/40',
            border: 'border-white/20',
            glow: '',
            badge: '● COMMON',
            badgeBg: 'bg-slate-500',
            textColor: 'text-slate-300',
        },
    };

    const config = gradeConfig[player.grade];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`
                h-full rounded-2xl overflow-hidden
                bg-gradient-to-br ${config.bg}
                border-2 ${config.border} ${config.glow}
                relative
            `}
        >
            {/* Holographic shimmer for high grades */}
            {(player.grade === 'A' || player.grade === 'B') && (
                <div className="absolute inset-0 holo-effect pointer-events-none opacity-30" />
            )}

            {/* Spotlight */}
            <div className="absolute inset-0 spotlight pointer-events-none" />

            {/* Grade Badge */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`absolute top-4 left-4 ${config.badgeBg} px-3 py-1 rounded-full text-white text-sm font-bold z-10`}
            >
                {config.badge}
            </motion.div>

            {/* Status Badge */}
            <motion.div
                key={status}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold z-10 ${status === 'BIDDING' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 status-pulse' :
                        status === 'SOLD' ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                            'bg-white/20 text-white/70 border border-white/30'
                    }`}
            >
                {status}
            </motion.div>

            <div className="p-6 pt-14 h-full flex flex-col">
                {/* Player Info */}
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className={`
                            w-28 h-28 rounded-2xl flex-shrink-0
                            bg-gradient-to-br ${config.bg}
                            border-2 ${config.border}
                            flex items-center justify-center
                            floating
                        `}
                    >
                        <span className={`text-6xl font-black ${config.textColor}`}>
                            {player.player.charAt(0)}
                        </span>
                    </motion.div>

                    {/* Details */}
                    <div className="flex-1">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className={`text-3xl font-black ${config.textColor} mb-2`}
                        >
                            {player.player}
                        </motion.h2>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-center gap-3 text-white/60"
                        >
                            <span>{player.category}</span>
                            <span className="text-white/30">•</span>
                            <span>{player.team}</span>
                            <span className={`
                                px-2 py-0.5 rounded text-xs font-bold
                                ${player.pool === 'BAT_WK' ? 'bg-blue-500/30 text-blue-300' :
                                    player.pool === 'BOWL' ? 'bg-purple-500/30 text-purple-300' :
                                        'bg-orange-500/30 text-orange-300'}
                            `}>
                                {player.pool}
                            </span>
                        </motion.div>
                    </div>

                    {/* Rating Circle */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className={`
                            w-20 h-20 rounded-full flex-shrink-0
                            bg-gradient-to-br ${config.bg}
                            border-2 ${config.border}
                            flex flex-col items-center justify-center
                        `}
                    >
                        <span className={`text-3xl font-black ${config.textColor}`}>{player.rating}</span>
                        <span className="text-[10px] text-white/50">RATING</span>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 grid grid-cols-4 gap-3"
                >
                    {[
                        { label: 'RATING', value: player.rating, color: config.textColor },
                        { label: 'LEGACY', value: player.legacy, color: 'text-yellow-400' },
                        { label: 'RANK', value: `#${player.rank}`, color: 'text-cyan-400' },
                        { label: 'BASE', value: '₹2 CR', color: 'text-green-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-black/30 rounded-xl p-3 text-center border border-white/10"
                        >
                            <div className="text-[10px] text-white/50">{stat.label}</div>
                            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Performance Bars */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 space-y-3 flex-1"
                >
                    {player.pool === 'BAT_WK' && (
                        <>
                            <StatBar label="Scoring" value={player.sub_scoring || 0} color="cyan" />
                            <StatBar label="Impact" value={player.sub_impact || 0} color="purple" />
                            <StatBar label="Consistency" value={player.sub_consistency || 0} color="yellow" />
                        </>
                    )}
                    {player.pool === 'BOWL' && (
                        <>
                            <StatBar label="Wicket Taking" value={player.sub_wickettaking || 0} color="cyan" />
                            <StatBar label="Economy" value={player.sub_economy || 0} color="purple" />
                            <StatBar label="Efficiency" value={player.sub_efficiency || 0} color="yellow" />
                        </>
                    )}
                    {player.pool === 'AR' && (
                        <>
                            <StatBar label="Batting" value={player.sub_batting || 0} color="cyan" />
                            <StatBar label="Bowling" value={player.sub_bowling || 0} color="purple" />
                            <StatBar label="Versatility" value={player.sub_versatility || 0} color="yellow" />
                        </>
                    )}
                    <StatBar label="Experience" value={player.sub_experience || 0} color="green" />
                </motion.div>
            </div>
        </motion.div>
    );
}

// Stat Bar Component
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
    const colorMap: Record<string, string> = {
        cyan: 'from-cyan-500 to-cyan-400',
        purple: 'from-purple-500 to-purple-400',
        yellow: 'from-yellow-500 to-yellow-400',
        green: 'from-green-500 to-green-400',
    };

    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{label}</span>
                <span className="font-bold text-white">{value}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]}`}
                />
            </div>
        </div>
    );
}

// Team Card in Leaderboard
function TeamLeaderboardCard({ team, rank }: { team: Team; rank: number }) {
    const budgetPercent = (team.budgetRemaining / team.totalBudget) * 100;

    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: rank * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all tilt-card"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className={`
                    text-lg font-black
                    ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-600' : 'text-white/30'}
                `}>
                    #{rank}
                </div>
                <div className="text-2xl">{team.logo}</div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{team.name}</div>
                    <div className="text-white/50 text-xs">{team.squadCount} players</div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-black text-green-400">₹{team.budgetRemaining}</div>
                    <div className="text-white/40 text-[10px]">CR left</div>
                </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${budgetPercent}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                />
            </div>
        </motion.div>
    );
}

export default function DisplayPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        const unsubscribe = subscribeToAuctionUpdates((newState) => {
            setAuctionState(newState);
        });

        return () => unsubscribe();
    }, []);

    if (loading || !auctionState) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-6xl"
                >
                    🏏
                </motion.div>
            </div>
        );
    }

    const sortedTeams = [...teams].sort((a, b) => b.budgetRemaining - a.budgetRemaining);

    return (
        <div className="min-h-screen animated-gradient-bg overflow-hidden relative">
            <FloatingParticles />

            <div className="max-w-7xl mx-auto p-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-black gradient-text-animated">
                            IPL AUCTION 2026
                        </h1>
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                            >
                                <span className="text-white/70 mr-2">Day</span>
                                <span className="text-lg font-bold text-white">{auctionState.auctionDay}</span>
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/50"
                            >
                                <div className="w-2 h-2 bg-red-500 rounded-full status-pulse" />
                                <span className="font-bold text-red-400">LIVE</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 p-4 glass-card"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {[
                                { label: 'Status', value: auctionState.status, color: 'text-white' },
                                { label: 'Player Status', value: auctionState.playerStatus, color: 'text-white' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                >
                                    <div className="text-white/60 text-sm">{item.label}</div>
                                    <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                                </motion.div>
                            ))}
                            {auctionState.highestBidder && (
                                <>
                                    <div className="w-px h-8 bg-white/20" />
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="text-white/60 text-sm">Highest Bidder</div>
                                        <div className="text-lg font-bold text-white">{auctionState.highestBidder}</div>
                                    </motion.div>
                                </>
                            )}
                        </div>
                        {auctionState.timerActive && (
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-3xl font-mono font-black text-yellow-400"
                            >
                                00:{auctionState.timerSeconds.toString().padStart(2, '0')}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 240px)' }}>
                    {/* Current Player */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {auctionState.currentPlayer ? (
                                <PlayerDisplayCard
                                    key={auctionState.currentPlayer.rank}
                                    player={auctionState.currentPlayer}
                                    status={auctionState.status}
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center glass-card"
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-6xl mb-4"
                                    >
                                        🏏
                                    </motion.div>
                                    <div className="text-2xl text-white/70 font-bold">Waiting for next player...</div>
                                    <div className="text-white/40 mt-2">The auctioneer is selecting</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Leaderboard */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-4 overflow-y-auto"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            🏆 <span className="gradient-text">Leaderboard</span>
                        </h2>
                        <div className="space-y-3">
                            {sortedTeams.map((team, index) => (
                                <TeamLeaderboardCard key={team.id} team={team} rank={index + 1} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Statistics Footer */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 glass-card"
                >
                    <div className="flex items-center justify-around">
                        {[
                            { label: 'Total Teams', value: teams.length, color: 'text-white' },
                            { label: 'Players Sold', value: teams.reduce((sum, t) => sum + t.squadCount, 0), color: 'text-green-400' },
                            { label: 'Total Spent', value: `₹${teams.reduce((sum, t) => sum + t.budgetUsed, 0).toFixed(1)} CR`, color: 'text-yellow-400' },
                            { label: 'Budget Remaining', value: `₹${teams.reduce((sum, t) => sum + t.budgetRemaining, 0).toFixed(1)} CR`, color: 'text-cyan-400' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-white/60 text-sm">{stat.label}</div>
                                <div className={`text-2xl font-bold ${stat.color} count-up`}>{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
