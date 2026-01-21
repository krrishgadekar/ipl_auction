"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTeamStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function TeamDashboard() {
    const params = useParams();
    const teamId = parseInt(params.id as string);
    const { team, squad, powerCards, fetchTeamData } = useTeamStore();

    useEffect(() => {
        fetchTeamData(teamId);

        // Poll for updates every 3 seconds
        const interval = setInterval(() => {
            fetchTeamData(teamId);
        }, 3000);

        return () => clearInterval(interval);
    }, [teamId]);

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-12 text-center">
                    <div className="spinner mx-auto mb-4" />
                    <p className="text-text-secondary">Loading team data...</p>
                </div>
            </div>
        );
    }

    const budgetPercentage = (team.budget_spent / team.budget_total) * 100;

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Team Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="gradient-text mb-2">{team.name}</h1>
                    <p className="text-xl text-text-secondary">{team.franchise}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Budget Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-sm font-semibold text-text-secondary mb-4">💰 Budget</h3>
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-sm text-text-secondary">Remaining</p>
                                <p className="text-4xl font-bold text-green-400">₹{team.budget_remaining}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-text-secondary">Spent</p>
                                <p className="text-2xl font-bold text-red-400">₹{team.budget_spent}</p>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${budgetPercentage}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-red-500 to-orange-600 rounded-full"
                            />
                        </div>
                        <p className="text-xs text-text-secondary mt-2 text-center">
                            {budgetPercentage.toFixed(1)}% used
                        </p>
                    </motion.div>

                    {/* Squad Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-sm font-semibold text-text-secondary mb-4">👥 Squad</h3>
                        <div className="text-center">
                            <p className="text-6xl font-bold gradient-text mb-2">{team.squad_count}</p>
                            <p className="text-text-secondary">/ 18 Players</p>
                        </div>
                        <div className="mt-4 flex justify-around text-sm">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-400">{Math.max(0, 11 - team.squad_count)}</p>
                                <p className="text-text-secondary text-xs">More needed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-400">{Math.max(0, 18 - team.squad_count)}</p>
                                <p className="text-text-secondary text-xs">Slots left</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RTM Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-sm font-semibold text-text-secondary mb-4">🎯 RTM Card</h3>
                        <div className="text-center">
                            {team.rtm_available && !team.rtm_used ? (
                                <div>
                                    <div className="text-6xl mb-4">✅</div>
                                    <p className="text-2xl font-bold text-green-400">Available</p>
                                    <p className="text-sm text-text-secondary mt-2">
                                        Can be used on {team.franchise} players
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-6xl mb-4">❌</div>
                                    <p className="text-2xl font-bold text-red-400">Used</p>
                                    <p className="text-sm text-text-secondary mt-2">
                                        RTM card has been utilized
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Power Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 mb-8"
                >
                    <h3 className="text-2xl font-bold mb-6">⚡ Power Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {powerCards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={`p-4 rounded-xl border-2 ${card.used
                                        ? 'bg-red-500/10 border-red-500/30 opacity-60'
                                        : 'bg-gradient-to-br from-accent-neon-blue/10 to-accent-purple/10 border-accent-neon-blue/30'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold">{card.card_name}</h4>
                                    <span className={`text-2xl ${card.used ? 'grayscale' : ''}`}>
                                        {card.card_type === 'final_strike' ? '⚡' :
                                            card.card_type === 'bid_freezer' ? '❄️' :
                                                card.card_type === 'gods_eye' ? '👁️' : '🔄'}
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary mb-2">₹{card.price} Crores</p>
                                <div className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${card.used
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-green-500/20 text-green-400'
                                    }`}>
                                    {card.used ? 'Used' : 'Available'}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Squad List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-2xl font-bold mb-6">🏏 Current Squad</h3>

                    {squad.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-xl text-text-secondary">No players purchased yet</p>
                            <p className="text-sm text-text-secondary mt-2">Your squad will appear here once you start bidding</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {squad.map((squadPlayer, index) => (
                                <motion.div
                                    key={squadPlayer.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.05 }}
                                    className="glass-card-hover p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold">{squadPlayer.player?.name || `Player #${squadPlayer.player_rank}`}</p>
                                            <p className="text-xs text-text-secondary">{squadPlayer.player?.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-accent-gold">₹{squadPlayer.purchase_price}</p>
                                            {squadPlayer.is_captain && <span className="text-xs">👑 C</span>}
                                            {squadPlayer.is_vice_captain && <span className="text-xs">⭐ VC</span>}
                                        </div>
                                    </div>

                                    {squadPlayer.player && (
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-accent-neon-blue to-accent-purple rounded-full"
                                                    style={{ width: `${squadPlayer.player.rating}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold">{squadPlayer.player.rating}</span>
                                        </div>
                                    )}

                                    {squadPlayer.is_final_xi && (
                                        <div className="mt-2">
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold">
                                                Final XI
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
