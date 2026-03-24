// Power Cards Page - PREMIUM PLEY-STYLE
// Detailed view of all power cards with rules and history

'use client';

import { use, useEffect, useState, useRef } from 'react';
import { Team } from '@/lib/api/teams';
import { getAllTeams } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Loader from '@/components/Loader';
import Image from 'next/image';
import { getPowerCardImage } from '@/lib/utils/powerCard';
import TeamAvatar from '@/components/team/TeamAvatar';

// Floating Particles
function FloatingParticles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
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

// Power Card definitions with full details
const powerCardDefinitions = {
    finalStrike: {
        name: 'Final Strike',
        icon: '⚡',
        cost: 7,
        gradient: 'from-yellow-500 to-orange-500',
        border: 'border-yellow-500',
        glow: 'shadow-[0_0_50px_rgba(234,179,8,0.4)]',
        description: 'Make an unbeatable final bid that closes the auction immediately',
        rules: [
            'Can only be used once per auction',
            'Must add minimum ₹1 CR to current bid',
            'Auction closes immediately after use',
            'Other teams cannot counter this bid',
            'Cost of ₹7 CR is deducted from your budget',
        ],
        strategy: 'Best used for marquee players you absolutely cannot miss. Save it for late-round bidding wars on essential picks.',
        rarity: 'LEGENDARY',
    },
    bidFreezer: {
        name: 'Bid Freezer',
        icon: '❄️',
        cost: 5,
        gradient: 'from-cyan-500 to-blue-500',
        border: 'border-cyan-500',
        glow: 'shadow-[0_0_50px_rgba(6,182,212,0.4)]',
        description: 'Freeze the current bid for 30 seconds, preventing other teams from bidding',
        rules: [
            'Freezes bidding for exactly 30 seconds',
            'You can still increase your own bid during freeze',
            'Other teams see a frozen timer',
            'Cannot be countered by other power cards',
            'Cost of ₹5 CR is deducted from your budget',
        ],
        strategy: 'Use when you have the highest bid and want to lock it in. Great for psychological pressure on opponents.',
        rarity: 'RARE',
    },
    godsEye: {
        name: "God's Eye",
        icon: '👁️',
        cost: 4,
        gradient: 'from-purple-500 to-pink-500',
        border: 'border-purple-500',
        glow: 'shadow-[0_0_50px_rgba(168,85,247,0.4)]',
        description: 'Reveal hidden player stats and true potential before bidding',
        rules: [
            'Reveals hidden performance metrics',
            'Shows injury history and fitness levels',
            'Displays projected performance for upcoming season',
            'Information is only visible to your team',
            'Cost of ₹4 CR is deducted from your budget',
        ],
        strategy: 'Perfect for uncapped players or those with limited IPL history. Helps identify hidden gems.',
        rarity: 'RARE',
    },
    mulligan: {
        name: 'Mulligan',
        icon: '🔄',
        cost: 3,
        gradient: 'from-green-500 to-emerald-500',
        border: 'border-green-500',
        glow: 'shadow-[0_0_50px_rgba(34,197,94,0.4)]',
        description: 'Skip the current player and bring them back later in the auction',
        rules: [
            'Current player is moved to end of auction queue',
            'All bids are reset when player returns',
            'Can only be used once per day',
            'Player returns in next round, not immediately',
            'Cost of ₹3 CR is deducted from your budget',
        ],
        strategy: 'Use when bidding is too high early. Player might go cheaper when budgets are tighter later.',
        rarity: 'UNCOMMON',
    },
    rtm: {
        name: 'RTM',
        icon: '🎯',
        cost: 0,
        gradient: 'from-red-500 to-pink-500',
        border: 'border-red-500',
        glow: 'shadow-[0_0_50px_rgba(239,68,68,0.4)]',
        description: 'Right To Match - Match the winning bid to retain your former player',
        rules: [
            'Only usable on players from your previous squad',
            'Must match the exact winning bid amount',
            'Can only be used limited times per auction',
            'No additional cost beyond the bid amount',
            'Must be used before auction hammer falls',
        ],
        strategy: 'Essential for retaining core players. Plan your RTM usage carefully based on your retention strategy.',
        rarity: 'LEGENDARY',
    },
};

