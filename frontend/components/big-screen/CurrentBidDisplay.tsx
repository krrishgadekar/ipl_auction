// Current Bid Display Component
// Shows current bid amount with pulsing animation

'use client';

import { motion } from 'framer-motion';

interface CurrentBidDisplayProps {
    amount: number;
    teamName: string | null;
    status: 'BIDDING' | 'SOLD' | 'UNSOLD' | 'IDLE';
}

export default function CurrentBidDisplay({ amount, teamName, status }: CurrentBidDisplayProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'SOLD': return '#22c55e';
            case 'UNSOLD': return '#ef4444';
            case 'BIDDING': return '#ffd700';
            default: return '#64748b';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'SOLD': return 'SOLD!';
            case 'UNSOLD': return 'UNSOLD';
            case 'BIDDING': return 'CURRENT BID';
            default: return 'WAITING...';
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            {/* Status Label */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor() }}
                />
                <span
                    className="text-2xl font-bold tracking-wider"
                    style={{ color: getStatusColor() }}
                >
                    {getStatusText()}
                </span>
            </div>

            {/* Bid Amount */}
            <motion.div
                key={amount}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
            >
                <div className="text-7xl font-black text-white mb-2">
                    ₹{amount.toFixed(1)} <span className="text-5xl text-white/70">CR</span>
                </div>

                {teamName && status === 'BIDDING' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl text-white/70"
                    >
                        {teamName}
                    </motion.div>
                )}

                {status === 'SOLD' && teamName && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="mt-4 text-3xl font-bold text-green-400"
                    >
                        Sold to {teamName}!
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
