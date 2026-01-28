// Home Page - PREMIUM PLEY-STYLE
// Immersive landing page with stunning animations

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

// Floating Particles
function FloatingParticles() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(25)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        background: ['#00d9ff', '#b537f2', '#ffd700', '#00ff88'][Math.floor(Math.random() * 4)],
                        borderRadius: '50%',
                        animationDuration: `${Math.random() * 12 + 8}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.5 + 0.2,
                    }}
                />
            ))}
        </div>
    );
}

// 3D Tilt Card Component
function TiltCard({ children, className, gradient }: { children: React.ReactNode; className?: string; gradient: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 15, y: -x * 15 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
            }}
            className={`relative transition-transform duration-200 ${className}`}
        >
            {/* Glow effect on hover */}
            <div className={`
                absolute inset-0 rounded-3xl blur-xl transition-opacity duration-300
                bg-gradient-to-br ${gradient}
                ${isHovered ? 'opacity-30' : 'opacity-0'}
            `} />
            {children}
        </motion.div>
    );
}

export default function HomePage() {
    const links = [
        {
            title: 'Big Screen',
            description: 'Immersive projector display for live audience',
            href: '/big-screen',
            icon: '📺',
            color: 'from-cyan-500 to-blue-500',
            badge: '1920×1080',
        },
        {
            title: 'All Teams',
            description: 'Complete overview of all team standings',
            href: '/teams',
            icon: '🏆',
            color: 'from-yellow-500 to-orange-500',
            badge: 'Leaderboard',
        },
        {
            title: 'Admin Panel',
            description: 'Full control dashboard for auctioneers',
            href: '/admin',
            icon: '🎛️',
            color: 'from-purple-500 to-pink-500',
            badge: 'Control',
        },
        {
            title: 'Team Dashboard',
            description: 'Real-time view for team participants',
            href: '/team/1',
            icon: '👥',
            color: 'from-green-500 to-emerald-500',
            badge: 'Live',
        },
    ];

    return (
        <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-8 overflow-hidden relative">
            <FloatingParticles />

            <div className="max-w-7xl w-full relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    {/* Logo/Brand */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        className="inline-block mb-8"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center text-5xl shadow-2xl shadow-purple-500/30 floating">
                            🏏
                        </div>
                    </motion.div>

                    {/* Title with animated gradient */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="big-screen-title gradient-text-animated mb-6"
                    >
                        IPL AUCTION 2026
                    </motion.h1>

                    {/* Subtitle with typing effect */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl text-white/60 mb-8"
                    >
                        <span className="gradient-text">Live Auction</span> • <span className="text-white/40">Real-time</span> • <span className="gradient-text">Immersive</span>
                    </motion.p>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-8 px-8 py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
                    >
                        {[
                            { label: 'Teams', value: '10', icon: '🏆' },
                            { label: 'Players', value: '600+', icon: '👤' },
                            { label: 'Budget', value: '₹1200 CR', icon: '💰' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <span className="text-2xl">{stat.icon}</span>
                                <div className="text-left">
                                    <div className="text-white/50 text-xs">{stat.label}</div>
                                    <div className="text-white font-bold">{stat.value}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Navigation Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {links.map((link, index) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <Link href={link.href}>
                                <TiltCard gradient={link.color}>
                                    <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                                        {/* Animated Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />

                                        {/* Spotlight effect */}
                                        <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        {/* Badge */}
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className={`absolute top-4 right-4 px-2 py-1 bg-gradient-to-r ${link.color} rounded-full text-[10px] font-bold text-white`}
                                        >
                                            {link.badge}
                                        </motion.div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="text-5xl mb-4 inline-block"
                                            >
                                                {link.icon}
                                            </motion.div>
                                            <h2 className={`text-2xl font-black text-white mb-2 group-hover:bg-gradient-to-r group-hover:${link.color} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                                                {link.title}
                                            </h2>
                                            <p className="text-white/50 text-sm">{link.description}</p>
                                        </div>

                                        {/* Arrow with animation */}
                                        <motion.div
                                            className="absolute bottom-6 right-6 text-3xl text-white/20 group-hover:text-white/60 transition-all"
                                            whileHover={{ x: 5 }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </TiltCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Team Quick Access */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass-card p-6 mb-8"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">🏏</span>
                        <span className="gradient-text">Quick Team Access</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: 1, name: 'MI', logo: '🔵', color: 'from-blue-500 to-blue-600' },
                            { id: 2, name: 'CSK', logo: '🟡', color: 'from-yellow-500 to-yellow-600' },
                            { id: 3, name: 'RCB', logo: '🔴', color: 'from-red-500 to-red-600' },
                            { id: 4, name: 'KKR', logo: '💜', color: 'from-purple-500 to-purple-600' },
                            { id: 5, name: 'DC', logo: '💙', color: 'from-blue-400 to-blue-500' },
                            { id: 6, name: 'PBKS', logo: '🔴', color: 'from-red-400 to-red-500' },
                            { id: 7, name: 'RR', logo: '💗', color: 'from-pink-500 to-pink-600' },
                            { id: 8, name: 'SRH', logo: '🧡', color: 'from-orange-500 to-orange-600' },
                            { id: 9, name: 'GT', logo: '💎', color: 'from-cyan-500 to-cyan-600' },
                            { id: 10, name: 'LSG', logo: '🩵', color: 'from-teal-500 to-teal-600' },
                        ].map((team, i) => (
                            <motion.div
                                key={team.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.9 + i * 0.05 }}
                            >
                                <Link href={`/team/${team.id}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                                            px-4 py-2 rounded-xl 
                                            bg-gradient-to-r ${team.color}
                                            text-white font-bold text-sm
                                            shadow-lg hover:shadow-xl transition-shadow
                                            cursor-pointer flex items-center gap-2
                                        `}
                                    >
                                        <span>{team.logo}</span>
                                        <span>{team.name}</span>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Status */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-green-500 rounded-full"
                        />
                        <span className="text-white/70">System Ready</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/50">All services operational</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