// Premium Power Card Component
function PowerCardDetail({ cardKey, card, teams, viewerTeamShortName }: {
    cardKey: string;
    card: typeof powerCardDefinitions.finalStrike;
    teams: Team[];
    viewerTeamShortName?: string;
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    // Find teams that have used/available this card
    const cardStats = teams.reduce((acc, team) => {
        const teamCard = team.powerCards[cardKey as keyof typeof team.powerCards];
        if (!teamCard) return acc;
        if (teamCard.used) acc.used.push(team);
        else if (teamCard.available) acc.available.push(team);
        return acc;
    }, { used: [] as Team[], available: [] as Team[] });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || isFlipped) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 15, y: -x * 15 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${isFlipped ? 180 : tilt.y}deg)`,
                transformStyle: 'preserve-3d',
            }}
            className={`
                relative min-h-[450px] rounded-3xl overflow-hidden cursor-pointer
                transition-transform duration-500
                ${card.border} border-2 ${card.glow}
            `}
        >
            {/* Front of Card */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                style={{ backfaceVisibility: 'hidden' }}
            >
                {/* Holographic overlay */}
                <div className="absolute inset-0 holo-effect opacity-30 pointer-events-none" />

                {/* Rarity Badge */}
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${card.gradient} text-white text-xs font-black`}
                >
                    {card.rarity}
                </motion.div>

                <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative w-48 h-64 mx-auto mb-6 mt-4 flex items-center justify-center"
                >
                    <Image 
                        src={getPowerCardImage(cardKey, viewerTeamShortName)} 
                        alt={card.name} 
                        fill
                        className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    />
                </motion.div>

                {/* Name & Cost */}
                <div className="text-center mb-6">
                    <h3 className={`text-3xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}>
                        {card.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/30 rounded-full border border-white/10">
                        <span className="text-white/60">Cost:</span>
                        <span className="font-bold text-yellow-400">
                            {card.cost > 0 ? `₹${card.cost} CR` : 'FREE'}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-white/70 text-center mb-6 leading-relaxed">
                    {card.description}
                </p>

                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30 text-center">
                        <div className="text-2xl font-black text-green-400">{cardStats.available.length}</div>
                        <div className="text-xs text-green-400/70">Available</div>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30 text-center">
                        <div className="text-2xl font-black text-red-400">{cardStats.used.length}</div>
                        <div className="text-xs text-red-400/70">Used</div>
                    </div>
                </div>

                {/* Flip Hint */}
                <div className="text-center text-white/30 text-xs">
                    Click to flip for rules →
                </div>
            </div>

            {/* Back of Card (Rules) */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>{card.icon}</span>
                    Rules & Guidelines
                </h4>

                <ul className="space-y-2 mb-6">
                    {card.rules.map((rule, i) => (
                        <motion.li
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 text-sm text-white/70"
                        >
                            <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.gradient} flex-shrink-0`} />
                            {rule}
                        </motion.li>
                    ))}
                </ul>

                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} bg-opacity-10 border ${card.border}/30`}>
                    <div className="text-xs text-white/60 mb-1">💡 Strategy Tip</div>
                    <p className="text-sm text-white/80">{card.strategy}</p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-center text-white/30 text-xs">
                    Click to flip back ←
                </div>
            </div>
        </motion.div>
    );
}

export default function PowerCardsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const teamId = Number(resolvedParams.id);

    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const teamsData = await getAllTeams();
                setTeams(teamsData);
                const team = teamsData.find(t => t.id === teamId);
                setCurrentTeam(team || null);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, [teamId]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen animated-gradient-bg overflow-auto">
            <FloatingParticles />

            {/* Header */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-4"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-4xl"
                            >
                                ⚡
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-black gradient-text-animated">Power Cards</h1>
                                <p className="text-white/50 text-sm">
                                    {currentTeam ? `${currentTeam.name}'s Arsenal` : 'Complete Guide'}
                                </p>
                            </div>
                        </motion.div>
                        <Link href={currentTeam ? `/team/${currentTeam.id}` : '/'} className="btn-secondary text-sm">
                            ← Back
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 relative z-10">
                {/* Your Power Cards Status (if team specific) */}
                {currentTeam && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 mb-8"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <TeamAvatar team={currentTeam} size={10} />
                            Your Power Cards Status
                        </h2>
                        <div className="grid grid-cols-5 gap-3">
                            {Object.entries(currentTeam.powerCards).map(([key, card]) => {
                                const def = powerCardDefinitions[key as keyof typeof powerCardDefinitions];
                                return (
                                    <div
                                        key={key}
                                        className={`p-3 rounded-xl text-center border ${card.used
                                            ? 'bg-red-500/10 border-red-500/30'
                                            : 'bg-green-500/10 border-green-500/30'
                                            }`}
                                    >
                                        <div className="relative w-10 h-14 mx-auto mb-1">
                                            <Image 
                                                src={getPowerCardImage(key, currentTeam.shortName)} 
                                                alt={key} 
                                                fill 
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className={`text-[10px] font-bold ${card.used ? 'text-red-400' : 'text-green-400'}`}>
                                            {card.used ? 'USED' : 'READY'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* All Power Cards Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                >
                    <h2 className="text-2xl font-black text-white mb-2">
                        <span className="gradient-text">Power Card Encyclopedia</span>
                    </h2>
                    <p className="text-white/50 mb-6">
                        Click any card to flip and see detailed rules
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(powerCardDefinitions).map(([key, card]) => (
                        <PowerCardDetail
                            key={key}
                            cardKey={key}
                            card={card}
                            teams={teams}
                            viewerTeamShortName={currentTeam?.shortName}
                        />
                    ))}
                </div>

                {/* Usage Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 mt-8"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        📊 Power Card Usage by Teams
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-white/60 text-sm">Team</th>
                                    {Object.entries(powerCardDefinitions).map(([key, card], i) => (
                                        <th key={card.name} className="py-3 px-2 text-white/60 text-sm">
                                            <div className="relative w-6 h-8 mx-auto">
                                                <Image 
                                                    src={getPowerCardImage(key)} 
                                                    alt={card.name} 
                                                    fill 
                                                    className="object-contain"
                                                />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map(team => (
                                    <tr key={team.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <TeamAvatar team={team} size={6} />
                                                <span className="text-white font-medium">{team.shortName}</span>
                                            </div>
                                        </td>
                                        {Object.keys(powerCardDefinitions).map(key => {
                                            const card = team.powerCards[key as keyof typeof team.powerCards];
                                            const isUsed = card?.used ?? false;
                                            return (
                                                <td key={key} className="text-center py-3 px-2">
                                                    <span className={`inline-flex w-6 h-6 rounded-full text-xs font-bold items-center justify-center ${isUsed
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : card
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-white/5 text-white/20'
                                                        }`}>
                                                        {isUsed ? '✗' : card ? '✓' : '–'}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
