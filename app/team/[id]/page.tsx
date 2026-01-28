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

    // Grade to card template mapping
    const gradeConfig = {
        A: {
            name: 'GOLD',
            template: '/cards/gold.png',
            ratingColor: '#3d2817',
            nameColor: '#3d2817',
            statColor: '#3d2817',
            bgGradient: 'from-[#fff5c3] to-[#dcaa4d]',
        },
        B: {
            name: 'SILVER',
            template: '/cards/silver.png',
            ratingColor: '#1a1a1a',
            nameColor: '#1a1a1a',
            statColor: '#1a1a1a',
            bgGradient: 'from-[#ffffff] to-[#bcc6cc]',
        },
        C: {
            name: 'PURPLE',
            template: '/cards/purple.png',
            ratingColor: '#ffffff',
            nameColor: '#ffffff',
            statColor: '#ffffff',
            bgGradient: 'from-[#e0c3fc] to-[#8ec5fc]',
        },
        D: {
            name: 'BRONZE',
            template: '/cards/bronze.png',
            ratingColor: '#2d1810',
            nameColor: '#2d1810',
            statColor: '#2d1810',
            bgGradient: 'from-[#ffdac1] to-[#b38260]',
        },
    };

    const config = gradeConfig[player.grade];

    // Position mapping
    const positionMap: Record<string, string> = {
        'Batsmen': 'BAT',
        'Bowlers': 'BWL',
        'All-rounders': 'ALL',
        'Wicketkeepers': 'WK',
    };

    // Cricket stats (BAT, RUN, BOW, CAT, FIE, PHY like the reference)
    const stats = {
        BAT: Math.min(99, player.rating - 5 + Math.floor(Math.random() * 10)),
        RUN: Math.min(99, player.rating + Math.floor(Math.random() * 5)),
        BOW: player.category === 'Bowlers' || player.category === 'All-rounders'
            ? Math.min(99, 70 + Math.floor(Math.random() * 25))
            : Math.min(99, 30 + Math.floor(Math.random() * 20)),
        CAT: Math.min(99, 75 + Math.floor(Math.random() * 20)),
        FIE: Math.min(99, 70 + Math.floor(Math.random() * 25)),
        PHY: Math.min(99, 75 + Math.floor(Math.random() * 20)),
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
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-60 bg-gradient-radial from-yellow-400/50 to-transparent" />
            )}

            {/* STATIC OVERRIDE - User Request */}
            <div className="relative w-full h-[360px]">
                <Image
                    src="/cards/full_card_kohli.png"
                    alt="Static Card"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </div>

            {/* Original Content Disabled */}
            {false && (
                <div className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient}`} />

                    {/* Background Template Image */}
                    <Image
                        src={config.template}
                        alt={`${config.name} card background`}
                        fill
                        className="object-cover relative z-10"
                        priority
                    />

                    {/* 0.5. CHECKERBOARD FIX - Overlay on top of template, behind content */}
                    <div
                        className={`absolute inset-x-5 top-14 bottom-28 rounded-3xl opacity-90 blur-sm bg-gradient-to-b ${config.bgGradient}`}
                        style={{ zIndex: 15 }}
                    />

                    {/* Overlay Content */}
                    <div className="absolute inset-0 z-20">
                        {/* Rating & Position (Top Left) */}
                        <div className="absolute top-6 left-6">
                            <div
                                className="text-5xl font-black leading-none"
                                style={{
                                    color: config.ratingColor,
                                    fontFamily: 'Arial Black, sans-serif',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                }}
                            >
                                {player.rating}
                            </div>
                            <div
                                className="text-base font-bold mt-1"
                                style={{ color: config.ratingColor }}
                            >
                                {positionMap[player.category] || 'PLR'}
                            </div>
                        </div>

                        {/* Player Image Area - Center */}
                        <div
                            className="absolute top-12 left-1/2 -translate-x-1/2 w-44 h-48 flex items-center justify-center overflow-hidden"
                            style={{ maskImage: 'radial-gradient(ellipse at center 40%, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center 40%, black 60%, transparent 100%)' }}
                        >
                            {playerImageUrl ? (
                                <Image
                                    src={playerImageUrl}
                                    alt={player.player}
                                    width={200}
                                    height={220}
                                    className="object-cover object-top scale-110"
                                    style={{ objectPosition: 'center 10%' }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span
                                        className="text-7xl font-black opacity-60"
                                        style={{ color: config.ratingColor }}
                                    >
                                        {player.player.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Player Name */}
                        <div
                            className="absolute top-[240px] left-1/2 -translate-x-1/2 w-full text-center px-4"
                        >
                            <h3
                                className="text-xl font-black tracking-tight"
                                style={{
                                    color: config.nameColor,
                                    fontFamily: 'Arial Black, sans-serif',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                                }}
                            >
                                {player.player.split(' ').slice(-1)[0]}
                            </h3>
                        </div>

                        {/* Stats Row - 6 stats in a row */}
                        <div className="absolute top-[270px] left-1/2 -translate-x-1/2 w-[220px]">
                            {/* Stats Labels */}
                            <div className="flex justify-between text-[9px] font-bold mb-1 px-2">
                                {Object.keys(stats).map(stat => (
                                    <span key={stat} style={{ color: config.statColor }}>{stat}</span>
                                ))}
                            </div>
                            {/* Stats Values */}
                            <div className="flex justify-between text-lg font-black px-2">
                                {Object.values(stats).map((value, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            color: config.statColor,
                                            fontFamily: 'Arial Black, sans-serif',
                                        }}
                                    >
                                        {value}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Icons - Flag & Badge */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                            {/* Indian Flag */}
                            <div className="w-6 h-4 rounded-sm overflow-hidden bg-white flex items-center justify-center text-xs">
                                🇮🇳
                            </div>

                            {/* Team Badge */}
                            <div
                                className="w-5 h-6 rounded flex items-center justify-center text-xs font-bold"
                                style={{
                                    background: 'rgba(255,255,255,0.3)',
                                    color: config.ratingColor,
                                }}
                            >
                                {player.team.charAt(0)}
                            </div>

                            {/* Team Logo/Trophy */}
                            <div className="text-sm">🏆</div>
                        </div>

                        {/* Grade Badge (Top Left badge area) */}
                        <div className="absolute top-2 left-2">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2"
                                style={{
                                    background: 'rgba(0,0,0,0.5)',
                                    color: '#ffffff',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                }}
                            >
                                {player.grade}
                            </div>
                        </div>

                        {/* Price Tag (if shown) */}
                        {showPrice && price && (
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                <div
                                    className="px-4 py-1 rounded-full text-sm font-black"
                                    style={{
                                        background: 'rgba(0,0,0,0.7)',
                                        color: '#ffd700',
                                    }}
                                >
                                    ₹{price} CR
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
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
            className="w-full h-[calc(100vh-100px)] flex flex-col relative"
        >
            {/* Background Image - Full Cover */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url(/bg/stadium.png)',
                    opacity: 0.5
                }}
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 z-0" />
            <div className="absolute inset-0 bg-radial-gradient z-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }} />

            {/* Content Container - Centered Single Page */}
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
                    <div className={`ml-4 px-3 py-1 rounded-lg text-xs font-black ${auctionState.status === 'BIDDING' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {auctionState.status}
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
                                key={auctionState.currentBid}
                                initial={{ scale: 1.4, filter: 'blur(10px)' }}
                                animate={{ scale: 1, filter: 'blur(0px)' }}
                                className="flex items-baseline justify-center gap-2"
                            >
                                <span className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">₹{auctionState.currentBid}</span>
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
function QuickLinkCard({ href, icon, title, description, stats, gradient, delay }: {
    href: string;
    icon: string;
    title: string;
    description: string;
    stats?: { label: string; value: string | number }[];
    gradient: string;
    delay?: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}>
            <Link href={href}>
                <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} className="glass-card p-5 cursor-pointer group relative overflow-hidden h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-3xl">{icon}</span>
                            <span className="text-white/30 text-2xl group-hover:text-white/60 transition-all">→</span>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1">{title}</h3>
                        <p className="text-white/50 text-sm mb-3">{description}</p>
                        {stats && (
                            <div className="flex gap-4">
                                {stats.map((stat, i) => (
                                    <div key={i}><div className={`text-lg font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{stat.value}</div><div className="text-[10px] text-white/40">{stat.label}</div></div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
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

    if (loading) return <div className="min-h-screen animated-gradient-bg flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-6xl">🏏</motion.div></div>;
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
        <div ref={containerRef} className="min-h-screen animated-gradient-bg overflow-auto">
            <FloatingParticles />

            {/* Header */}
            <motion.div style={{ opacity: headerOpacity }} className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg">{team.logo}</div>
                            <div><h1 className="text-2xl font-black gradient-text-animated">{team.name}</h1><p className="text-white/50 text-sm">{team.shortName} • Team Dashboard</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2">
                                <div className="px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30"><span className="text-green-400 font-bold text-sm">₹{team.budgetRemaining} CR</span></div>
                                <div className="px-3 py-1.5 bg-cyan-500/20 rounded-full border border-cyan-500/30"><span className="text-cyan-400 font-bold text-sm">{team.squadCount}/{team.squadLimit}</span></div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full"><div className="w-2 h-2 bg-red-500 rounded-full status-pulse" /><span className="font-bold text-red-400 text-sm">LIVE</span></div>
                            <Link href="/" className="btn-secondary text-sm">← Home</Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* HERO - Current Auction (Full Screen) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mb-10 border-b border-white/10">
                <HeroAuctionCard auctionState={auctionState} team={team} />
            </motion.div>

            <div className="max-w-7xl mx-auto p-6 relative z-10">

                {/* Budget Bar */}
                <ScrollReveal className="glass-card p-4 mb-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60">Budget Remaining</span>
                        <div className="flex items-center gap-4">
                            <span className="text-green-400 font-bold">₹{team.budgetRemaining} CR</span>
                            <span className="text-white/40">of ₹{team.totalBudget} CR</span>
                            <span className="font-bold text-lg text-white">{budgetPercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${budgetPercentage}%` }} className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-500" />
                    </div>
                </ScrollReveal>

                {/* My Collection - FIFA Cards */}
                <ScrollReveal className="glass-card p-6 mb-10" delay={0.1}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-white flex items-center gap-3">🎴 <span className="gradient-text">My Collection</span></h2>
                            <p className="text-white/50 mt-1">{purchasedPlayers.length} FIFA-style cards • Hover for 3D effect</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-xl text-sm font-bold ${!selectedCategory ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-white/10 text-white/60'}`}>All ({purchasedPlayers.length})</button>
                            {categories.map(cat => {
                                const count = (groupedPlayers[cat] || []).length;
                                if (count === 0) return null;
                                return <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-bold ${selectedCategory === cat ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-white/10 text-white/60'}`}>{categoryIcons[cat]} {count}</button>;
                            })}
                        </div>
                    </div>

                    {purchasedPlayers.length === 0 ? (
                        <div className="text-center py-20">
                            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl mb-6">🎴</motion.div>
                            <div className="text-2xl text-white/60 mb-2 font-bold">No cards collected yet</div>
                            <div className="text-lg text-white/40">Win auctions to build your FIFA-style squad!</div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-8 justify-center py-4">
                            <AnimatePresence mode="popLayout">
                                {displayPlayers.map((player, i) => (
                                    <motion.div key={player.rank} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: i * 0.05 }}>
                                        <FIFACard player={player} showPrice={true} price={getPlayerPrice(player)} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6">
                        {[
                            { label: 'GOLD', count: purchasedPlayers.filter(p => p.grade === 'A').length },
                            { label: 'SILVER', count: purchasedPlayers.filter(p => p.grade === 'B').length },
                            { label: 'PURPLE', count: purchasedPlayers.filter(p => p.grade === 'C').length },
                            { label: 'BRONZE', count: purchasedPlayers.filter(p => p.grade === 'D').length },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10">
                                <span className="font-black text-white">{item.label}</span>
                                <span className="text-white/80">×{item.count}</span>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Quick Access */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">🔗 Quick Access</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <QuickLinkCard href={`/team/${team.id}/power-cards`} icon="⚡" title="Power Cards" description="View your arsenal and card rules" stats={[{ label: 'Available', value: availablePowerCards }, { label: 'Used', value: 5 - availablePowerCards }]} gradient="from-yellow-500 to-orange-500" />
                        <QuickLinkCard href="/teams" icon="🏆" title="All Teams" description="View all teams' budget & squads" stats={[{ label: 'Teams', value: allTeams.length }]} gradient="from-cyan-500 to-blue-500" delay={0.1} />
                        <QuickLinkCard href="/big-screen" icon="📺" title="Big Screen" description="Full immersive auction display" gradient="from-purple-500 to-pink-500" delay={0.2} />
                    </div>
                </div>
            </div>
        </div>
    );
}
