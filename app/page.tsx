"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-5xl"
            >
                {/* IPL Logo Placeholder */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    <h1 className="gradient-text font-display font-black text-7xl lg:text-8xl mb-4">
                        IPL AUCTION
                    </h1>
                    <div className="w-32 h-1 mx-auto bg-gradient-to-r from-accent-neon-blue via-accent-purple to-accent-gold rounded-full" />
                </motion.div>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-3xl text-text-secondary mb-16 font-light"
                >
                    Real-Time Auction Simulation Platform
                </motion.p>

                {/* Role Selection Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    {/* Super Admin */}
                    <Link href="/auth?role=super-admin">
                        <div className="glass-card-hover p-6 cursor-pointer group">
                            <div className="text-4xl mb-4">🔴</div>
                            <h3 className="text-xl font-bold mb-2 text-red-400">Super Admin</h3>
                            <p className="text-sm text-text-secondary">
                                Full Control & Emergency Override
                            </p>
                        </div>
                    </Link>

                    {/* Auctioneer */}
                    <Link href="/auth?role=auctioneer">
                        <div className="glass-card-hover p-6 cursor-pointer group">
                            <div className="text-4xl mb-4">🟧</div>
                            <h3 className="text-xl font-bold mb-2 text-orange-400">Auctioneer</h3>
                            <p className="text-sm text-text-secondary">
                                Control Auction Flow
                            </p>
                        </div>
                    </Link>

                    {/* Admin Operator */}
                    <Link href="/auth?role=admin-operator">
                        <div className="glass-card-hover p-6 cursor-pointer group">
                            <div className="text-4xl mb-4">🟨</div>
                            <h3 className="text-xl font-bold mb-2 text-yellow-400">Admin Operator</h3>
                            <p className="text-sm text-text-secondary">
                                Data Entry & Mutations
                            </p>
                        </div>
                    </Link>

                    {/* Team Participant */}
                    <Link href="/auth?role=team">
                        <div className="glass-card-hover p-6 cursor-pointer group">
                            <div className="text-4xl mb-4">🟩</div>
                            <h3 className="text-xl font-bold mb-2 text-green-400">Team</h3>
                            <p className="text-sm text-text-secondary">
                                View Dashboard (Read-Only)
                            </p>
                        </div>
                    </Link>
                </motion.div>

                {/* Big Screen Display */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <Link href="/display">
                        <div className="glass-card-hover p-8 cursor-pointer neon-glow-blue max-w-md mx-auto">
                            <div className="text-5xl mb-4">📺</div>
                            <h3 className="text-2xl font-bold mb-2 gradient-text">Big Screen Display</h3>
                            <p className="text-text-secondary">
                                Live Auction Feed & Leaderboard
                            </p>
                        </div>
                    </Link>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-16 text-text-secondary text-sm"
                >
                    <p>IPL Auction 2026 • Offline Event Mode • Admin-Controlled System</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
