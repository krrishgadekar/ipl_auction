// Big Screen Display Page - PREMIUM PLEY-STYLE
// Full-screen immersive auction experience
// Optimized for 1920×1080 projectors

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Player } from '@/lib/mockData/players';
import { Team } from '@/lib/mockData/teams';
import { AuctionState } from '@/lib/mockData/auctionState';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';

// Floating Particles Component
function FloatingParticles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        background: ['#00d9ff', '#b537f2', '#ffd700', '#00ff88'][Math.floor(Math.random() * 4)],
                        borderRadius: '50%',
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.5 + 0.2,
                    }}
                />
            ))}
        </div>
    );
}

// Animated Number Counter
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const steps = 30;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{prefix}{displayValue.toFixed(1)}{suffix}</span>;
}

// Premium Player Card for Big Screen
function PremiumPlayerCard({ player }: { player: Player }) {
    const gradeConfig = {
        A: {
            bg: 'from-yellow-900/40 via-amber-800/30 to-yellow-900/40',
            border: 'border-yellow-400',
            glow: 'legendary-glow',
            badge: '✨ LEGENDARY',
            badgeBg: 'bg-gradient-to-r from-yellow-500 to-amber-500',
            textColor: 'text-yellow-400',
        },
        B: {
            bg: 'from-purple-900/40 via-indigo-800/30 to-purple-900/40',
            border: 'border-purple-400',
            glow: 'glow-pulse',
            badge: '💎 RARE',
            badgeBg: 'bg-purple-500',
            textColor: 'text-purple-400',
        },
        C: {
            bg: 'from-cyan-900/40 via-blue-800/30 to-cyan-900/40',
            border: 'border-cyan-400',
            glow: '',
            badge: '⚡ UNCOMMON',
            badgeBg: 'bg-cyan-500',
            textColor: 'text-cyan-400',
        },
        D: {
            bg: 'from-slate-800/40 via-gray-700/30 to-slate-800/40',
            border: 'border-slate-500',
            glow: '',
            badge: '● COMMON',
            badgeBg: 'bg-slate-500',
            textColor: 'text-slate-400',
        },
    };

    const config = gradeConfig[player.grade];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className={`
                relative overflow-hidden rounded-3xl
                bg-gradient-to-br ${config.bg}
                border-2 ${config.border}
                ${config.glow}
                p-8 h-full
            `}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
            {/* Holographic overlay for legendary */}
            {player.grade === 'A' && (
                <div className="absolute inset-0 holo-effect pointer-events-none" />
            )}

            {/* Spotlight effect */}
            <div className="absolute inset-0 spotlight pointer-events-none" />

            {/* Grade Badge */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`absolute top-6 left-6 ${config.badgeBg} px-4 py-2 rounded-full text-white font-black text-lg`}
            >
                {config.badge}
            </motion.div>

            {/* Main Content */}
            <div className="flex h-full gap-8 items-center relative z-10 pt-12">
                {/* Player Avatar */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="flex-shrink-0"
                >
                    <div className={`
                        w-56 h-56 rounded-3xl
                        bg-gradient-to-br ${config.bg}
                        border-4 ${config.border}
                        flex items-center justify-center
                        ${config.glow}
                        floating
                    `}>
                        <span className={`text-9xl font-black ${config.textColor}`}>
                            {player.player.charAt(0)}
                        </span>
                    </div>
                </motion.div>

                {/* Player Info */}
                <div className="flex-1">
                    <motion.h2
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl font-black text-white mb-4 text-reveal"
                    >
                        {player.player}
                    </motion.h2>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <span className="text-2xl text-white/70">{player.category}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-2xl text-white/70">{player.team}</span>
                        <span className={`
                            px-3 py-1 rounded-lg text-sm font-bold
                            ${player.pool === 'BAT_WK' ? 'bg-blue-500/30 text-blue-300' :
                                player.pool === 'BOWL' ? 'bg-purple-500/30 text-purple-300' :
                                    'bg-orange-500/30 text-orange-300'}
                        `}>
                            {player.pool}
                        </span>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-4 gap-4"
                    >
                        <div className="bg-black/30 rounded-2xl p-4 text-center border border-white/10">
                            <div className="text-white/50 text-sm mb-1">RATING</div>
                            <div className={`text-5xl font-black ${config.textColor}`}>{player.rating}</div>
                        </div>
                        <div className="bg-black/30 rounded-2xl p-4 text-center border border-white/10">
                            <div className="text-white/50 text-sm mb-1">LEGACY</div>
                            <div className="text-5xl font-black text-yellow-400">{player.legacy}</div>
                        </div>
                        <div className="bg-black/30 rounded-2xl p-4 text-center border border-white/10">
                            <div className="text-white/50 text-sm mb-1">RANK</div>
                            <div className="text-5xl font-black text-cyan-400">#{player.rank}</div>
                        </div>
                        <div className="bg-black/30 rounded-2xl p-4 text-center border border-white/10">
                            <div className="text-white/50 text-sm mb-1">BASE</div>
                            <div className="text-5xl font-black text-green-400">₹2</div>
                        </div>
                    </motion.div>
                </div>

                {/* Overall Rating Circle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="flex-shrink-0"
                >
                    <div className={`
                        w-40 h-40 rounded-full
                        bg-gradient-to-br ${config.bg}
                        border-4 ${config.border}
                        flex flex-col items-center justify-center
                        ${config.glow}
                    `}>
                        <span className={`text-6xl font-black ${config.textColor}`}>{player.rating}</span>
                        <span className="text-white/50 text-sm">OVERALL</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Waiting State Component
function WaitingState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-white/10"
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="text-9xl mb-8"
            >
                🏏
            </motion.div>
            <h2 className="text-4xl font-black text-white/70 mb-4">
                WAITING FOR NEXT PLAYER
            </h2>
            <p className="text-xl text-white/40">The auctioneer is selecting...</p>
        </motion.div>
    );
}

// Team Leaderboard Card
function TeamCard({ team, rank }: { team: Team; rank: number }) {
    const budgetPercent = (team.budgetRemaining / team.totalBudget) * 100;

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: rank * 0.1 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl font-black text-white/30">#{rank}</div>
                <div className="text-3xl">{team.logo}</div>
                <div className="flex-1">
                    <div className="font-bold text-white text-lg">{team.shortName}</div>
                    <div className="text-white/50 text-sm">{team.squadCount} players</div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-green-400">₹{team.budgetRemaining}</div>
                    <div className="text-white/40 text-xs">CR left</div>
                </div>
            </div>
            {/* Budget bar */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${budgetPercent}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                />
            </div>
        </motion.div>
    );
}

export default function BigScreenPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSoldAnimation, setShowSoldAnimation] = useState(false);

    const triggerConfetti = useCallback(() => {
        import('canvas-confetti').then((confetti) => {
            const duration = 4000;
            const end = Date.now() + duration;
            const colors = ['#ffd700', '#00d9ff', '#b537f2', '#00ff88', '#ff6b35'];

            (function frame() {
                confetti.default({
                    particleCount: 5,
                    angle: 60,
                    spread: 70,
                    origin: { x: 0, y: 0.7 },
                    colors: colors
                });
                confetti.default({
                    particleCount: 5,
                    angle: 120,
                    spread: 70,
                    origin: { x: 1, y: 0.7 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        });
    }, []);

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
            if (auctionState?.status === 'BIDDING' && newState.status === 'SOLD') {
                setShowSoldAnimation(true);
                triggerConfetti();
                setTimeout(() => setShowSoldAnimation(false), 3000);
            }
            setAuctionState(newState);
        });

        // Refresh teams
        const teamsInterval = setInterval(async () => {
            const teamsData = await getAllTeams();
            setTeams(teamsData);
        }, 2000);

        return () => {
            unsubscribe();
            clearInterval(teamsInterval);
        };
    }, [auctionState?.status, triggerConfetti]);

    if (loading || !auctionState) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-8xl"
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

            {/* SOLD Animation Overlay */}
            <AnimatePresence>
                {showSoldAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 20 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="text-[12rem] font-black text-yellow-400 drop-shadow-[0_0_60px_rgba(255,215,0,0.8)] glitch"
                        >
                            SOLD! 🎉
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-screen h-screen p-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="big-screen-title gradient-text-animated">
                                IPL AUCTION 2026
                            </h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                            >
                                <span className="text-white/70 text-xl mr-3">Day</span>
                                <span className="text-3xl font-black text-white">{auctionState.auctionDay}</span>
                            </motion.div>

                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex items-center gap-3 px-6 py-3 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/50"
                            >
                                <div className="w-4 h-4 bg-red-500 rounded-full status-pulse" />
                                <span className="text-2xl font-black text-red-400">LIVE</span>
                            </motion.div>

                            {/* Status Badge */}
                            <motion.div
                                key={auctionState.status}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`px-6 py-3 rounded-full font-black text-xl ${auctionState.status === 'BIDDING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                                        auctionState.status === 'SOLD' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                            'bg-white/10 text-white/60 border border-white/20'
                                    }`}
                            >
                                {auctionState.status}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-4 gap-6 h-[calc(100%-160px)]">
                    {/* Player Card - 3 columns */}
                    <div className="col-span-3">
                        <AnimatePresence mode="wait">
                            {auctionState.currentPlayer ? (
                                <PremiumPlayerCard
                                    key={auctionState.currentPlayer.rank}
                                    player={auctionState.currentPlayer}
                                />
                            ) : (
                                <WaitingState key="waiting" />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Leaderboard - 1 column */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-4 overflow-y-auto"
                    >
                        <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                            🏆 Leaderboard
                        </h3>
                        <div className="space-y-3">
                            {sortedTeams.slice(0, 6).map((team, index) => (
                                <TeamCard key={team.id} team={team} rank={index + 1} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer Stats */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-6 left-8 right-8"
                >
                    <div className="flex items-center justify-between px-8 py-5 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
                        <div className="flex items-center gap-12">
                            <div className="text-center">
                                <div className="text-white/50 text-sm">TEAMS</div>
                                <div className="text-3xl font-black text-white count-up">{teams.length}</div>
                            </div>
                            <div className="w-px h-10 bg-white/20" />
                            <div className="text-center">
                                <div className="text-white/50 text-sm">PLAYERS SOLD</div>
                                <div className="text-3xl font-black text-green-400 count-up">
                                    {teams.reduce((sum, t) => sum + t.squadCount, 0)}
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/20" />
                            <div className="text-center">
                                <div className="text-white/50 text-sm">TOTAL SPENT</div>
                                <div className="text-3xl font-black text-yellow-400">
                                    ₹<AnimatedNumber value={teams.reduce((sum, t) => sum + t.budgetUsed, 0)} suffix=" CR" />
                                </div>
                            </div>
                        </div>

                        {/* Marquee of team names */}
                        <div className="flex-1 mx-12 overflow-hidden">
                            <div className="marquee whitespace-nowrap">
                                {[...teams, ...teams].map((team, i) => (
                                    <span key={i} className="inline-flex items-center gap-2 mx-6 text-white/50">
                                        <span className="text-xl">{team.logo}</span>
                                        <span>{team.shortName}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
