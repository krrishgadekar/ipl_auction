// All Teams Overview Page - PREMIUM PLEY-STYLE
// Full detailed view of all teams in the auction
// Click on any team for expanded details

'use client';

import { useEffect, useState, useRef } from 'react';
import { Team } from '@/lib/mockData/teams';
import { Player } from '@/lib/mockData/players';
import { getAllTeams } from '@/lib/api/teams';
import { getAllPlayers } from '@/lib/api/players';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
function TeamDetailCard({ team, allPlayers, index, isExpanded, onToggle }: {
    team: Team;
    allPlayers: Player[];
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const teamPlayers = allPlayers.filter(p => team.players.includes(p.rank));
    const budgetPercent = (team.budgetRemaining / team.totalBudget) * 100;

    // Group players by category
    const playersByCategory = teamPlayers.reduce((acc, p) => {
        if (!acc[p.category]) acc[p.category] = [];
        acc[p.category].push(p);
        return acc;
    }, {} as Record<string, Player[]>);

    // Grade distribution
    const gradeCount = teamPlayers.reduce((acc, p) => {
        acc[p.grade] = (acc[p.grade] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || isExpanded) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 8, y: -x * 8 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    const categoryColors: Record<string, string> = {
        Batsmen: 'from-blue-500 to-cyan-500',
        Bowlers: 'from-purple-500 to-pink-500',
        'All-rounders': 'from-orange-500 to-yellow-500',
        Wicketkeepers: 'from-green-500 to-emerald-500',
    };

    const gradeColors: Record<string, string> = {
        A: 'text-yellow-400 bg-yellow-500/20',
        B: 'text-purple-400 bg-purple-500/20',
        C: 'text-cyan-400 bg-cyan-500/20',
        D: 'text-slate-400 bg-slate-500/20',
    };

    return (
        <motion.div
            ref={cardRef}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: isExpanded ? 'none' : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
            className={`
                rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
                ${isExpanded
                    ? 'col-span-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(0,217,255,0.3)]'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }
            `}
            onClick={onToggle}
        >
            {/* Header */}
            <div className={`p-6 ${isExpanded ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-white/10' : ''}`}>
                <div className="flex items-center gap-4">
                    <motion.div
                        className={`text-5xl ${isExpanded ? 'floating' : ''}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        {team.logo}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-black text-white truncate ${isExpanded ? 'text-3xl gradient-text-animated' : 'text-xl'}`}>
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
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className="text-2xl text-white/30"
                        >
                            ▼
                        </motion.div>
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

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 border-t border-white/10"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Total Budget', value: `₹${team.totalBudget} CR`, color: 'text-white', icon: '💰' },
                                { label: 'Squad Size', value: `${team.squadCount}/${team.squadLimit}`, color: 'text-cyan-400', icon: '👥' },
                                { label: 'Avg. Cost', value: team.squadCount > 0 ? `₹${(team.budgetUsed / team.squadCount).toFixed(1)} CR` : '—', color: 'text-yellow-400', icon: '📊' },
                                { label: 'Slots Left', value: team.squadLimit - team.squadCount, color: 'text-purple-400', icon: '📋' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 bg-black/30 rounded-xl border border-white/10 text-center"
                                >
                                    <div className="text-2xl mb-1">{stat.icon}</div>
                                    <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                                    <div className="text-xs text-white/40">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Grade Distribution */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
                                Grade Distribution
                            </h4>
                            <div className="flex gap-3">
                                {['A', 'B', 'C', 'D'].map(grade => (
                                    <div
                                        key={grade}
                                        className={`flex-1 p-3 rounded-xl text-center ${gradeColors[grade]} border border-white/10`}
                                    >
                                        <div className="text-2xl font-black">{gradeCount[grade] || 0}</div>
                                        <div className="text-xs">Grade {grade}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Players by Category */}
                        {teamPlayers.length > 0 ? (
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">
                                    Squad Composition
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(playersByCategory).map(([category, players]) => (
                                        <div
                                            key={category}
                                            className="p-4 bg-black/20 rounded-xl border border-white/10"
                                        >
                                            <div className={`text-lg font-bold bg-gradient-to-r ${categoryColors[category]} bg-clip-text text-transparent mb-2`}>
                                                {category}
                                            </div>
                                            <div className="space-y-1">
                                                {players.map(player => (
                                                    <div key={player.rank} className="flex items-center gap-2 text-sm">
                                                        <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${gradeColors[player.grade]}`}>
                                                            {player.grade}
                                                        </span>
                                                        <span className="text-white/70 truncate">{player.player}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-white/40">
                                <div className="text-3xl mb-2">🏏</div>
                                <div>No players acquired yet</div>
                            </div>
                        )}

                        {/* Power Cards Status */}
                        <div className="mt-6">
                            <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
                                Power Cards
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(team.powerCards).map(([key, card]) => (
                                    <div
                                        key={key}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${card.used
                                                ? 'bg-red-500/20 text-red-400 border-red-500/30 line-through'
                                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                                            }`}
                                    >
                                        {card.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.div className="mt-6 flex justify-center">
                            <Link
                                href={`/team/${team.id}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/30"
                                >
                                    View Full Dashboard →
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function AllTeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'budget' | 'squad' | 'name'>('budget');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [teamsData, playersData] = await Promise.all([
                    getAllTeams(),
                    getAllPlayers(),
                ]);
                setTeams(teamsData);
                setAllPlayers(playersData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading teams:', error);
                setLoading(false);
            }
        };

        loadData();

        // Poll for updates
        const interval = setInterval(async () => {
            const [teamsData, playersData] = await Promise.all([
                getAllTeams(),
                getAllPlayers(),
            ]);
            setTeams(teamsData);
            setAllPlayers(playersData);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
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
                        <span className="text-white/40 text-sm ml-2">Click any team to expand</span>
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
                            allPlayers={allPlayers}
                            index={index}
                            isExpanded={expandedTeam === team.id}
                            onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
