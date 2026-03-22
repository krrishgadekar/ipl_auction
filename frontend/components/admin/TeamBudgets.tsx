// Team Budgets Component
// Display all team budgets and squad counts

'use client';

import { type Team } from '@/lib/api/teams';
import { motion } from 'framer-motion';

interface TeamBudgetsProps {
    teams: Team[];
}

export default function TeamBudgets({ teams }: TeamBudgetsProps) {
    const sortedTeams = [...teams].sort((a, b) => b.purseRemaining - a.purseRemaining);

    return (
        <div className="backdrop-blur-md rounded-2xl p-6" style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(43,181,204,0.15)' }}>
            <h2 className="text-2xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Cinzel', serif" }}>Team Budgets</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTeams.map((team, index) => {
                    const budgetPercent = (team.purseRemaining / 120) * 100;
                    const squadPercent = (team.squadCount / 15) * 100;

                    return (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-xl transition-all"
                            style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(43,181,204,0.1)' }}
                        >
                            {/* Team Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-white">{team.name}</h3>
                                    <div className="text-xs" style={{ color: 'rgba(43,181,204,0.6)' }}>Rank #{index + 1}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #0e4d5e, #1a8a9e)' }}>
                                    {team.name.split(' ').map(w => w[0]).join('')}
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs" style={{ color: 'rgba(122,148,176,0.7)' }}>Budget Remaining</span>
                                    <span className="text-sm font-bold" style={{ color: '#2dd4a0' }}>
                                        ₹{team.purseRemaining} CR
                                    </span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(43,181,204,0.08)' }}>
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{ width: `${budgetPercent}%`, background: 'linear-gradient(90deg, #0e4d5e, #2bb5cc)' }}
                                    />
                                </div>
                            </div>

                            {/* Squad Count */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs" style={{ color: 'rgba(122,148,176,0.7)' }}>Squad</span>
                                    <span className="text-sm font-bold" style={{ color: '#2bb5cc' }}>
                                        {team.squadCount}/{team.squadLimit}
                                    </span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(43,181,204,0.08)' }}>
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{ width: `${squadPercent}%`, background: 'linear-gradient(90deg, #1a5f7a, #2bb5cc)' }}
                                    />
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center justify-between text-xs">
                                <div>
                                    <span className="" style={{ color: 'rgba(122,148,176,0.6)' }}>Used: </span>
                                    <span className="font-bold" style={{ color: '#d4af37' }}>₹{team.budgetUsed} CR</span>
                                </div>
                                <div>
                                    <span className="" style={{ color: 'rgba(122,148,176,0.6)' }}>Overseas: </span>
                                    <span className={`font-bold ${team.overseasCount >= 5 ? '' : team.overseasCount >= 3 ? '' : ''}`}
                                        style={{ color: team.overseasCount >= 5 ? '#e74c5e' : team.overseasCount >= 3 ? '#2dd4a0' : '#fff' }}>
                                        {team.overseasCount}/5
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
