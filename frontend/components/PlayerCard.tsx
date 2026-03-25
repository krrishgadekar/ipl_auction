"use client";

import { Player } from '@/lib/mockData/players';
import { motion } from 'framer-motion';

interface PlayerCardProps {
    player: Player;
    currentBid?: number;
    isRiddle?: boolean;
    showReveal?: boolean;
}

export default function PlayerCard({ player, currentBid = 0, isRiddle = false, showReveal = false }: PlayerCardProps) {
    // Determine which sub-ratings to show based on pool
    const getSubRatings = () => {
        const exp = { label: 'Experience', value: player.sub_experience || 0, color: '#00ff88' };
        const rat = { label: 'Overall Rating', value: player.rating || 0, color: '#ffffff' };

        if (player.pool === 'BAT_WK') {
            return [
                { label: 'Scoring', value: player.sub_scoring || 0, color: '#00d9ff' },
                { label: 'Impact', value: player.sub_impact || 0, color: '#b537f2' },
                { label: 'Consistency', value: player.sub_consistency || 0, color: '#ffd700' },
                exp,
                rat
            ];
        } else if (player.pool === 'BOWL') {
            return [
                { label: 'Wicket Taking', value: player.sub_wicket_taking || 0, color: '#00d9ff' },
                { label: 'Economy', value: player.sub_economy || 0, color: '#b537f2' },
                { label: 'Efficiency', value: player.sub_efficiency || 0, color: '#ffd700' },
                exp,
                rat
            ];
        } else if (player.pool === 'AR') {
            return [
                { label: 'Batting', value: player.sub_batting || 0, color: '#00d9ff' },
                { label: 'Bowling', value: player.sub_bowling || 0, color: '#b537f2' },
                { label: 'Versatility', value: player.sub_versatility || 0, color: '#ffd700' },
                exp,
                rat
            ];
        }
        return [];
    };

    const gradeColors = {
        A: 'from-green-500 to-emerald-600',
        B: 'from-blue-500 to-indigo-600',
        C: 'from-yellow-500 to-orange-500',
        D: 'from-red-500 to-rose-600',
    };

    const poolBadgeColors = {
        BAT_WK: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        BOWL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        AR: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 max-w-4xl mx-auto"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Player Image & Basic Info */}
                <div className="lg:col-span-1 flex flex-col items-center">
                    {/* Player Image Placeholder */}
                    <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-accent-neon-blue/20 to-accent-purple/20 border-2 border-white/10 flex items-center justify-center mb-4">
                        {isRiddle && !showReveal ? (
                            <div className="text-6xl">❓</div>
                        ) : (
                            <div className="text-7xl font-bold gradient-text">
                                {player.player.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Player Name or Riddle */}
                    <h2 className="text-3xl font-bold mb-2 text-center">
                        {isRiddle && !showReveal ? (
                            <span className="text-yellow-400">🧩 Mystery Player</span>
                        ) : (
                            player.player
                        )}
                    </h2>

                    {/* Team & Role */}
                    {!isRiddle || showReveal ? (
                        <div className="text-center mb-4">
                            <p className="text-lg text-text-secondary">{player.team}</p>
                            <p className="text-sm text-text-secondary">{player.role}</p>
                        </div>
                    ) : null}

                    {/* Pool Badge */}
                    <div className={`px-4 py-2 rounded-full border ${poolBadgeColors[player.pool]} font-semibold mb-4`}>
                        {player.pool === 'BAT_WK' ? 'Batsman/WK' : player.pool === 'BOWL' ? 'Bowler' : 'All-Rounder'}
                    </div>

                    {/* Base Price */}
                    <div className="glass-card px-6 py-3 mb-2">
                        <p className="text-sm text-text-secondary">Base Price</p>
                        <p className="text-2xl font-bold gradient-text">₹2 CR</p>
                    </div>

                    {/* Current Bid */}
                    {currentBid > 0 && (
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="glass-card px-6 py-3 neon-glow-blue"
                        >
                            <p className="text-sm text-text-secondary">Current Bid</p>
                            <p className="text-3xl font-bold text-accent-neon-blue">₹{currentBid} CR</p>
                        </motion.div>
                    )}
                </div>

                {/* Right: Ratings & Stats */}
                <div className="lg:col-span-2">
                    {/* Primary Rating & Grade */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">Overall Rating</p>
                            <div className="flex items-center gap-4">
                                <span className="text-6xl font-black gradient-text">{player.rating}</span>
                                <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${gradeColors[player.grade]} text-white font-bold text-2xl`}>
                                    {player.grade}
                                </div>
                            </div>
                        </div>

                        {/* Legacy Badge */}
                        <div className="text-center">
                            <p className="text-sm text-text-secondary mb-1">Legacy</p>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-yellow-600 flex items-center justify-center border-4 border-white/20">
                                <span className="text-3xl font-bold text-white">{player.legacy}</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-6">
                        <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
                            {player.category}
                        </span>
                    </div>

                    {/* Sub-Ratings (Pool-Based) */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">Performance Attributes</h3>
                        {getSubRatings().map((stat, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-semibold" style={{ color: stat.color }}>
                                        {stat.label}
                                    </span>
                                    <span className="text-sm font-bold">{stat.value}</span>
                                </div>
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.value}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(to right, ${stat.color}, ${stat.color}dd)`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Rank Badge */}
                    <div className="mt-6 text-right">
                        <span className="text-sm text-text-secondary">
                            Rank: <span className="font-bold text-white">#{player.rank}</span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
