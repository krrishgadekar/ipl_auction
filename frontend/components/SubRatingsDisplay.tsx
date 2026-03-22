// Pool-Aware Sub-Ratings Display Component
// Shows ONLY relevant sub-ratings based on player's pool

'use client';

import { Player } from '@/lib/api/auction';
import { motion } from 'framer-motion';

interface SubRating {
    label: string;
    value: number;
    color: string;
}

interface SubRatingsDisplayProps {
    player: Player;
    animate?: boolean;
}

export default function SubRatingsDisplay({ player, animate = true }: SubRatingsDisplayProps) {
    // Get pool-specific sub-ratings
    const getSubRatings = (): SubRating[] => {
        const ratings: SubRating[] = [];
        const exp = { label: 'Experience', value: player.sub_experience || 0, color: '#9333ea' };
        const rat = { label: 'Overall Rating', value: player.rating, color: '#ffffff' };

        switch (player.pool) {
            case 'BAT_WK':
                if (player.sub_scoring !== undefined) {
                    ratings.push({ label: 'Scoring', value: player.sub_scoring, color: '#00d4ff' });
                }
                if (player.sub_impact !== undefined) {
                    ratings.push({ label: 'Impact', value: player.sub_impact, color: '#ff00e5' });
                }
                if (player.sub_consistency !== undefined) {
                    ratings.push({ label: 'Consistency', value: player.sub_consistency, color: '#ffd700' });
                }
                ratings.push(exp, rat);
                break;

            case 'BOWL':
                if (player.sub_wickettaking !== undefined) {
                    ratings.push({ label: 'Wicket-Taking', value: player.sub_wickettaking, color: '#00d4ff' });
                }
                if (player.sub_economy !== undefined) {
                    ratings.push({ label: 'Economy', value: player.sub_economy, color: '#ff00e5' });
                }
                if (player.sub_efficiency !== undefined) {
                    ratings.push({ label: 'Efficiency', value: player.sub_efficiency, color: '#ffd700' });
                }
                ratings.push(exp, rat);
                break;

            case 'AR':
                if (player.sub_batting !== undefined) {
                    ratings.push({ label: 'Batting', value: player.sub_batting, color: '#00d4ff' });
                }
                if (player.sub_bowling !== undefined) {
                    ratings.push({ label: 'Bowling', value: player.sub_bowling, color: '#ff00e5' });
                }
                if (player.sub_versatility !== undefined) {
                    ratings.push({ label: 'Versatility', value: player.sub_versatility, color: '#ffd700' });
                }
                ratings.push(exp, rat);
                break;
        }

        return ratings;
    };

    const subRatings = getSubRatings();

    return (
        <div className="space-y-3">
            {subRatings.map((rating, index) => (
                <div key={rating.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80 font-medium">{rating.label}</span>
                        <span className="text-white font-bold">{rating.value}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${rating.color}, ${rating.color}dd)`,
                                boxShadow: `0 0 10px ${rating.color}80`
                            }}
                            initial={animate ? { width: 0 } : { width: `${rating.value}%` }}
                            animate={{ width: `${rating.value}%` }}
                            transition={{
                                duration: 1,
                                delay: animate ? index * 0.1 : 0,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
