// Current Player Preview Component
// Compact text-only player card for admin panel (no images)

'use client';

import { Player } from '@/lib/api/auction';
import SubRatingsDisplay from '../SubRatingsDisplay';

interface CurrentPlayerPreviewProps {
    player: Player | null;
}

export default function CurrentPlayerPreview({ player }: CurrentPlayerPreviewProps) {
    if (!player) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="text-center text-white/60">
                    <div className="text-4xl mb-2">⏳</div>
                    <div>No player selected</div>
                </div>
            </div>
        );
    }

    const gradeColors: Record<string, string> = {
        A: 'from-green-500 to-emerald-500',
        B: 'from-blue-500 to-cyan-500',
        C: 'from-yellow-500 to-orange-500',
        D: 'from-red-500 to-pink-500',
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            {/* Player Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{player.player}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/70 mb-2">
                        <span>{player.category}</span>
                        <span>•</span>
                        <span>{player.team}</span>
                        <span>•</span>
                        <span>{player.nationality}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradeColors[player.grade] || gradeColors.C} text-white text-sm font-bold`}>
                            Grade {player.grade}
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-bold">
                            Pool: {player.pool}
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-bold">
                            Role: {player.role}
                        </div>
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="text-center ml-4">
                    <div className="text-5xl font-black bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        {player.rating}
                    </div>
                    <div className="text-xs text-white/60 uppercase tracking-wider">Overall</div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-white/60 text-xs mb-1">Rank</div>
                    <div className="text-xl font-bold text-white">#{player.rank}</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-white/60 text-xs mb-1">Legacy</div>
                    <div className="text-xl font-bold text-white">{player.legacy}/10</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-white/60 text-xs mb-1">Base Price</div>
                    <div className="text-xl font-bold text-yellow-400">₹{player.basePrice} CR</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-white/60 text-xs mb-1">UUID</div>
                    <div className="text-[10px] font-mono text-white/50 break-all">{player.id || '—'}</div>
                </div>
            </div>

            {/* Sub-ratings */}
            <div>
                <h4 className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wider">Performance Metrics</h4>
                <SubRatingsDisplay player={player} />
            </div>
        </div>
    );
}
