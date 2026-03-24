// All Teams Overview Page - PREMIUM PLEY-STYLE
// Full detailed view of all teams in the auction
// Click on any team for expanded details

'use client';

import { useEffect, useState, useRef } from 'react';
import { Team } from '@/lib/api/teams';
import { getAllTeams } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { useAuctionSocket } from '@/lib/hooks/useAuctionSocket';
import TeamAvatar from '@/components/team/TeamAvatar';

// Floating Particles
function FloatingParticles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
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
                        opacity: Math.random() * 0.4 + 0.1,
                    }}
                />
            ))}
        </div>
    );
}

// Detailed Team Card
function TeamDetailCard({ team, index }: {
    team: Team;
    index: number;
}) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const budgetPercent = (team.budgetRemaining / team.totalBudget) * 100;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 8, y: -x * 8 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <Link href={`/team/${team.id}`}>
            <motion.div
                ref={cardRef}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
            >
                {/* Header */}
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <TeamAvatar team={team} size={64} className="shadow-2xl" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-white text-xl truncate">
                                {team.name}
                            </h3>
                            <p className="text-white/50 text-sm">{team.shortName}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-black text-green-400">₹{team.budgetRemaining}</div>
                                <div className="text-[10px] text-white/40">CR REMAINING</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-cyan-400">{team.squadCount}</div>
                                <div className="text-[10px] text-white/40">PLAYERS</div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Progress Bar */}
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${budgetPercent}%` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                        />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-white/40">
                        <span>₹{team.budgetUsed} CR spent</span>
                        <span>{budgetPercent.toFixed(0)}% remaining</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export default function AllTeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'budget' | 'squad' | 'name'>('budget');
    
    const { on, requestState } = useAuctionSocket();

    useEffect(() => {
        const loadData = async () => {
            try {
                const teamsData = await getAllTeams();
                setTeams(teamsData);
                setLoading(false);
                requestState();
            } catch (error) {
                console.error('Error loading teams:', error);
                setLoading(false);
            }
        };

        loadData();
    }, [requestState]);

    useEffect(() => {
        const unbindStateSync = on('STATE_SYNC', (data: any) => {
            if (data && data.teams) {
                setTeams(data.teams);
            }
        });
        return () => {
            unbindStateSync();
        };
    }, [on]);

    if (loading) return <Loader />;

    // Sort teams
    const sortedTeams = [...teams].sort((a, b) => {
        if (sortBy === 'budget') return b.budgetRemaining - a.budgetRemaining;
        if (sortBy === 'squad') return b.squadCount - a.squadCount;
        return a.name.localeCompare(b.name);
    });

    // Overall stats
    const totalSpent = teams.reduce((sum, t) => sum + t.budgetUsed, 0);
    const totalPlayers = teams.reduce((sum, t) => sum + t.squadCount, 0);
    const avgSpend = totalPlayers > 0 ? totalSpent / totalPlayers : 0;

    return (
        <div className="min-h-screen animated-gradient-bg overflow-auto">
            <FloatingParticles />

            {/* Header */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="text-4xl">🏆</div>
                            <div>
                                <h1 className="text-2xl font-black gradient-text-animated">All Teams Overview</h1>
                                <p className="text-white/50 text-sm">Complete auction standings and details</p>
                            </div>
                        </motion.div>
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full"
                            >
                                <div className="w-2 h-2 bg-red-500 rounded-full status-pulse" />
                                <span className="font-bold text-red-400 text-sm">LIVE</span>
                            </motion.div>
                            <Link href="/" className="btn-secondary text-sm">← Home</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 relative z-10">
                {/* Overall Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Total Teams', value: teams.length, color: 'text-white', icon: '🏆' },
                        { label: 'Total Spent', value: `₹${totalSpent.toFixed(1)} CR`, color: 'text-yellow-400', icon: '💰' },
                        { label: 'Players Sold', value: totalPlayers, color: 'text-green-400', icon: '👥' },
                        { label: 'Avg. Player Cost', value: `₹${avgSpend.toFixed(1)} CR`, color: 'text-cyan-400', icon: '📊' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-5 text-center"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="text-white/50 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Sort Controls */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between mb-6"
                >
                    <h2 className="text-xl font-bold text-white">
                        Teams Leaderboard
                        
                    </h2>
                    <div className="flex gap-2">
                        {[
                            { key: 'budget', label: '💰 Budget' },
                            { key: 'squad', label: '👥 Squad' },
                            { key: 'name', label: '📝 Name' },
                        ].map(sort => (
                            <button
                                key={sort.key}
                                onClick={() => setSortBy(sort.key as typeof sortBy)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === sort.key
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                                    }`}
                            >
                                {sort.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {sortedTeams.map((team, index) => (
                        <TeamDetailCard
                            key={team.id}
                            team={team}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
