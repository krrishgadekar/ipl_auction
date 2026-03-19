'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Player, mockPlayers } from '@/lib/mockData/players';
import { Team } from '@/lib/mockData/teams';
import { AuctionState } from '@/lib/mockData/auctionState';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { preloadImages } from '@/lib/utils/playerImage';

/* ═══════════════════════════════════════════════════════════
   GRADE THEMES — Consistent Background, Colored Accents
   ═══════════════════════════════════════════════════════════ */
const THEMES: Record<string, {
    accent: string; accentLight: string; accentGlow: string;
    badgeText: string; glowClass: string; tierLabel: string;
}> = {
    A: {
        accent: '#d4af37', accentLight: '#f5d569', accentGlow: 'rgba(212,175,55,0.4)',
        badgeText: '#1a1000', glowClass: 'legendary-glow', tierLabel: 'LEGENDARY',
    },
    B: {
        accent: '#2bb5cc', accentLight: '#7eeaf5', accentGlow: 'rgba(43,181,204,0.4)',
        badgeText: '#031a22', glowClass: 'glow-pulse', tierLabel: 'ELITE',
    },
    C: {
        accent: '#5c8aaf', accentLight: '#8ab8d8', accentGlow: 'rgba(92,138,175,0.35)',
        badgeText: '#080e1a', glowClass: '', tierLabel: 'RISING',
    },
};

// Unified premium background constants
const CARD_BG = 'linear-gradient(135deg, #050b14 0%, #0a1628 25%, #081220 50%, #040910 100%)';
const GLASS_BG = 'rgba(43,181,204,0.06)';
const GLASS_BORDER = 'rgba(43,181,204,0.15)';
const TEXT_SEC = 'rgba(122,148,176,0.5)';

/* ═══════════════════════════════════════════════════════════
   SPIDER CHART
   ═══════════════════════════════════════════════════════════ */
function getStats(p: Player): { label: string; value: number; display: string }[] {
    const leg = { label: 'LEG', value: Math.min(p.legacy * 10, 100), display: String(p.legacy) };
    const rat = { label: 'RAT', value: p.rating, display: String(p.rating) };
    const exp = { label: 'EXP', value: p.sub_experience, display: String(p.sub_experience) };
    if (p.pool === 'BAT_WK') return [
        { label: 'SCR', value: p.sub_scoring ?? 0, display: String(p.sub_scoring ?? 0) },
        { label: 'IMP', value: p.sub_impact ?? 0, display: String(p.sub_impact ?? 0) },
        rat, { label: 'CON', value: p.sub_consistency ?? 0, display: String(p.sub_consistency ?? 0) }, leg, exp ];
    if (p.pool === 'BOWL') return [
        { label: 'WKT', value: p.sub_wickettaking ?? 0, display: String(p.sub_wickettaking ?? 0) },
        { label: 'ECO', value: p.sub_economy ?? 0, display: String(p.sub_economy ?? 0) },
        rat, { label: 'EFF', value: p.sub_efficiency ?? 0, display: String(p.sub_efficiency ?? 0) }, leg, exp ];
    return [
        { label: 'BAT', value: p.sub_batting ?? 0, display: String(p.sub_batting ?? 0) },
        { label: 'BWL', value: p.sub_bowling ?? 0, display: String(p.sub_bowling ?? 0) },
        rat, { label: 'VRS', value: p.sub_versatility ?? 0, display: String(p.sub_versatility ?? 0) }, leg, exp ];
}

