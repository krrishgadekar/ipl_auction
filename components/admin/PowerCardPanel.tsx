// Power Card Panel Component
// Admin control for triggering power cards

'use client';

import { Team } from '@/lib/mockData/teams';
import { triggerPowerCard } from '@/lib/api/auction';
import { toast } from 'sonner';
import { useState } from 'react';

interface PowerCardPanelProps {
    teams: Team[];
}

export default function PowerCardPanel({ teams }: PowerCardPanelProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<number>(teams[0]?.id || 1);
    const [selectedCard, setSelectedCard] = useState<string>('finalStrike');
    const [activating, setActivating] = useState(false);

    const cards = [
        { id: 'finalStrike', name: 'Final Strike', cost: 7, icon: '⚡' },
        { id: 'bidFreezer', name: 'Bid Freezer', cost: 5, icon: '❄️' },
        { id: 'godsEye', name: "God's Eye", cost: 4, icon: '👁️' },
        { id: 'mulligan', name: 'Mulligan', cost: 3, icon: '🔄' },
        { id: 'rtm', name: 'RTM', cost: 0, icon: '🎯' },
    ];

    const selectedTeam = teams.find(t => t.id === selectedTeamId);

    const handleActivate = async () => {
        if (!selectedTeam) return;

        const card = cards.find(c => c.id === selectedCard);
        if (!card) return;

        if (window.confirm(`Activate ${card.name} for ${selectedTeam.name}?\nCost: ₹${card.cost} CR`)) {
            setActivating(true);
            try {
                await triggerPowerCard(selectedTeam.id, selectedCard);
                toast.success(`${card.name} activated for ${selectedTeam.name}!`);
            } catch (error) {
                console.error('Failed to activate card:', error);
                toast.error('Failed to activate power card');
            } finally {
                setActivating(false);
            }
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Power Cards Control</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-white/60 text-sm mb-2">Select Team</label>
                    <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    >
                        {teams.map(team => (
                            <option key={team.id} value={team.id} className="bg-slate-900">
                                {team.name} ({team.shortName})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-white/60 text-sm mb-2">Select Card</label>
                    <div className="grid grid-cols-2 gap-2">
                        {cards.map(card => (
                            <button
                                key={card.id}
                                onClick={() => setSelectedCard(card.id)}
                                className={`p-3 rounded-xl border text-left transition-all ${selectedCard === card.id
                                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-xl mb-1">{card.icon}</div>
                                <div className="font-bold text-sm">{card.name}</div>
                                <div className="text-xs opacity-60">₹{card.cost} CR</div>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleActivate}
                    disabled={activating}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                    {activating ? 'Activating...' : 'Activate Power Card'}
                </button>
            </div>
        </div>
    );
}
