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
    hideOverall?: boolean;
    themeColor?: string;
}

export default function SubRatingsDisplay({ player, animate = true, hideOverall = false, themeColor }: SubRatingsDisplayProps) {
    // Get pool-specific sub-ratings
    const getSubRatings = (): SubRating[] => {
        const ratings: SubRating[] = [];
        const exp = { label: 'Experience', value: player.sub_experience || 0, color: themeColor || '#9333ea' };
        const rat = { label: 'Overall Rating', value: player.rating, color: themeColor || '#ffffff' };

        switch (player.pool) {
            case 'BAT_WK':
                if (player.sub_scoring !== undefined) {
                    ratings.push({ label: 'Scoring', value: player.sub_scoring, color: themeColor || '#00d4ff' });
                }
                if (player.sub_impact !== undefined) {
                    ratings.push({ label: 'Impact', value: player.sub_impact, color: themeColor || '#ff00e5' });
                }
                if (player.sub_consistency !== undefined) {
                    ratings.push({ label: 'Consistency', value: player.sub_consistency, color: themeColor || '#ffd700' });
                }
                ratings.push(exp);
                if (!hideOverall) {
                    ratings.push(rat);
                }
                break;

            case 'BOWL':
                // @ts-ignore - Handle frontend/backend schema mismatch during dynamic renders
                const wicketTaking = player.sub_wicket_taking ?? player.sub_wickettaking;
                if (wicketTaking !== undefined) {
                    ratings.push({ label: 'Wicket-Taking', value: wicketTaking, color: themeColor || '#00d4ff' });
                }
                if (player.sub_economy !== undefined) {
                    ratings.push({ label: 'Economy', value: player.sub_economy, color: themeColor || '#ff00e5' });
                }
                if (player.sub_efficiency !== undefined) {
                    ratings.push({ label: 'Efficiency', value: player.sub_efficiency, color: themeColor || '#ffd700' });
                }
                if (!hideOverall) {
                    ratings.push(rat);
                }
                break;

            case 'AR':
                if (player.sub_batting !== undefined) {
                    ratings.push({ label: 'Batting', value: player.sub_batting, color: themeColor || '#00d4ff' });
                }
                if (player.sub_bowling !== undefined) {
                    ratings.push({ label: 'Bowling', value: player.sub_bowling, color: themeColor || '#ff00e5' });
                }
                if (player.sub_versatility !== undefined) {
                    ratings.push({ label: 'Versatility', value: player.sub_versatility, color: themeColor || '#ffd700' });
                }
                if (!hideOverall) {
                    ratings.push(rat);
                }
                break;
        }

        return ratings;
    };

    const subRatings = getSubRatings();

    return (
        <div className="space-y-4 lg:space-y-6">
            {subRatings.map((rating, index) => (
                <div key={rating.label} className="space-y-2">
                    <div className="flex items-center justify-between text-base lg:text-xl px-1">
                        <span className="text-white/80 font-black uppercase tracking-widest">{rating.label}</span>
                        <span className="text-white font-black" style={{ textShadow: `0 0 10px ${rating.color}` }}>{rating.value}</span>
                    </div>
                    <div className="h-3 outline outline-1 outline-white/10 bg-black/40 rounded-full overflow-hidden shadow-inner flex items-center p-[2px]">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${rating.color}88, ${rating.color})`,
                                boxShadow: `0 0 15px ${rating.color}aa`
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
