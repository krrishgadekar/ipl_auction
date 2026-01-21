// Team Budgets Component
// Display all team budgets and squad counts

'use client';

import { Team } from '@/lib/mockData/teams';
import { motion } from 'framer-motion';

interface TeamBudgetsProps {
    teams: Team[];
}

export default function TeamBudgets({ teams }: TeamBudgetsProps) {
    const sortedTeams = [...teams].sort((a, b) => b.budgetRemaining - a.budgetRemaining);

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Team Budgets</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTeams.map((team, index) => {
                    const budgetPercent = (team.budgetRemaining / 100) * 100;
                    const squadPercent = (team.squadCount / 18) * 100;

                    return (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                        >
                            {/* Team Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-white">{team.name}</h3>
                                    <div className="text-xs text-white/60">Rank #{index + 1}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {team.name.split(' ').map(w => w[0]).join('')}
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-white/60">Budget Remaining</span>
                                    <span className="text-sm font-bold text-green-400">
                                        ₹{team.budgetRemaining} CR
                                    </span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                        style={{ width: `${budgetPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Squad Count */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-white/60">Squad</span>
                                    <span className="text-sm font-bold text-cyan-400">
                                        {team.squadCount}/18
                                    </span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                                        style={{ width: `${squadPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-white/60">Used: </span>
                                    <span className="text-yellow-400 font-bold">₹{team.budgetUsed} CR</span>
                                </div>
                                <div>
                                    <span className="text-white/60">RTM: </span>
                                    <span className="text-white font-bold">
                                        {team.powerCards.rtm.available ? '✓' : '✗'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
