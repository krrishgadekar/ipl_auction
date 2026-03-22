// Large Player Card for Big Screen Display
// Optimized for 1920×1080 projector display

'use client';

import { type Player } from '@/lib/api/players';
import SubRatingsDisplay from '../SubRatingsDisplay';
import { motion } from 'framer-motion';

interface PlayerCardLargeProps {
    player: Player;
}

export default function PlayerCardLarge({ player }: PlayerCardLargeProps) {
    // Get grade color
    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return '#ffd700'; // Gold
            case 'B': return '#c0c0c0'; // Silver
            case 'C': return '#cd7f32'; // Bronze
            case 'D': return '#64748b'; // Gray
            default: return '#ffffff';
        }
    };

    // Get pool badge color
    const getPoolColor = (pool: string) => {
        switch (pool) {
            case 'BAT_WK': return '#00d4ff';
            case 'BOWL': return '#ff00e5';
            case 'AR': return '#ffd700';
            default: return '#ffffff';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full"
        >
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-8">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {/* Player Name */}
                            <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
                                {player.player}
                            </h1>

                            {/* Previous Team */}
                            <p className="text-2xl text-white/60 font-medium">
                                {player.team}
                            </p>

                            {/* Role & Category */}
                            <div className="flex items-center gap-3 mt-4">
                                <span className="px-4 py-2 bg-white/10 rounded-full text-white/90 text-lg font-medium">
                                    {player.role}
                                </span>
                                <span
                                    className="px-4 py-2 rounded-full text-white font-bold text-lg"
                                    style={{
                                        backgroundColor: `${getPoolColor(player.pool)}30`,
                                        border: `2px solid ${getPoolColor(player.pool)}`,
                                        boxShadow: `0 0 20px ${getPoolColor(player.pool)}50`
                                    }}
                                >
                                    {player.pool}
                                </span>
                            </div>
                        </div>

                        {/* Rating Circle */}
                        <div className="flex flex-col items-center gap-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="relative w-40 h-40 flex items-center justify-center"
                            >
                                {/* Outer Ring */}
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(${getGradeColor(player.grade)} ${player.rating}%, transparent ${player.rating}%)`,
                                        filter: 'blur(8px)',
                                        opacity: 0.6
                                    }}
                                />

                                {/* Inner Circle */}
                                <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 flex flex-col items-center justify-center"
                                    style={{ borderColor: getGradeColor(player.grade) }}>
                                    <span className="text-5xl font-black text-white">{player.rating}</span>
                                    <span
                                        className="text-3xl font-bold"
                                        style={{ color: getGradeColor(player.grade) }}
                                    >
                                        {player.grade}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Legacy */}
                            <div className="flex items-center gap-2">
                                <span className="text-white/60 text-lg">Legacy</span>
                                <span className="text-2xl font-bold text-yellow-400">{player.legacy}</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Sub-Ratings */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Performance Attributes</h3>
                        <SubRatingsDisplay player={player} animate={true} />
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-500/10 to-yellow-500/10 rounded-full blur-3xl -z-10" />
            </div>
        </motion.div>
    );
}
