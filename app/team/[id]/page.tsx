// Team Dashboard Page - PNG-BASED FIFA CARDS
// Using generated card templates with player data overlay
// Exact replica of the reference cards

'use client';

import { use, useEffect, useState, useRef } from 'react';
import { AuctionState } from '@/lib/mockData/auctionState';
import { Team } from '@/lib/mockData/teams';
import { Player } from '@/lib/mockData/players';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import { getAllPlayers } from '@/lib/api/players';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Logo3D = dynamic(() => import('@/components/Logo3D'), {
    ssr: false,
    loading: () => <div className="logo3d-container"><div className="logo3d-loader"><div className="logo3d-spinner" /></div></div>,
});

// Floating Particles
function FloatingParticles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        background: ['#00d9ff', '#b537f2', '#ffd700'][Math.floor(Math.random() * 3)],
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

// --- ANIMATION COMPONENTS ---

function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function InteractiveFIFACard({ player }: { player: Player }) {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
            className="relative cursor-pointer"
        >
            <div style={{ transform: "translateZ(20px)" }}>
                <FIFACard player={player} showPrice={false} />
            </div>

            {/* Dynamic Glare/Glow */}
            <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%)",
                    transform: "translateZ(40px)",
                }}
            />
        </motion.div>
    );
}

// FIFA Card with PNG Template Background
function FIFACard({ player, showPrice, price }: {
    player: Player;
    showPrice?: boolean;
    price?: number;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 12, y: -x * 12 });
    };

    // Grade to CSS premium config mapping
    const gradeConfig = {
        A: {
            name: 'GOLD',
            bgOuter: 'linear-gradient(135deg, #FDE08B 0%, #D4AF37 50%, #FDE08B 100%)',
            bgInner: 'linear-gradient(180deg, #1A1305 0%, #0D0902 100%)',
            textColor: '#FDE08B',
        },
        B: {
            name: 'SILVER',
            bgOuter: 'linear-gradient(135deg, #E8ECF1 0%, #9BA4B5 50%, #E8ECF1 100%)',
            bgInner: 'linear-gradient(180deg, #111827 0%, #030712 100%)',
            textColor: '#E8ECF1',
        },
        C: {
            name: 'PURPLE',
            bgOuter: 'linear-gradient(135deg, #E0C3FC 0%, #8E2DE2 50%, #E0C3FC 100%)',
            bgInner: 'linear-gradient(180deg, #1A0B2E 0%, #0D031A 100%)',
            textColor: '#E0C3FC',
        },
        D: {
            name: 'BRONZE',
            bgOuter: 'linear-gradient(135deg, #E6A171 0%, #A65D37 50%, #E6A171 100%)',
            bgInner: 'linear-gradient(180deg, #2D1A11 0%, #170C08 100%)',
            textColor: '#E6A171',
        },
    };

    const config = gradeConfig[player.grade as keyof typeof gradeConfig];

    // Position mapping
    const positionMap: Record<string, string> = {
        'Batsmen': 'BAT',
        'Bowlers': 'BWL',
        'All-rounders': 'ALL',
        'Wicketkeepers': 'WK',
    };

    // Seeded random for deterministic stats (avoid re-randomizing each render)
    const seed = player.rank;
    const seededRand = (i: number) => {
        const x = Math.sin(seed * 100 + i) * 10000;
        return Math.floor((x - Math.floor(x)) * 100);
    };

    // Cricket stats (BAT, RUN, BOW, CAT, FIE, PHY like the reference)
    const stats = {
        BAT: Math.min(99, Math.max(40, player.rating - 5 + (seededRand(1) % 10))),
        RUN: Math.min(99, Math.max(40, player.rating + (seededRand(2) % 5))),
        BOW: player.category === 'Bowlers' || player.category === 'All-rounders'
            ? Math.min(99, 70 + (seededRand(3) % 25))
            : Math.min(99, 30 + (seededRand(3) % 20)),
        CAT: Math.min(99, 75 + (seededRand(4) % 20)),
        FIE: Math.min(99, 70 + (seededRand(5) % 25)),
        PHY: Math.min(99, 75 + (seededRand(6) % 20)),
    };

    // Player image URL
    const playerImageUrl = player.imageUrl || null;

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false); }}
            initial={{ opacity: 0, y: 30, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
            }}
            className="relative cursor-pointer w-[260px]"
        >
            {/* Glow effect on hover */}
            {isHovered && (
                <div
                    className="absolute -inset-4 rounded-3xl blur-2xl opacity-60"
                    style={{
                        background: {
                            A: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)',
                            B: 'radial-gradient(circle, rgba(192,192,210,0.5) 0%, transparent 70%)',
                            C: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
                            D: 'radial-gradient(circle, rgba(205,150,100,0.4) 0%, transparent 70%)',
                        }[player.grade],
                    }}
                />
            )}

            {/* Dynamic CSS Shield Card */}
            <div 
                className="relative w-full h-[360px] shadow-2xl transition-all duration-300"
                style={{
                    clipPath: 'polygon(10% 0, 90% 0, 100% 12%, 100% 85%, 50% 100%, 0 85%, 0 12%)',
                    background: config.bgOuter,
                    padding: '3px' // creates the metallic border effect
                }}
            >
                {/* Inner Card Background */}
                <div 
                    className="relative w-full h-full overflow-hidden"
                    style={{
                        clipPath: 'polygon(10% 0, 90% 0, 100% 12%, 100% 86%, 50% 100%, 0 86%, 0 12%)',
                        background: config.bgInner
                    }}
                >
                    {/* Top glass reflection */}
                    <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-0" />
                    
                    {/* Diagonal animated shine */}
                    <div className="absolute -inset-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] animate-[shimmer_5s_infinite] pointer-events-none z-10" />

                {/* Overlay Content */}
                <div className="absolute inset-0 z-20">
                    {/* Rating & Position (Top Left) */}
                    <div className="absolute top-8 left-6">
                        <div
                            className="text-5xl font-black leading-none tracking-tighter"
                            style={{
                                color: config.textColor,
                                fontFamily: "'Cinzel', serif",
                                textShadow: '0px 2px 10px rgba(0,0,0,0.8)',
                            }}
                        >
                            {player.rating}
                        </div>
                        <div
                            className="text-sm font-black mt-1 ml-1 tracking-widest uppercase opacity-90"
                            style={{ color: config.textColor }}
                        >
                            {positionMap[player.category] || 'PLR'}
                        </div>
                    </div>

                    {/* Player Image Area - Center */}
                    <div
                        className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-[220px] flex items-end justify-center overflow-hidden"
                        style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 90%)' }}
                    >
                        {playerImageUrl ? (
                            <Image
                                src={playerImageUrl}
                                alt={player.player}
                                width={220}
                                height={240}
                                className="object-cover object-top"
                                style={{ 
                                    objectPosition: 'center top',
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center pb-10">
                                <span
                                    className="text-7xl font-black opacity-30"
                                    style={{ color: '#000', fontFamily: "'Cinzel', serif" }}
                                >
                                    {player.player.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Player Name */}
                    <div
                        className="absolute top-[230px] left-1/2 -translate-x-1/2 w-full text-center px-4 border-b border-white/10 pb-2 z-30"
                    >
                        <h3
                            className="text-2xl font-black tracking-widest uppercase drop-shadow-md"
                            style={{
                                color: config.textColor,
                                fontFamily: "'Cinzel', serif",
                                textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                            }}
                        >
                            {player.player.split(' ').slice(-1)[0]}
                        </h3>
                    </div>

                    {/* Stats Row - 6 stats in a row */}
                    <div className="absolute top-[270px] left-1/2 -translate-x-1/2 w-[220px]">
                        {/* Stats Labels */}
                        <div className="flex justify-between text-[10px] font-black tracking-widest mb-1 px-1 opacity-80">
                            {Object.keys(stats).map(stat => (
                                <span key={stat} style={{ color: config.textColor }}>{stat}</span>
                            ))}
                        </div>
                        {/* Stats Values */}
                        <div className="flex justify-between text-lg font-black px-1">
                            {Object.values(stats).map((value, i) => (
                                <span
                                    key={i}
                                    style={{
                                        color: config.textColor,
                                        fontFamily: "'Cinzel', serif",
                                    }}
                                >
                                    {value}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Icons - Flag & Badge */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 w-full pt-3 border-t border-white/5 mx-auto max-w-[180px]">
                        {/* Nationality Flag */}
                        <div className="w-6 h-4 rounded-sm shadow-sm overflow-hidden bg-white flex items-center justify-center text-[10px]">
                            {player.nationality === 'Overseas' ? '🌍' : '🇮🇳'}
                        </div>

                        {/* Team Badge */}
                        <div
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-black bg-white/10"
                            style={{
                                color: config.textColor,
                                border: `1px solid ${config.textColor}30`
                            }}
                        >
                            {player.team.charAt(0)}
                        </div>

                        {/* Legacy Stars */}
                        <div className="text-[10px] tracking-widest flex" style={{ color: config.textColor }} title={`Legacy: ${player.legacy}`}>
                            {Array(Math.min(3, Math.ceil(player.legacy / 3))).fill('⭐').map((s,i) => <span key={i} style={{ textShadow: `0 0 5px ${config.textColor}`}}>{s}</span>)}
                        </div>
                    </div>

                    {/* Grade Badge (Top Right) */}
                    <div className="absolute top-3 right-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2"
                            style={{
                                background: {
                                    A: 'rgba(212,175,55,0.6)',
                                    B: 'rgba(192,192,210,0.6)',
                                    C: 'rgba(168,85,247,0.6)',
                                    D: 'rgba(180,120,70,0.6)',
                                }[player.grade],
                                color: '#ffffff',
                                borderColor: 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            {player.grade}
                        </div>
                    </div>

                    {/* Price Tag (if shown) */}
                    {showPrice && price && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-50">
                            <div
                                className="px-5 py-2 rounded-full text-sm font-black tracking-widest shadow-2xl border"
                                style={{
                                    background: config.bgInner,
                                    color: config.textColor,
                                    borderColor: config.textColor,
                                    fontFamily: "'Cinzel', serif"
                                }}
                            >
                                ₹{price} CR
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </motion.div>
    );
}

// HERO Current Auction Card
function HeroAuctionCard({ auctionState, team }: { auctionState: AuctionState | null; team: Team }) {
    if (!auctionState?.currentPlayer) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 text-center max-w-2xl mx-auto"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-6"
                >
                    ⏳
                </motion.div>
                <div className="text-3xl text-white/60 font-bold mb-2">Waiting for Next Player...</div>
                <div className="text-lg text-white/40">The auctioneer is selecting the next pick</div>
            </motion.div>
        );
    }

    const player = auctionState.currentPlayer;
    const gradeColors = {
        A: { bg: 'from-yellow-500 via-amber-500 to-orange-500', glow: '0 0 80px rgba(255,215,0,0.5)' },
        B: { bg: 'from-purple-500 via-pink-500 to-fuchsia-500', glow: '0 0 60px rgba(168,85,247,0.4)' },
        C: { bg: 'from-purple-600 via-violet-600 to-purple-700', glow: '0 0 50px rgba(139,92,246,0.3)' },
        D: { bg: 'from-orange-700 via-amber-700 to-orange-800', glow: '0 0 40px rgba(217,119,6,0.3)' },
    };
    const config = gradeColors[player.grade];
    const isWinning = auctionState.highestBidder === team.name;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full flex-1 flex flex-col relative py-12"
        >
            {/* Content Container - Centered */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-8">

                {/* Minimal Glass Header - Replaces Yellow Banner */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
                >
                    <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-3xl">🎯</motion.span>
                    <div>
                        <div className="text-white/60 text-xs font-bold tracking-wider uppercase">Current Auction</div>
                        <div className="text-xl font-black text-white leading-none">#{player.rank} • {player.player}</div>
                    </div>
                    <div className={`ml-4 px-3 py-1 rounded-lg text-xs font-black ${auctionState.phase === 'BIDDING' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {auctionState.phase}
                    </div>
                </motion.div>


                {/* Main Layout Grid - Side by Side for Single Page Fit */}
                <div className="flex items-center justify-center gap-12 w-full max-w-7xl px-4 flex-1">

                    {/* LEFT: FIFA Card - METAMASK STYLE INTERACTIVE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                        transition={{
                            duration: 0.8,
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative z-20"
                        style={{ perspective: 1000 }}
                    >
                        <div className="scale-125 md:scale-150 transform-gpu">
                            <InteractiveFIFACard player={player} />
                        </div>

                        {/* Bloom Glow */}
                        <div className="absolute -inset-20 blur-[60px] rounded-full z-[-1] opacity-50 animate-pulse"
                            style={{ background: config.glow.split(' ')[4] || '#ffd700' }} />
                    </motion.div>

                    {/* RIGHT: Bid Info & Controls */}
                    <div className="flex-1 max-w-lg space-y-5 z-20">

                        {/* Current Bid Display */}
                        <div className="text-center relative py-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl" />
                            <div className="text-xs text-white/40 font-bold tracking-[0.3em] uppercase mb-1">Current Bid</div>
                            <motion.div
                                key={auctionState.current_bid}
                                initial={{ scale: 1.4, filter: 'blur(10px)' }}
                                animate={{ scale: 1, filter: 'blur(0px)' }}
                                className="flex items-baseline justify-center gap-2"
                            >
                                <span className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">₹{auctionState.current_bid}</span>
                                <span className="text-4xl font-bold text-white/50">CR</span>
                            </motion.div>
                        </div>

                        {/* Highest Bidder Box */}
                        <motion.div
                            className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden group ${isWinning
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <div className="text-[10px] text-white/40 uppercase font-bold mb-1">Highest Bidder</div>
                                    <div className={`text-xl font-black ${isWinning ? 'text-green-400' : 'text-white'}`}>
                                        {auctionState.highestBidder || 'No Bids'}
                                    </div>
                                </div>
                                {isWinning && <div className="text-3xl animate-bounce">👑</div>}
                            </div>
                            {isWinning && <div className="absolute inset-0 bg-green-500/5 animate-pulse" />}
                        </motion.div>

                        {/* Player Stats / Info Compact */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-[10px] text-white/40 uppercase font-bold">Role</div>
                                <div className="text-sm font-bold text-white max-w-full truncate">{player.category || 'Player'}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-[10px] text-white/40 uppercase font-bold">Team</div>
                                <div className="text-sm font-bold text-white">{player.team}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-[10px] text-white/40 uppercase font-bold">Legacy</div>
                                <div className="text-sm font-bold text-white">{player.legacy}★</div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </motion.div>
    );
}

// Quick Link Card
function QuickLinkCard({ href, icon, title, description, stats, accent, delay }: {
    href: string;
    icon: string;
    title: string;
    description: string;
    stats?: { label: string; value: string | number }[];
    accent: string;
    delay?: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }} className="h-full">
            <Link href={href} className="block h-full">
                <div 
                    className="home-card group h-full flex flex-col"
                    style={{ '--card-accent': accent } as React.CSSProperties}
                >
                    <div className="home-card-accent" />
                    
                    <div className="home-card-icon text-3xl mb-4">
                        {icon}
                    </div>

                    <h3 className="home-card-title">{title}</h3>
                    <p className="home-card-desc mb-4 flex-1">{description}</p>
                    
                    {stats && (
                        <div className="flex gap-4 mt-auto pt-4 border-t border-white/5">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-lg font-black text-white">{stat.value}</div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="home-card-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function TeamDashboard({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const teamId = Number(resolvedParams.id);
    const containerRef = useRef<HTMLDivElement>(null);

    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { scrollYProgress } = useScroll({ container: containerRef });
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [state, teams, players] = await Promise.all([getAuctionState(), getAllTeams(), getAllPlayers()]);
                setAuctionState(state);
                setAllTeams(teams);
                setTeam(teams.find(t => t.id === teamId) || null);
                setAllPlayers(players);
                setLoading(false);
            } catch (error) {
                console.error('Error loading team dashboard:', error);
                setLoading(false);
            }
        };
        loadData();
        const unsubscribe = subscribeToAuctionUpdates(setAuctionState);
        const teamsInterval = setInterval(async () => {
            const teams = await getAllTeams();
            setAllTeams(teams);
            setTeam(teams.find(t => t.id === teamId) || null);
        }, 2000);
        return () => { unsubscribe(); clearInterval(teamsInterval); };
    }, [teamId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'radial-gradient(ellipse at center, #0a1628, #040b14)' }}>
            {/* Background particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: ['#2bb5cc', '#d4af37', '#2dd4a0'][i % 3],
                            opacity: Math.random() * 0.4 + 0.1,
                            animation: `floatUp ${Math.random() * 6 + 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative flex flex-col items-center z-10">
                {/* 3D GLB Logo Model */}
                <div style={{ width: '280px', height: '280px' }}>
                    <Logo3D />
                </div>

                {/* Loading text */}
                <div className="coin-loading-text" style={{ marginTop: '-1rem' }}>
                    <span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span>
                </div>
            </div>
        </div>
    );
    if (!team) return <div className="min-h-screen animated-gradient-bg flex items-center justify-center"><div className="text-center"><div className="text-6xl mb-4">❌</div><div className="text-2xl text-white font-bold mb-2">Team Not Found</div><Link href="/" className="btn-primary">Back to Home</Link></div></div>;

    const purchasedPlayers = allPlayers.filter(p => team.players.includes(p.rank));
    const groupedPlayers = purchasedPlayers.reduce((acc, player) => { if (!acc[player.category]) acc[player.category] = []; acc[player.category].push(player); return acc; }, {} as Record<string, Player[]>);
    const getPlayerPrice = (player: Player) => ({ A: 15, B: 8, C: 4, D: 2 }[player.grade] || 2);
    const categories = ['Batsmen', 'Bowlers', 'All-rounders', 'Wicketkeepers'];
    const budgetPercentage = (team.budgetRemaining / team.totalBudget) * 100;
    const categoryIcons: Record<string, string> = { Batsmen: '🏏', Bowlers: '🎯', 'All-rounders': '⚔️', Wicketkeepers: '🧤' };
    const availablePowerCards = Object.values(team.powerCards).filter(c => c.available && !c.used).length;
    const displayPlayers = selectedCategory ? groupedPlayers[selectedCategory] || [] : purchasedPlayers;

    return (
        <div ref={containerRef} className="min-h-screen relative overflow-auto">
            <div className="home-bg" />
            <FloatingParticles />

            {/* Header */}
            <motion.div style={{ opacity: headerOpacity }} className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a1628]/80 border-b border-[#2bb5cc]/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#081a2e] to-[#040b14] border border-[#d4af37]/30 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">{team.logo}</div>
                            <div>
                                <h1 className="text-2xl font-black text-[#e8ecf1]" style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>{team.name}</h1>
                                <p className="text-[#bcdce6]/60 text-xs tracking-widest uppercase mt-0.5">{team.shortName} • Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="px-4 py-1.5 bg-[#0a1628]/50 rounded-full border border-[#2bb5cc]/20 backdrop-blur-md">
                                    <span className="text-[10px] text-[#7a9ab0] uppercase tracking-wider mr-2">Budget</span>
                                    <span className="text-[#2dd4a0] font-bold text-sm">₹{team.budgetRemaining} CR</span>
                                </div>
                                <div className="px-4 py-1.5 bg-[#0a1628]/50 rounded-full border border-[#2bb5cc]/20 backdrop-blur-md">
                                    <span className="text-[10px] text-[#7a9ab0] uppercase tracking-wider mr-2">Squad</span>
                                    <span className="text-[#2bb5cc] font-bold text-sm">{team.squadCount}/{team.squadLimit}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full"><div className="w-2 h-2 bg-red-500 rounded-full status-pulse" /><span className="font-bold text-red-400 text-xs tracking-widest uppercase">Live</span></div>
                            <Link href="/" className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#bcdce6]/80 hover:text-white border border-white/10 rounded-full hover:bg-white/5 transition-all">← Home</Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* HERO - Current Auction (Full Screen) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mb-10 border-b border-white/10">
                <HeroAuctionCard auctionState={auctionState} team={team} />
            </motion.div>

            <div className="max-w-7xl mx-auto p-6 relative z-10 flex flex-col gap-10">

                {/* Budget Bar - Premium Look */}
                <ScrollReveal className="p-6 rounded-2xl bg-[#0a1628]/60 border border-[#2bb5cc]/10 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[#7a9ab0] text-xs font-bold uppercase tracking-widest">Budget Remaining</span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-[#2dd4a0] font-black text-2xl">₹{team.budgetRemaining} <span className="text-sm">CR</span></span>
                            <span className="text-[#7a9ab0]/50 text-sm font-bold">/ ₹{team.totalBudget} CR</span>
                            <span className="font-black text-sm text-[#e8ecf1] ml-2 px-2 py-0.5 rounded bg-white/5">{budgetPercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                    <div className="h-2 bg-[#040b14] rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${budgetPercentage}%` }} 
                            className="h-full rounded-full relative"
                            style={{ background: 'linear-gradient(90deg, #2bb5cc, #2dd4a0)' }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
                        </motion.div>
                    </div>
                </ScrollReveal>


                {/* Quick Access */}
                <div className="mb-8">
                    <h2 className="text-[#e8ecf1] font-black text-xl mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                        Command Center
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <QuickLinkCard href={`/team/${team.id}/power-cards`} icon="⚡" title="Power Cards" description="View your arsenal and match-altering abilities." stats={[{ label: 'Available', value: availablePowerCards }, { label: 'Used', value: 5 - availablePowerCards }]} accent="#d4af37" />
                        <QuickLinkCard href="/teams" icon="🏆" title="All Teams" description="View all rival franchises, budgets & squads." stats={[{ label: 'Teams', value: allTeams.length }]} accent="#2bb5cc" delay={0.1} />
                        <QuickLinkCard href="/big-screen" icon="📺" title="Big Screen" description="Launch the full immersive live public display." accent="#6c8aff" delay={0.2} />
                    </div>
                </div>
            </div>
        </div>
    );
}
