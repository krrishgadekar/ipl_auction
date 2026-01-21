"use client";

import { useEffect, useState } from 'react';
import { useAuctionStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCard from '@/components/PlayerCard';

export default function BigScreenDisplay() {
    const { auction, teams, currentPlayer, fetchAuction, fetchTeams, refreshCurrentPlayer } = useAuctionStore();
    const [auctionId, setAuctionId] = useState(1);

    useEffect(() => {
        // Initial fetch
        fetchAuction(auctionId);
        fetchTeams(auctionId);

        // Poll for updates every 2 seconds
        const interval = setInterval(() => {
            fetchAuction(auctionId);
            fetchTeams(auctionId);
        }, 2000);

        return () => clearInterval(interval);
    }, [auctionId]);

    useEffect(() => {
        if (auction?.current_player_id) {
            refreshCurrentPlayer();
        }
    }, [auction?.current_player_id]);

    // Sort teams by budget spent (descending) for leaderboard
    const sortedTeams = [...teams].sort((a, b) => b.budget_spent - a.budget_spent);

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="gradient-text text-6xl lg:text-8xl mb-4">IPL AUCTION {new Date().getFullYear()}</h1>
                <div className="flex justify-center gap-8 text-xl">
                    <span className="px-6 py-2 glass-card">
                        Day {auction?.day || 1}
                    </span>
                    <span className={`px-6 py-2 glass-card ${auction?.status === 'active' ? 'neon-glow-blue text-accent-neon-blue' : ''
                        }`}>
                        {auction?.status?.toUpperCase() || 'IDLE'}
                    </span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Left: Current Player (Large) */}
                <div className="xl:col-span-3">
                    <AnimatePresence mode="wait">
                        {currentPlayer ? (
                            <PlayerCard
                                key={currentPlayer.id}
                                player={currentPlayer}
                                currentBid={auction?.current_bid_amount || 0}
                                isRiddle={currentPlayer.is_riddle}
                            />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-card p-16 text-center"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="text-9xl mb-6"
                                >
                                    🏏
                                </motion.div>
                                <h2 className="text-4xl font-bold mb-4">Waiting for next player...</h2>
                                <p className="text-xl text-text-secondary">The auction will resume shortly</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Current Bidding Team */}
                    {auction?.current_bidding_team_id && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 glass-card p-6 neon-glow-purple text-center"
                        >
                            <p className="text-sm text-text-secondary mb-2">CURRENT BIDDER</p>
                            <p className="text-3xl font-bold">
                                {teams.find(t => t.id === auction.current_bidding_team_id)?.name || 'Unknown Team'}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Right: Leaderboard */}
                <div className="xl:col-span-1">
                    <div className="glass-card p-6 sticky top-6">
                        <h3 className="text-2xl font-bold mb-6 gradient-text">🏆 Leaderboard</h3>

                        <div className="space-y-4">
                            {sortedTeams.map((team, index) => (
                                <motion.div
                                    key={team.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-4 rounded-xl ${index === 0
                                            ? 'bg-gradient-to-r from-gold-500/20 to-yellow-500/20 border-2 border-gold-400'
                                            : index === 1
                                                ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400'
                                                : index === 2
                                                    ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border border-orange-500'
                                                    : 'bg-white/5 border border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                            </span>
                                            <div>
                                                <p className="font-bold">{team.name}</p>
                                                <p className="text-xs text-text-secondary">
                                                    {team.squad_count} players
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                                        <div className="text-center p-2 rounded bg-white/5">
                                            <p className="text-xs text-text-secondary">Spent</p>
                                            <p className="font-bold text-red-400">₹{team.budget_spent}</p>
                                        </div>
                                        <div className="text-center p-2 rounded bg-white/5">
                                            <p className="text-xs text-text-secondary">Left</p>
                                            <p className="font-bold text-green-400">₹{team.budget_remaining}</p>
                                        </div>
                                    </div>

                                    {/* Budget Bar */}
                                    <div className="mt-3">
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(team.budget_spent / 100) * 100}%` }}
                                                transition={{ duration: 1 }}
                                                className="h-full bg-gradient-to-r from-accent-neon-blue to-accent-purple rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* RTM Status */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-sm font-semibold mb-3">RTM Cards</p>
                            <div className="space-y-2">
                                {teams.map((team) => (
                                    <div key={team.id} className="flex justify-between text-sm">
                                        <span className="text-text-secondary">{team.name}</span>
                                        <span className={team.rtm_used ? 'text-red-400' : 'text-green-400'}>
                                            {team.rtm_used ? '❌ Used' : '✅ Available'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-text-secondary mb-1">Total Teams</p>
                    <p className="text-3xl font-bold gradient-text">{teams.length}</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-text-secondary mb-1">Players Sold</p>
                    <p className="text-3xl font-bold text-green-400">
                        {teams.reduce((acc, team) => acc + team.squad_count, 0)}
                    </p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-text-secondary mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-red-400">
                        ₹{teams.reduce((acc, team) => acc + team.budget_spent, 0)} CR
                    </p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-text-secondary mb-1">Avg Squad</p>
                    <p className="text-3xl font-bold text-blue-400">
                        {teams.length > 0
                            ? Math.round(teams.reduce((acc, team) => acc + team.squad_count, 0) / teams.length)
                            : 0}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
