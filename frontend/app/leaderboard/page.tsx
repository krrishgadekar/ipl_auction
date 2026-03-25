'use client';

import { useEffect, useState, useCallback } from 'react';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/api/finalTeam';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { useAuctionSocket } from '@/lib/hooks/useAuctionSocket';

/* ─── Floating Particles ─── */
function FloatingParticles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 25 }, (_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                        background: i % 3 === 0
                            ? 'radial-gradient(circle, rgba(212,175,55,0.7), rgba(212,175,55,0.1))'
                            : 'radial-gradient(circle, rgba(43,181,204,0.6), rgba(43,181,204,0.1))',
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

/* ─── Medal Emoji ─── */
function getRankDisplay(rank: number): { emoji: string; color: string; glow: string } {
    switch (rank) {
        case 1: return { emoji: '🏆', color: '#d4af37', glow: '0 0 40px rgba(212,175,55,0.6)' };
        case 2: return { emoji: '🥈', color: '#c0c0c0', glow: '0 0 30px rgba(192,192,192,0.4)' };
        case 3: return { emoji: '🥉', color: '#cd7f32', glow: '0 0 30px rgba(205,127,50,0.4)' };
        default: return { emoji: `#${rank}`, color: 'rgba(122,148,176,0.7)', glow: 'none' };
    }
}

/* ─── Score Bar ─── */
function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs w-24 text-right" style={{ color: 'rgba(122,148,176,0.7)' }}>{label}</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(4,11,20,0.6)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                />
            </div>
            <span className="text-sm font-bold w-16 text-right" style={{ color }}>{value.toFixed(1)}</span>
        </div>
    );
}

