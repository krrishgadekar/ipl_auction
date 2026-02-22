'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

/* ─── Ocean Bubble Particles ─── */
function OceanBubbles() {
    const bubbles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 10 + 4,
        duration: Math.random() * 18 + 10,
        delay: Math.random() * 10,
        color: Math.random() > 0.5 ? 'rgba(43,181,204,' : 'rgba(212,175,55,',
        opacity: Math.random() * 0.4 + 0.1,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {bubbles.map((b) => (
                <div
                    key={b.id}
                    className="particle"
                    style={{
                        left: b.left,
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        background: `radial-gradient(circle at 35% 35%, ${b.color}0.9) 0%, ${b.color}0.3) 100%)`,
                        border: `1px solid ${b.color}0.5)`,
                        borderRadius: '50%',
                        animationDuration: `${b.duration}s`,
                        animationDelay: `${b.delay}s`,
                        opacity: b.opacity,
                        backdropFilter: 'blur(1px)',
                    }}
                />
            ))}
        </div>
    );
}

/* ─── Wave SVG Footer ─── */
function OceanWaves() {
    return (
        <div className="ocean-waves">
            <svg className="wave-layer-1" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none">
                <path d="M0,100 C240,160 480,40 720,100 C960,160 1200,40 1440,100 L1440,200 L0,200 Z"
                    fill="url(#waveGrad1)" />
                <defs>
                    <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0e4d5e" />
                        <stop offset="50%" stopColor="#1a8a9e" />
                        <stop offset="100%" stopColor="#0e4d5e" />
                    </linearGradient>
                </defs>
            </svg>
            <svg className="wave-layer-2" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none" style={{ bottom: 0 }}>
                <path d="M0,130 C360,60 720,180 1080,100 C1260,60 1380,120 1440,130 L1440,200 L0,200 Z"
                    fill="url(#waveGrad2)" />
                <defs>
                    <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0a1628" />
                        <stop offset="50%" stopColor="#0d2137" />
                        <stop offset="100%" stopColor="#0a1628" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

/* ─── 3D Tilt Card ─── */
function TiltCard({ children, className, glowColor }: {
    children: React.ReactNode;
    className?: string;
    glowColor: string;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 12, y: -x * 12 });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
            }}
            className={`relative transition-transform duration-150 ${className}`}
        >
            {/* Glow halo */}
            <div className={`
                absolute inset-0 rounded-3xl blur-xl transition-opacity duration-400
                ${hovered ? 'opacity-30' : 'opacity-0'}
            `} style={{ background: glowColor }} />
            {children}
        </motion.div>
    );
}

const NAV_LINKS = [
    {
        title: 'Big Screen',
        description: 'Immersive projector display for live audience',
        href: '/big-screen',
        icon: '📺',
        gradient: 'linear-gradient(135deg, #0e4d5e, #1a8a9e)',
        glow: 'linear-gradient(135deg, #1a8a9e, #2bb5cc)',
        borderColor: 'rgba(43,181,204,0.3)',
        badge: '1920×1080',
    },
    {
        title: 'All Teams',
        description: 'Complete overview of all team standings',
        href: '/teams',
        icon: '🏆',
        gradient: 'linear-gradient(135deg, #7a5c00, #c9a84c)',
        glow: 'linear-gradient(135deg, #c9a84c, #f5d569)',
        borderColor: 'rgba(212,175,55,0.3)',
        badge: 'Leaderboard',
    },
    {
        title: 'Admin Panel',
        description: 'Full control dashboard for auctioneers',
        href: '/admin',
        icon: '🎛️',
        gradient: 'linear-gradient(135deg, #0d3a52, #1a6a82)',
        glow: 'linear-gradient(135deg, #2bb5cc, #5ccfdf)',
        borderColor: 'rgba(43,181,204,0.25)',
        badge: 'Control',
    },
    {
        title: 'Team Dashboard',
        description: 'Real-time view for team participants',
        href: '/team/1',
        icon: '👥',
        gradient: 'linear-gradient(135deg, #0a3d2e, #1a6a52)',
        glow: 'linear-gradient(135deg, #2dd4a0, #5ee8c5)',
        borderColor: 'rgba(45,212,160,0.25)',
        badge: 'Live',
    },
];

const TEAMS = [
    { id: 1, name: 'MI', color: '#004BA0', glow: '#1976D2' },
    { id: 2, name: 'CSK', color: '#F9C400', text: '#000', glow: '#FFD700' },
    { id: 3, name: 'RCB', color: '#C01B2D', glow: '#E53935' },
    { id: 4, name: 'KKR', color: '#3A225D', glow: '#7B1FA2' },
    { id: 5, name: 'DC', color: '#00509E', glow: '#1565C0' },
    { id: 6, name: 'PBKS', color: '#AA0000', glow: '#C62828' },
    { id: 7, name: 'RR', color: '#EA1A84', glow: '#E91E8C' },
    { id: 8, name: 'SRH', color: '#F26522', glow: '#FF6F00' },
    { id: 9, name: 'GT', color: '#1C2951', glow: '#283593' },
    { id: 10, name: 'LSG', color: '#00A99D', glow: '#00BCD4' },
];

