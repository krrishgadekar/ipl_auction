// Power Card Status Component
// Shows which power cards are available/used for the team

'use client';

import { Team } from '@/lib/mockData/teams';
import { motion } from 'framer-motion';

interface PowerCardStatusProps {
    team: Team;
}

export default function PowerCardStatus({ team }: PowerCardStatusProps) {
    const powerCards = [
        { ...team.powerCards.finalStrike, icon: '⚡' },
        { ...team.powerCards.bidFreezer, icon: '❄️' },
        { ...team.powerCards.godsEye, icon: '👁️' },
        { ...team.powerCards.mulligan, icon: '🔄' },
    ];

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Power Cards</h2>

            <div className="space-y-3">
                {powerCards.map((card, index) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border transition-all ${card.used
                                ? 'bg-red-500/10 border-red-500/30 opacity-50'
                                : card.available
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-white/5 border-white/10 opacity-50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{card.icon}</div>
                                <div>
                                    <h3 className="font-bold text-white">{card.name}</h3>
                                    {card.cost > 0 && (
                                        <div className="text-sm text-white/60">Cost: ₹{card.cost} CR</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {card.used ? (
                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                                        Used
                                    </span>
                                ) : card.available ? (
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                                        Available
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-white/10 text-white/40 rounded-full text-sm font-bold">
                                        Locked
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-xl">
                <div className="text-sm text-white/60 text-center">
                    Power cards can be used by the auctioneer during bidding
                </div>
            </div>
        </div>
    );
}
