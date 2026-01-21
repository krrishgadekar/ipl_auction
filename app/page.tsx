// Home Page
// Landing page with navigation to different views

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
    const links = [
        {
            title: 'Big Screen',
            description: 'Projector display for live audience (1920×1080)',
            href: '/big-screen',
            icon: '📺',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Admin Panel',
            description: 'Control dashboard for auctioneers',
            href: '/admin',
            icon: '🎛️',
            color: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Team Dashboard',
            description: 'Read-only view for team participants',
            href: '/team/1',
            icon: '👥',
            color: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-8">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        IPL AUCTION 2026
                    </h1>
                    <p className="text-2xl text-white/70">Live Auction System</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {links.map((link, index) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={link.href}>
                                <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden">
                                    {/* Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="text-6xl mb-4">{link.icon}</div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{link.title}</h2>
                                        <p className="text-white/60">{link.description}</p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="absolute bottom-8 right-8 text-4xl text-white/30 group-hover:text-white/60 group-hover:translate-x-2 transition-all duration-300">
                                        →
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-white/70">System Ready</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
