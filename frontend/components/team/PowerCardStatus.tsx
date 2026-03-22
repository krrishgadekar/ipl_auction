import { getPowerCardImage } from '@/lib/utils/powerCard';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PowerCardStatusProps {
    team: any; // Allow for flexible team object
}

export default function PowerCardStatus({ team }: PowerCardStatusProps) {
    const powerCardKeys = ['finalStrike', 'bidFreezer', 'godsEye', 'mulligan', 'rightToMatch'];
    
    const powerCards = powerCardKeys.map(key => ({
        key,
        ...(team.powerCards?.[key] || { name: key, used: false, available: false, cost: 1 }),
        image: getPowerCardImage(key, team.shortName)
    }));

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
                                <div className="relative w-12 h-16 flex-shrink-0">
                                    <Image 
                                        src={card.image} 
                                        alt={card.name} 
                                        fill 
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm">{card.name}</h3>
                                    {card.cost > 0 && (
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider">Cost: ₹{card.cost} CR</div>
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
