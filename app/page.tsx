'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Logo3D = dynamic(() => import('@/components/Logo3D'), {
    ssr: false,
    loading: () => <div className="logo3d-container"><div className="logo3d-loader"><div className="logo3d-spinner" /></div></div>,
});

/* ─── SVG Icons ─── */
function IconMonitor() {
    return (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    );
}

function IconCog() {
    return (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}

function IconUsers() {
    return (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconTrophy() {
    return (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    );
}

/* ─── Nav Card Data ─── */
const NAV_LINKS = [
    {
        title: 'Big Screen',
        description: 'Projector display for live audience viewing',
        href: '/big-screen',
        Icon: IconMonitor,
        accent: '#2bb5cc',
        tag: '1920×1080',
    },
    {
        title: 'Admin Panel',
        description: 'Auctioneer control center and bid management',
        href: '/admin',
        Icon: IconCog,
        accent: '#6c8aff',
        tag: 'Control',
    },
    {
        title: 'Team Dashboard',
        description: 'Real-time squad builder for team owners',
        href: '/team/1',
        Icon: IconUsers,
        accent: '#2dd4a0',
        tag: 'Live',
    },
    {
        title: 'Final Standings',
        description: 'Leaderboard with scores & winner declaration',
        href: '/leaderboard',
        Icon: IconTrophy,
        accent: '#d4af37',
        tag: 'V3.1',
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function HomePage() {
    return (
        <div className="home-root">
            {/* Clean Premium Gradient Background */}
            <div className="home-bg" />

            {/* Float Stats Top Right */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="home-stats-corner"
            >
                {[
                    { label: 'Teams', value: '10', dot: '#2bb5cc' },
                    { label: 'Players', value: '246', dot: '#d4af37' },
                    { label: 'Budget', value: '₹1200 CR', dot: '#2dd4a0' },
                ].map((stat, i) => (
                    <div key={stat.label} className="home-stat-item">
                        <div className="home-stat-dot" style={{ background: stat.dot }} />
                        <div>
                            <div className="home-stat-label">{stat.label}</div>
                            <div className="home-stat-value">{stat.value}</div>
                        </div>
                        {i < 2 && <div className="home-stat-sep" />}
                    </div>
                ))}
            </motion.div>

            <div className="home-content">

                {/* ── HERO ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center mb-4"
                >
                    {/* 3D Logo */}
                    <Logo3D />

                    {/* Title */}
                    <h1 className="home-title gradient-text-animated">
                        IPL AUCTION 2026
                    </h1>
                </motion.div>

                {/* ── NAV CARDS ── */}
                <div className="home-cards-grid">
                    {NAV_LINKS.map((link, i) => (
                        <motion.div
                            key={link.href}
                            custom={i}
                            initial="hidden"
                            animate="show"
                            variants={fadeUp}
                        >
                            <Link href={link.href} className="block h-full">
                                <div
                                    className="home-card group"
                                    style={{ '--card-accent': link.accent } as React.CSSProperties}
                                >
                                    {/* Top accent border */}
                                    <div className="home-card-accent" />

                                    {/* Tag */}
                                    <div className="home-card-tag">
                                        {link.tag}
                                    </div>

                                    {/* Icon */}
                                    <div className="home-card-icon">
                                        <link.Icon />
                                    </div>

                                    {/* Text */}
                                    <h2 className="home-card-title">{link.title}</h2>
                                    <p className="home-card-desc">{link.description}</p>

                                    {/* Arrow */}
                                    <div className="home-card-arrow">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
