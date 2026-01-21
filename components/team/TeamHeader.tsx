// Team Header Component
// Displays team name, logo, and budget at the top of team dashboard

'use client';

import { Team } from '@/lib/mockData/teams';
import { motion } from 'framer-motion';

interface TeamHeaderProps {
    team: Team;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
    const budgetPercentage = (team.budgetRemaining / team.totalBudget) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6"
        >
            <div className="flex items-center justify-between">
                {/* Team Info */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-3xl">
                        {team.logo}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white mb-1">{team.name}</h1>
                        <p className="text-white/60">Team ID: {team.id} • {team.shortName}</p>
                    </div>
                </div>

                {/* Budget Display */}
                <div className="text-right">
                    <div className="text-white/60 text-sm mb-1">Budget Remaining</div>
                    <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        ₹{team.budgetRemaining} CR
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                        of ₹{team.totalBudget} CR total
                    </div>
                </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="mt-4">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${budgetPercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-white/60">
                    <span>Used: ₹{team.budgetUsed} CR</span>
                    <span>{budgetPercentage.toFixed(1)}% Remaining</span>
                </div>
            </div>

            {/* Squad Count */}
            <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 p-3 bg-white/5 rounded-xl">
                    <div className="text-white/60 text-sm">Squad</div>
                    <div className="text-2xl font-bold text-white">
                        {team.squadCount}/{team.squadLimit}
                    </div>
                </div>
                <div className="flex-1 p-3 bg-white/5 rounded-xl">
                    <div className="text-white/60 text-sm">Slots Remaining</div>
                    <div className="text-2xl font-bold text-cyan-400">
                        {team.squadLimit - team.squadCount}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
