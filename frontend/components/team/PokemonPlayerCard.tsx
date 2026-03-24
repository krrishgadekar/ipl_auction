// Pokemon-Style Player Card Component
// Legendary UI for Grade A, Rare for B, Uncommon for C, Common for D

'use client';

import { Player } from '@/lib/mockData/players';
import { motion } from 'framer-motion';

interface PokemonPlayerCardProps {
    player: Player;
    showPrice?: boolean;
    price?: number;
    size?: 'sm' | 'md' | 'lg';
    isRiddle?: boolean;
    riddleClue?: { id: number; title: string; question: string } | null;
}

export default function PokemonPlayerCard({
    player,
    showPrice = false,
    price,
    size = 'md',
    isRiddle = false,
    riddleClue = null
}: PokemonPlayerCardProps) {
    // Card styles based on grade (Pokemon rarity system)
    const getCardStyles = () => {
        if (isRiddle) {
            return {
                wrapper: 'riddle-card',
                border: 'border-2 border-[rgba(212,175,55,0.6)]',
                background: 'bg-gradient-to-br from-[#1a1a1a] via-[#2d2410] to-[#1a1a1a]',
                glow: 'shadow-[0_0_20px_rgba(212,175,55,0.3)]',
                headerBg: 'bg-gradient-to-r from-[#d4af37] via-[#f5d569] to-[#d4af37]',
                headerText: 'text-black',
                ratingBg: 'bg-gradient-to-br from-[#333] to-[#111]',
                ratingText: 'text-[#d4af37]',
                badge: '🧩 RIDDLE',
                badgeColor: 'bg-[#d4af37] text-black',
                shimmer: true,
                holoEffect: false,
            };
        }

        switch (player.grade) {
            case 'A': // LEGENDARY - Gold/Rainbow holographic
                return {
                    wrapper: 'legendary-card',
                    border: 'border-2 border-yellow-400',
                    background: 'bg-gradient-to-br from-yellow-900/40 via-amber-800/30 to-yellow-900/40',
                    glow: 'shadow-[0_0_30px_rgba(255,215,0,0.5),0_0_60px_rgba(255,215,0,0.3)]',
                    headerBg: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500',
                    headerText: 'text-black',
                    ratingBg: 'bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-500',
                    ratingText: 'text-black',
                    badge: '✨ LEGENDARY',
                    badgeColor: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black',
                    shimmer: true,
                    holoEffect: true,
                };
            case 'B': // RARE - Purple/Blue
                return {
                    wrapper: 'rare-card',
                    border: 'border-2 border-purple-400',
                    background: 'bg-gradient-to-br from-purple-900/40 via-indigo-800/30 to-purple-900/40',
                    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
                    headerBg: 'bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500',
                    headerText: 'text-white',
                    ratingBg: 'bg-gradient-to-br from-purple-400 to-indigo-500',
                    ratingText: 'text-white',
                    badge: '💎 RARE',
                    badgeColor: 'bg-purple-500/80 text-white',
                    shimmer: true,
                    holoEffect: false,
                };
            case 'C': // UNCOMMON - Blue/Cyan
                return {
                    wrapper: 'uncommon-card',
                    border: 'border border-cyan-400/60',
                    background: 'bg-gradient-to-br from-cyan-900/30 via-blue-800/20 to-cyan-900/30',
                    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
                    headerBg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
                    headerText: 'text-white',
                    ratingBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
                    ratingText: 'text-white',
                    badge: '⚡ UNCOMMON',
                    badgeColor: 'bg-cyan-500/80 text-white',
                    shimmer: false,
                    holoEffect: false,
                };
            default: // COMMON - Gray/White
                return {
                    wrapper: 'common-card',
                    border: 'border border-white/30',
                    background: 'bg-gradient-to-br from-slate-800/40 via-gray-700/30 to-slate-800/40',
                    glow: '',
                    headerBg: 'bg-gradient-to-r from-slate-500 to-gray-500',
                    headerText: 'text-white',
                    ratingBg: 'bg-slate-500',
                    ratingText: 'text-white',
                    badge: '● COMMON',
                    badgeColor: 'bg-slate-500/80 text-white',
                    shimmer: false,
                    holoEffect: false,
                };
        }
    };

    const styles = getCardStyles();

    const sizeClasses = {
        sm: 'w-40',
        md: 'w-52',
        lg: 'w-64',
    };

    const getPoolIcon = () => {
        if (isRiddle) return '🎭';
        switch (player.pool) {
            case 'BAT_WK': return '🏏';
            case 'BOWL': return '🎯';
            case 'AR': return '⚔️';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 }
            }}
            className={`
                ${sizeClasses[size]}
                ${styles.border}
                ${styles.background}
                ${styles.glow}
                rounded-2xl overflow-hidden
                transform-gpu perspective-1000
                transition-all duration-300
                relative
                group
                flex flex-col h-full
            `}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Holographic shimmer effect for legendary cards */}
            {styles.shimmer && (
                <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
            )}

            {/* Rainbow holo effect for legendary */}
            {styles.holoEffect && (
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 mix-blend-overlay" />
            )}

            {/* Card Header with Grade Badge */}
            <div className={`${styles.headerBg} px-3 py-2 relative shrink-0`}>
                <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${styles.headerText} tracking-wider`}>
                        {styles.badge}
                    </span>
                    <span className="text-lg">{getPoolIcon()}</span>
                </div>
            </div>

            {/* Player Avatar Area */}
            <div className="relative p-4 pb-2 shrink-0">
                {/* Avatar */}
                <div className={`
                    w-20 h-20 mx-auto rounded-2xl 
                    ${isRiddle ? 'bg-gradient-to-br from-[#111] to-[#333] border-2 border-[#d4af37]' :
                        player.grade === 'A' ? 'bg-gradient-to-br from-yellow-400/30 via-amber-300/20 to-yellow-400/30 border-2 border-yellow-400/50' :
                        player.grade === 'B' ? 'bg-gradient-to-br from-purple-400/30 to-indigo-400/30 border border-purple-400/50' :
                        player.grade === 'C' ? 'bg-gradient-to-br from-cyan-400/30 to-blue-400/30 border border-cyan-400/50' :
                        'bg-white/10 border border-white/20'}
                    flex items-center justify-center
                    ${player.grade === 'A' && !isRiddle ? 'shadow-[0_0_20px_rgba(255,215,0,0.4)]' : ''}
                    ${isRiddle ? 'shadow-[0_0_20px_rgba(212,175,55,0.4)]' : ''}
                `}>
                    <span className={`
                        text-4xl font-black
                        ${isRiddle ? 'text-[#d4af37]' :
                            player.grade === 'A' ? 'text-yellow-300' :
                            player.grade === 'B' ? 'text-purple-300' :
                            player.grade === 'C' ? 'text-cyan-300' :
                            'text-white/80'}
                    `}>
                        {isRiddle ? '❓' : player.player.charAt(0)}
                    </span>
                </div>

                {/* Rating Badge - positioned at corner */}
                <div className={`
                    absolute top-2 right-2
                    ${styles.ratingBg}
                    border border-white/10
                    w-10 h-10 rounded-xl
                    flex items-center justify-center
                    ${styles.ratingText} font-black text-lg
                    ${player.grade === 'A' || isRiddle ? 'shadow-lg' : ''}
                `}>
                    {isRiddle ? '??' : player.rating}
                </div>
            </div>

            {/* Player Name */}
            <div className="px-3 text-center shrink-0">
                <h3 className={`
                    font-black text-sm truncate
                    ${isRiddle ? 'text-[#d4af37]' :
                        player.grade === 'A' ? 'text-yellow-300' :
                        player.grade === 'B' ? 'text-purple-300' :
                        player.grade === 'C' ? 'text-cyan-300' :
                        'text-white'}
                `}>
                    {isRiddle ? (riddleClue?.title || '???') : player.player}
                </h3>
                <p className="text-xs text-white/50 truncate mt-0.5">
                    {isRiddle ? 'Mystery Player' : player.category}
                </p>
            </div>

            {/* Stats Section / Riddle Clue Section */}
            <div className="p-3 mt-1 flex-1 flex flex-col justify-center">
                {isRiddle ? (
                    <div className="bg-black/40 rounded-lg p-2 border border-[#d4af37]/30 h-full flex flex-col items-center justify-center text-center">
                        <div className="text-[9px] text-[#d4af37]/70 uppercase font-black tracking-widest mb-1">Clue</div>
                        <div className="text-[10px] sm:text-xs font-medium text-white/90 line-clamp-4 leading-tight">
                            {riddleClue?.question || "Question loading..."}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-black/20 rounded-lg p-1.5 text-center">
                            <div className="text-[10px] text-white/40 uppercase">Legacy</div>
                            <div className={`text-sm font-bold ${player.grade === 'A' ? 'text-yellow-400' : 'text-white'}`}>
                                {player.legacy}/10
                            </div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-1.5 text-center">
                            <div className="text-[10px] text-white/40 uppercase">Rank</div>
                            <div className="text-sm font-bold text-white">
                                #{player.rank}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Price Footer (optional) */}
            {showPrice && price !== undefined && (
                <div className={`
                    px-3 py-2 text-center shrink-0
                    ${isRiddle ? 'bg-[#d4af37]/20 border-t border-[#d4af37]/30' :
                        player.grade === 'A' ? 'bg-yellow-500/20 border-t border-yellow-400/30' :
                        player.grade === 'B' ? 'bg-purple-500/20 border-t border-purple-400/30' :
                        player.grade === 'C' ? 'bg-cyan-500/20 border-t border-cyan-400/30' :
                        'bg-white/5 border-t border-white/10'}
                `}>
                    <div className={`
                        text-lg font-black
                        ${isRiddle ? 'text-[#d4af37]' :
                            player.grade === 'A' ? 'text-yellow-400' :
                            player.grade === 'B' ? 'text-purple-400' :
                            player.grade === 'C' ? 'text-cyan-400' :
                            'text-white'}
                    `}>
                        ₹{price} CR
                    </div>
                </div>
            )}

            {/* Team badge at bottom */}
            <div className="px-3 pb-3 pt-1 shrink-0">
                <div className="text-[10px] text-white/30 text-center truncate">
                    {isRiddle ? '???' : player.team}
                </div>
            </div>
        </motion.div>
    );
}
