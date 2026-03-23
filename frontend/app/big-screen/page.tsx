'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { mockPlayers } from '@/lib/mockData/players';
import { Team } from '@/lib/api/teams';
import { type Player, type AuctionState, getAuctionState } from '@/lib/api/auction';
import { AUCTIONABLE_POWER_CARDS } from '@/lib/mockData/powercards';
import { getAllTeams } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { preloadImages } from '@/lib/utils/playerImage';
import Loader from '@/components/Loader';
import { useAuctionSocket } from '@/lib/hooks/useAuctionSocket';

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

    if (p.pool === 'BAT_WK') return [
        { label: 'SCR', value: p.sub_scoring ?? 0, display: String(p.sub_scoring ?? 0) },
        { label: 'IMP', value: p.sub_impact ?? 0, display: String(p.sub_impact ?? 0) },
        { label: 'CON', value: p.sub_consistency ?? 0, display: String(p.sub_consistency ?? 0) },
        { label: 'EXP', value: p.sub_experience ?? 0, display: String(p.sub_experience ?? 0) }
    ];
    if (p.pool === 'BOWL') return [
        { label: 'WKT', value: p.sub_wickettaking ?? 0, display: String(p.sub_wickettaking ?? 0) },
        { label: 'ECO', value: p.sub_economy ?? 0, display: String(p.sub_economy ?? 0) },
        { label: 'EFF', value: p.sub_efficiency ?? 0, display: String(p.sub_efficiency ?? 0) }
    ];
    return [
        { label: 'BAT', value: p.sub_batting ?? 0, display: String(p.sub_batting ?? 0) },
        { label: 'BWL', value: p.sub_bowling ?? 0, display: String(p.sub_bowling ?? 0) },
        { label: 'VRS', value: p.sub_versatility ?? 0, display: String(p.sub_versatility ?? 0) }
    ];
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
   TEAM AVATAR — Colored circle with initial for teams without logos
   ═══════════════════════════════════════════════════════════ */
const TEAM_COLORS = [
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#2980B9', '#C0392B', '#27AE60',
];

