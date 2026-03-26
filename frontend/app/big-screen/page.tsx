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
                                        className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="text-8xl mb-6">⚡</div>
                                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter" style={{ fontFamily: "'Cinzel', serif" }}>
                                            Power Card Auction
                                        </h2>
                                        <p className="text-[#2bb5cc] tracking-[0.5em] uppercase font-bold mt-4 opacity-60">
                                            Preparing Next Advantage...
                                        </p>
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
                                                <h2 className="text-white font-black italic uppercase tracking-tighter leading-tight"
                                                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
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
                                        <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="absolute top-3 left-3 z-30 flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full font-black text-[0.6rem] tracking-[0.15em]" style={{ background: `linear-gradient(135deg, ${fcColor}, ${fcColor}cc)`, color: '#fff' }}>🏢 FRANCHISE RIGHTS AUCTION</span>
                                        </motion.div>
                                        {franchise ? (
                                            <>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]" style={{ paddingLeft: '10%' }}>
                                                    <span style={{ fontSize: 'clamp(8rem, 16vw, 14rem)', fontFamily: "'Cinzel', serif", fontWeight: 900, color: fcColor, opacity: 0.06, lineHeight: 1 }}>{franchise.short}</span>
                                                </div>
                                                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute bottom-0 left-0 z-10 flex items-center justify-center" style={{ width: '38%', height: '95%' }}>
                                                    <Image src={`/teams/${franchise.short.toLowerCase()}.png`} alt={franchise.name} width={130} height={130} className="object-contain" />
                                                </motion.div>
                                                <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center p-5 pr-6" style={{ width: '55%' }}>
                                                    <motion.h2 className="font-black text-white text-4xl mb-2" style={{ fontFamily: "'Cinzel', serif" }}>{franchise.name}</motion.h2>
                                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                                        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                                                            <div className="text-[0.65rem] uppercase tracking-wider mb-1 text-white/40">Base Price</div>
                                                            <div className="text-2xl font-black text-[#d4af37]">₹3.0 CR</div>
                                                        </div>
                                                        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                                                            <div className="text-[0.65rem] uppercase tracking-wider mb-1 text-white/40">Current Bid</div>
                                                            <div className="text-2xl font-black text-[#2dd4a0]">₹{currentBid ? Number(currentBid).toFixed(1) : '3.0'} CR</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <div className="text-7xl mb-4">🏛️</div>
                                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Franchise Auction</h2>
                                                <p className="text-white/40 tracking-widest uppercase text-xs mt-2">Awaiting Auctioneer...</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })() : auctionState.phase === 'NOT_STARTED' || auctionState.phase === 'PRE_AUCTION' ? (
                            <motion.div key="not-started" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center">
                                <div className="w-40 h-40 relative rounded-full overflow-hidden border-2 border-white/20 mb-8 shadow-2xl">
                                    <Image src="/auction_logo.jpg" alt="IPL Logo" fill className="object-cover" />
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Welcome to IPL Auction 2026</h2>
                                <p className="text-[#d4af37] tracking-widest uppercase font-bold mt-4">PREPARE FOR THE ULTIMATE SHOWDOWN</p>
                            </motion.div>
                        ) : (
                            <motion.div key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center">
                                <div className="text-7xl mb-4">🏏</div>
                                <h2 className="text-2xl font-black text-white/30 uppercase italic">Next Player Incoming</h2>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
