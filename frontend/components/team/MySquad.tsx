// My Squad Component
// Updated with squad composition tracker (rulebook §5) and overseas count

'use client';

import { Player } from '@/lib/mockData/players';
import { motion } from 'framer-motion';

interface MySquadProps {
    players: Player[];
    budgetUsed: number;
    squadLimit?: number;
}

// Composition rules from rulebook §5
const COMPOSITION_RULES = {
    Batsmen: { min: 3, max: 5, emoji: '🏏' },
    Bowlers: { min: 5, max: 8, emoji: '🎳' },
    'All-rounders': { min: 3, max: 5, emoji: '⚡' },
    Wicketkeepers: { min: 2, max: 4, emoji: '🧤' },
};
const OVERSEAS_MIN = 3;
const OVERSEAS_MAX = 5;

function CompositionBar({ label, count, min, max, emoji }: { label: string; count: number; min: number; max: number; emoji: string }) {
    const pct = Math.min((count / max) * 100, 100);
    const ok = count >= min && count <= max;
    const warn = count < min;
    const bar = ok ? 'bg-green-500' : warn ? 'bg-orange-400' : 'bg-red-500';

    return (
        <div className="flex items-center gap-3">
            <span className="text-base w-6 text-center">{emoji}</span>
            <div className="flex-1">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>{label}</span>
                    <span className={ok ? 'text-green-400' : warn ? 'text-orange-400' : 'text-red-400'}>
                        {count} / {min}–{max}
                    </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(43,181,204,0.08)' }}>
                    <div
                        className="h-full rounded-full transition-all"
                        style={{
                            width: `${pct}%`,
                            background: ok ? 'linear-gradient(90deg, #1a6a52, #2dd4a0)' : warn ? 'linear-gradient(90deg, #7a4a00, #d4691e)' : 'linear-gradient(90deg, #6b0a1a, #e74c5e)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function MySquad({ players, budgetUsed, squadLimit = 15 }: MySquadProps) {
    const grouped = players.reduce((acc, p) => {
        acc[p.category] = [...(acc[p.category] || []), p];
        return acc;
    }, {} as Record<string, Player[]>);

    const categories = ['Batsmen', 'Wicketkeepers', 'All-rounders', 'Bowlers'] as const;
    const overseasCount = players.filter(p => p.nationality === 'Overseas').length;

    return (
        <div className="backdrop-blur-md rounded-2xl p-6" style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(43,181,204,0.15)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-2xl font-bold gradient-text" style={{ fontFamily: "'Cinzel', serif" }}>My Squad</h2>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(122,148,176,0.5)' }}>{players.length}/{squadLimit} players</div>
                </div>
                <div className="text-right">
                    <div className="text-sm" style={{ color: 'rgba(122,148,176,0.7)' }}>Total Spent</div>
                    <div className="text-2xl font-bold" style={{ color: '#d4af37', fontFamily: "'Cinzel', serif" }}>₹{budgetUsed} CR</div>
                </div>
            </div>

            {/* Squad Progress Bar */}
            <div className="mb-5">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Squad Filled</span>
                    <span>{players.length}/{squadLimit}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(43,181,204,0.08)' }}>
                    <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(players.length / squadLimit) * 100}%`, background: 'linear-gradient(90deg, #0e4d5e, #2bb5cc)' }}
                    />
                </div>
            </div>

            {/* Composition Tracker */}
            <div className="mb-5 p-4 rounded-xl space-y-2" style={{ background: 'rgba(14,77,94,0.1)', border: '1px solid rgba(43,181,204,0.12)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(43,181,204,0.6)' }}>Composition</div>
                {categories.map(cat => (
                    <CompositionBar
                        key={cat}
                        label={cat}
                        count={grouped[cat]?.length ?? 0}
                        min={COMPOSITION_RULES[cat].min}
                        max={COMPOSITION_RULES[cat].max}
                        emoji={COMPOSITION_RULES[cat].emoji}
                    />
                ))}
                {/* Overseas */}
                <CompositionBar
                    label="Overseas"
                    count={overseasCount}
                    min={OVERSEAS_MIN}
                    max={OVERSEAS_MAX}
                    emoji="🌍"
                />
            </div>

            {/* Players List */}
            {players.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏘️</div>
                    <div className="text-xl" style={{ color: 'rgba(122,148,176,0.6)' }}>No players purchased yet</div>
                    <div className="text-sm mt-2" style={{ color: 'rgba(122,148,176,0.4)' }}>Start bidding to build your squad!</div>
                </div>
            ) : (
                <div className="space-y-5">
                    {categories.map((category, catIndex) => {
                        const catPlayers = grouped[category] || [];
                        if (catPlayers.length === 0) return null;
                        const rule = COMPOSITION_RULES[category];
                        const ok = catPlayers.length >= rule.min && catPlayers.length <= rule.max;

                        return (
                            <div key={category}>
                                <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'rgba(43,181,204,0.8)' }}>
                                    {rule.emoji} {category}
                                    <span
                                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                                        style={{
                                            background: ok ? 'rgba(45,212,160,0.15)' : 'rgba(212,131,30,0.15)',
                                            color: ok ? '#2dd4a0' : '#d4691e',
                                        }}
                                    >
                                        {catPlayers.length}
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {catPlayers.map((player, index) => (
                                        <motion.div
                                            key={player.rank}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: catIndex * 0.07 + index * 0.04 }}
                                            className="p-3 rounded-xl transition-all"
                                            style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(43,181,204,0.1)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ background: 'linear-gradient(135deg, #0e4d5e, #1a8a9e)' }}>
                                                    {player.player.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-white text-sm truncate">{player.player}</h4>
                                                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(122,148,176,0.5)' }}>
                                                        <span className="truncate">{player.role}</span>
                                                        {player.nationality === 'Overseas' && (
                                                            <span className="text-cyan-400 shrink-0">🌍</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    <span
                                                        className="px-2 py-1 rounded-full text-xs font-black"
                                                        style={{
                                                            background: player.grade === 'A' ? 'rgba(100,70,0,0.25)' : player.grade === 'B' ? 'rgba(14,77,94,0.3)' : player.grade === 'C' ? 'rgba(100,70,0,0.15)' : 'rgba(10,22,40,0.3)',
                                                            color: player.grade === 'A' ? '#d4af37' : player.grade === 'B' ? '#7eeaf5' : player.grade === 'C' ? '#d4691e' : '#7a94b0',
                                                            border: player.grade === 'A' ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(43,181,204,0.15)',
                                                        }}
                                                    >{player.grade}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
