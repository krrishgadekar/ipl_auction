'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Player, mockPlayers } from '@/lib/mockData/players';
import { Team } from '@/lib/mockData/teams';
import { AuctionState } from '@/lib/mockData/auctionState';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { preloadImages } from '@/lib/utils/playerImage';

/* ─── Ocean Bubbles ─── */
function OceanBubbles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 20 }, (_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 8 + 3}px`,
                        height: `${Math.random() * 8 + 3}px`,
                        background: i % 2 === 0
                            ? 'radial-gradient(circle at 35% 35%, rgba(43,181,204,0.8), rgba(43,181,204,0.2))'
                            : 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.6), rgba(212,175,55,0.1))',
                        border: i % 2 === 0
                            ? '1px solid rgba(43,181,204,0.4)'
                            : '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '50%',
                        animationDuration: `${Math.random() * 15 + 12}s`,
                        animationDelay: `${Math.random() * 8}s`,
                        opacity: Math.random() * 0.4 + 0.1,
                    }}
                />
            ))}
        </div>
    );
}

/* ─── Animated Number ─── */
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const steps = 30;
        const inc = value / steps;
        let cur = 0;
        const t = setInterval(() => {
            cur += inc;
            if (cur >= value) { setDisplay(value); clearInterval(t); }
            else setDisplay(Math.floor(cur));
        }, 1000 / steps);
        return () => clearInterval(t);
    }, [value]);
    return <span>{prefix}{display.toFixed(1)}{suffix}</span>;
}

/* ─── Grade config ─── */
const GRADE = {
    A: {
        bg: 'linear-gradient(135deg, rgba(100,70,0,0.4) 0%, rgba(180,130,20,0.25) 50%, rgba(100,70,0,0.4) 100%)',
        border: '#d4af37',
        borderOpacity: 'rgba(212,175,55,0.5)',
        glow: 'legendary-glow',
        badge: '✦ LEGENDARY',
        badgeBg: 'linear-gradient(135deg, #7a5c00, #d4af37)',
        textColor: '#f5d569',
    },
    B: {
        bg: 'linear-gradient(135deg, rgba(14,77,94,0.5) 0%, rgba(26,138,158,0.3) 50%, rgba(14,77,94,0.5) 100%)',
        border: '#2bb5cc',
        borderOpacity: 'rgba(43,181,204,0.5)',
        glow: 'glow-pulse',
        badge: '◆ ELITE',
        badgeBg: 'linear-gradient(135deg, #0e4d5e, #1a8a9e)',
        textColor: '#7eeaf5',
    },
    C: {
        bg: 'linear-gradient(135deg, rgba(10,30,50,0.5) 0%, rgba(20,60,90,0.3) 50%, rgba(10,30,50,0.5) 100%)',
        border: '#5ccfdf',
        borderOpacity: 'rgba(92,207,223,0.4)',
        glow: '',
        badge: '● SKILLED',
        badgeBg: 'linear-gradient(135deg, #0a2840, #1a5f7a)',
        textColor: '#5ccfdf',
    },
    D: {
        bg: 'linear-gradient(135deg, rgba(8,20,35,0.5) 0%, rgba(15,40,65,0.3) 50%, rgba(8,20,35,0.5) 100%)',
        border: '#7a94b0',
        borderOpacity: 'rgba(122,148,176,0.3)',
        glow: '',
        badge: '· PROSPECT',
        badgeBg: 'linear-gradient(135deg, #0a1c30, #1a3552)',
        textColor: '#7a94b0',
    },
};

/* ─── Grade-specific background panels ─── */
const GRADE_PANEL: Record<string, React.CSSProperties> = {
    A: { background: 'linear-gradient(180deg, rgba(80,55,0,0.95) 0%, rgba(30,18,0,0.98) 100%)' },
    B: { background: 'linear-gradient(180deg, rgba(8,50,65,0.95) 0%, rgba(4,18,28,0.98) 100%)' },
    C: { background: 'linear-gradient(180deg, rgba(6,25,42,0.95) 0%, rgba(4,14,24,0.98) 100%)' },
    D: { background: 'linear-gradient(180deg, rgba(8,16,28,0.95) 0%, rgba(4,10,18,0.98) 100%)' },
};

/* ─── Sub-rating bar ─── */
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="w-24 shrink-0 uppercase tracking-widest" style={{ color: 'rgba(122,148,176,0.65)', fontSize: '0.62rem' }}>{label}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                />
            </div>
            <span className="w-7 text-right font-bold shrink-0" style={{ color, fontSize: '0.65rem' }}>{value}</span>
        </div>
    );
}

/* ─── Pool-based sub-ratings ─── */
function PoolStats({ player, accentColor }: { player: Player; accentColor: string }) {
    const barColor = accentColor;
    if (player.pool === 'BAT_WK') return (
        <div className="space-y-1.5">
            {player.sub_scoring !== undefined && <StatBar label="Scoring" value={player.sub_scoring} color={barColor} />}
            {player.sub_impact !== undefined && <StatBar label="Impact" value={player.sub_impact} color={barColor} />}
            {player.sub_consistency !== undefined && <StatBar label="Consistency" value={player.sub_consistency} color={barColor} />}
            <StatBar label="Experience" value={player.sub_experience} color={barColor} />
        </div>
    );
    if (player.pool === 'BOWL') return (
        <div className="space-y-1.5">
            {player.sub_wickettaking !== undefined && <StatBar label="Wicket-taking" value={player.sub_wickettaking} color={barColor} />}
            {player.sub_economy !== undefined && <StatBar label="Economy" value={player.sub_economy} color={barColor} />}
            {player.sub_efficiency !== undefined && <StatBar label="Efficiency" value={player.sub_efficiency} color={barColor} />}
            <StatBar label="Experience" value={player.sub_experience} color={barColor} />
        </div>
    );
    return (
        <div className="space-y-1.5">
            {player.sub_batting !== undefined && <StatBar label="Batting" value={player.sub_batting} color={barColor} />}
            {player.sub_bowling !== undefined && <StatBar label="Bowling" value={player.sub_bowling} color={barColor} />}
            {player.sub_versatility !== undefined && <StatBar label="Versatility" value={player.sub_versatility} color={barColor} />}
            <StatBar label="Experience" value={player.sub_experience} color={barColor} />
        </div>
    );
}

/* ─── Premium Player Card ─── */
function PremiumPlayerCard({ player }: { player: Player }) {
    const cfg = GRADE[player.grade as keyof typeof GRADE] ?? GRADE.D;
    const panelStyle = GRADE_PANEL[player.grade] ?? GRADE_PANEL.D;
    const isLegendary = player.grade === 'A';
    const isRiddle = player.isRiddle;

    // photo side width varies by grade
    const photoWidths: Record<string, string> = { A: '42%', B: '38%', C: '35%', D: '33%' };
    const photoWidth = photoWidths[player.grade] ?? '35%';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -30 }}
            transition={{ duration: 0.55, type: 'spring', stiffness: 110 }}
            className={`relative overflow-hidden rounded-3xl h-full flex ${cfg.glow}`}
            style={{ border: `2px solid ${cfg.borderOpacity}`, boxShadow: `0 0 80px ${cfg.borderOpacity}40` }}
        >
            {/* ── LEFT: Photo Panel ── */}
            <div
                className="relative flex-shrink-0 overflow-hidden"
                style={{ width: photoWidth, ...panelStyle }}
            >
                {/* Grade-specific top accent stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ background: cfg.badgeBg }} />

                {/* Grade Badge */}
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-4 left-0 right-0 flex justify-center z-20"
                >
                    <span
                        className="px-5 py-1.5 rounded-full text-white font-black text-sm tracking-widest"
                        style={{ background: cfg.badgeBg, boxShadow: `0 4px 20px ${cfg.borderOpacity}` }}
                    >
                        {cfg.badge}
                    </span>
                </motion.div>

                {/* Holographic shimmer overlay (A only) */}
                {isLegendary && <div className="absolute inset-0 holo-effect opacity-20 pointer-events-none z-10" />}

                {/* Player Photo or Initial */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="absolute inset-0 flex items-end justify-center"
                    style={{ paddingTop: '60px' }}
                >
                    {!isRiddle && player.imageUrl ? (
                        <div className="relative w-full h-full flex items-end justify-center">
                            {/* Photo glow underlayer */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-2/3 z-0"
                                style={{ background: `radial-gradient(ellipse at 50% 100%, ${cfg.borderOpacity} 0%, transparent 70%)` }}
                            />
                            {/* Use Next.js Image for local files (priority=instant), plain img for remote URLs */}
                            {player.imageUrl.startsWith('/') ? (
                                <div className="relative z-10 w-full h-full">
                                    <Image
                                        src={player.imageUrl}
                                        alt={player.player}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 40vw, 30vw"
                                        className="object-contain object-bottom"
                                        style={{ filter: isLegendary ? 'drop-shadow(0 0 24px rgba(212,175,55,0.5))' : `drop-shadow(0 0 16px ${cfg.border}60)` }}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={player.imageUrl}
                                    alt={player.player}
                                    className="relative z-10 object-contain object-bottom max-h-full w-full"
                                    style={{ filter: isLegendary ? 'drop-shadow(0 0 24px rgba(212,175,55,0.5))' : `drop-shadow(0 0 16px ${cfg.border}60)` }}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                        </div>
                    ) : (
                        /* Initial Letter Fallback */
                        <div className="relative flex items-center justify-center w-full h-full">
                            {/* Big watermark initial */}
                            <span
                                className="absolute select-none"
                                style={{
                                    fontSize: 'clamp(8rem, 18vw, 16rem)',
                                    fontFamily: "'Cinzel', serif",
                                    fontWeight: 900,
                                    color: cfg.borderOpacity,
                                    lineHeight: 1,
                                    bottom: '-0.1em',
                                    letterSpacing: '-0.05em',
                                    opacity: 0.35,
                                }}
                            >
                                {isRiddle ? '?' : player.player.charAt(0)}
                            </span>
                            {/* Circle avatar */}
                            <motion.div
                                animate={isLegendary ? { boxShadow: ['0 0 30px rgba(212,175,55,0.3)', '0 0 60px rgba(212,175,55,0.6)', '0 0 30px rgba(212,175,55,0.3)'] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-36 h-36 rounded-full flex items-center justify-center z-10"
                                style={{
                                    background: `radial-gradient(circle at 35% 35%, ${cfg.border}30, rgba(4,11,20,0.5))`,
                                    border: `3px solid ${cfg.borderOpacity}`,
                                }}
                            >
                                <span style={{ fontSize: '4rem', fontFamily: "'Cinzel', serif", color: cfg.textColor, textShadow: `0 0 30px ${cfg.border}` }}>
                                    {isRiddle ? '?' : player.player.charAt(0)}
                                </span>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* Scanning line (A grade only) */}
                {isLegendary && (
                    <motion.div
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-0.5 z-30 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)', top: '60px' }}
                    />
                )}

                {/* Overseas ribbon */}
                {player.nationality === 'Overseas' && (
                    <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-4 left-0 right-0 flex justify-center z-20"
                    >
                        <span
                            className="px-3 py-1 text-xs font-bold rounded-full"
                            style={{ background: 'rgba(14,77,94,0.8)', border: '1px solid rgba(43,181,204,0.5)', color: '#7eeaf5' }}
                        >
                            🌍 OVERSEAS
                        </span>
                    </motion.div>
                )}

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(4,11,20,0.7), transparent)' }} />
            </div>

            {/* ── RIGHT: Info Panel ── */}
            <div
                className="flex-1 flex flex-col justify-between p-7 pt-8 min-w-0 relative overflow-hidden"
                style={panelStyle}
            >
                {/* Very faint watermark grade letter */}
                <span
                    className="absolute right-4 top-0 select-none pointer-events-none"
                    style={{
                        fontSize: '18rem',
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 900,
                        color: cfg.borderOpacity,
                        opacity: 0.04,
                        lineHeight: 1,
                    }}
                >
                    {player.grade}
                </span>

                {/* Top section: Name, tags */}
                <div className="relative z-10">
                    {/* Rank pill */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                        <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
                            style={{ background: 'rgba(43,181,204,0.08)', color: 'rgba(43,181,204,0.5)', border: '1px solid rgba(43,181,204,0.15)' }}>
                            #{player.rank} · {player.pool}
                        </span>
                    </motion.div>

                    {/* Name */}
                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="font-black text-white leading-tight mb-3"
                        style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                            fontFamily: "'Cinzel', serif",
                            textShadow: `0 0 30px ${cfg.border}50`,
                            letterSpacing: '0.02em',
                        }}
                    >
                        {isRiddle ? '??? RIDDLE PLAYER ???' : player.player}
                    </motion.h2>

                    {/* Tags row */}
                    <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                        className="flex flex-wrap items-center gap-2 mb-5">
                        <span className="px-3 py-1 rounded-lg text-sm font-bold"
                            style={{ background: 'rgba(43,181,204,0.12)', color: '#7eeaf5', border: '1px solid rgba(43,181,204,0.2)' }}>
                            {player.category}
                        </span>
                        <span className="text-sm" style={{ color: 'rgba(122,148,176,0.5)' }}>·</span>
                        <span className="text-sm" style={{ color: 'rgba(188,220,230,0.65)' }}>{player.team}</span>
                        {player.role && player.role !== player.category && (
                            <>
                                <span className="text-sm" style={{ color: 'rgba(122,148,176,0.5)' }}>·</span>
                                <span className="px-2 py-0.5 rounded text-xs" style={{ color: 'rgba(122,148,176,0.7)', background: 'rgba(122,148,176,0.06)' }}>{player.role}</span>
                            </>
                        )}
                    </motion.div>

                    {/* Sub-ratings */}
                    {!isRiddle && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="rounded-2xl p-4 mb-4"
                            style={{ background: 'rgba(4,11,20,0.45)', border: `1px solid ${cfg.borderOpacity}` }}>
                            <div className="text-xs font-black tracking-widest uppercase mb-3"
                                style={{ color: cfg.textColor, opacity: 0.7 }}>Player Attributes</div>
                            <PoolStats player={player} accentColor={cfg.textColor} />
                        </motion.div>
                    )}
                </div>

                {/* Bottom section: Stats grid */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="grid grid-cols-4 gap-3 relative z-10"
                >
                    {[
                        { label: 'RATING', val: player.rating, color: cfg.textColor },
                        { label: 'LEGACY', val: player.legacy, color: '#d4af37' },
                        { label: 'RANK', val: `#${player.rank}`, color: '#2bb5cc' },
                        { label: 'BASE', val: `₹${player.basePrice}CR`, color: '#2dd4a0' },
                    ].map((s) => (
                        <div key={s.label} className="rounded-2xl p-3 text-center"
                            style={{ background: 'rgba(4,11,20,0.6)', border: `1px solid ${cfg.borderOpacity}` }}>
                            <div className="text-xs mb-1 tracking-widest" style={{ color: 'rgba(122,148,176,0.6)', fontSize: '0.6rem' }}>{s.label}</div>
                            <div className="font-black" style={{ color: s.color, fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}>{s.val}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Overall Rating Circle (top-right of info panel) */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.45, type: 'spring' }}
                className="absolute top-5 right-5 z-20"
            >
                <div
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center ${cfg.glow}`}
                    style={{ background: cfg.badgeBg, border: `3px solid ${cfg.borderOpacity}` }}
                >
                    <span className="font-black leading-none" style={{ fontSize: '1.8rem', color: '#fff', fontFamily: "'Cinzel', serif" }}>
                        {player.rating}
                    </span>
                    <span className="text-[0.55rem] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>OVR</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Waiting State ─── */
function WaitingState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center rounded-3xl"
            style={{
                background: 'rgba(10,22,40,0.4)',
                border: '1px solid rgba(43,181,204,0.12)',
            }}
        >
            <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-9xl mb-8"
            >
                🌊
            </motion.div>
            <h2
                className="text-4xl font-black mb-3"
                style={{ fontFamily: "'Cinzel', serif", color: 'rgba(188,220,230,0.6)' }}
            >
                NEXT PLAYER INCOMING
            </h2>
            <p style={{ color: 'rgba(122,148,176,0.5)', fontSize: '1.1rem' }}>The auctioneer is selecting...</p>
        </motion.div>
    );
}

/* ─── Team Leaderboard Card ─── */
function TeamCard({ team, rank }: { team: Team; rank: number }) {
    const pct = (team.budgetRemaining / team.totalBudget) * 100;
    const tealVal = Math.round((pct / 100) * 200 + 55);
    return (
        <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: rank * 0.08 }}
            className="p-4 rounded-xl transition-all duration-300 group ocean-surface-hover"
            style={{
                background: 'rgba(10,22,40,0.5)',
                border: '1px solid rgba(43,181,204,0.1)',
            }}
            whileHover={{ borderColor: 'rgba(43,181,204,0.25)' } as never}
        >
            <div className="flex items-center gap-2.5 mb-2">
                <div
                    className="text-xl font-black w-7 text-right"
                    style={{ color: rank <= 3 ? '#d4af37' : 'rgba(122,148,176,0.4)' }}
                >
                    #{rank}
                </div>
                <div className="text-2xl">{team.logo}</div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-base leading-tight">{team.shortName}</div>
                    <div className="text-xs" style={{ color: 'rgba(122,148,176,0.6)' }}>{team.squadCount}/{team.squadLimit} players</div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black" style={{ color: `hsl(${tealVal}, 70%, 60%)` }}>
                        ₹{team.budgetRemaining}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(122,148,176,0.5)' }}>CR left</div>
                </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(43,181,204,0.1)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #0e4d5e, #2bb5cc)' }}
                />
            </div>
        </motion.div>
    );
}

export default function BigScreenPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSoldAnimation, setShowSoldAnimation] = useState(false);

    const triggerConfetti = useCallback(() => {
        import('canvas-confetti').then((confetti) => {
            const duration = 4000;
            const end = Date.now() + duration;
            const colors = ['#d4af37', '#2bb5cc', '#f5d569', '#7eeaf5', '#c9a84c'];
            (function frame() {
                confetti.default({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
                confetti.default({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        });
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [state, teamsData] = await Promise.all([getAuctionState(), getAllTeams()]);
                setAuctionState(state);
                setTeams(teamsData);
                setLoading(false);
            } catch { setLoading(false); }
        };
        loadData();

        const unsub = subscribeToAuctionUpdates((newState) => {
            if (auctionState?.status === 'BIDDING' && newState.status === 'SOLD') {
                setShowSoldAnimation(true);
                triggerConfetti();
                setTimeout(() => setShowSoldAnimation(false), 3200);
            }
            setAuctionState(newState);

            // Preload the next queued player's image so it's warm in cache
            if (newState.currentPlayerRank !== null) {
                const nextRankIndex = mockPlayers.findIndex(p => p.rank === newState.currentPlayerRank);
                const lookAhead = [1, 2].map(offset => mockPlayers[nextRankIndex + offset]?.imageUrl);
                preloadImages(lookAhead);
            }
        });

        const ti = setInterval(async () => { setTeams(await getAllTeams()); }, 2000);
        return () => { unsub(); clearInterval(ti); };
    }, [auctionState?.status, triggerConfetti]);

    if (loading || !auctionState) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-8xl"
                >
                    🌊
                </motion.div>
            </div>
        );
    }

    const sortedTeams = [...teams].sort((a, b) => b.budgetRemaining - a.budgetRemaining);

    const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
        BIDDING: { bg: 'rgba(212,175,55,0.15)', text: '#d4af37', border: 'rgba(212,175,55,0.4)' },
        CLOSED_BIDDING: { bg: 'rgba(88,28,135,0.2)', text: '#c084fc', border: 'rgba(192,132,252,0.4)' },
        SOLD: { bg: 'rgba(45,212,160,0.15)', text: '#2dd4a0', border: 'rgba(45,212,160,0.4)' },
        UNSOLD: { bg: 'rgba(231,76,94,0.15)', text: '#e74c5e', border: 'rgba(231,76,94,0.4)' },
        ANNOUNCING: { bg: 'rgba(43,181,204,0.15)', text: '#2bb5cc', border: 'rgba(43,181,204,0.4)' },
        IDLE: { bg: 'rgba(10,22,40,0.3)', text: 'rgba(122,148,176,0.7)', border: 'rgba(43,181,204,0.15)' },
    };
    const statusStyle = STATUS_STYLES[auctionState.status] ?? { bg: 'rgba(10,22,40,0.3)', text: 'rgba(122,148,176,0.7)', border: 'rgba(43,181,204,0.15)' };

    return (
        <div className="min-h-screen animated-gradient-bg overflow-hidden relative">
            <OceanBubbles />

            {/* SOLD Overlay */}
            <AnimatePresence>
                {showSoldAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)' }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -15 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 15 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="font-black glitch"
                            style={{
                                fontSize: 'clamp(6rem, 15vw, 12rem)',
                                color: '#d4af37',
                                fontFamily: "'Cinzel', serif",
                                textShadow: '0 0 60px rgba(212,175,55,0.8), 0 0 120px rgba(212,175,55,0.4)',
                                letterSpacing: '0.05em',
                            }}
                        >
                            SOLD! 🔨
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-screen h-screen p-6 relative z-10 flex flex-col">
                {/* ── HEADER ── */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between mb-5 flex-shrink-0"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 flex-shrink-0">
                            <Image src="/logo.png" alt="IPL" fill className="object-contain" onError={() => { }} />
                            <div className="absolute inset-0 flex items-center justify-center text-3xl">🏏</div>
                        </div>
                        <h1
                            className="big-screen-title gradient-text-animated leading-none"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                        >
                            IPL AUCTION 2026
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Day */}
                        <div
                            className="px-5 py-2.5 rounded-full"
                            style={{ background: 'rgba(14,77,94,0.2)', border: '1px solid rgba(43,181,204,0.2)' }}
                        >
                            <span style={{ color: 'rgba(188,220,230,0.6)', marginRight: '0.5rem', fontSize: '1rem' }}>Day</span>
                            <span className="text-2xl font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                                {auctionState.auctionDay}
                            </span>
                        </div>

                        {/* LIVE */}
                        <motion.div
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full"
                            style={{ background: 'rgba(231,76,94,0.15)', border: '1px solid rgba(231,76,94,0.4)' }}
                        >
                            <div className="w-3 h-3 rounded-full status-pulse" style={{ background: '#e74c5e' }} />
                            <span className="text-xl font-black" style={{ color: '#e74c5e', fontFamily: "'Cinzel', serif" }}>LIVE</span>
                        </motion.div>

                        {/* Status */}
                        <motion.div
                            key={auctionState.status}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-5 py-2.5 rounded-full font-black text-lg"
                            style={{ background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`, fontFamily: "'Cinzel', serif" }}
                        >
                            {auctionState.status.replace('_', ' ')}
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── MAIN GRID ── */}
                <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
                    {/* Player Card — 3 cols */}
                    <div className="col-span-3">
                        <AnimatePresence mode="wait">
                            {auctionState.currentPlayer ? (
                                <PremiumPlayerCard
                                    key={auctionState.currentPlayer.rank}
                                    player={auctionState.currentPlayer}
                                />
                            ) : (
                                <WaitingState key="waiting" />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Leaderboard — 1 col */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-3xl p-4 overflow-y-auto flex flex-col"
                        style={{
                            background: 'rgba(10,22,40,0.6)',
                            border: '1px solid rgba(43,181,204,0.12)',
                            backdropFilter: 'blur(16px)',
                        }}
                    >
                        <h3
                            className="text-xl font-black mb-4 gradient-text flex-shrink-0"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            🏆 Standings
                        </h3>
                        <div className="space-y-2.5 flex-1">
                            {sortedTeams.map((team, i) => (
                                <TeamCard key={team.id} team={team} rank={i + 1} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── FOOTER STATS ── */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex-shrink-0 mt-4"
                >
                    <div
                        className="flex items-center justify-between px-8 py-4 rounded-full"
                        style={{
                            background: 'rgba(4,11,20,0.6)',
                            border: '1px solid rgba(43,181,204,0.15)',
                            backdropFilter: 'blur(16px)',
                        }}
                    >
                        <div className="flex items-center gap-10">
                            {[
                                { label: 'TEAMS', val: String(teams.length), color: '#2bb5cc' },
                                { label: 'PLAYERS SOLD', val: String(teams.reduce((s, t) => s + t.squadCount, 0)), color: '#2dd4a0' },
                                { label: 'TOTAL SPENT', val: null, color: '#d4af37', animated: teams.reduce((s, t) => s + t.budgetUsed, 0) },
                            ].map((s, i) => (
                                <div key={s.label} className="flex items-center gap-6">
                                    {i > 0 && <div className="w-px h-8" style={{ background: 'rgba(43,181,204,0.15)' }} />}
                                    <div className="text-center">
                                        <div className="text-xs mb-0.5" style={{ color: 'rgba(122,148,176,0.6)', letterSpacing: '0.1em' }}>{s.label}</div>
                                        <div className="text-2xl font-black count-up" style={{ color: s.color, fontFamily: "'Cinzel', serif" }}>
                                            {s.animated !== undefined
                                                ? <><span>₹</span><AnimatedNumber value={s.animated} suffix=" CR" /></>
                                                : s.val
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Marquee */}
                        <div className="flex-1 mx-10 overflow-hidden">
                            <div className="marquee whitespace-nowrap">
                                {[...teams, ...teams].map((team, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-2 mx-6"
                                        style={{ color: 'rgba(122,148,176,0.5)' }}
                                    >
                                        <span className="text-lg">{team.logo}</span>
                                        <span className="font-semibold">{team.shortName}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
