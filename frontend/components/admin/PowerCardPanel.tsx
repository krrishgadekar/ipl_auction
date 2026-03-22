// Power Card Panel Component
// Admin control for triggering power cards
// Rulebook §7: 4 cards, 1 CR each, one-time use

'use client';

import { type Team } from '@/lib/api/teams';
import { triggerPowerCard } from '@/lib/api/auction';
import { toast } from 'sonner';
import { useState } from 'react';

interface PowerCardPanelProps {
    teams: Team[];
}

const CARDS = [
    {
        id: 'godsEye',
        name: "God's Eye",
        icon: '👁️',
        description: 'Reveals the highest sealed bid in Closed Bidding',
        color: 'cyan',
    },
    {
        id: 'mulligan',
        name: 'Mulligan',
        icon: '🔄',
        description: 'Refund & return a purchased player to the pool',
        color: 'green',
    },
    {
        id: 'finalStrike',
        name: 'Final Strike',
        icon: '⚡',
        description: 'Steal a player after hammer by matching the winning bid',
        color: 'yellow',
    },
    {
        id: 'bidFreezer',
        name: 'Bid Freezer',
        icon: '❄️',
        description: 'Block one team from bidding on the current player',
        color: 'blue',
        needsTargetTeam: true,
    },
] as const;

type CardId = typeof CARDS[number]['id'];

export default function PowerCardPanel({ teams }: PowerCardPanelProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<string | number>(teams[0]?.id || 1);
    const [selectedCard, setSelectedCard] = useState<CardId>('godsEye');
    const [targetTeamId, setTargetTeamId] = useState<string | number>(teams[1]?.id || 2);
    const [activating, setActivating] = useState(false);

    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    const card = CARDS.find(c => c.id === selectedCard)!;
    const needsTarget = card.id === 'bidFreezer';

    const colorClasses: Record<string, string> = {
        cyan: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
        green: 'bg-green-500/20 border-green-500 text-green-400',
        yellow: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
        blue: 'bg-blue-500/20 border-blue-500 text-blue-400',
    };

    const handleActivate = async () => {
        if (!selectedTeam) return;

        // Check if team has the card available
        const teamCard = selectedTeam.powerCards[selectedCard as keyof typeof selectedTeam.powerCards];
        if (teamCard?.used) {
            toast.error(`${selectedTeam.shortName} has already used ${card.name}!`);
            return;
        }

        const targetTeam = needsTarget ? teams.find(t => t.id === targetTeamId) : null;
        const confirmMsg = needsTarget
            ? `Activate ${card.name} for ${selectedTeam.name}?\nCost: ₹1 CR\nBlocking: ${targetTeam?.name}`
            : `Activate ${card.name} for ${selectedTeam.name}?\nCost: ₹1 CR`;

        if (window.confirm(confirmMsg)) {
            setActivating(true);
            try {
                await triggerPowerCard(String(selectedTeam.id), selectedCard, targetTeam ? String(targetTeam.id) : undefined);
                toast.success(`${card.icon} ${card.name} activated for ${selectedTeam.shortName}!`);
            } catch (error) {
                console.error('Failed to activate card:', error);
                toast.error('Failed to activate power card');
            } finally {
                setActivating(false);
            }
        }
    };

    return (
        <div className="backdrop-blur-md rounded-2xl p-6" style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(43,181,204,0.15)' }}>
            <h2 className="text-xl font-bold mb-1 gradient-text" style={{ fontFamily: "'Cinzel', serif" }}>Power Cards</h2>
            <p className="text-xs mb-4" style={{ color: 'rgba(122,148,176,0.5)' }}>₹1 CR each · One-time use · 4 cards per team</p>

            <div className="space-y-4">
                {/* Team Selector */}
                <div>
                    <label className="block text-sm mb-2" style={{ color: 'rgba(122,148,176,0.8)' }}>Activating Team</label>
                    <select
                        value={String(selectedTeamId)}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                        style={{ background: 'rgba(14,77,94,0.2)', border: '1px solid rgba(43,181,204,0.2)' }}
                    >
                        {teams.map(team => (
                            <option key={team.id} value={team.id} className="bg-slate-900">
                                {team.shortName} — {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Card Grid */}
                <div>
                    <label className="block text-sm mb-2" style={{ color: 'rgba(122,148,176,0.8)' }}>Select Card</label>
                    <div className="grid grid-cols-2 gap-2">
                        {CARDS.map(c => {
                            const teamCard = selectedTeam?.powerCards[c.id as keyof typeof selectedTeam.powerCards];
                            const isUsed = teamCard?.used ?? false;
                            const isSelected = selectedCard === c.id;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => !isUsed && setSelectedCard(c.id)}
                                    disabled={isUsed}
                                    className={`p-3 rounded-xl text-left transition-all relative ${isUsed
                                            ? 'cursor-not-allowed'
                                            : isSelected
                                                ? ''
                                                : ''
                                        }`}
                                    style={{
                                        background: isUsed
                                            ? 'rgba(10,22,40,0.3)'
                                            : isSelected
                                                ? 'rgba(14,77,94,0.3)'
                                                : 'rgba(10,22,40,0.4)',
                                        border: isUsed
                                            ? '1px solid rgba(43,181,204,0.08)'
                                            : isSelected
                                                ? '2px solid rgba(43,181,204,0.5)'
                                                : '1px solid rgba(43,181,204,0.12)',
                                        color: isUsed ? 'rgba(122,148,176,0.2)' : isSelected ? '#7eeaf5' : 'rgba(188,220,230,0.6)',
                                        opacity: isUsed ? 0.5 : 1,
                                    }}
                                >
                                    {isUsed && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                                            <span className="text-white/30 font-bold text-xs">USED</span>
                                        </div>
                                    )}
                                    <div className="text-xl mb-1">{c.icon}</div>
                                    <div className="font-bold text-sm">{c.name}</div>
                                    <div className="text-xs opacity-60 mt-0.5 leading-tight">{c.description}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bid Freezer Target Team */}
                {needsTarget && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(14,77,94,0.15)', border: '1px solid rgba(43,181,204,0.2)' }}>
                        <label className="block text-sm font-bold mb-2" style={{ color: '#2bb5cc' }}>
                            ❄️ Block which team?
                        </label>
                        <select
                            value={String(targetTeamId)}
                            onChange={(e) => setTargetTeamId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                            style={{ background: 'rgba(14,77,94,0.2)', border: '1px solid rgba(43,181,204,0.2)' }}
                        >
                            {teams
                                .filter(t => t.id !== selectedTeamId)
                                .map(team => (
                                    <option key={team.id} value={team.id} className="bg-slate-900">
                                        {team.shortName} — {team.name}
                                    </option>
                                ))}
                        </select>
                        <p className="text-xs mt-2" style={{ color: 'rgba(122,148,176,0.5)' }}>
                            This team will be blocked from bidding on the current player.
                        </p>
                    </div>
                )}

                {/* Activate Button */}
                <button
                    onClick={handleActivate}
                    disabled={activating}
                    className="w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    style={{
                        background: 'linear-gradient(135deg, #0e4d5e, #1a8a9e)',
                        color: '#fff',
                        boxShadow: '0 4px 20px rgba(43,181,204,0.2)',
                        fontFamily: "'Cinzel', serif",
                    }}
                >
                    {activating
                        ? 'Activating...'
                        : `${card.icon} Activate ${card.name} · ₹1 CR`}
                </button>
            </div>
        </div>
    );
}
