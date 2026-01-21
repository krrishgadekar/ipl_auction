// My Squad Component
// Displays all players purchased by the team

'use client';

import { Player } from '@/lib/mockData/players';
import { motion } from 'framer-motion';

interface MySquadProps {
    players: Player[];
    budgetUsed: number;
}

export default function MySquad({ players, budgetUsed }: MySquadProps) {
    // Group players by category
    const groupedPlayers = players.reduce((acc, player) => {
        if (!acc[player.category]) {
            acc[player.category] = [];
        }
        acc[player.category].push(player);
        return acc;
    }, {} as Record<string, Player[]>);

    const categories = ['Batsmen', 'Bowlers', 'All-rounders', 'Wicketkeepers'];

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">My Squad</h2>
                <div className="text-right">
                    <div className="text-white/60 text-sm">Total Spent</div>
                    <div className="text-2xl font-bold text-yellow-400">₹{budgetUsed} CR</div>
                </div>
            </div>

            {players.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏏</div>
                    <div className="text-xl text-white/60">No players purchased yet</div>
                    <div className="text-sm text-white/40 mt-2">Start bidding to build your squad!</div>
                </div>
            ) : (
                <div className="space-y-6">
                    {categories.map((category, catIndex) => {
                        const categoryPlayers = groupedPlayers[category] || [];
                        if (categoryPlayers.length === 0) return null;

                        return (
                            <div key={category}>
                                <h3 className="text-lg font-bold text-white/80 mb-3 flex items-center gap-2">
                                    {category}
                                    <span className="text-sm text-white/40">({categoryPlayers.length})</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {categoryPlayers.map((player, index) => (
                                        <motion.div
                                            key={player.rank}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                                            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
                                                    {player.player.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-white">{player.player}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                                        <span>{player.team}</span>
                                                        <span>•</span>
                                                        <span className="font-bold">{player.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${player.grade === 'A' ? 'bg-green-500/20 text-green-400' :
                                                            player.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                                                                player.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                    'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {player.grade}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
