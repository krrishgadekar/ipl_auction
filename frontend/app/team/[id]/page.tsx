// Team Dashboard Page — Auth-Protected Personalized View
// Shows: My Squad, Power Cards, Budget, All Teams Overview

'use client';

import { use, useEffect, useState, useRef } from 'react';
import { AuctionState } from '@/lib/api/auction';
import { Team } from '@/lib/api/teams';
import { Player } from '@/lib/api/players';
import { getAllTeams } from '@/lib/api/teams';
import { getAllPlayers } from '@/lib/api/players';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuctionSocket } from '@/lib/hooks/useAuctionSocket';
import TeamAvatar from '@/components/team/TeamAvatar';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Playing11Submission from '@/components/team/Playing11Submission';

const Logo3D = dynamic(() => import('@/components/Logo3D'), {
    ssr: false,
    loading: () => <div className="logo3d-container"><div className="logo3d-loader"><div className="logo3d-spinner" /></div></div>,
});

// Floating Particles
function FloatingParticles() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

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
            name: 'BRONZE',
            bgOuter: 'linear-gradient(135deg, #E6A171 0%, #A65D37 50%, #E6A171 100%)',
            bgInner: 'linear-gradient(180deg, #2D1A11 0%, #170C08 100%)',
            textColor: '#E6A171',
        },
        D: {
            name: 'COMMON',
            bgOuter: 'linear-gradient(135deg, #9BA4B5 0%, #4B5563 50%, #9BA4B5 100%)',
            bgInner: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
            textColor: '#9BA4B5',
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

    // Seeded random for deterministic stats
    const seed = player.rank;
    const seededRand = (i: number) => {
        const x = Math.sin(seed * 100 + i) * 10000;
        return Math.floor((x - Math.floor(x)) * 100);
    };

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
            className="relative cursor-pointer w-[220px]"
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
                        }[player.grade as 'A' | 'B' | 'C' | 'D'],
                    }}
                />
            )}

            {/* Dynamic CSS Shield Card */}
            <div
                className="relative w-full h-[310px] shadow-2xl transition-all duration-300"
                style={{
                    clipPath: 'polygon(10% 0, 90% 0, 100% 12%, 100% 85%, 50% 100%, 0 85%, 0 12%)',
                    background: config.bgOuter,
                    padding: '3px'
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

                    {/* Shimmer */}
                    <div className="absolute -inset-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] animate-[shimmer_5s_infinite] pointer-events-none z-10" />

                    {/* Card Content */}
                    <div className="absolute inset-0 z-20">
                        {/* Rating & Position (Top Left) */}
                        <div className="absolute top-6 left-4">
                            <div
                                className="text-4xl font-black leading-none tracking-tighter"
                                style={{ color: config.textColor, fontFamily: "'Cinzel', serif", textShadow: '0px 2px 10px rgba(0,0,0,0.8)' }}
                            >
                                {player.rating}
                            </div>
                            <div
                                className="text-xs font-black mt-1 ml-0.5 tracking-widest uppercase opacity-90"
                                style={{ color: config.textColor }}
                            >
                                {positionMap[player.category] || 'PLR'}
                            </div>
                        </div>

                        {/* Player Image */}
                        <div
                            className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-[185px] flex items-end justify-center overflow-hidden"
                            style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 90%)' }}
                        >
                            {playerImageUrl ? (
                                <Image src={playerImageUrl} alt={player.player} width={180} height={200} className="object-cover object-top" style={{ objectPosition: 'center top' }} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center pb-10">
                                    <span className="text-6xl font-black opacity-30" style={{ color: '#000', fontFamily: "'Cinzel', serif" }}>
                                        {player.player.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Player Name */}
                        <div className="absolute top-[195px] left-1/2 -translate-x-1/2 w-full text-center px-4 border-b border-white/10 pb-1.5 z-30">
                            <h3
                                className="text-lg font-black tracking-widest uppercase drop-shadow-md"
                                style={{ color: config.textColor, fontFamily: "'Cinzel', serif", textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
                            >
                                {player.player.split(' ').slice(-1)[0]}
                            </h3>
                        </div>

                        {/* Stats Row */}
                        <div className="absolute top-[230px] left-1/2 -translate-x-1/2 w-[190px]">
                            <div className="flex justify-between text-[9px] font-black tracking-widest mb-0.5 px-1 opacity-80">
                                {Object.keys(stats).map(stat => (
                                    <span key={stat} style={{ color: config.textColor }}>{stat}</span>
                                ))}
                            </div>
                            <div className="flex justify-between text-sm font-black px-1">
                                {Object.values(stats).map((value, i) => (
                                    <span key={i} style={{ color: config.textColor, fontFamily: "'Cinzel', serif" }}>{value}</span>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Icons Removed */}

                        {/* Grade Badge */}
                        <div className="absolute top-2 right-2">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2"
                                style={{
                                    background: config.bgOuter,
                                    color: '#ffffff',
                                    borderColor: 'rgba(255,255,255,0.4)',
                                    backdropFilter: 'blur(4px)',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                }}
                            >
                                {player.grade}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

import { getPowerCardImage, getPowerCardName } from '@/lib/utils/powerCard';

const StatBox = ({ label, value }: { label: string; value?: number }) => (
    <div className="p-2 rounded bg-black/10 border border-black/5 flex flex-col items-center justify-center min-w-[70px]">
        <p className="text-[10px] font-bold uppercase text-black/40 leading-none mb-1">{label}</p>
        <p className="text-lg font-black leading-none">{value || 'N/A'}</p>
    </div>
);

const ModalStat = ({ label, value, config, delay }: { label: string; value?: number; config: any; delay: number }) => (
    <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay }}
        whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
        className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center transition-colors group"
    >
        <p className="text-[10px] font-bold uppercase text-white/40 mb-1 tracking-widest group-hover:text-white/60 transition-colors">{label}</p>
        <p className="text-3xl font-black italic tracking-tighter" style={{ color: config.textColor }}>{value || 'N/A'}</p>
    </motion.div>
);

// Power Card Definitions
const POWER_CARD_DEFS: Record<string, { gradient: string }> = {
    finalStrike: { gradient: 'from-yellow-500 to-orange-500' },
    bidFreezer: { gradient: 'from-cyan-500 to-blue-500' },
    godsEye: { gradient: 'from-purple-500 to-pink-500' },
    mulligan: { gradient: 'from-green-500 to-emerald-500' },
    rightToMatch: { gradient: 'from-red-500 to-pink-500' },
};

export default function TeamDashboard({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const teamId = resolvedParams.id;
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { isAuthenticated, teamId: authTeamId, loading: authLoading, logout } = useAuth();

    const [team, setTeam] = useState<Team | null>(null);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);

    useEffect(() => setMounted(true), []);

    const { on, requestState } = useAuctionSocket();

    const { scrollYProgress } = useScroll({ container: containerRef });
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

    // Auth guard
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [teams, players] = await Promise.all([getAllTeams(), getAllPlayers()]);
                setAllTeams(teams);
                // Find team by matching the URL id (could be numeric from mock or uuid from backend)
                const myTeam = teams.find(t => String(t.id) === teamId) || null;
                setTeam(myTeam);
                setAllPlayers(players);
                setLoading(false);

                requestState();
            } catch (error) {
                console.error('Error loading team dashboard:', error);
                setLoading(false);
            }
        };
        loadData();
    }, [teamId, requestState]);

    useEffect(() => {
        const unsubs: (() => void)[] = [];

        const unbindSync = on('STATE_SYNC', (data?: any) => {
            if (data) {
                if (data.teams) {
                    setAllTeams(data.teams);
                    setTeam(data.teams.find((t: any) => String(t.id) === teamId) || null);
                }
                if (data.phase || data.status) {
                    setAuctionState(data);
                }
            } else {
                requestState();
            }
        });
        if (unbindSync) unsubs.push(unbindSync);

        const unbindPlayerSold = on('PLAYER_SOLD', () => {
            requestState();
        });
        if (unbindPlayerSold) unsubs.push(unbindPlayerSold);

        return () => {
            unsubs.forEach(u => u());
        };
    }, [teamId, on, requestState]);

    if (!authLoading && !isAuthenticated) return null;

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'radial-gradient(ellipse at center, #0a1628, #040b14)' }}>
            {mounted && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 4 + 1}px`, height: `${Math.random() * 4 + 1}px`,
                            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                            background: ['#2bb5cc', '#d4af37', '#2dd4a0'][i % 3],
                            opacity: Math.random() * 0.4 + 0.1,
                            animation: `floatUp ${Math.random() * 6 + 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>
            )}
            <div className="relative flex flex-col items-center z-10">
                <div style={{ width: '280px', height: '280px' }}><Logo3D /></div>
                <div className="coin-loading-text" style={{ marginTop: '-1rem' }}>
                    <span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span>
                </div>
            </div>
        </div>
    );

    if (!team) return <div className="min-h-screen animated-gradient-bg flex items-center justify-center"><div className="text-center"><div className="text-6xl mb-4">❌</div><div className="text-2xl text-white font-bold mb-2">Team Not Found</div><Link href="/" className="btn-primary">Back to Home</Link></div></div>;

    const purchasedPlayers = allPlayers.filter(p => team.players?.includes(p.rank));
    const budgetPercentage = (team.budgetRemaining / team.totalBudget) * 100;
    const availablePowerCards = Object.entries(team.powerCards).filter(([key, c]) => !c.used && (c.available || key === 'rightToMatch')).length;
    const usedPowerCards = Object.values(team.powerCards).filter(c => c.used).length;

    return (
        <div ref={containerRef} className="min-h-screen relative overflow-auto">
            <div className="home-bg" />
            <FloatingParticles />

            {/* Header */}
            <motion.div style={{ opacity: headerOpacity }} className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a1628]/80 border-b border-[#2bb5cc]/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <TeamAvatar team={team} size={56} className="shadow-2xl !rounded-2xl" />
                            <div>
                                <h1 className="text-2xl font-black text-[#e8ecf1]" style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>{team.name}</h1>
                                <p className="text-[#bcdce6]/60 text-xs tracking-widest uppercase mt-0.5">{team.shortName} • Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="px-4 py-1.5 bg-[#0a1628]/50 rounded-full border border-[#2bb5cc]/20 backdrop-blur-md">
                                    <span className="text-[10px] text-[#7a9ab0] uppercase tracking-wider mr-2">Squad</span>
                                    <span className="text-[#2bb5cc] font-bold text-sm">{team.squadCount}/{team.squadLimit}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full"><div className="w-2 h-2 bg-red-500 rounded-full status-pulse" /><span className="font-bold text-red-400 text-xs tracking-widest uppercase">Live</span></div>
                            <button onClick={logout} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-red-400/80 hover:text-red-400 border border-red-500/20 rounded-full hover:bg-red-500/10 transition-all">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto p-6 relative z-10 flex flex-col gap-10">

                {/* Live Power Card Auction Banner Removed */}


                {/* Budget Bar */}
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

                {/* My Squad Section */}
                <ScrollReveal>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[#e8ecf1] font-black text-xl tracking-wide flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
                            <span className="text-2xl">🏆</span> My Squad
                            <span className="text-sm font-medium text-[#7a9ab0] ml-2">({purchasedPlayers.length}/{team.squadLimit})</span>
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {purchasedPlayers.map((player, index) => {
                            const gradeConfig = {
                                A: { bgOuter: 'linear-gradient(135deg, #FDE08B 0%, #D4AF37 50%, #FDE08B 100%)', textColor: '#FDE08B' },
                                B: { bgOuter: 'linear-gradient(135deg, #E8ECF1 0%, #9BA4B5 50%, #E8ECF1 100%)', textColor: '#E8ECF1' },
                                C: { bgOuter: 'linear-gradient(135deg, #E6A171 0%, #A65D37 50%, #E6A171 100%)', textColor: '#E6A171' },
                                D: { bgOuter: 'linear-gradient(135deg, #9BA4B5 0%, #4B5563 50%, #9BA4B5 100%)', textColor: '#9BA4B5' },
                            };
                            const config = gradeConfig[player.grade as keyof typeof gradeConfig] || gradeConfig.D;

                            return (
                                <motion.div
                                    key={player.rank}
                                    whileHover={{ x: 5 }}
                                    onClick={() => setExpandedPlayerId(player.rank)}
                                    className="cursor-pointer flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className="text-xl font-black w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[#7a9ab0]">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <div className="text-lg font-black uppercase tracking-tight text-[#e8ecf1]">
                                                {player.player}
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a9ab0]/60">
                                                {player.category}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className="px-5 py-1.5 rounded-full text-[12px] font-black border-2 tracking-widest text-white"
                                        style={{ 
                                            background: config.bgOuter,
                                            borderColor: 'rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        GRADE {player.grade}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {purchasedPlayers.length === 0 && (
                            <div className="py-20 text-center rounded-2xl bg-[#0a1628]/40 border border-[#2bb5cc]/10 border-dashed">
                                <div className="text-6xl mb-4">🏏</div>
                                <div className="text-xl text-[#7a9ab0] font-bold tracking-widest uppercase italic">Empty Squad</div>
                                <div className="text-sm text-[#7a9ab0]/60 mt-2">Acquire players to build your team.</div>
                            </div>
                        )}
                    </div>
                    
                    <Playing11Submission 
                        teamId={team.id} 
                        squadCount={team.squadCount} 
                        purchasedPlayers={purchasedPlayers} 
                        auctionPhase={auctionState?.phase || 'LIVE'}
                        onSuccess={() => {
                            // Optionally trigger a re-fetch or show a success state
                            requestState();
                        }}
                    />

                    {/* Modal Pop-out for Player Details */}
                    <AnimatePresence>
                        {expandedPlayerId && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setExpandedPlayerId(null)}
                                    className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-start justify-center p-4 overflow-y-auto pt-32 pb-10"
                                >
                                    {/* Modal Content */}
                                    {(() => {
                                        const player = purchasedPlayers.find(p => p.rank === expandedPlayerId);
                                        if (!player) return null;
                                        const gradeConfig = {
                                            A: { bgOuter: 'linear-gradient(135deg, #FDE08B 0%, #D4AF37 50%, #FDE08B 100%)', textColor: '#FDE08B' },
                                            B: { bgOuter: 'linear-gradient(135deg, #E8ECF1 0%, #9BA4B5 50%, #E8ECF1 100%)', textColor: '#E8ECF1' },
                                            C: { bgOuter: 'linear-gradient(135deg, #E6A171 0%, #A65D37 50%, #E6A171 100%)', textColor: '#E6A171' },
                                            D: { bgOuter: 'linear-gradient(135deg, #9BA4B5 0%, #4B5563 50%, #9BA4B5 100%)', textColor: '#9BA4B5' },
                                        };
                                        const config = gradeConfig[player.grade as keyof typeof gradeConfig] || gradeConfig.D;
                                        
                                        return (
                                            <div className="relative w-full max-w-4xl p-1 rounded-3xl group">
                                                {/* Shimmering Glow Effect Outside */}
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ 
                                                        opacity: [0.2, 0.5, 0.2],
                                                        scale: [1, 1.05, 1],
                                                        filter: [
                                                            `blur(20px) brightness(1)`,
                                                            `blur(40px) brightness(1.2)`,
                                                            `blur(20px) brightness(1)`
                                                        ]
                                                    }}
                                                    transition={{ 
                                                        duration: player.grade === 'A' ? 2 : player.grade === 'B' ? 3 : 4,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="absolute inset-0 rounded-3xl z-[-1]"
                                                    style={{ 
                                                        background: config.bgOuter,
                                                        opacity: player.grade === 'A' ? 0.6 : player.grade === 'B' ? 0.4 : 0.2
                                                    }}
                                                />

                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                                    exit={{ scale: 0.8, opacity: 0, y: 40 }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="relative rounded-[22px] overflow-hidden"
                                                >
                                                    <div className="bg-[#0a1628]/90 rounded-[22px] overflow-hidden relative border border-white/5">
                                                    {/* Decorative Header with Grade Gradient */}
                                                    <div className="h-32 w-full absolute top-0 left-0 opacity-20" style={{ background: config.bgOuter }} />
                                                    
                                                    {/* Close Button */}
                                                    <button 
                                                        onClick={() => setExpandedPlayerId(null)}
                                                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-50 border border-white/10"
                                                    >
                                                        <span className="text-2xl leading-none">×</span>
                                                    </button>

                                                    <div className="p-8 md:p-12 relative z-10">
                                                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-white">
                                                            {/* Avatar Section */}
                                                            <div className="relative shrink-0">
                                                                <motion.div 
                                                                    initial={{ y: 20, opacity: 0 }}
                                                                    animate={{ y: 0, opacity: 1 }}
                                                                    transition={{ delay: 0.2 }}
                                                                    className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl bg-black/80 relative group"
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 z-10" />
                                                                    <img 
                                                                        src={`/player_photos/${player.rank}.avif`} 
                                                                        alt={player.player}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = 'https://www.iplt20.com/assets/images/default-headshot.png';
                                                                        }}
                                                                    />
                                                                    <div className="absolute bottom-4 left-4 z-20">
                                                                        <div className="text-sm font-bold opacity-50 uppercase tracking-widest">Jersey #</div>
                                                                        <div className="text-4xl font-black italic">{player.rank}</div>
                                                                    </div>
                                                                </motion.div>
                                                                
                                                                {/* Grade Badge */}
                                                                <div 
                                                                    className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-4 border-[#0a1628] shadow-2xl z-30 transform -rotate-12"
                                                                    style={{ background: config.bgOuter }}
                                                                >
                                                                    <span className="text-[10px] font-black text-black/40 uppercase leading-none mb-1">Grade</span>
                                                                    <span className="text-4xl font-black text-black leading-none">{player.grade}</span>
                                                                </div>
                                                            </div>

                                                            {/* Details Section */}
                                                            <div className="flex-1 w-full">
                                                                <div className="mb-8 border-b border-white/10 pb-6">
                                                                    <motion.h3 
                                                                        initial={{ x: -20, opacity: 0 }}
                                                                        animate={{ x: 0, opacity: 1 }}
                                                                        transition={{ delay: 0.3 }}
                                                                        className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic mb-2"
                                                                        style={{ color: '#ffffff', textShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
                                                                    >
                                                                        {player.player}
                                                                    </motion.h3>
                                                                    <div className="flex flex-wrap gap-3 items-center">
                                                                        <span className="px-4 py-1.5 rounded-full bg-[#2bb5cc]/20 border border-[#2bb5cc]/30 text-[#2bb5cc] text-xs font-black uppercase tracking-wider">{player.category}</span>
                                                                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-black uppercase tracking-wider">
                                                                            {player.nationality === 'Overseas' ? '🌎 International Player' : '🇮🇳 Domestic Player'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Unified Stats Card */}
                                                                <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                                                                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-6 border-b border-white/5 pb-2">Technical Analysis • Stats</div>
                                                                    
                                                                    {(() => {
                                                                        const cat = player.category?.toLowerCase() || '';
                                                                        const isBatOrWk = cat.includes('bat') || cat.includes('wicket') || cat.includes('wk');
                                                                        const isBowl = cat.includes('bowl');
                                                                        const colsClass = isBatOrWk ? 'grid-cols-5' : 'grid-cols-4';

                                                                        return (
                                                                            <div className={`grid ${colsClass} gap-4`}>
                                                                                {/* Header Row */}
                                                                                <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Rating</div>
                                                                                {isBatOrWk ? (
                                                                                    <>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Scoring</div>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Impact</div>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Cons.</div>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Exp.</div>
                                                                                    </>
                                                                                ) : isBowl ? (
                                                                                    <>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Wickets</div>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Economy</div>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Eff.</div>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Batting</div>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Bowling</div>
                                                                                        <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest text-center">Vers.</div>
                                                                                    </>
                                                                                )}

                                                                                {/* Value Row */}
                                                                                <div className="text-3xl font-black italic text-[#2dd4a0] text-center">{player.rating || '-'}</div>
                                                                                {isBatOrWk ? (
                                                                                    <>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_scoring || '-'}</div>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_impact || '-'}</div>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_consistency || '-'}</div>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_experience || '-'}</div>
                                                                                    </>
                                                                                ) : isBowl ? (
                                                                                    <>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_wicket_taking || '-'}</div>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_economy || '-'}</div>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_efficiency || '-'}</div>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_batting || '-'}</div>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_bowling || '-'}</div>
                                                                                        <div className="text-3xl font-black italic text-center" style={{ color: config.textColor }}>{player.sub_versatility || '-'}</div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                        );
                                    })()}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </ScrollReveal>

                {/* Power Cards Section */}
                <ScrollReveal>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[#e8ecf1] font-black text-xl tracking-wide flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
                            <span className="text-2xl">⚡</span> Power Cards
                            <span className="text-sm font-medium text-[#2dd4a0] ml-2">{availablePowerCards} Available</span>
                            <span className="text-sm font-medium text-red-400/60 ml-1">{usedPowerCards} Used</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {Object.entries(team.powerCards).map(([key, card]) => {
                            const def = POWER_CARD_DEFS[key];
                            return (
                                <motion.div
                                    key={key}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className={`p-3 rounded-2xl text-center border backdrop-blur-sm transition-all ${card.used
                                        ? 'bg-red-500/5 border-red-500/20 opacity-60'
                                        : 'bg-[#0a1628]/60 border-[#2bb5cc]/20 hover:border-[#2bb5cc]/40'
                                        }`}
                                >
                                    <div className="flex justify-center mb-3">
                                        <div className="relative w-24 h-32 flex items-center justify-center">
                                            <Image
                                                src={getPowerCardImage(key, team.logo ? team.logo.split('/').pop()?.split('.')[0] : undefined)}
                                                alt={card.name}
                                                fill
                                                className="object-contain drop-shadow-[0_0_10px_rgba(43,181,204,0.4)]"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black tracking-widest text-[#e8ecf1]/40 uppercase mb-1">
                                        {card.name}
                                    </div>
                                    <div className={`text-[10px] font-black px-3 py-0.5 rounded-full inline-block ${card.used
                                        ? 'bg-red-500/20 text-red-400'
                                        : (card.available || key === 'rightToMatch')
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-white/10 text-white/40'
                                        }`}>
                                        {card.used ? 'USED' : (card.available || key === 'rightToMatch') ? 'AVAILABLE' : 'UNAVAILABLE'}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </ScrollReveal>

                {/* All Teams Budget Overview */}
                <ScrollReveal>
                    <h2 className="text-[#e8ecf1] font-black text-xl mb-6 tracking-wide flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
                        <span className="text-2xl">📊</span> All Teams Overview
                    </h2>

                    <div className="rounded-2xl bg-[#0a1628]/60 border border-[#2bb5cc]/10 backdrop-blur-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2bb5cc]/10">
                                    <th className="text-left py-3 px-5 text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold">#</th>
                                    <th className="text-left py-3 px-3 text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold">Team</th>
                                    <th className="text-right py-3 px-5 text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold">Budget Remaining</th>
                                    <th className="text-right py-3 px-5 text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold">Players</th>
                                    <th className="text-right py-3 px-5 text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold">Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...allTeams].sort((a, b) => b.budgetRemaining - a.budgetRemaining).map((t, i) => {
                                    const isMyTeam = String(t.id) === teamId;
                                    return (
                                        <motion.tr
                                            key={t.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.03 }}
                                            className={`border-b border-white/5 transition-colors ${isMyTeam
                                                ? 'bg-[#2bb5cc]/10 border-l-2 border-l-[#2bb5cc]'
                                                : 'hover:bg-white/3'
                                                }`}
                                        >
                                            <td className="py-3 px-5 text-sm text-[#7a9ab0] font-mono">{i + 1}</td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={t.logo || '/auction_logo.jpg'} alt={t.shortName} className="w-8 h-8 object-contain drop-shadow-md" onError={(e) => { (e.target as HTMLImageElement).src = '/auction_logo.jpg'; }} />
                                                    <div>
                                                        <span className={`font-bold text-sm ${isMyTeam ? 'text-[#2bb5cc]' : 'text-[#e8ecf1]'}`}>{t.name}</span>
                                                        {isMyTeam && <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded bg-[#2bb5cc]/20 text-[#2bb5cc] font-black uppercase">You</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <span className="text-[#2dd4a0] font-bold text-sm">₹{t.budgetRemaining} CR</span>
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <span className="text-[#2bb5cc] font-bold text-sm">{t.squadCount}/{t.squadLimit}</span>
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <span className="text-[#7a9ab0] font-medium text-sm">₹{t.budgetUsed} CR</span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </ScrollReveal>

            </div>
        </div>
    );
}
