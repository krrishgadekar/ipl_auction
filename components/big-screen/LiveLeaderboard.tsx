// Live Leaderboard Component
// Displays team rankings with animations

'use client';

import { Team } from '@/lib/mockData/teams';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveLeaderboardProps {
    teams: Team[];
}

export default function LiveLeaderboard({ teams }: LiveLeaderboardProps) {
    // Sort teams by budget used (descending)
    const sortedTeams = [...teams].sort((a, b) => b.budgetUsed - a.budgetUsed);

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Leaderboard</h2>

            <AnimatePresence mode="popLayout">
                {sortedTeams.map((team, index) => (
                    <motion.div
                        key={team.id}
                        layout
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 overflow-hidden group hover:bg-white/10 transition-colors"
                    >
                        {/* Rank Badge */}
                        <div className="absolute top-0 left-0 w-12 h-full flex items-center justify-center" style={{ backgroundColor: team.color + '40' }}>
                            <span className="text-2xl font-bold text-white">{index + 1}</span>
                        </div>

                        {/* Content */}
                        <div className="ml-14 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={team.logo} alt={team.shortName} className="w-10 h-10 object-contain drop-shadow-md" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                                    <p className="text-sm text-white/60">Squad: {team.squadCount}/{team.squadLimit}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">
                                    ₹{team.budgetRemaining.toFixed(1)} CR
                                </div>
                                <div className="text-sm text-white/60">
                                    Used: ₹{team.budgetUsed.toFixed(1)} CR
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 ml-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: team.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(team.budgetUsed / team.totalBudget) * 100}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
