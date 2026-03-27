'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { mockPlayers } from '@/lib/mockData/players';
import { Team, getTeamLeaderboard, getAllTeams } from '@/lib/api/teams';
import { type Player, type AuctionState, getAuctionState } from '@/lib/api/auction';
import { AUCTIONABLE_POWER_CARDS } from '@/lib/mockData/powercards';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { preloadImages } from '@/lib/utils/playerImage';
import Loader from '@/components/Loader';
import SubRatingsDisplay from '@/components/SubRatingsDisplay';
import { useAuctionSocket } from '@/lib/hooks/useAuctionSocket';
import { getPowerCardImage, getPowerCardName } from '@/lib/utils/powerCard';
import TeamAvatar from '@/components/team/TeamAvatar';
import { getAllFranchises } from '@/lib/api/admin';

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
        accent: '#c0c0c0', accentLight: '#ffffff', accentGlow: 'rgba(192,192,192,0.4)',
        badgeText: '#1a1a1a', glowClass: 'glow-pulse', tierLabel: 'ELITE',
    },
    C: {
        accent: '#cd7f32', accentLight: '#e8a365', accentGlow: 'rgba(205,127,50,0.4)',
        badgeText: '#2a1604', glowClass: '', tierLabel: 'RISING',
    },
};

// Unified premium background constants
const CARD_BG = 'linear-gradient(135deg, #050b14 0%, #0a1628 25%, #081220 50%, #040910 100%)';
const GLASS_BG = 'rgba(43,181,204,0.06)';
const GLASS_BORDER = 'rgba(43,181,204,0.15)';
const TEXT_SEC = 'rgba(122,148,176,0.5)';

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
// Franchise type for big-screen use
interface FranchiseInfo {
    id: number;
    name: string;
    short_name: string;
}

// Fallback color map by short_name for visual accent
const FRANCHISE_COLORS: Record<string, string> = {
    MI: '#004BA0', CSK: '#FFCB05', RCB: '#EC1C24', KKR: '#3A225D',
    DC: '#17479E', RR: '#EA1A85', SRH: '#F26522', PBKS: '#D71920',
    LSG: '#A72056', GT: '#1C1C2B',
};