export default function HomePage() {
    return (
        <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-8 overflow-hidden relative">
            <OceanBubbles />

            <div className="max-w-7xl w-full relative z-10">

                {/* ── HERO ── */}
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
                        className="inline-block mb-6 floating"
                    >
                        <div className="relative w-28 h-28">
                            <Image
                                src="/logo.png"
                                alt="IPL Auction 2026"
                                fill
                                className="object-contain drop-shadow-[0_0_30px_rgba(43,181,204,0.5)]"
                                onError={(e) => {
                                    // Fallback if logo not found
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            {/* Fallback emoji if image missing */}
                            <div className="absolute inset-0 flex items-center justify-center text-6xl">🏏</div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="big-screen-title gradient-text-animated mb-3"
                    >
                        IPL AUCTION 2026
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-xl mb-1"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'rgba(188,220,230,0.7)', letterSpacing: '0.12em' }}
                    >
                        The Water Edition — Live Auction System
                    </motion.p>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.45, duration: 0.6 }}
                        className="mx-auto mt-4 mb-8 h-px w-64"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }}
                    />

                    {/* Stats Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-8 px-8 py-4 rounded-full"
                        style={{
                            background: 'rgba(14,77,94,0.2)',
                            border: '1px solid rgba(43,181,204,0.2)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {[
                            { label: 'Teams', value: '10', icon: '🏆' },
                            { label: 'Players', value: '246', icon: '👤' },
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
                                    <div className="text-xs" style={{ color: 'rgba(122,148,176,0.8)' }}>{stat.label}</div>
                                    <div className="font-bold text-white">{stat.value}</div>
                                </div>
                                {i < 2 && <div className="w-px h-8 mx-2" style={{ background: 'rgba(43,181,204,0.2)' }} />}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ── NAV CARDS ── */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {NAV_LINKS.map((link, i) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                        >
                            <Link href={link.href}>
                                <TiltCard glowColor={link.glow}>
                                    <div
                                        className="group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden h-full ocean-surface-hover"
                                        style={{
                                            background: 'rgba(10,22,40,0.7)',
                                            border: `1px solid ${link.borderColor}`,
                                            backdropFilter: 'blur(16px)',
                                            minHeight: '180px',
                                        }}
                                    >
                                        {/* Gradient hover overlay */}
                                        <div
                                            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                            style={{ background: link.gradient }}
                                        />

                                        {/* Badge top-right */}
                                        <motion.div
                                            whileHover={{ scale: 1.08 }}
                                            className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                            style={{ background: link.gradient }}
                                        >
                                            {link.badge}
                                        </motion.div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 6 }}
                                                className="text-5xl mb-4 inline-block"
                                            >
                                                {link.icon}
                                            </motion.div>
                                            <h2
                                                className="text-xl font-black text-white mb-2"
                                                style={{ fontFamily: "'Cinzel', serif" }}
                                            >
                                                {link.title}
                                            </h2>
                                            <p className="text-sm" style={{ color: 'rgba(122,148,176,0.8)' }}>
                                                {link.description}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <motion.div
                                            className="absolute bottom-5 right-5 text-2xl transition-all duration-300 opacity-30 group-hover:opacity-70"
                                            whileHover={{ x: 4 }}
                                        >
                                            →
                                        </motion.div>

                                        {/* Bottom border glow on hover */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"
                                            style={{ background: link.gradient }}
                                        />
                                    </div>
                                </TiltCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* ── QUICK TEAM ACCESS ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-2xl p-6 mb-8"
                    style={{
                        background: 'rgba(10,22,40,0.6)',
                        border: '1px solid rgba(43,181,204,0.12)',
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    <h3
                        className="text-lg font-bold mb-5 flex items-center gap-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <span
                            className="text-sm font-bold px-3 py-1 rounded-full"
                            style={{
                                background: 'rgba(212,175,55,0.1)',
                                border: '1px solid rgba(212,175,55,0.25)',
                                color: '#d4af37',
                            }}
                        >
                            ⚡ QUICK ACCESS
                        </span>
                        <span className="gradient-text">Team Dashboards</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {TEAMS.map((team, i) => (
                            <motion.div
                                key={team.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 + i * 0.04 }}
                            >
                                <Link href={`/team/${team.id}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.1, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2 transition-all"
                                        style={{
                                            background: team.color,
                                            color: team.text ?? '#fff',
                                            boxShadow: `0 4px 15px ${team.glow}30`,
                                            border: `1px solid ${team.glow}50`,
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 25px ${team.glow}60`;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 15px ${team.glow}30`;
                                        }}
                                    >
                                        <span>{team.name}</span>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── STATUS BAR ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <div
                        className="inline-flex items-center gap-4 px-6 py-3 rounded-full"
                        style={{
                            background: 'rgba(14,77,94,0.15)',
                            border: '1px solid rgba(43,181,204,0.15)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full"
                            style={{ background: '#2dd4a0' }}
                        />
                        <span style={{ color: 'rgba(188,220,230,0.7)' }}>System Ready</span>
                        <span style={{ color: 'rgba(43,181,204,0.3)' }}>•</span>
                        <span style={{ color: 'rgba(122,148,176,0.6)' }}>All services operational</span>
                    </div>
                </motion.div>
            </div>

            {/* ── WAVE FOOTER ── */}
            <OceanWaves />
        </div>
    );
}