function SpiderChart({ stats, theme }: { stats: { label: string; value: number; display: string }[]; theme: typeof THEMES.A }) {
    const s = 260, cx = s / 2, cy = s / 2, r = 88, n = stats.length;
    const pt = (i: number, f: number) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        return { x: cx + f * r * Math.cos(a), y: cy + f * r * Math.sin(a) };
    };
    const poly = (f: number) => Array.from({ length: n }, (_, i) => { const p = pt(i, f); return `${p.x},${p.y}`; }).join(' ');
    const dataPoly = stats.map((st, i) => { const p = pt(i, st.value / 100); return `${p.x},${p.y}`; }).join(' ');

    return (
        <svg viewBox={`0 0 ${s} ${s}`} style={{ width: '100%', height: '100%' }}>
            {[0.33, 0.66, 1].map((lv, li) => (
                <polygon key={li} points={poly(lv)} fill="none" stroke={`${theme.accent}18`} strokeWidth="0.7" />
            ))}
            {stats.map((_, i) => { const e = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke={`${theme.accent}10`} strokeWidth="0.7" />; })}
            <motion.polygon points={dataPoly} fill={`${theme.accent}25`} stroke={theme.accent}
                strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} />
            {stats.map((st, i) => { const p = pt(i, st.value / 100); return <motion.circle key={i} cx={p.x} cy={p.y} r="3" fill={theme.accent} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.07 }} />; })}
            {stats.map((st, i) => {
                const p = pt(i, 1.28);
                return (<g key={`l${i}`}>
                    <text x={p.x} y={p.y - 6} textAnchor="middle" fill={TEXT_SEC} fontSize="7.5" fontFamily="Inter" fontWeight="600" letterSpacing="0.06em">{st.label}</text>
                    <text x={p.x} y={p.y + 9} textAnchor="middle" fill={theme.accentLight} fontSize="13" fontFamily="Cinzel" fontWeight="800">{st.display}</text>
                </g>);
            })}
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function BigScreenPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSold, setShowSold] = useState(false);
    const [showReveal, setShowReveal] = useState(false);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const auth = localStorage.getItem('ipl_screen_auth');
            if (auth === 'true') {
                setIsAuth(true);
            } else {
                router.push('/big-screen/login');
            }
        }
    }, [router]);

    const confetti = useCallback(() => {
        import('canvas-confetti').then((c) => {
            const end = Date.now() + 4000;
            const colors = ['#d4af37', '#2bb5cc', '#f5d569', '#7eeaf5'];
            (function f() {
                c.default({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
                c.default({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
                if (Date.now() < end) requestAnimationFrame(f);
            }());
        });
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const [s, t] = await Promise.all([getAuctionState(), getAllTeams()]);
                setAuctionState(s); setTeams(t); setLoading(false);
            } catch { setLoading(false); }
        };
        load();
        const unsub = subscribeToAuctionUpdates((ns) => {
            if (auctionState?.status === 'BIDDING' && ns.status === 'SOLD') { setShowSold(true); confetti(); setTimeout(() => setShowSold(false), 3200); }
            // Detect riddle → revealed transition
            if (auctionState?.currentPlayer?.isRiddle && ns.currentPlayer && !ns.currentPlayer.isRiddle && ns.currentPlayer.rank === auctionState.currentPlayer.rank) {
                setShowReveal(true);
                confetti();
                setTimeout(() => setShowReveal(false), 4000);
            }
            setAuctionState(ns);
            if (ns.currentPlayerRank !== null) {
                const idx = mockPlayers.findIndex(p => p.rank === ns.currentPlayerRank);
                preloadImages([1, 2].map(o => mockPlayers[idx + o]?.imageUrl));
            }
        });
        const ti = setInterval(async () => { setTeams(await getAllTeams()); }, 2000);
        return () => { unsub(); clearInterval(ti); };
    }, [auctionState?.status, confetti]);

    if (!isAuth) return null;

    if (loading || !auctionState) return (
        <div className="h-screen w-screen animated-gradient-bg flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-7xl">🏏</motion.div>
        </div>
    );

    const player = auctionState.currentPlayer;
    const theme = player ? (THEMES[player.grade] ?? THEMES.D) : THEMES.D;
    const sorted = [...teams].sort((a, b) => b.budgetRemaining - a.budgetRemaining);
    const sold = teams.reduce((s, t) => s + t.squadCount, 0);
    const spent = teams.reduce((s, t) => s + t.budgetUsed, 0);
    const total = mockPlayers.length;

    const SS: Record<string, { bg: string; text: string; bdr: string }> = {
        BIDDING: { bg: 'rgba(212,175,55,0.15)', text: '#d4af37', bdr: 'rgba(212,175,55,0.4)' },
        CLOSED_BIDDING: { bg: 'rgba(88,28,135,0.2)', text: '#c084fc', bdr: 'rgba(192,132,252,0.4)' },
        SOLD: { bg: 'rgba(45,212,160,0.15)', text: '#2dd4a0', bdr: 'rgba(45,212,160,0.4)' },
        UNSOLD: { bg: 'rgba(231,76,94,0.15)', text: '#e74c5e', bdr: 'rgba(231,76,94,0.4)' },
        ANNOUNCING: { bg: 'rgba(43,181,204,0.15)', text: '#2bb5cc', bdr: 'rgba(43,181,204,0.4)' },
        IDLE: { bg: 'rgba(10,22,40,0.3)', text: 'rgba(122,148,176,0.7)', bdr: 'rgba(43,181,204,0.15)' },
    };
    const ss = SS[auctionState.status] ?? SS.IDLE;

    return (
        <div className="h-screen w-screen overflow-hidden relative" style={{ background: '#050a12' }}>
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(ellipse at 30% 40%, ${theme.accentGlow} 0%, transparent 60%)`,
                opacity: 0.15,
            }} />

            {/* SOLD overlay */}
            <AnimatePresence>
                {showSold && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)` }}>
                        <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300 }}
                            style={{ fontSize: 'clamp(5rem, 14vw, 11rem)', color: theme.accent, fontFamily: "'Cinzel', serif", fontWeight: 900,
                                textShadow: `0 0 60px ${theme.accentGlow}, 0 0 120px ${theme.accentGlow}` }}>
                            SOLD! 🔨
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RIDDLE REVEALED overlay */}
            <AnimatePresence>
                {showReveal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)' }}>
                        <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300 }}
                            style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', fontFamily: "'Cinzel', serif", fontWeight: 900,
                                color: '#d4af37',
                                textShadow: '0 0 60px rgba(212,175,55,0.6), 0 0 120px rgba(212,175,55,0.3)' }}>
                            🎭 REVEALED!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 h-full w-full p-4 flex flex-col gap-2">

                {/* ── HEADER ── */}
                <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8"><Image src="/logo.png" alt="IPL" fill className="object-contain" priority /></div>
                        <h1 className="gradient-text-animated font-black leading-none"
                            style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2rem)', fontFamily: "'Cinzel', serif", letterSpacing: '0.04em' }}>
                            IPL AUCTION 2026</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full" style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                            <span style={{ color: TEXT_SEC, fontSize: '0.7rem', marginRight: '0.25rem' }}>Day</span>
                            <span className="font-black text-white" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.95rem' }}>{auctionState.auctionDay}</span>
                        </div>
                        <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                            style={{ background: 'rgba(231,76,94,0.1)', border: '1px solid rgba(231,76,94,0.25)' }}>
                            <div className="w-2 h-2 rounded-full status-pulse" style={{ background: '#e74c5e' }} />
                            <span className="font-black" style={{ color: '#e74c5e', fontFamily: "'Cinzel', serif", fontSize: '0.8rem' }}>LIVE</span>
                        </motion.div>
                        <motion.div key={auctionState.status} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="px-3 py-1 rounded-full font-black" style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.bdr}`, fontFamily: "'Cinzel', serif", fontSize: '0.75rem' }}>
                            {auctionState.status.replace('_', ' ')}
                        </motion.div>
                    </div>
                </motion.header>

                {/* ── MAIN CARD ── */}
                <div className={`flex-1 rounded-2xl overflow-hidden relative ${theme.glowClass}`} style={{
                    background: CARD_BG,
                    border: `1px solid ${GLASS_BORDER}`,
                    boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 80px ${theme.accentGlow}20`,
                }}>
                    <AnimatePresence mode="wait">
                        {player ? (
                            <motion.div key={player.rank} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col">

                                {/* ═══ TOP SECTION (60%): Player + Chart + Info ═══ */}
                                <div className="flex-1 relative min-h-0" style={{ height: '60%' }}>

                                    {/* Tier accent stripe at top */}
                                    <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
                                        style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight}, ${theme.accent})` }} />

                                    {/* Tier label — top-left corner */}
                                    <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                                        className="absolute top-3 left-3 z-30 flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full font-black text-[0.6rem] tracking-[0.15em]"
                                            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`, color: theme.badgeText }}>
                                            {theme.tierLabel}
                                        </span>
                                        {player.nationality === 'Overseas' && (
                                            <span className="px-2 py-0.5 rounded-full text-[0.55rem] font-bold"
                                                style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}`, color: theme.accentLight }}>
                                                🌍 OVERSEAS
                                            </span>
                                        )}
                                    </motion.div>

                                    {/* Large rank number — center, behind everything */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
                                        style={{ paddingLeft: '10%' }}>
                                        <span style={{
                                            fontSize: 'clamp(12rem, 22vw, 20rem)', fontFamily: "'Cinzel', serif", fontWeight: 900,
                                            color: theme.accent, opacity: 0.06, lineHeight: 1,
                                        }}>{player.rank}</span>
                                    </div>

                                    {/* Spider chart — center-ish */}
                                    <div className="absolute z-[5] pointer-events-none"
                                        style={{ top: '8%', left: '22%', width: '42%', height: '90%' }}>
                                        <SpiderChart stats={getStats(player)} theme={theme} />
                                    </div>

                                    {/* Player Image — bottom-left corner, like the reference */}
                                    <motion.div
                                        initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1, duration: 0.5 }}
                                        className="absolute bottom-0 left-0 z-10"
                                        style={{ width: '38%', height: '95%' }}>
                                        {/* Glow under player */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 z-0"
                                            style={{ background: `radial-gradient(ellipse at 50% 100%, ${theme.accentGlow} 0%, transparent 65%)` }} />
                                        {!player.isRiddle && player.imageUrl ? (
                                            player.imageUrl.startsWith('/') ? (
                                                <Image src={player.imageUrl} alt={player.player} fill priority sizes="35vw"
                                                    className="object-contain object-bottom z-10"
                                                    style={{ filter: `drop-shadow(0 6px 20px rgba(0,0,0,0.6)) drop-shadow(0 0 25px ${theme.accentGlow})` }} />
                                            ) : (
                                                <img src={player.imageUrl} alt={player.player}
                                                    className="absolute inset-0 w-full h-full object-contain object-bottom z-10"
                                                    style={{ filter: `drop-shadow(0 6px 20px rgba(0,0,0,0.6))` }}
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            )
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-24 h-24 rounded-full flex items-center justify-center"
                                                    style={{ background: `radial-gradient(circle, ${theme.accent}25, transparent)`, border: `2px solid ${GLASS_BORDER}` }}>
                                                    <span style={{ fontSize: '3rem', fontFamily: "'Cinzel', serif", color: theme.accentLight }}>
                                                        {player.isRiddle ? '?' : player.player.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Player Info — right side */}
                                    <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center p-5 pr-6"
                                        style={{ width: '42%' }}>

                                        {/* Name */}
                                        <motion.h2 initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                                            className="font-black text-white leading-[0.95] mb-1"
                                            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', fontFamily: "'Cinzel', serif" }}>
                                            {player.isRiddle ? '???' : player.player}
                                        </motion.h2>
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
                                            className="flex items-center gap-1.5 mb-4">
                                            <span className="text-[0.75rem]" style={{ color: TEXT_SEC }}>{player.category}</span>
                                            <span style={{ color: `${theme.accent}40` }}>·</span>
                                            <span className="text-[0.75rem]" style={{ color: TEXT_SEC }}>{player.team}</span>
                                        </motion.div>

                                        {/* 3 Stat Cards */}
                                        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 }}
                                            className="grid grid-cols-3 gap-2 mb-3">
                                            {[
                                                { icon: '⭐', lbl: 'Rating', val: String(player.rating) },
                                                { icon: '🏆', lbl: 'Legacy', val: String(player.legacy) },
                                                { icon: '💰', lbl: 'Base', val: `₹${player.basePrice}CR` },
                                            ].map((c) => (
                                                <div key={c.lbl} className="rounded-xl p-2.5 text-center"
                                                    style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                    <div className="text-sm mb-0.5">{c.icon}</div>
                                                    <div className="text-[0.5rem] uppercase tracking-wider mb-0.5" style={{ color: TEXT_SEC }}>{c.lbl}</div>
                                                    <div className="text-xl font-black" style={{ color: theme.accentLight, fontFamily: "'Cinzel', serif" }}>{c.val}</div>
                                                </div>
                                            ))}
                                        </motion.div>

                                        {/* 2×2 Info Grid */}
                                        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                                            className="grid grid-cols-2 gap-1.5">
                                            {[
                                                { lbl: 'Nationality', val: player.nationality === 'Indian' ? '🇮🇳 Indian' : '🌍 Overseas' },
                                                { lbl: 'Pool', val: player.pool },
                                                { lbl: 'Grade', val: `Grade ${player.grade}` },
                                                { lbl: 'Rank', val: `#${player.rank}` },
                                            ].map((c) => (
                                                <div key={c.lbl} className="rounded-lg p-2 text-center"
                                                    style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                    <div className="text-[0.45rem] uppercase tracking-wider" style={{ color: TEXT_SEC }}>{c.lbl}</div>
                                                    <div className="text-[0.8rem] font-bold text-white">{c.val}</div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </div>

                                    {/* OVR circle — top right of the info area */}
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                                        className="absolute top-4 right-5 z-20">
                                        <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                                                boxShadow: `0 4px 20px ${theme.accentGlow}` }}>
                                            <span className="font-black leading-none" style={{ fontSize: '1.3rem', color: theme.badgeText, fontFamily: "'Cinzel', serif" }}>{player.rating}</span>
                                            <span className="text-[0.35rem] tracking-widest uppercase font-bold" style={{ color: `${theme.badgeText}aa` }}>OVR</span>
                                        </div>
                                    </motion.div>

                                    {/* Scan line for A only */}
                                    {player.grade === 'A' && (
                                        <motion.div animate={{ y: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                            className="absolute left-0 right-0 h-px z-[6] pointer-events-none"
                                            style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}50, transparent)` }} />
                                    )}
                                </div>

                                {/* ═══ BOTTOM SECTION (40%): Standings ═══ */}
                                <div className="flex-shrink-0 relative" style={{
                                    height: '40%',
                                    borderTop: `1px solid ${GLASS_BORDER}`,
                                    background: `linear-gradient(180deg, ${GLASS_BG} 0%, rgba(4,8,16,0.5) 100%)`,
                                }}>
                                    <div className="h-full flex">
                                        {/* Team Standings — 2 columns of 5 */}
                                        <div className="flex-1 p-3 overflow-hidden">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <span className="text-xs">🏆</span>
                                                <span className="text-[0.7rem] font-black tracking-widest uppercase"
                                                    style={{ color: theme.accentLight, fontFamily: "'Cinzel', serif" }}>TEAM STANDINGS</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 h-[calc(100%-28px)]">
                                                {sorted.map((team, i) => {
                                                    const pct = (team.budgetRemaining / team.totalBudget) * 100;
                                                    return (
                                                        <motion.div key={team.id}
                                                            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: 0.4 + i * 0.04 }}
                                                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg relative overflow-hidden"
                                                            style={{
                                                                background: i < 3 ? `${theme.accent}08` : 'rgba(255,255,255,0.02)',
                                                                borderLeft: `2px solid ${team.primaryColor || GLASS_BORDER}`,
                                                            }}>
                                                            {/* Rank */}
                                                            <span className="text-[0.65rem] font-black w-4 text-center"
                                                                style={{ color: i < 3 ? theme.accent : `${theme.accent}50` }}>{i + 1}</span>
                                                            {/* Logo */}
                                                            <div className="w-5 h-5 relative flex-shrink-0">
                                                                <Image src={team.logo} alt={team.shortName} fill sizes="20px" className="object-contain" />
                                                            </div>
                                                            {/* Name */}
                                                            <span className="text-[0.75rem] font-bold text-white flex-1 min-w-0 truncate"
                                                                style={{ fontFamily: "'Cinzel', serif" }}>{team.shortName}</span>
                                                            {/* Squad */}
                                                            <span className="text-[0.55rem]" style={{ color: TEXT_SEC }}>{team.squadCount}/{team.squadLimit}</span>
                                                            {/* Budget */}
                                                            <span className="text-[0.8rem] font-black" style={{ color: '#2dd4a0', fontFamily: "'Cinzel', serif" }}>₹{team.budgetRemaining}</span>
                                                            {/* Budget bar at bottom */}
                                                            <div className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{ background: `${theme.accent}08` }}>
                                                                <div className="h-full" style={{ width: `${pct}%`, background: team.primaryColor || theme.accent }} />
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Auction Progress */}
                                        <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 px-4" style={{
                                            width: '180px', borderLeft: `1px solid ${GLASS_BORDER}`,
                                        }}>
                                            <div className="text-[0.5rem] font-black tracking-widest uppercase" style={{ color: TEXT_SEC }}>PROGRESS</div>
                                            <div className="relative w-16 h-16">
                                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke={`${theme.accent}15`} strokeWidth="2.5" />
                                                    <motion.circle cx="18" cy="18" r="14" fill="none" stroke={theme.accent}
                                                        strokeWidth="2.5" strokeLinecap="round"
                                                        strokeDasharray={`${(sold / Math.max(total, 1)) * 88} 100`}
                                                        initial={{ strokeDasharray: '0 100' }}
                                                        animate={{ strokeDasharray: `${(sold / Math.max(total, 1)) * 88} 100` }}
                                                        transition={{ duration: 1, delay: 0.5 }} />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[0.6rem] font-black" style={{ color: theme.accentLight }}>{Math.round((sold / Math.max(total, 1)) * 100)}%</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="text-center">
                                                    <div className="text-[0.4rem] uppercase" style={{ color: TEXT_SEC }}>Sold</div>
                                                    <div className="text-sm font-black" style={{ color: '#2dd4a0', fontFamily: "'Cinzel', serif" }}>{sold}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-[0.4rem] uppercase" style={{ color: TEXT_SEC }}>Left</div>
                                                    <div className="text-sm font-black" style={{ color: '#e74c5e', fontFamily: "'Cinzel', serif" }}>{total - sold}</div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[0.4rem] uppercase" style={{ color: TEXT_SEC }}>Spent</div>
                                                <div className="text-sm font-black" style={{ color: theme.accent, fontFamily: "'Cinzel', serif" }}>₹{spent.toFixed(1)} CR</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center">
                                <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-4">🏏</motion.div>
                                <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "'Cinzel', serif", color: 'rgba(188,220,230,0.4)' }}>NEXT PLAYER INCOMING</h2>
                                <p style={{ color: 'rgba(122,148,176,0.3)', fontSize: '0.9rem' }}>The auctioneer is selecting...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
