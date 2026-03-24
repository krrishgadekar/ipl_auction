// Super Admin Page
// Configuration interface for managing teams and auction settings

'use client';

import { useEffect, useState } from 'react';
import { type Team } from '@/lib/api/teams';
import { getAllTeams } from '@/lib/api/teams';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import TeamAvatar from '@/components/team/TeamAvatar';

export default function SuperAdminPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                const teamsData = await getAllTeams();
                setTeams(teamsData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading teams:', error);
                toast.error('Failed to load teams');
                setLoading(false);
            }
        };

        loadTeams();

        // Refresh teams periodically
        const interval = setInterval(async () => {
            const teamsData = await getAllTeams();
            setTeams(teamsData);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleResetAuction = () => {
        const confirmed = window.confirm(
            '⚠️ WARNING: Reset Entire Auction?\n\nThis will:\n- Clear all bids\n- Reset all budgets to ₹100 CR\n- Reset all squad counts to 0\n- Reset all power cards\n- Move to first player\n\nThis action CANNOT be undone!'
        );

        if (confirmed) {
            // TODO: Implement reset logic
            toast.success('Auction reset successfully!');
        }
    };

    if (loading) return <Loader text="LOADING" />;

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
                            <h1 className="text-4xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                                SUPER ADMIN
                            </h1>
                            <p className="text-white/70">Auction Configuration & Management</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
                            >
                                ← Back to Home
                            </Link>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="font-bold text-red-400">ADMIN MODE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Auction Controls */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Auction Controls</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={handleResetAuction}
                            className="p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-white font-bold transition-all"
                        >
                            🔄 Reset Auction
                        </button>
                        <button
                            onClick={() => toast.info('Pause/Resume coming soon!')}
                            className="p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-xl text-white font-bold transition-all"
                        >
                            ⏸️ Pause Auction
                        </button>
                        <button
                            onClick={() => toast.info('Export data coming soon!')}
                            className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-xl text-white font-bold transition-all"
                        >
                            💾 Export Data
                        </button>
                    </div>
                </motion.div>

                {/* Team Management Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                        >
                            {/* Team Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="mr-4">
                                    <TeamAvatar team={team} size={12} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg">{team.name}</h3>
                                    <p className="text-white/60 text-sm">{team.shortName}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-3 mb-4">
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <div className="text-white/60 text-sm">Budget Remaining</div>
                                    <div className="text-2xl font-bold text-green-400">₹{team.budgetRemaining} CR</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <div className="text-white/60 text-sm">Squad ({team.squadCount}/{team.squadLimit})</div>
                                    <div className="text-2xl font-bold text-cyan-400">{team.players.length} Players</div>
                                </div>
                            </div>

                            {/* Power Cards */}
                            <div className="mb-4">
                                <div className="text-white/60 text-sm mb-2">Power Cards</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { card: team.powerCards?.['finalStrike'], icon: '⚡' },
                                        { card: team.powerCards?.['bidFreezer'], icon: '❄️' },
                                        { card: team.powerCards?.['godsEye'], icon: '👁️' },
                                        { card: team.powerCards?.['mulligan'], icon: '🔄' },
                                    ].slice(0, 3).map((item, i) => (
                                        <div
                                            key={i}
                                            className={`p-2 rounded-lg text-center ${item.card?.used
                                                ? 'bg-red-500/20 text-red-400'
                                                : item.card?.available
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-white/5 text-white/40'
                                                }`}
                                        >
                                            {item.icon}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <Link
                                    href={`/team/${team.id}`}
                                    className="block w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-xl text-cyan-400 font-bold text-center transition-all"
                                >
                                    View Team Dashboard
                                </Link>
                                <button
                                    onClick={() => toast.info(`Managing ${team.name} - Coming soon!`)}
                                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold transition-all"
                                >
                                    Edit Team
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl"
                >
                    <div className="text-sm text-blue-400">
                        <strong>ℹ️ Info:</strong> This is the Super Admin interface for configuring teams and managing the auction. Use with caution as changes here affect the entire auction.
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
