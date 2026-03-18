// Auction Timer Component
// Displays countdown with visual urgency states
// Used in Admin Panel and Big Screen

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuctionTimerProps {
    seconds: number;
    isActive: boolean;
    onExpire?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export default function AuctionTimer({ seconds, isActive, onExpire, size = 'md' }: AuctionTimerProps) {
    const [timeLeft, setTimeLeft] = useState(seconds);

    // Sync local state with prop
    useEffect(() => {
        setTimeLeft(seconds);
    }, [seconds]);

    // Countdown logic
    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onExpire?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeLeft, onExpire]);

    // Format time directly
    const displayTime = `00:${timeLeft.toString().padStart(2, '0')}`;

    // Determine color based on urgency
    const getColor = () => {
        if (timeLeft > 20) return 'text-white';
        if (timeLeft > 10) return 'text-yellow-400';
        if (timeLeft > 5) return 'text-orange-500';
        return 'text-red-500 animate-pulse';
    };

    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-6xl',
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={timeLeft}
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className={`font-mono font-bold font-variant-numeric tabular-nums ${getColor()} ${sizeClasses[size]}`}
            >
                {displayTime}
            </motion.div>
        </AnimatePresence>
    );
}