function TeamAvatar({ team, size = 20 }: { team: { logo?: string; shortName: string; name: string; id: string | number }; size?: number }) {
    // If team has a real image logo (starts with /), show it
    if (team.logo && team.logo.startsWith('/')) {
        return (
            <div className="relative flex-shrink-0 rounded overflow-hidden bg-white/5" style={{ width: size, height: size }}>
                <Image src={team.logo} alt={team.shortName} fill sizes={`${size}px`} className="object-contain" />
            </div>
        );
    }
    // Otherwise show colored initial circle
    const colorIdx = typeof team.id === 'string' ? team.id.charCodeAt(0) % TEAM_COLORS.length : Number(team.id) % TEAM_COLORS.length;
    const bgColor = TEAM_COLORS[colorIdx];
    const initial = (team.shortName || team.name)?.[0]?.toUpperCase() || '?';
    return (
        <div className="flex-shrink-0 rounded-full flex items-center justify-center font-black"
            style={{ width: size, height: size, background: `${bgColor}30`, border: `1px solid ${bgColor}60`, color: bgColor, fontSize: size * 0.45 }}>
            {initial}
        </div>
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

    const { on } = useAuctionSocket();

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

    // Fetch initial data and refresh function
    const refreshData = useCallback(async () => {
        try {
            const [state, teamsData] = await Promise.all([getAuctionState(), getAllTeams()]);
            setAuctionState(state as any);
            setTeams(teamsData);
            
            // Preload next player images if possible
            if (state.currentPlayerRank !== null) {
                const idx = mockPlayers.findIndex(p => p.rank === state.currentPlayerRank);
                preloadImages([1, 2].map(o => mockPlayers[idx + o]?.imageUrl));
            }
        } catch (e) {
            console.error("Failed to fetch state:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // WebSocket Event Listeners
    useEffect(() => {
        const unsubs = [
            on('STATE_SYNC', refreshData),
            on('TEAM_STATE_SYNC', refreshData),
            on('PHASE_CHANGED', refreshData),
            on('BID_UPDATED', refreshData),
            on('PLAYER_UNSOLD', refreshData),
            on('FRANCHISE_ASSIGNED', refreshData),
            on('POWER_CARD_USED', refreshData),
            on('PLAYER_ANNOUNCED', refreshData),
            on('ITEM_ANNOUNCED', refreshData),
            on('PLAYER_SOLD', () => {
                setShowSold(true);
                confetti();
                setTimeout(() => setShowSold(false), 3200);
                refreshData();
            }),
            on('RIDDLE_UNVEILED', () => {
                setShowReveal(true);
                confetti();
                setTimeout(() => setShowReveal(false), 4000);
                refreshData();
            })
        ];

        return () => { unsubs.forEach(unsub => unsub()); };
    }, [on, refreshData, confetti]);

    if (!isAuth) return null;

    if (loading || !auctionState) return <Loader text="LOADING AUCTION" />;

    const player = auctionState.currentPlayer;
    const theme = player ? (THEMES[player.grade] ?? THEMES.C) : THEMES.C;
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
                            style={{
                                fontSize: 'clamp(5rem, 14vw, 11rem)', color: theme.accent, fontFamily: "'Cinzel', serif", fontWeight: 900,
                                textShadow: `0 0 60px ${theme.accentGlow}, 0 0 120px ${theme.accentGlow}`
                            }}>
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
                            style={{
                                fontSize: 'clamp(4rem, 12vw, 9rem)', fontFamily: "'Cinzel', serif", fontWeight: 900,
                                color: '#d4af37',
                                textShadow: '0 0 60px rgba(212,175,55,0.6), 0 0 120px rgba(212,175,55,0.3)'
                            }}>
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
                        <div className="relative w-[76px] h-[76px] flex items-center justify-center -ml-2 -mt-1 rounded-full overflow-hidden border border-[rgba(212,175,55,0.4)] shadow-[0_0_20px_rgba(43,181,204,0.15)] bg-black">
                            <Image src="/auction_logo.jpg" alt="IPL" fill className="object-cover" priority />
                        </div>
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
                    </div>
                </motion.header>

                {/* ── MAIN CARD ── */}
                <div className={`flex-1 rounded-2xl overflow-hidden relative ${theme.glowClass}`} style={{
                    background: CARD_BG,
                    border: `1px solid ${GLASS_BORDER}`,
                    boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 80px ${theme.accentGlow}20`,
                }}>
                    <AnimatePresence mode="wait">
                        {auctionState.phase === 'POWER_CARD_PHASE' ? (() => {
                            const powerCardId = auctionState.activePowerCard;
                            const card = AUCTIONABLE_POWER_CARDS.find(c => c.id === powerCardId) || AUCTIONABLE_POWER_CARDS[0];
                            const pcBid = auctionState.currentBid || 0;
                            const highestBidderTeam = teams.find(t => t.id === auctionState.highestBidderId);

                            return (
                                <motion.div key={`pc-${card.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex flex-col">

                                    {/* ═══ TOP SECTION (60%): Card Visual + Info ═══ */}
                                    <div className="flex-1 relative min-h-0" style={{ height: '60%' }}>
                                        {/* Accent stripe */}
                                        <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
                                            style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}80, ${card.color})` }} />

                                        {/* Badge */}
                                        <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                                            className="absolute top-3 left-3 z-30 flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full font-black text-[0.6rem] tracking-[0.15em]"
                                                style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)`, color: '#000' }}>
                                                ⚡ POWER CARD
                                            </span>
                                        </motion.div>

                                        {/* Large background icon */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
                                            style={{ paddingLeft: '10%' }}>
                                            <span style={{ fontSize: 'clamp(12rem, 22vw, 20rem)', opacity: 0.06, lineHeight: 1 }}>
                                                {card.icon}
                                            </span>
                                        </div>

                                        {/* Card Visual — left side */}
                                        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1, duration: 0.5 }}
                                            className="absolute bottom-0 left-0 z-10 flex items-center justify-center"
                                            style={{ width: '38%', height: '95%' }}>
                                            {/* Glow */}
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 z-0"
                                                style={{ background: `radial-gradient(ellipse at 50% 100%, ${card.color}40, transparent 65%)` }} />
                                            <motion.div className="relative z-10 flex flex-col items-center justify-center gap-4">
                                                <motion.div
                                                    className="w-36 h-36 rounded-3xl flex items-center justify-center relative"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${card.color}20, ${card.color}08)`,
                                                        border: `2px solid ${card.color}40`,
                                                        boxShadow: `0 0 60px ${card.color}30, inset 0 0 40px ${card.color}10`,
                                                    }}
                                                    animate={{
                                                        boxShadow: [
                                                            `0 0 40px ${card.color}20, inset 0 0 30px ${card.color}08`,
                                                            `0 0 80px ${card.color}40, inset 0 0 50px ${card.color}15`,
                                                            `0 0 40px ${card.color}20, inset 0 0 30px ${card.color}08`,
                                                        ],
                                                    }}
                                                    transition={{ duration: 3, repeat: Infinity }}>
                                                    <span style={{ fontSize: '5rem', filter: `drop-shadow(0 0 20px ${card.color})` }}>
                                                        {card.icon}
                                                    </span>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>

                                        {/* Card Info — right side */}
                                        <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center p-5 pr-6"
                                            style={{ width: '55%' }}>
                                            {/* Name */}
                                            <motion.h2 initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                                                className="font-black text-white leading-[0.95] mb-2"
                                                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', fontFamily: "'Cinzel', serif" }}>
                                                {card.name}
                                            </motion.h2>
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
                                                className="mb-6">
                                                <span className="text-base font-medium leading-relaxed" style={{ color: 'rgba(122,148,176,0.7)' }}>
                                                    {card.description}
                                                </span>
                                            </motion.div>

                                            {/* Bid Stats Grid */}
                                            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                                                className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl p-3 text-center flex flex-col items-center justify-center"
                                                    style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                    <div className="text-[0.65rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: TEXT_SEC }}>Current Bid</div>
                                                    <div className="text-2xl font-black" style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
                                                        ₹{pcBid ? Number(pcBid).toFixed(1) : '0.0'} <span className="text-sm text-white/50">CR</span>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl p-3 text-center flex flex-col items-center justify-center"
                                                    style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                    <div className="text-[0.65rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: TEXT_SEC }}>Highest Bidder</div>
                                                    {highestBidderTeam ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 relative">
                                                                <Image src={highestBidderTeam.logo} alt={highestBidderTeam.shortName} fill className="object-contain" />
                                                            </div>
                                                            <span className="text-lg font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                                                                {highestBidderTeam.shortName}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-base font-medium text-white/30 italic">Awaiting bids…</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Icon badge — top right */}
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                                            className="absolute top-5 right-6 z-20">
                                            <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                                                style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)`, boxShadow: `0 4px 20px ${card.color}60` }}>
                                                <span style={{ fontSize: '1.6rem' }}>{card.icon}</span>
                                                <span className="text-[0.35rem] tracking-widest uppercase font-bold" style={{ color: '#000a' }}>CARD</span>
                                            </div>
                                        </motion.div>

                                        {/* Scan line */}
                                        <motion.div animate={{ y: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                            className="absolute left-0 right-0 h-px z-[6] pointer-events-none"
                                            style={{ background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)` }} />
                                    </div>

                                    {/* ═══ BOTTOM SECTION (40%): Standings + Rules ═══ */}
                                    <div className="flex-shrink-0 relative" style={{
                                        height: '40%',
                                        borderTop: `1px solid ${GLASS_BORDER}`,
                                        background: `linear-gradient(180deg, ${GLASS_BG} 0%, rgba(4,8,16,0.5) 100%)`,
                                    }}>
                                        <div className="h-full flex">
                                            {/* Team Standings */}
                                            <div className="flex-1 p-3 overflow-hidden">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <span className="text-xs">🏆</span>
                                                    <span className="text-[0.7rem] font-black tracking-widest uppercase"
                                                        style={{ color: card.color, fontFamily: "'Cinzel', serif" }}>TEAM STANDINGS</span>
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
                                                                    background: i < 3 ? `${card.color}08` : 'rgba(255,255,255,0.02)',
                                                                    borderLeft: `2px solid ${GLASS_BORDER}`,
                                                                }}>
                                                                <span className="text-[0.65rem] font-black w-4 text-center"
                                                                    style={{ color: i < 3 ? card.color : `${card.color}50` }}>{i + 1}</span>
                                                                <div className="w-5 h-5 relative flex-shrink-0">
                                                                    <Image src={team.logo} alt={team.shortName} fill sizes="20px" className="object-contain" />
                                                                </div>
                                                                <span className="text-[0.75rem] font-bold text-white flex-1 min-w-0 truncate"
                                                                    style={{ fontFamily: "'Cinzel', serif" }}>{team.shortName}</span>
                                                                <span className="text-[0.55rem]" style={{ color: TEXT_SEC }}>{team.squadCount}/{team.squadLimit}</span>
                                                                <span className="text-[0.8rem] font-black" style={{ color: '#2dd4a0', fontFamily: "'Cinzel', serif" }}>₹{team.budgetRemaining}</span>
                                                                <div className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{ background: `${card.color}08` }}>
                                                                    <div className="h-full" style={{ width: `${pct}%`, background: card.color }} />
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Card Rules panel */}
                                            <div className="flex-shrink-0 flex flex-col gap-1 px-4 py-3" style={{
                                                width: '220px', borderLeft: `1px solid ${GLASS_BORDER}`,
                                            }}>
                                                <div className="text-[0.55rem] font-black tracking-widest uppercase" style={{ color: card.color }}>
                                                    📋 CARD RULES
                                                </div>
                                                <div className="flex-1 overflow-auto space-y-2 mt-1">
                                                    {card.rules.map((rule: string, idx: number) => (
                                                        <div key={idx} className="flex gap-2 items-start">
                                                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: card.color }} />
                                                            <span className="text-white/60 text-[0.65rem] leading-relaxed">{rule}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })() : player ? (
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
                                            className="font-black text-white leading-[0.95] mb-2"
                                            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', fontFamily: "'Cinzel', serif" }}>
                                            {player.isRiddle ? '???' : player.player}
                                        </motion.h2>
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
                                            className="mb-8">
                                            <span className="text-xl font-medium tracking-wide" style={{ color: TEXT_SEC }}>
                                                {player.role}
                                            </span>
                                        </motion.div>

                                        {/* Stats Grid */}
                                        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                                            className="grid grid-cols-2 gap-3">
                                            {[
                                                { lbl: 'Grade', val: `Grade ${player.grade}` },
                                                { lbl: 'Nationality', val: player.nationality === 'Indian' ? '🇮🇳 Indian' : '🌍 Overseas' },
                                            ].map((c) => (
                                                <div key={c.lbl} className="rounded-xl p-3 text-center flex flex-col items-center justify-center"
                                                    style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                    <div className="text-[0.65rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: TEXT_SEC }}>{c.lbl}</div>
                                                    <div className="text-xl font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>{c.val}</div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </div>

                                    {/* OVR circle — top right of the info area */}
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                                        className="absolute top-5 right-6 z-20">
                                        <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                                                boxShadow: `0 4px 20px ${theme.accentGlow}`
                                            }}>
                                            <span className="font-black leading-none" style={{ fontSize: '1.5rem', color: theme.badgeText, fontFamily: "'Cinzel', serif" }}>{player.rating}</span>
                                            <span className="text-[0.4rem] tracking-widest uppercase font-bold" style={{ color: `${theme.badgeText}aa` }}>OVR</span>
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
                                                                borderLeft: `2px solid ${GLASS_BORDER}`,
                                                            }}>
                                                            {/* Rank */}
                                                            <span className="text-[0.65rem] font-black w-4 text-center"
                                                                style={{ color: i < 3 ? theme.accent : `${theme.accent}50` }}>{i + 1}</span>
                                                            {/* Logo */}
                                                            <TeamAvatar team={team} size={20} />
                                                            {/* Name */}
                                                            <span className="text-[0.75rem] font-bold text-white flex-1 min-w-0 truncate"
                                                                style={{ fontFamily: "'Cinzel', serif" }}>{team.shortName}</span>
                                                            {/* Squad */}
                                                            <span className="text-[0.55rem]" style={{ color: TEXT_SEC }}>{team.squadCount}/{team.squadLimit}</span>
                                                            {/* Budget */}
                                                            <span className="text-[0.8rem] font-black" style={{ color: '#2dd4a0', fontFamily: "'Cinzel', serif" }}>₹{team.budgetRemaining}</span>
                                                            {/* Budget bar at bottom */}
                                                            <div className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{ background: `${theme.accent}08` }}>
                                                                <div className="h-full" style={{ width: `${pct}%`, background: theme.accent }} />
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
                        ) : auctionState.phase === 'FRANCHISE_PHASE' ? (() => {
                            // Map franchise IDs to names
                            const FRANCHISE_NAMES: Record<string, { name: string; short: string; color: string }> = {
                                '1': { name: 'Mumbai Indians', short: 'MI', color: '#004BA0' },
                                '2': { name: 'Chennai Super Kings', short: 'CSK', color: '#FFCB05' },
                                '3': { name: 'Royal Challengers Bangalore', short: 'RCB', color: '#EC1C24' },
                                '4': { name: 'Kolkata Knight Riders', short: 'KKR', color: '#3A225D' },
                                '5': { name: 'Delhi Capitals', short: 'DC', color: '#17479E' },
                                '6': { name: 'Rajasthan Royals', short: 'RR', color: '#EA1A85' },
                                '7': { name: 'Sunrisers Hyderabad', short: 'SRH', color: '#F26522' },
                                '8': { name: 'Punjab Kings', short: 'PBKS', color: '#D71920' },
                                '9': { name: 'Lucknow Super Giants', short: 'LSG', color: '#A72056' },
                                '10': { name: 'Gujarat Titans', short: 'GT', color: '#1C1C2B' },
                            };
                            const franchiseId = auctionState.currentItemId || '';
                            const franchise = FRANCHISE_NAMES[franchiseId] || null;
                            const fcColor = franchise?.color || '#8B5CF6';
                            const highestBidderTeam = teams.find(t => t.id === auctionState.highestBidderId);
                            const currentBid = auctionState.currentBid || 0;
                            const hasFranchise = !!franchise;

                            return (
                                <motion.div key={`franchise-${franchiseId}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex flex-col">

                                    {/* ═══ TOP SECTION (60%): Franchise Visual + Info ═══ */}
                                    <div className="flex-1 relative min-h-0" style={{ height: '60%' }}>
                                        {/* Accent stripe */}
                                        <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
                                            style={{ background: `linear-gradient(90deg, ${fcColor}, ${fcColor}80, ${fcColor})` }} />

                                        {/* Badge */}
                                        <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                                            className="absolute top-3 left-3 z-30 flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full font-black text-[0.6rem] tracking-[0.15em]"
                                                style={{ background: `linear-gradient(135deg, ${fcColor}, ${fcColor}cc)`, color: '#fff' }}>
                                                🏢 FRANCHISE RIGHTS AUCTION
                                            </span>
                                        </motion.div>

                                        {hasFranchise ? (
                                            <>
                                                {/* Large background text */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
                                                    style={{ paddingLeft: '10%' }}>
                                                    <span style={{
                                                        fontSize: 'clamp(8rem, 16vw, 14rem)', fontFamily: "'Cinzel', serif", fontWeight: 900,
                                                        color: fcColor, opacity: 0.06, lineHeight: 1,
                                                    }}>{franchise!.short}</span>
                                                </div>

                                                {/* Franchise Logo — left side */}
                                                <motion.div
                                                    initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1, duration: 0.5 }}
                                                    className="absolute bottom-0 left-0 z-10 flex items-center justify-center"
                                                    style={{ width: '38%', height: '95%' }}>
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 z-0"
                                                        style={{ background: `radial-gradient(ellipse at 50% 100%, ${fcColor}40, transparent 65%)` }} />
                                                    <motion.div className="relative z-10 flex flex-col items-center justify-center gap-4">
                                                        <motion.div
                                                            className="w-44 h-44 rounded-3xl flex items-center justify-center relative overflow-hidden"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${fcColor}20, ${fcColor}08)`,
                                                                border: `2px solid ${fcColor}40`,
                                                                boxShadow: `0 0 60px ${fcColor}30, inset 0 0 40px ${fcColor}10`,
                                                            }}
                                                            animate={{
                                                                boxShadow: [
                                                                    `0 0 40px ${fcColor}20, inset 0 0 30px ${fcColor}08`,
                                                                    `0 0 80px ${fcColor}40, inset 0 0 50px ${fcColor}15`,
                                                                    `0 0 40px ${fcColor}20, inset 0 0 30px ${fcColor}08`,
                                                                ],
                                                            }}
                                                            transition={{ duration: 3, repeat: Infinity }}>
                                                            <Image
                                                                src={`/teams/${franchise!.short.toLowerCase()}.png`}
                                                                alt={franchise!.name}
                                                                width={130} height={130}
                                                                className="object-contain"
                                                                style={{ filter: `drop-shadow(0 0 20px ${fcColor})` }}
                                                            />
                                                        </motion.div>
                                                    </motion.div>
                                                </motion.div>

                                                {/* Franchise Info — right side */}
                                                <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center p-5 pr-6"
                                                    style={{ width: '55%' }}>
                                                    <motion.h2 initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                                                        className="font-black text-white leading-[0.95] mb-2"
                                                        style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', fontFamily: "'Cinzel', serif" }}>
                                                        {franchise!.name}
                                                    </motion.h2>
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
                                                        className="mb-6">
                                                        <span className="text-base font-medium leading-relaxed" style={{ color: 'rgba(122,148,176,0.7)' }}>
                                                            The winning team acquires this franchise&apos;s brand identity, logo, and an RTM card.
                                                        </span>
                                                    </motion.div>

                                                    {/* Bid Stats Grid */}
                                                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                                                        className="grid grid-cols-3 gap-3">
                                                        <div className="rounded-xl p-3 text-center flex flex-col items-center justify-center"
                                                            style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                            <div className="text-[0.65rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: TEXT_SEC }}>Base Reserve</div>
                                                            <div className="text-2xl font-black" style={{ color: '#d4af37', fontFamily: "'Cinzel', serif" }}>
                                                                ₹3.0 <span className="text-sm text-white/50">CR</span>
                                                            </div>
                                                        </div>
                                                        <div className="rounded-xl p-3 text-center flex flex-col items-center justify-center"
                                                            style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                            <div className="text-[0.65rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: TEXT_SEC }}>Current Bid</div>
                                                            <div className="text-2xl font-black" style={{ color: '#2dd4a0', fontFamily: "'Cinzel', serif" }}>
                                                                ₹{currentBid ? Number(currentBid).toFixed(1) : '3.0'} <span className="text-sm text-white/50">CR</span>
                                                            </div>
                                                        </div>
                                                        <div className="rounded-xl p-3 text-center flex flex-col items-center justify-center"
                                                            style={{ background: 'rgba(45,212,160,0.08)', border: '1px solid rgba(45,212,160,0.2)' }}>
                                                            <div className="text-[0.65rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: '#2dd4a0' }}>Awarded</div>
                                                            <div className="text-lg font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>RTM Card</div>
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                {/* RTM badge — top right */}
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                                                    className="absolute top-5 right-6 z-20">
                                                    <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                                                        style={{ background: `linear-gradient(135deg, ${fcColor}, ${fcColor}cc)`, boxShadow: `0 4px 20px ${fcColor}60` }}>
                                                        <span style={{ fontSize: '1.2rem', filter: `drop-shadow(0 0 10px ${fcColor})` }}>🎫</span>
                                                        <span className="text-[0.35rem] tracking-widest uppercase font-bold" style={{ color: '#fffa' }}>RTM</span>
                                                    </div>
                                                </motion.div>
                                            </>
                                        ) : (
                                            /* ═══ No franchise selected yet — waiting state ═══ */
                                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                                <motion.div
                                                    animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                    className="text-7xl mb-6"
                                                    style={{ filter: `drop-shadow(0 0 30px ${fcColor})` }}>
                                                    🏛️
                                                </motion.div>
                                                <h2 className="font-black text-white mb-3 text-center"
                                                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontFamily: "'Cinzel', serif", textShadow: `0 0 40px ${fcColor}40` }}>
                                                    FRANCHISE RIGHTS AUCTION
                                                </h2>
                                                <motion.p
                                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="text-lg font-medium tracking-widest uppercase"
                                                    style={{ color: `${fcColor}cc` }}>
                                                    Awaiting Auctioneer…
                                                </motion.p>
                                            </div>
                                        )}

                                        {/* Scan line */}
                                        <motion.div animate={{ y: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                            className="absolute left-0 right-0 h-px z-[6] pointer-events-none"
                                            style={{ background: `linear-gradient(90deg, transparent, ${fcColor}50, transparent)` }} />
                                    </div>

                                    {/* ═══ BOTTOM SECTION (40%): Team Standings ═══ */}
                                    <div className="flex-shrink-0 relative" style={{
                                        height: '40%',
                                        borderTop: `1px solid ${GLASS_BORDER}`,
                                        background: `linear-gradient(180deg, ${GLASS_BG} 0%, rgba(4,8,16,0.5) 100%)`,
                                    }}>
                                        <div className="h-full flex">
                                            {/* Team Standings */}
                                            <div className="flex-1 p-3 overflow-hidden">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <span className="text-xs">🏆</span>
                                                    <span className="text-[0.7rem] font-black tracking-widest uppercase"
                                                        style={{ color: fcColor, fontFamily: "'Cinzel', serif" }}>TEAM STANDINGS</span>
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
                                                                    background: i < 3 ? `${fcColor}08` : 'rgba(255,255,255,0.02)',
                                                                    borderLeft: `2px solid ${GLASS_BORDER}`,
                                                                }}>
                                                                <span className="text-[0.65rem] font-black w-4 text-center"
                                                                    style={{ color: i < 3 ? fcColor : `${fcColor}50` }}>{i + 1}</span>
                                                                <TeamAvatar team={team} size={20} />
                                                                <span className="text-[0.75rem] font-bold text-white flex-1 min-w-0 truncate"
                                                                    style={{ fontFamily: "'Cinzel', serif" }}>{team.shortName}</span>
                                                                <span className="text-[0.55rem]" style={{ color: TEXT_SEC }}>{team.squadCount}/{team.squadLimit}</span>
                                                                <span className="text-[0.8rem] font-black" style={{ color: '#2dd4a0', fontFamily: "'Cinzel', serif" }}>₹{team.budgetRemaining}</span>
                                                                <div className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{ background: `${fcColor}08` }}>
                                                                    <div className="h-full" style={{ width: `${pct}%`, background: fcColor }} />
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Franchise Info panel */}
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3 px-4 py-3" style={{
                                                width: '220px', borderLeft: `1px solid ${GLASS_BORDER}`,
                                            }}>
                                                <div className="text-[0.55rem] font-black tracking-widest uppercase" style={{ color: fcColor }}>
                                                    📋 FRANCHISE DETAILS
                                                </div>
                                                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                                                    <div className="rounded-xl p-3 text-center w-full" style={{ background: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}>
                                                        <div className="text-[0.6rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: TEXT_SEC }}>Highest Bidder</div>
                                                        {highestBidderTeam ? (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <span className="text-base font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                                                                    {highestBidderTeam.shortName || highestBidderTeam.name}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm font-medium text-white/30 italic">Awaiting bids…</span>
                                                        )}
                                                    </div>
                                                    <div className="rounded-xl p-3 text-center w-full" style={{ background: 'rgba(45,212,160,0.08)', border: '1px solid rgba(45,212,160,0.2)' }}>
                                                        <div className="text-[0.6rem] uppercase tracking-wider mb-1 font-semibold" style={{ color: '#2dd4a0' }}>Awarded</div>
                                                        <div className="text-lg font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>RTM Card</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })() : auctionState.phase === 'NOT_STARTED' || auctionState.phase === 'PRE_AUCTION' ? (
                            <motion.div key="not-started" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center">
                                <motion.div className="w-40 h-40 relative flex items-center justify-center rounded-full overflow-hidden border-2 border-[rgba(212,175,55,0.4)] shadow-[0_0_40px_rgba(212,175,55,0.2)] bg-black mb-8"
                                            animate={{ boxShadow: ['0 0 20px rgba(212,175,55,0.2)', '0 0 60px rgba(212,175,55,0.4)', '0 0 20px rgba(212,175,55,0.2)'] }}
                                            transition={{ duration: 3, repeat: Infinity }}>
                                    <Image src="/auction_logo.jpg" alt="IPL Logo" fill className="object-cover" />
                                </motion.div>
                                <h2 className="font-black mb-2 text-center text-white" 
                                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Cinzel', serif", textShadow: '0 0 40px rgba(212,175,55,0.4)' }}>
                                    WELCOME TO IPL AUCTION 2026
                                </h2>
                                <p className="text-lg font-medium tracking-widest uppercase mt-4" style={{ color: 'rgba(212,175,55,0.8)' }}>
                                    PREPARE FOR THE ULTIMATE SHOWDOWN
                                </p>
                            </motion.div>
                        ) : auctionState.phase === 'POST_AUCTION' || auctionState.phase === 'COMPLETED' ? (
                            <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center">
                                <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity }} className="text-8xl mb-6 filter drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">
                                    🏆
                                </motion.div>
                                <h2 className="font-black mb-2 text-center text-[#d4af37]" 
                                    style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontFamily: "'Cinzel', serif", textShadow: '0 0 40px rgba(212,175,55,0.4)' }}>
                                    AUCTION CONCLUDED
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }} className="mt-4 tracking-widest uppercase font-bold text-center max-w-2xl">
                                    Thank you for participating in the most spectacular auction. <br/> See you on the pitch!
                                </p>
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
