// ═══════════════════════════════════════════════════════════════
// Team Login Page — Premium dark-themed authentication
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const [showForceLogin, setShowForceLogin] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent, force: boolean = false) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(username, password, force);
            // Redirect to team dashboard
            router.push(`/team/${result.teamId}`);
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
            if (err.message && err.message.includes('already logged in')) {
                setShowForceLogin(true);
            }
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
                            background: ['#2bb5cc', '#d4af37', '#2dd4a0'][i % 3],
                            opacity: Math.random() * 0.4 + 0.1,
                            animation: `floatUp ${Math.random() * 6 + 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#2bb5cc]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-[#d4af37]/8 rounded-full blur-[100px] pointer-events-none" />

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
                <div className="p-8 rounded-3xl bg-[#0a1628]/80 border border-[#2bb5cc]/20 backdrop-blur-xl shadow-[0_0_80px_rgba(43,181,204,0.1)]">

                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="text-7xl mb-4 inline-block"
                        >
                            🏏
                        </motion.div>
                        <h1 className="text-3xl font-black text-[#e8ecf1] tracking-wide"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            IPL AUCTION 2026
                        </h1>
                        <p className="text-[#7a9ab0] text-sm mt-2 tracking-widest uppercase">
                            Team Login
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold mb-2">
                                Team Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (showForceLogin) setShowForceLogin(false);
                                }}
                                placeholder="Enter your team username"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#040b14] border border-[#2bb5cc]/20 text-[#e8ecf1] placeholder-[#7a9ab0]/40 focus:outline-none focus:border-[#2bb5cc]/60 focus:shadow-[0_0_20px_rgba(43,181,204,0.15)] transition-all text-sm"
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
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (showForceLogin) setShowForceLogin(false);
                                }}
                                placeholder="Enter your team password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#040b14] border border-[#2bb5cc]/20 text-[#e8ecf1] placeholder-[#7a9ab0]/40 focus:outline-none focus:border-[#2bb5cc]/60 focus:shadow-[0_0_20px_rgba(43,181,204,0.15)] transition-all text-sm"
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
                                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center font-medium flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        ⚠️ {error}
                                    </div>
                                    
                                    {showForceLogin && (
                                        <motion.button
                                            type="button"
                                            onClick={(e) => handleSubmit(null as any, true)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                                        >
                                            Logout from other devices & Login
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading || !username || !password}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, #2bb5cc 0%, #2dd4a0 100%)',
                                boxShadow: '0 4px 20px rgba(43,181,204,0.3)',
                            }}
                        >
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

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
                                        Authenticating...
                                    </>
                                ) : (
                                    <>Enter Auction Room →</>
                                )}
                            </span>
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center space-y-3">
                        <p className="text-[#7a9ab0]/40 text-xs">
                            Credentials provided by auction organizers
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-[#2bb5cc]/70 hover:text-[#2bb5cc] text-sm font-medium transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Bottom glow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#2bb5cc]/20 blur-2xl rounded-full" />
            </motion.div>
        </div>
    );
}
