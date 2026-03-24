// Team Header Component
// Displays team name, logo, and budget at the top of team dashboard

'use client';

import { Team } from '@/lib/mockData/teams';
import { motion } from 'framer-motion';
import TeamAvatar from './TeamAvatar';

interface TeamHeaderProps {
    team: Team;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
    const budgetPercentage = (team.budgetRemaining / team.totalBudget) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md rounded-2xl p-6 mb-6"
            style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(43,181,204,0.15)' }}
        >
            <div className="flex items-center justify-between">
                {/* Team Info */}
                <div className="flex items-center gap-4">
                    <TeamAvatar team={team} size={64} className="shadow-2xl" />
                    <div>
                        <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{team.name}</h1>
                        <p style={{ color: 'rgba(122,148,176,0.6)' }}>Team ID: {team.id} • {team.shortName}</p>
                    </div>
                </div>

                {/* Budget Display */}
                <div className="text-right">
                    <div className="text-sm mb-1" style={{ color: 'rgba(122,148,176,0.7)' }}>Budget Remaining</div>
                    <div className="text-5xl font-black" style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
                        ₹{team.budgetRemaining} CR
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'rgba(122,148,176,0.6)' }}>
                        of ₹{team.totalBudget} CR total
                    </div>
                </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="mt-4">
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(43,181,204,0.08)' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${budgetPercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full"
                        style={{ background: 'linear-gradient(90deg, #0e4d5e, #2bb5cc)' }}
                    />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm" style={{ color: 'rgba(122,148,176,0.6)' }}>
                    <span>Used: ₹{team.budgetUsed} CR</span>
                    <span>{budgetPercentage.toFixed(1)}% Remaining</span>
                </div>
            </div>

            {/* Squad Count */}
            <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 p-3 rounded-xl" style={{ background: 'rgba(14,77,94,0.15)', border: '1px solid rgba(43,181,204,0.12)' }}>
                    <div className="text-sm" style={{ color: 'rgba(122,148,176,0.6)' }}>Squad</div>
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                        {team.squadCount}/{team.squadLimit}
                    </div>
                </div>
                <div className="flex-1 p-3 rounded-xl" style={{ background: 'rgba(14,77,94,0.15)', border: '1px solid rgba(43,181,204,0.12)' }}>
                    <div className="text-sm" style={{ color: 'rgba(122,148,176,0.6)' }}>Slots Remaining</div>
                    <div className="text-2xl font-bold" style={{ color: '#2bb5cc', fontFamily: "'Cinzel', serif" }}>
                        {team.squadLimit - team.squadCount}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
