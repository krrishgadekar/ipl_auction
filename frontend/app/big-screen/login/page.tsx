// ═══════════════════════════════════════════════════════════════
// Big Screen Login Page — Premium dark-themed authentication
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { loginAdmin } from '@/lib/api/auction';

export default function BigScreenLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginAdmin(username, password);
            
            if (data.sessionId) {
                // Store session token
                localStorage.setItem('ipl_admin_token', data.sessionId);
                localStorage.setItem('ipl_screen_auth', 'true');
                router.push('/big-screen');
            } else {
                setError('Authentication failed');
                setShake(true);
                setTimeout(() => setShake(false), 600);
            }
        } catch (err: any) {
            setError(err.message || 'Connection error');
            setShake(true);
            setTimeout(() => setShake(false), 600);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at center, #0a1628, #040b14)' }}
        >
            {/* Background particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 25 }, (_, i) => (
                    <div key={i} className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: ['#f59e0b', '#3b82f6', '#10b981'][i % 3], // amber, blue, emerald
                            opacity: Math.random() * 0.4 + 0.1,
                            animation: `floatUp ${Math.random() * 6 + 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#f59e0b]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-[#3b82f6]/8 rounded-full blur-[100px] pointer-events-none" />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: shake ? [0, -10, 10, -10, 10, 0] : 0,
                }}
                transition={{
                    duration: shake ? 0.5 : 0.7,
                    ease: shake ? 'easeInOut' : 'easeOut',
                }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="p-8 rounded-3xl bg-[#0a1628]/80 border border-[#f59e0b]/20 backdrop-blur-xl shadow-[0_0_80px_rgba(245,158,11,0.1)]">

                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="text-7xl mb-4 inline-block"
                        >
                            📺
                        </motion.div>
                        <h1 className="text-3xl font-black text-[#e8ecf1] tracking-wide"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            IPL AUCTION 2026
                        </h1>
                        <p className="text-[#f59e0b] font-bold text-sm mt-2 tracking-widest uppercase">
                            Big Screen Login
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold mb-2">
                                Screen Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter display username"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#040b14] border border-[#f59e0b]/20 text-[#e8ecf1] placeholder-[#7a9ab0]/40 focus:outline-none focus:border-[#f59e0b]/60 focus:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all text-sm"
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter display password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#040b14] border border-[#f59e0b]/20 text-[#e8ecf1] placeholder-[#7a9ab0]/40 focus:outline-none focus:border-[#f59e0b]/60 focus:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all text-sm"
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center font-medium"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading || !username || !password}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 rounded-xl font-bold text-gray-900 text-sm tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
                            }}
                        >
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="inline-block text-lg"
                                        >
                                            ⚡
                                        </motion.span>
                                        Connecting...
                                    </>
                                ) : (
                                    <>Launch Display →</>
                                )}
                            </span>
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center space-y-3">
                        <p className="text-[#7a9ab0]/40 text-xs">
                            Display Mode Access
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-[#f59e0b]/70 hover:text-[#f59e0b] text-sm font-medium transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Bottom glow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#f59e0b]/20 blur-2xl rounded-full" />
            </motion.div>
        </div>
    );
}