/* ─── Team Leaderboard Card ─── */
function LeaderboardCard({ entry, index }: { entry: LeaderboardEntry; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const rankInfo = getRankDisplay(entry.rank);
    const isWinner = entry.rank === 1;

    return (
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isWinner ? 'ring-2 ring-yellow-500/50' : ''}`}
            style={{
                background: isWinner
                    ? 'linear-gradient(135deg, rgba(80,55,0,0.3) 0%, rgba(10,22,40,0.85) 40%, rgba(10,22,40,0.95) 100%)'
                    : 'rgba(10,22,40,0.7)',
                border: `1px solid ${isWinner ? 'rgba(212,175,55,0.4)' : 'rgba(43,181,204,0.15)'}`,
                boxShadow: isWinner ? rankInfo.glow : 'none',
            }}
            onClick={() => setExpanded(!expanded)}
        >
            {/* Winner shimmer */}
            {isWinner && (
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.08) 45%, transparent 50%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s infinite',
                    }}
                />
            )}

            {/* Main row */}
            <div className="relative z-10 flex items-center gap-4 p-5">
                {/* Rank */}
                <div
                    className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, rgba(4,11,20,0.8), rgba(4,11,20,0.5))`,
                        border: `2px solid ${rankInfo.color}40`,
                        boxShadow: rankInfo.glow,
                    }}
                >
                    <span className="text-2xl">{rankInfo.emoji}</span>
                </div>

                {/* Team info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{entry.teamName.charAt(0)}</span>
                        <h3
                            className="font-black text-lg truncate"
                            style={{
                                color: isWinner ? '#f5d569' : '#e8f0f8',
                                fontFamily: "'Cinzel', serif",
                            }}
                        >
                            {entry.teamName}
                        </h3>
                        <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{
                                background: '#2bb5cc30',
                                color: '#2bb5cc',
                                border: '1px solid #2bb5cc50',
                            }}
                        >
                            {entry.brandKey || entry.teamName.slice(0, 3).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs" style={{ color: 'rgba(122,148,176,0.7)' }}>
                            ©️ {entry.captain.name}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(122,148,176,0.5)' }}>
                            VC: {entry.viceCaptain.name}
                        </span>
                    </div>
                </div>

                {/* Total Score */}
                <div className="flex-shrink-0 text-right">
                    <div
                        className="font-black text-3xl"
                        style={{
                            color: isWinner ? '#d4af37' : '#2bb5cc',
                            fontFamily: "'Cinzel', serif",
                            textShadow: isWinner ? '0 0 30px rgba(212,175,55,0.5)' : 'none',
                        }}
                    >
                        {entry.score.finalScore.toFixed(1)}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(122,148,176,0.5)' }}>
                        TOTAL PTS
                    </div>
                </div>

                {/* Expand indicator */}
                <motion.span
                    animate={{ rotate: expanded ? 180 : 0 }}
                    className="text-lg"
                    style={{ color: 'rgba(122,148,176,0.4)' }}
                >
                    ▼
                </motion.span>
            </div>

            {/* Expanded section */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t overflow-hidden"
                        style={{ borderColor: 'rgba(43,181,204,0.1)' }}
                    >
                        <div className="p-5 grid grid-cols-2 gap-6">
                            {/* Left: Score breakdown */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold tracking-widest" style={{ color: '#2bb5cc' }}>
                                    SCORE BREAKDOWN
                                </h4>
                                <ScoreBar label="Base Score" value={entry.score.baseScore} max={2000} color="#d4af37" />
                                <ScoreBar label="Captain" value={entry.score.captainBonus} max={300} color="#f5d569" />
                                <ScoreBar label="Vice Capt" value={entry.score.vcBonus} max={150} color="#f5d569" />
                                <ScoreBar label="Balance" value={entry.score.balanceBonus} max={30} color="#2dd4a0" />
                                <ScoreBar label="Efficiency" value={entry.score.efficiencyBonus} max={15} color="#2bb5cc" />
                                <ScoreBar label="Brand" value={entry.score.brandBonus} max={5} color="#c084fc" />
                            </div>

                            {/* Right: Playing XI */}
                            <div>
                                <h4 className="text-sm font-bold tracking-widest mb-3" style={{ color: '#2bb5cc' }}>
                                    PLAYING XI
                                </h4>
                                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2">
                                    {entry.top11.map(p => {
                                        const isCaptain = p.id === entry.captain.id;
                                        const isVC = p.id === entry.viceCaptain.id;
                                        return (
                                            <div
                                                key={p.rank}
                                                className="flex items-center gap-2 py-1.5 px-3 rounded-lg"
                                                style={{
                                                    background: isCaptain
                                                        ? 'rgba(212,175,55,0.1)'
                                                        : isVC
                                                            ? 'rgba(43,181,204,0.08)'
                                                            : 'rgba(4,11,20,0.4)',
                                                    border: `1px solid ${isCaptain ? 'rgba(212,175,55,0.3)' : isVC ? 'rgba(43,181,204,0.2)' : 'transparent'}`,
                                                }}
                                            >
                                                <span className="text-xs w-5" style={{ color: 'rgba(122,148,176,0.5)' }}>
                                                    {p.nationality === 'Overseas' ? '🌍' : ''}
                                                </span>
                                                <span
                                                    className="flex-1 text-sm font-medium truncate"
                                                    style={{ color: isCaptain ? '#f5d569' : isVC ? '#7eeaf5' : '#c8d8e8' }}
                                                >
                                                    {p.name}
                                                    {isCaptain && <span className="ml-1 text-xs font-bold text-yellow-400">(C)</span>}
                                                    {isVC && <span className="ml-1 text-xs font-bold text-cyan-400">(VC)</span>}
                                                </span>
                                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(4,11,20,0.6)', color: 'rgba(122,148,176,0.7)' }}>
                                                    {p.category.replace('men', '').replace('ers', '')}
                                                </span>
                                                <span className="text-sm font-bold w-8 text-center" style={{ color: '#d4af37' }}>
                                                    {p.rating}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════ */
/* ─── Main Leaderboard Page ─── */
/* ═══════════════════════════════════════════════════════ */
export default function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    
    const { on } = useAuctionSocket();

    const loadData = useCallback(async () => {
        try {
            const data = await getLeaderboard();
            setEntries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        
        const unbindLocked = on('LINEUP_LOCKED', () => {
            loadData();
        });

        return () => {
            unbindLocked();
        };
    }, [loadData, on]);

    const winner = entries.find(e => e.rank === 1);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen animated-gradient-bg relative overflow-hidden">
            <FloatingParticles />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-10"
                >
                    <Link
                        href="/"
                        className="inline-block mb-4 text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                        style={{
                            background: 'rgba(43,181,204,0.1)',
                            border: '1px solid rgba(43,181,204,0.2)',
                            color: 'rgba(122,148,176,0.7)',
                        }}
                    >
                        ← Back to Home
                    </Link>
                    <h1
                        className="font-black tracking-wide"
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontFamily: "'Cinzel', serif",
                            background: 'linear-gradient(135deg, #d4af37 0%, #f5d569 50%, #d4af37 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: 'none',
                        }}
                    >
                        🏆 FINAL STANDINGS
                    </h1>
                    <p className="mt-2" style={{ color: 'rgba(122,148,176,0.6)' }}>
                        IPL 2026 Mock Auction — Official Scored Formula
                    </p>
                </motion.div>

                {/* Winner Banner */}
                {winner && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="mb-8 rounded-2xl p-6 text-center relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(80,55,0,0.4), rgba(30,18,0,0.6))',
                            border: '2px solid rgba(212,175,55,0.4)',
                            boxShadow: '0 0 60px rgba(212,175,55,0.2)',
                        }}
                    >
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'linear-gradient(105deg, transparent 35%, rgba(212,175,55,0.1) 40%, transparent 45%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2.5s infinite',
                        }} />
                        <div className="relative z-10">
                            <div className="text-5xl mb-2">🏆</div>
                            <div className="text-lg tracking-widest mb-1" style={{ color: 'rgba(212,175,55,0.7)' }}>
                                CHAMPION
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl">{winner.teamName.charAt(0)}</span>
                                <h2
                                    className="font-black text-3xl"
                                    style={{ fontFamily: "'Cinzel', serif", color: '#f5d569' }}
                                >
                                    {winner.teamName}
                                </h2>
                            </div>
                            <div
                                className="mt-2 font-black text-5xl"
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    color: '#d4af37',
                                    textShadow: '0 0 40px rgba(212,175,55,0.6)',
                                }}
                            >
                                {winner.score.finalScore.toFixed(1)} PTS
                            </div>
                            <div className="mt-2 flex items-center justify-center gap-6 text-sm" style={{ color: 'rgba(212,175,55,0.6)' }}>
                                <span>©️ {winner.captain.name}</span>
                                <span>VC: {winner.viceCaptain.name}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* No submissions state */}
                {entries.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 rounded-2xl"
                        style={{
                            background: 'rgba(10,22,40,0.5)',
                            border: '1px solid rgba(43,181,204,0.15)',
                        }}
                    >
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#7eeaf5' }}>
                            No Teams Submitted Yet
                        </h3>
                        <p style={{ color: 'rgba(122,148,176,0.6)' }}>
                            Teams must submit their Top 11 via the Admin panel after the auction ends.
                        </p>
                    </motion.div>
                )}

                {/* Rankings */}
                <div className="space-y-3">
                    {entries.map((entry, i) => (
                        <LeaderboardCard key={entry.teamId} entry={entry} index={i} />
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: entries.length * 0.12 + 0.5 }}
                    className="text-center mt-10 py-4"
                    style={{ color: 'rgba(122,148,176,0.3)', fontSize: '0.75rem' }}
                >
                    Scoring: FinalScore = BaseScore + CaptBonus + VCBonus + BalanceBonus + EfficiencyBonus + BrandBonus
                </motion.div>
            </div>
        </div>
    );
}