export default function BigScreenPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [franchises, setFranchises] = useState<FranchiseInfo[]>([]);
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

    const refreshData = useCallback(async () => {
        try {
            const [state, teamsData] = await Promise.all([getAuctionState(), getAllTeams()]);
            setAuctionState(state as any);
            setTeams(teamsData);
            
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

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    useEffect(() => {
        getAllFranchises()
            .then((data: any[]) => setFranchises(data))
            .catch(err => console.error('Failed to load franchises:', err));
    }, []);

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
        <div className="h-screen w-screen overflow-hidden relative" style={{ background: `radial-gradient(circle at 50% 50%, ${theme.accent}20 0%, #03060a 80%)` }}>
            <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(ellipse at 30% 40%, ${theme.accentLight} 0%, transparent 60%)`,
                opacity: 0.1,
            }} />

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
                    </div>
                </motion.header>

                <div className={`flex-1 rounded-2xl overflow-hidden relative ${theme.glowClass}`} style={{
                    background: CARD_BG,
                    border: `1px solid ${GLASS_BORDER}`,
                    boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 80px ${theme.accentGlow}20`,
                }}>
                    <AnimatePresence mode="wait">
                        {auctionState.phase === 'POWER_CARD_PHASE' ? (() => {
                            const powerCardId = auctionState.currentItemId || auctionState.activePowerCard;
                            if (!powerCardId) {
                                return (
                                    <motion.div key="pc-waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="h-full w-full relative overflow-hidden">
                                        {/* BG: Asymmetric cyan glow bottom-right */}
                                        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 75% 70%, rgba(43,181,204,0.2) 0%, transparent 50%), radial-gradient(ellipse at 10% 20%, rgba(126,234,245,0.06) 0%, transparent 40%)' }} />
                                        {/* Giant ⚡ watermark */}
                                        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 z-[1] pointer-events-none select-none" style={{ fontSize: '28rem', lineHeight: 1, opacity: 0.03, color: '#2bb5cc' }}>⚡</div>
                                        {/* Horizontal circuit traces */}
                                        <motion.div className="absolute top-[25%] left-0 right-0 h-[1px] z-[2]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(43,181,204,0.3) 20%, rgba(43,181,204,0.5) 50%, transparent 70%)' }}
                                            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                                        <motion.div className="absolute top-[75%] left-0 right-0 h-[1px] z-[2]" style={{ background: 'linear-gradient(90deg, transparent 30%, rgba(43,181,204,0.4) 60%, rgba(43,181,204,0.3) 80%, transparent 100%)' }}
                                            animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
                                        {/* Vertical accent bar left */}
                                        <motion.div className="absolute left-[8%] top-[15%] bottom-[15%] w-[2px] z-[3]"
                                            style={{ background: 'linear-gradient(180deg, transparent, #2bb5cc, transparent)' }}
                                            animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                                        {/* Hex grid overlay right side */}
                                        <svg className="absolute right-0 top-0 bottom-0 w-[40%] h-full z-[1] pointer-events-none" style={{ opacity: 0.04 }}>
                                            <defs><pattern id="hexgrid" width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                                                <polygon points="30,2 54,15 54,37 30,50 6,37 6,15" fill="none" stroke="#2bb5cc" strokeWidth="1" />
                                            </pattern></defs>
                                            <rect width="100%" height="100%" fill="url(#hexgrid)" />
                                        </svg>
                                        {/* Particles */}
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div key={i} className="absolute rounded-full pointer-events-none z-[2]"
                                                style={{ width: 2 + (i % 3), height: 2 + (i % 3), background: 'rgba(43,181,204,0.5)', left: `${50 + (i * 6) % 45}%`, top: `${10 + (i * 12) % 80}%`, boxShadow: '0 0 6px rgba(43,181,204,0.4)' }}
                                                animate={{ y: [0, -20 - (i % 3) * 10, 0], opacity: [0.1, 0.5, 0.1] }}
                                                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} />
                                        ))}
                                        {/* LEFT-ALIGNED content — unique asymmetric layout */}
                                        <div className="relative z-10 h-full flex items-center pl-[12%]">
                                            <div className="flex flex-col">
                                                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}
                                                    className="flex items-center gap-4 mb-6">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#2bb5cc]/40 relative" style={{ boxShadow: '0 0 20px rgba(43,181,204,0.3)' }}>
                                                        <Image src="/auction_logo.jpg" alt="IPL" fill className="object-cover" />
                                                    </div>
                                                    <div className="h-[1px] w-12" style={{ background: 'linear-gradient(90deg, #2bb5cc, transparent)' }} />
                                                    <span className="text-[10px] font-black tracking-[0.5em] uppercase px-4 py-1 border border-[#2bb5cc]/30 rounded" style={{ color: '#7eeaf5', background: 'rgba(43,181,204,0.06)' }}>Phase II</span>
                                                </motion.div>
                                                <motion.h2 initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}>
                                                    <span className="text-7xl md:text-8xl font-black uppercase block leading-[0.9]" style={{ fontFamily: "'Cinzel', serif", background: 'linear-gradient(135deg, #ffffff 0%, #7eeaf5 60%, #2bb5cc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 30px rgba(43,181,204,0.4))' }}>
                                                        Power<br />Card
                                                    </span>
                                                </motion.h2>
                                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                                                    className="mt-6 flex items-center gap-3">
                                                    <div className="w-8 h-[2px] bg-[#2bb5cc]/60" />
                                                    <span className="text-base tracking-[0.2em] uppercase font-medium" style={{ color: 'rgba(126,234,245,0.5)' }}>Strategic Advantages Await</span>
                                                </motion.div>
                                                <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}
                                                    className="mt-6 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2bb5cc]" />
                                                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: '#7eeaf5' }}>Preparing Next Advantage</span>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }
                            const card = AUCTIONABLE_POWER_CARDS.find(c => c.id.toLowerCase() === powerCardId?.toLowerCase()) || AUCTIONABLE_POWER_CARDS[0];
                            const pcBid = auctionState.currentBid || 0;
                            return (
                                <motion.div key={`pc-${card.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex flex-col">
                                    <div className="flex-1 relative min-h-0" style={{ height: '100%' }}>
                                        <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
                                            style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}80, ${card.color})` }} />
                                        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1, duration: 0.5 }}
                                            className="absolute bottom-0 left-0 z-10 flex items-center justify-center pl-10"
                                            style={{ width: '45%', height: '100%' }}>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 z-0"
                                                style={{ background: `radial-gradient(ellipse at 50% 100%, ${card.color}40, transparent 65%)` }} />
                                            <motion.div className="relative z-10 flex flex-col items-center justify-center gap-4 w-full h-full pb-10">
                                                <motion.div
                                                    className="w-[380px] h-[550px] rounded-[2rem] flex items-center justify-center relative overflow-hidden"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${card.color}20, ${card.color}08)`,
                                                        border: `2px solid ${card.color}40`,
                                                        boxShadow: `0 0 80px ${card.color}40, inset 0 0 50px ${card.color}20`,
                                                    }}
                                                    animate={{
                                                        boxShadow: [
                                                            `0 0 40px ${card.color}20, inset 0 0 30px ${card.color}08`,
                                                            `0 0 80px ${card.color}40, inset 0 0 50px ${card.color}15`,
                                                            `0 0 40px ${card.color}20, inset 0 0 30px ${card.color}08`,
                                                        ],
                                                    }}
                                                    transition={{ duration: 3, repeat: Infinity }}>
                                                    <Image src={getPowerCardImage(powerCardId || 'finalStrike')} alt={card.name} fill className="object-contain p-2" />
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>

                                        <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center p-12 pr-16"
                                            style={{ width: '55%' }}>
                                            <motion.h2 initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                                                className="font-black text-white leading-[0.95] mb-6 drop-shadow-lg"
                                                style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', fontFamily: "'Cinzel', serif" }}>
                                                {card.name}
                                            </motion.h2>
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
                                                className="mb-12 max-w-2xl">
                                                <span className="text-2xl font-medium leading-relaxed" style={{ color: 'rgba(122,148,176,0.9)' }}>
                                                    {card.description}
                                                </span>
                                            </motion.div>
                                            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                                                className="grid grid-cols-1 gap-4 w-2/3 max-w-md">
                                                <div className="rounded-2xl p-6 text-center flex flex-col items-center justify-center"
                                                    style={{ background: GLASS_BG, border: `2px solid ${GLASS_BORDER}` }}>
                                                    <div className="text-[0.95rem] uppercase tracking-widest mb-3 font-bold" style={{ color: TEXT_SEC }}>Base Price</div>
                                                    <div className="text-6xl font-black tracking-tight" style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", textShadow: '0 0 30px rgba(212,175,55,0.4)' }}>
                                                        ₹{pcBid ? Number(pcBid).toFixed(1) : '0.0'} <span className="text-3xl font-bold text-white/50">CR</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })() : player ? (
                            <motion.div key={player.rank} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col relative overflow-hidden">

                                {/* ═══ RIDDLE OVERLAY (STRICT LAYER) ═══ */}
                                <AnimatePresence>
                                    {player.isRiddle && (
                                        <motion.div key="riddle-layer"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
                                            style={{ background: '#05080c' }}
                                        >
                                            <div className="relative z-10 w-[85%] max-w-4xl p-12 rounded-[3rem] border border-white/10 backdrop-blur-3xl bg-white/5 text-center">
                                                <div className="text-6xl mb-8">🎭</div>
                                                <h3 className="text-white/40 text-xs font-black tracking-[0.6em] uppercase mb-4">
                                                    {auctionState.riddleClue?.title || player.riddleTitle || "Mystery Player"}
                                                </h3>
                                                <h2 className="text-white font-black italic uppercase tracking-tighter leading-tight max-h-[45vh] overflow-y-auto"
                                                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.8rem)' }}>
                                                    &quot;{auctionState.riddleClue?.question || player.riddleQuestion || "Mystery awaits..."}&quot;
                                                </h2>
                                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                                                    className="mt-12 text-white/20 text-xs font-black tracking-[1em] uppercase">
                                                    Awaiting Unveiling...
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* ═══ UNDERLYING PLAYER UI (Familiar Layout) ═══ */}
                                <div className={`flex-1 flex flex-col transition-all duration-1000 ${player.isRiddle ? 'opacity-0 scale-95 blur-2xl' : 'opacity-1 scale-100 blur-0'}`}>
                                    <div className="flex-1 relative min-h-0" style={{ height: '100%' }}>
                                        <div className="flex w-full h-full relative z-10 px-8 py-6 gap-8 items-stretch justify-center">
                                            
                                            {/* LEFT: PLAYER IMAGE */}
                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                className="w-[35%] h-full relative rounded-[2.5rem] overflow-hidden flex items-end justify-center"
                                                style={{
                                                    background: `linear-gradient(to bottom, #0a1018, ${theme.accent}33)`, 
                                                    border: `3px solid ${theme.accent}`,
                                                    boxShadow: `0 30px 60px rgba(0,0,0,0.6)`
                                                }}>
                                                {player.imageUrl ? (
                                                    <img src={player.imageUrl} alt={player.player} 
                                                        className="absolute inset-x-0 bottom-0 w-full h-[95%] object-contain object-bottom" />
                                                ) : (
                                                    <span style={{ fontSize: '8rem', color: theme.accent, fontWeight: 900, opacity: 0.2 }}>{player.player.charAt(0)}</span>
                                                )}
                                            </motion.div>

                                            {/* RIGHT: STATS & INFO */}
                                            <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                                className="w-[65%] h-full flex flex-col gap-4 justify-between">
                                                
                                                {/* STATS (Replaced Spider Chart) */}
                                                <div className="p-5 lg:p-6 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-xl">
                                                    <SubRatingsDisplay player={player} animate={true} hideOverall={true} themeColor={theme.accentLight} />
                                                </div>

                                                {/* INFO BOX */}
                                                <div className="flex-1 rounded-[2.5rem] p-5 lg:p-7 flex flex-col justify-between relative overflow-hidden"
                                                    style={{ background: `linear-gradient(135deg, rgba(10,16,24,0.95) 0%, ${theme.accent}20 100%)`, border: `2px solid ${theme.accent}55` }}>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                                            <span className="px-3 py-1 rounded-full font-black text-[0.65rem] tracking-[0.2em] bg-black/60 shadow-md whitespace-nowrap" style={{ color: theme.accentLight, border: `1px solid ${theme.accent}` }}>
                                                                GRADE {player.grade}
                                                            </span>
                                                            <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                                                                {player.role || player.category}
                                                            </span>
                                                            <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                                                                {player.nationality_raw || (player.nationality === 'Indian' ? 'Indian' : 'Overseas')}
                                                            </span>
                                                        </div>
                                                        <h2 className="font-black text-white leading-tight uppercase tracking-tighter"
                                                            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', textShadow: `0 4px 20px ${theme.accentGlow}` }}>
                                                            {player.player}
                                                        </h2>
                                                    </div>

                                                    <div className="flex items-end justify-between pt-3 border-t gap-4" style={{ borderColor: `${theme.accent}33` }}>
                                                        <div className="flex flex-col">
                                                            <div className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-white/40 mb-1">Base Price</div>
                                                            <div className="flex items-baseline gap-1 relative -bottom-1">
                                                                <span className="text-lg font-bold text-white/20 uppercase tracking-widest">₹</span>
                                                                <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums">
                                                                    {player.basePrice?.toFixed(2) || '0.50'}
                                                                </div>
                                                                <div className="text-xs font-black text-white/30 tracking-widest uppercase pb-1">Cr</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <div className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-white/40 mb-1 text-right">Overall</div>
                                                            <div className="text-3xl font-black text-white italic tracking-tighter leading-none tabular-nums relative -bottom-1" style={{ color: theme.accentLight }}>
                                                                {player.rating}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Scan line */}
                                    <motion.div animate={{ y: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-px z-[6] pointer-events-none"
                                        style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}50, transparent)` }} />
                                </div>
                            </motion.div>
                        ) : (auctionState.phase === 'FRANCHISE_PHASE') ? (() => {
                            const franchiseId = auctionState.currentItemId || '';
                            const rawFranchise = franchises.find(f => f.id.toString() === franchiseId || f.short_name === franchiseId) || null;
                            const franchise = rawFranchise ? { name: rawFranchise.name, short: rawFranchise.short_name, color: FRANCHISE_COLORS[rawFranchise.short_name] || '#8B5CF6' } : null;
                            const fcColor = franchise?.color || '#8B5CF6';
                            const currentBid = auctionState.currentBid || 0;
                            return (
                                <motion.div key={`franchise-${franchiseId}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                                    <div className="flex-1 relative min-h-0" style={{ height: '60%' }}>
                                        <div className="absolute top-0 left-0 right-0 h-[2px] z-20" style={{ background: `linear-gradient(90deg, ${fcColor}, ${fcColor}80, ${fcColor})` }} />
                                        {franchise ? (
                                            <>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]" style={{ paddingLeft: '10%' }}>
                                                    <span style={{ fontSize: 'clamp(8rem, 16vw, 14rem)', fontFamily: "'Cinzel', serif", fontWeight: 900, color: fcColor, opacity: 0.06, lineHeight: 1 }}>{franchise.short}</span>
                                                </div>
                                                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute bottom-0 left-0 z-10 flex items-center justify-center" style={{ width: '38%', height: '95%' }}>
                                                    {/* Radial glow halo behind logo */}
                                                    <div className="absolute inset-0 pointer-events-none" style={{
                                                        background: `radial-gradient(circle at 50% 55%, ${fcColor}50 0%, ${fcColor}20 35%, transparent 65%)`,
                                                    }} />
                                                    {/* Animated glowing logo container */}
                                                    <motion.div
                                                        className="relative z-10 rounded-full p-4"
                                                        animate={{
                                                            boxShadow: [
                                                                `0 0 30px ${fcColor}30, 0 0 60px ${fcColor}15, inset 0 0 20px ${fcColor}10`,
                                                                `0 0 50px ${fcColor}50, 0 0 100px ${fcColor}25, inset 0 0 40px ${fcColor}20`,
                                                                `0 0 30px ${fcColor}30, 0 0 60px ${fcColor}15, inset 0 0 20px ${fcColor}10`,
                                                            ],
                                                        }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                                        style={{
                                                            border: `2px solid ${fcColor}40`,
                                                            background: `radial-gradient(circle, ${fcColor}15 0%, transparent 70%)`,
                                                        }}
                                                    >
                                                        <Image src={`/teams/${franchise.short.toLowerCase()}.png`} alt={franchise.name} width={130} height={130} className="object-contain drop-shadow-2xl" />
                                                    </motion.div>
                                                </motion.div>
                                                <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center p-5 pr-6" style={{ width: '55%' }}>
                                                    <motion.h2 className="font-black text-white text-4xl mb-2" style={{ fontFamily: "'Cinzel', serif" }}>{franchise.name}</motion.h2>
                                                    <div className="grid grid-cols-1 gap-3 mt-6 max-w-xs">
                                                        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                                                            <div className="text-[0.65rem] uppercase tracking-wider mb-1 text-white/40">Base Price</div>
                                                            <div className="text-2xl font-black text-[#d4af37]">₹3.0 CR</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 overflow-hidden">
                                                {/* BG: Warm gold glow top-left */}
                                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 25% 25%, rgba(212,175,55,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(212,175,55,0.06) 0%, transparent 40%)' }} />
                                                {/* Giant "01" watermark */}
                                                <div className="absolute left-[-3%] bottom-[-10%] z-[1] pointer-events-none select-none" style={{ fontSize: '22rem', fontFamily: "'Cinzel', serif", fontWeight: 900, lineHeight: 1, opacity: 0.025, color: '#d4af37' }}>01</div>
                                                {/* Top decorative gold bar */}
                                                <div className="absolute top-0 left-[10%] right-[10%] h-[2px] z-[3]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(212,175,55,0.8), rgba(212,175,55,0.5), transparent)' }} />
                                                {/* Vertical accent bar right */}
                                                <motion.div className="absolute right-[8%] top-[10%] bottom-[10%] w-[3px] z-[3]"
                                                    style={{ background: 'linear-gradient(180deg, transparent, #d4af37, #f5d569, #d4af37, transparent)' }}
                                                    animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 4, repeat: Infinity }} />
                                                {/* Gold shimmer sweep */}
                                                <motion.div className="absolute inset-0 pointer-events-none z-[1]"
                                                    style={{ background: 'linear-gradient(120deg, transparent 0%, rgba(212,175,55,0.04) 40%, rgba(245,213,105,0.08) 50%, rgba(212,175,55,0.04) 60%, transparent 100%)', backgroundSize: '200% 200%' }}
                                                    animate={{ backgroundPosition: ['-100% -100%', '200% 200%'] }}
                                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 2 }} />
                                                {/* Particles - sparse, elegant */}
                                                {[...Array(6)].map((_, i) => (
                                                    <motion.div key={i} className="absolute rounded-full pointer-events-none z-[2]"
                                                        style={{ width: 2 + (i % 2), height: 2 + (i % 2), background: 'rgba(212,175,55,0.5)', left: `${15 + (i * 14) % 70}%`, top: `${20 + (i * 13) % 60}%`, boxShadow: '0 0 6px rgba(212,175,55,0.3)' }}
                                                        animate={{ y: [0, -15 - (i % 3) * 8, 0], opacity: [0.1, 0.4, 0.1] }}
                                                        transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.6 }} />
                                                ))}
                                                {/* RIGHT-ALIGNED content */}
                                                <div className="relative z-10 h-full flex items-center justify-end pr-[14%]">
                                                    <div className="flex flex-col items-end text-right">
                                                        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}
                                                            className="flex items-center gap-4 mb-4">
                                                            <span className="text-[10px] font-black tracking-[0.5em] uppercase px-4 py-1 border border-[#d4af37]/30 rounded" style={{ color: '#f5d569', background: 'rgba(212,175,55,0.06)' }}>Phase I</span>
                                                            <div className="h-[1px] w-12" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
                                                            <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#d4af37]/30 relative" style={{ boxShadow: '0 0 20px rgba(212,175,55,0.2)' }}>
                                                                <Image src="/auction_logo.jpg" alt="IPL" fill className="object-cover" />
                                                            </div>
                                                        </motion.div>
                                                        <motion.h2 initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}>
                                                            <span className="text-7xl md:text-8xl font-black uppercase block leading-[0.9]" style={{ fontFamily: "'Cinzel', serif", background: 'linear-gradient(135deg, #ffffff 0%, #ffe599 40%, #d4af37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 30px rgba(212,175,55,0.4))' }}>
                                                                Franchise<br />Auction
                                                            </span>
                                                        </motion.h2>
                                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                                                            className="mt-6 flex items-center gap-3">
                                                            <span className="text-base tracking-[0.2em] uppercase font-medium" style={{ color: 'rgba(245,213,105,0.5)' }}>Claim Your Legacy</span>
                                                            <div className="w-8 h-[2px] bg-[#d4af37]/50" />
                                                        </motion.div>
                                                        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
                                                            className="mt-6 flex items-center gap-2">
                                                            <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: '#f5d569' }}>Awaiting Auctioneer</span>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })() : auctionState.phase === 'POST_AUCTION' ? (
                            <motion.div key="post-auction" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full w-full relative overflow-hidden">
                                {/* BG: Centered emerald bloom */}
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(45,212,160,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(43,181,204,0.06) 0%, transparent 40%)' }} />
                                {/* Giant ✓ watermark */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none select-none" style={{ fontSize: '30rem', lineHeight: 1, opacity: 0.025, color: '#2dd4a0' }}>✓</div>
                                {/* Top + bottom accent bars */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] z-[3]" style={{ background: 'linear-gradient(90deg, transparent, rgba(45,212,160,0.6), transparent)' }} />
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] z-[3]" style={{ background: 'linear-gradient(90deg, transparent, rgba(45,212,160,0.4), transparent)' }} />
                                {/* Vertical center line */}
                                <div className="absolute left-1/2 top-[10%] bottom-[10%] w-[1px] z-[2] -translate-x-1/2" style={{ background: 'linear-gradient(180deg, transparent, rgba(45,212,160,0.15), transparent)' }} />
                                {/* Content: centered with progress timeline */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                    {/* Mini logo */}
                                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                                        className="w-20 h-20 rounded-full overflow-hidden border border-[#2dd4a0]/30 relative mb-5" style={{ boxShadow: '0 0 30px rgba(45,212,160,0.2)' }}>
                                        <Image src="/auction_logo.jpg" alt="IPL" fill className="object-cover" />
                                    </motion.div>
                                    {/* Title */}
                                    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                        <span className="text-5xl md:text-6xl font-black uppercase block" style={{ fontFamily: "'Cinzel', serif", background: 'linear-gradient(180deg, #ffffff 0%, #a8f0d4 50%, #2dd4a0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 25px rgba(45,212,160,0.3))' }}>
                                            Auction Complete
                                        </span>
                                    </motion.h2>
                                    {/* PROGRESS TIMELINE — unique to this screen */}
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                        className="mt-8 flex items-center gap-0">
                                        {[
                                            { label: 'Franchise', done: true },
                                            { label: 'Power Cards', done: true },
                                            { label: 'Player Auction', done: true },
                                            { label: 'Playing XI', done: false },
                                        ].map((step, i) => (
                                            <React.Fragment key={i}>
                                                {i > 0 && <div className="w-10 h-[1px]" style={{ background: step.done ? 'rgba(45,212,160,0.4)' : 'rgba(255,255,255,0.1)' }} />}
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step.done ? 'border-[#2dd4a0]/50' : 'border-white/15'}`}
                                                        style={{ border: `1.5px solid`, borderColor: step.done ? 'rgba(45,212,160,0.5)' : 'rgba(255,255,255,0.15)', background: step.done ? 'rgba(45,212,160,0.1)' : 'transparent', color: step.done ? '#2dd4a0' : 'rgba(255,255,255,0.3)' }}>
                                                        {step.done ? '✓' : (i + 1)}
                                                    </div>
                                                    <span className="text-[9px] tracking-[0.15em] uppercase font-bold" style={{ color: step.done ? 'rgba(45,212,160,0.6)' : 'rgba(255,255,255,0.2)' }}>{step.label}</span>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </motion.div>
                                    {/* Status */}
                                    <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
                                        className="mt-8 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4a0]" />
                                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: '#2dd4a0' }}>Submit Your Playing XI</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : auctionState.phase === 'COMPLETED' ? (
                            <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full w-full relative overflow-hidden">
                                {/* BG: Rich gold bloom center */}
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.18) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(245,213,105,0.06) 0%, transparent 40%), radial-gradient(ellipse at 85% 15%, rgba(212,175,55,0.05) 0%, transparent 35%)' }} />
                                {/* Full-width gold bars top & bottom */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] z-[3]" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] z-[3]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />
                                {/* Concentric animated rings */}
                                {[120, 180, 250].map((size, i) => (
                                    <motion.div key={i} className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full z-[1] pointer-events-none"
                                        style={{ width: size, height: size, border: `1px solid rgba(212,175,55,${0.08 - i * 0.02})` }}
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.3 - i * 0.1, 0.6 - i * 0.15, 0.3 - i * 0.1] }}
                                        transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }} />
                                ))}
                                {/* Confetti-like gold particles — dense, celebratory */}
                                {[...Array(20)].map((_, i) => (
                                    <motion.div key={i} className="absolute pointer-events-none z-[2]"
                                        style={{ width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: i % 4 === 0 ? '0' : '50%', transform: i % 4 === 0 ? 'rotate(45deg)' : 'none', background: i % 3 === 0 ? 'rgba(212,175,55,0.7)' : i % 3 === 1 ? 'rgba(245,213,105,0.5)' : 'rgba(255,255,255,0.3)', left: `${3 + (i * 5) % 94}%`, top: `${5 + (i * 7) % 90}%`, boxShadow: `0 0 ${2 + i % 3 * 3}px rgba(212,175,55,0.3)` }}
                                        animate={{ y: [0, -20 - (i % 6) * 8, 0], x: [0, (i % 2 === 0 ? 5 : -5), 0], opacity: [0.05, 0.5, 0.05] }}
                                        transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.25 }} />
                                ))}
                                {/* CONTENT: Trophy-centric celebration layout */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                    {/* Large trophy with glow */}
                                    <motion.div initial={{ scale: 0, rotateY: 180 }} animate={{ scale: 1, rotateY: 0 }} transition={{ duration: 0.8, type: 'spring' }}
                                        className="relative mb-2">
                                        <motion.div className="absolute inset-[-30px] rounded-full"
                                            animate={{ boxShadow: ['0 0 60px rgba(212,175,55,0.15)', '0 0 120px rgba(212,175,55,0.3)', '0 0 60px rgba(212,175,55,0.15)'] }}
                                            transition={{ duration: 2, repeat: Infinity }} />
                                        <div className="text-center" style={{ fontSize: '6rem', filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.5))' }}>🏆</div>
                                    </motion.div>
                                    {/* Title */}
                                    <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                        <span className="text-5xl md:text-7xl font-black uppercase block" style={{ fontFamily: "'Cinzel', serif", background: 'linear-gradient(180deg, #ffffff 0%, #ffe599 30%, #d4af37 70%, #b8941e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 40px rgba(212,175,55,0.5))' }}>
                                            Season Complete
                                        </span>
                                    </motion.h2>
                                    {/* Water Edition subtitle */}
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                        className="mt-3 text-sm tracking-[0.5em] uppercase font-medium" style={{ color: 'rgba(245,213,105,0.45)' }}>
                                        The Water Edition • 2026
                                    </motion.p>
                                    {/* Horizontal rule */}
                                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 1 }}
                                        className="mt-5 w-64 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }} />
                                    {/* Status */}
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                                        className="mt-5 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                        <span className="text-[11px] font-bold tracking-[0.4em] uppercase" style={{ color: '#f5d569' }}>Thank You For Participating</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : auctionState.phase === 'NOT_STARTED' || auctionState.phase === 'PRE_AUCTION' ? (
                            <motion.div key="not-started" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full w-full relative overflow-hidden">
                                {/* BG: Deep dark with subtle dual glow */}
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(43,181,204,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 40%)' }} />
                                {/* Giant watermark logo */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full overflow-hidden z-[1] pointer-events-none" style={{ opacity: 0.04 }}>
                                    <Image src="/auction_logo.jpg" alt="" fill className="object-cover" />
                                </div>
                                {/* Diagonal shimmer */}
                                <motion.div className="absolute inset-0 pointer-events-none z-[1]"
                                    style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(212,175,55,0.03) 45%, rgba(212,175,55,0.07) 50%, rgba(212,175,55,0.03) 55%, transparent 100%)', backgroundSize: '300% 300%' }}
                                    animate={{ backgroundPosition: ['-150% -150%', '250% 250%'] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: 'linear', repeatDelay: 3 }} />
                                {/* Subtle bottom bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] z-[3]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />
                                {/* CONTENT: Clean centered welcome */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: 'spring' }}
                                        className="w-24 h-24 rounded-full overflow-hidden border border-[#d4af37]/25 relative mb-6" style={{ boxShadow: '0 0 25px rgba(212,175,55,0.15)' }}>
                                        <Image src="/auction_logo.jpg" alt="IPL" fill className="object-cover" />
                                    </motion.div>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                        className="text-[10px] tracking-[0.6em] uppercase font-bold mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>
                                        Welcome To
                                    </motion.p>
                                    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                        <span className="text-5xl md:text-7xl font-black uppercase block" style={{ fontFamily: "'Cinzel', serif", background: 'linear-gradient(180deg, #ffffff 0%, rgba(212,175,55,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 25px rgba(212,175,55,0.2))' }}>
                                            IPL Auction 2026
                                        </span>
                                    </motion.h2>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                        className="mt-3 text-sm tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                        The Ultimate Showdown Awaits
                                    </motion.p>
                                    <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }}
                                        className="mt-8 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
                                        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.3)' }}>Awaiting Start</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full w-full relative overflow-hidden">
                                {/* Minimal BG */}
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(126,234,245,0.06) 0%, transparent 50%)' }} />
                                {/* CONTENT: Ultra clean loading */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                    <motion.h2 initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                        <span className="text-4xl md:text-5xl font-black uppercase block" style={{ fontFamily: "'Cinzel', serif", background: 'linear-gradient(180deg, #ffffff 0%, rgba(126,234,245,0.6) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 15px rgba(126,234,245,0.2))' }}>
                                            Next Player
                                        </span>
                                    </motion.h2>
                                    {/* Three bouncing dots */}
                                    <div className="flex items-center gap-2 mt-6">
                                        {[0, 1, 2].map(i => (
                                            <motion.div key={i} className="w-2 h-2 rounded-full bg-[#7eeaf5]/40"
                                                animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
                                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
