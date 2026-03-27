// Shared Team Avatar Component
// Handles Franchise Logo, Emoji, and Placeholder states

'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TeamAvatarProps {
    team: {
        id?: string | number;
        logo?: string | null;
        shortName?: string;
        name?: string;
    };
    size?: number;
    className?: string;
}

const TEAM_COLORS = [
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#2980B9', '#C0392B', '#27AE60',
];

export default function TeamAvatar({ team, size = 40, className = '' }: TeamAvatarProps) {
    const isUrl = team.logo && (team.logo.startsWith('/') || team.logo.startsWith('http'));

    // 1. Franchise Logo (URL)
    if (isUrl) {
        return (
            <div 
                className={`relative flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 p-1 ${className}`}
                style={{ width: size, height: size }}
            >
                <img 
                    src={team.logo!} 
                    alt={team.shortName || team.name || 'Team Logo'} 
                    className="w-full h-full object-contain drop-shadow-sm" 
                />
            </div>
        );
    }

    // 2. Emoji Logo
    if (team.logo && team.logo.length <= 2) {
        return (
            <div 
                className={`flex-shrink-0 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${className}`}
                style={{ width: size, height: size, fontSize: size * 0.6 }}
            >
                {team.logo}
            </div>
        );
    }

    // 3. IPL Auction Logo Placeholder (before franchise assignment)
    return (
        <div 
            className={`relative flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a2a3a] to-[#0a1628] border border-white/10 p-1 ${className}`}
            style={{ width: size, height: size }}
        >
            <img 
                src="/auction_logo.jpg" 
                alt={team.shortName || team.name || 'IPL Auction'} 
                className="w-full h-full object-contain drop-shadow-sm" 
            />
        </div>
    );
}
