import { useState, useMemo } from 'react';
import { Player } from '@/lib/api/players';
import { lockLineup } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';

// Squad validation rules (mirroring scoringService.js)
const SQUAD_RULES = {
    total: 15,
    BAT: { min: 3, max: 5 },
    BOWL: { min: 5, max: 8 },
    AR: { min: 3, max: 6 },
    WK: { min: 1, max: 2 },
    overseas: { min: 2, max: 5 },
};

// Category mapping for display names
const CATEGORY_LABELS: Record<string, string> = {
    BAT: 'Batsmen',
    Batsmen: 'Batsmen',
    BOWL: 'Bowlers',
    Bowlers: 'Bowlers',
    AR: 'All-Rounders',
    'All-rounders': 'All-Rounders',
    WK: 'Wicketkeepers',
    Wicketkeepers: 'Wicketkeepers',
};

// Normalize category to short key
function normCategory(cat: string): string {
    const map: Record<string, string> = {
        'Batsmen': 'BAT', 'BAT': 'BAT',
        'Bowlers': 'BOWL', 'BOWL': 'BOWL',
        'All-rounders': 'AR', 'AR': 'AR',
        'Wicketkeepers': 'WK', 'WK': 'WK',
    };
    return map[cat] || cat;
}

interface Props {
    teamId: string | number;
    squadCount: number;
    purchasedPlayers: Player[];
    auctionPhase: string;
    onSuccess?: () => void;
}

function validateSquad(players: Player[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (players.length !== SQUAD_RULES.total) {
        errors.push(`Squad must have exactly ${SQUAD_RULES.total} players (have ${players.length})`);
    }

    const counts: Record<string, number> = { BAT: 0, BOWL: 0, AR: 0, WK: 0, OVERSEAS: 0 };
    players.forEach(p => {
        const cat = normCategory(p.category);
        if (counts[cat] !== undefined) counts[cat]++;
        if (p.nationality === 'OVERSEAS' || p.nationality === 'Overseas') counts.OVERSEAS++;
    });

    if (counts.BAT < SQUAD_RULES.BAT.min)
        errors.push(`Minimum ${SQUAD_RULES.BAT.min} Batsmen required (have ${counts.BAT})`);
    if (counts.BAT > SQUAD_RULES.BAT.max)
        errors.push(`Maximum ${SQUAD_RULES.BAT.max} Batsmen allowed (have ${counts.BAT})`);
    if (counts.BOWL < SQUAD_RULES.BOWL.min)
        errors.push(`Minimum ${SQUAD_RULES.BOWL.min} Bowlers required (have ${counts.BOWL})`);
    if (counts.BOWL > SQUAD_RULES.BOWL.max)
        errors.push(`Maximum ${SQUAD_RULES.BOWL.max} Bowlers allowed (have ${counts.BOWL})`);
    if (counts.AR < SQUAD_RULES.AR.min)
        errors.push(`Minimum ${SQUAD_RULES.AR.min} All-Rounders required (have ${counts.AR})`);
    if (counts.AR > SQUAD_RULES.AR.max)
        errors.push(`Maximum ${SQUAD_RULES.AR.max} All-Rounders allowed (have ${counts.AR})`);
    if (counts.WK < SQUAD_RULES.WK.min)
        errors.push(`Minimum ${SQUAD_RULES.WK.min} Wicketkeepers required (have ${counts.WK})`);
    if (counts.WK > SQUAD_RULES.WK.max)
        errors.push(`Maximum ${SQUAD_RULES.WK.max} Wicketkeepers allowed (have ${counts.WK})`);
    if (counts.OVERSEAS < SQUAD_RULES.overseas.min || counts.OVERSEAS > SQUAD_RULES.overseas.max) {
        errors.push(`Overseas players must be between ${SQUAD_RULES.overseas.min}–${SQUAD_RULES.overseas.max} (have ${counts.OVERSEAS})`);
    }

    return { valid: errors.length === 0, errors };
}

export default function Playing11Submission({ teamId, squadCount, purchasedPlayers, auctionPhase, onSuccess }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [captainId, setCaptainId] = useState<number | null>(null);
    const [vcId, setVcId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Phase
    const phase = auctionPhase?.toUpperCase() || '';

    // Squad validation MUST be called before any early returns (Rules of Hooks)
    const squadValidation = useMemo(() => validateSquad(purchasedPlayers), [purchasedPlayers]);

    const toggleSelection = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(x => x !== id));
            if (captainId === id) setCaptainId(null);
            if (vcId === id) setVcId(null);
        } else {
            if (selectedIds.length < 11) {
                setSelectedIds(prev => [...prev, id]);
            }
        }
    };

    const handleRoleAssign = (id: number, role: 'C' | 'VC') => {
        if (!selectedIds.includes(id)) return;
        
        if (role === 'C') {
            if (captainId === id) setCaptainId(null);
            else {
                setCaptainId(id);
                if (vcId === id) setVcId(null);
            }
        } else {
            if (vcId === id) setVcId(null);
            else {
                setVcId(id);
                if (captainId === id) setCaptainId(null);
            }
        }
    };

    const handleSubmit = async () => {
        setError('');
        setSuccessMessage('');
        if (selectedIds.length !== 11) {
            setError('Please select exactly 11 players.');
            return;
        }
        if (!captainId || !vcId) {
            setError('Please select both a Captain and a Vice-Captain.');
            return;
        }

        const selectedPlayersList = purchasedPlayers.filter(p => selectedIds.includes(p.rank));
        let wkCount = 0;
        let osCount = 0;
        selectedPlayersList.forEach(p => {
            if (normCategory(p.category) === 'WK') wkCount++;
            if (p.nationality === 'OVERSEAS' || p.nationality === 'Overseas') osCount++;
        });

        if (wkCount < 1) {
            setError('Playing XI must include at least 1 Wicketkeeper.');
            return;
        }
        if (osCount > 4) {
            setError(`Playing XI can include a maximum of 4 Overseas players (you selected ${osCount}).`);
            return;
        }

        setLoading(true);
        try {
            await lockLineup(teamId, selectedIds.map(String), String(captainId), String(vcId));
            setSuccessMessage('Playing XI successfully locked!');
            window.alert('✅ Squad locked successfully! You can close this modal.');
            setTimeout(() => {
                setIsOpen(false);
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit playing XI');
        } finally {
            setLoading(false);
        }
    };

    // Render states based on phase and validation
    if (phase !== 'POST_AUCTION' && phase !== 'COMPLETED') {
        // LIVE PHASE — Show locked state
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
            >
                <div className="p-6 rounded-2xl bg-[#0a1628]/40 border border-[#2bb5cc]/20 border-dashed text-center backdrop-blur-md">
                    <div className="text-3xl mb-3 opacity-50">🔒</div>
                    <h3 className="text-[#e8ecf1] font-black text-sm tracking-widest uppercase mb-1">Final XI Selection Locked</h3>
                    <p className="text-[#7a9ab0] text-xs">Unlock conditions: Survive the auction phase with a valid 15-player squad.</p>
                </div>
            </motion.div>
        );
    }

    // ELIMINATED: Squad doesn't meet criteria during POST_AUCTION or COMPLETED
    if (!squadValidation.valid) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
            >
                <div className="rounded-2xl overflow-hidden border border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-900/10 backdrop-blur-xl">
                    {/* Header */}
                    <div className="px-6 py-4 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-xl">🚫</div>
                        <div>
                            <h3 className="text-red-400 font-black text-lg tracking-widest uppercase">Eliminated</h3>
                            <p className="text-red-400/50 text-xs tracking-wider">Squad does not meet minimum requirements</p>
                        </div>
                    </div>
                    {/* Violations */}
                    <div className="p-6 space-y-3">
                        {squadValidation.errors.map((err, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                            >
                                <span className="text-red-500 text-sm">✕</span>
                                <span className="text-red-300/80 text-sm font-medium">{err}</span>
                            </motion.div>
                        ))}
                        <p className="text-red-400/40 text-xs mt-4 text-center italic tracking-wider">
                            Your team cannot submit a Playing XI and will not be scored.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // COMPLETED phase — show locked state
    if (phase === 'COMPLETED') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
            >
                <div className="p-6 rounded-2xl bg-[#2bb5cc]/10 border border-[#2bb5cc]/20 backdrop-blur-md text-center">
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="text-[#2bb5cc] font-black text-lg tracking-widest uppercase mb-2">Auction Complete</h3>
                    <p className="text-[#7a9ab0] text-sm">Final standings are being calculated. Check the leaderboard for results.</p>
                </div>
            </motion.div>
        );
    }

    // POST_AUCTION with valid squad — show submission button + modal
    return (
        <div className="mt-8">
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full py-4 rounded-xl bg-[linear-gradient(45deg,#2bb5cc,#2dd4a0)] text-[#040b14] font-black uppercase tracking-widest hover:scale-[1.01] transition-transform shadow-[0_0_20px_rgba(45,212,160,0.3)]"
            >
                Submit Official Playing XI & Roles
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0a1628] rounded-3xl w-full max-w-4xl border border-[#2bb5cc]/20 shadow-2xl overflow-hidden relative"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
                                            Select Playing XI
                                        </h2>
                                        <p className="text-[#7a9ab0] text-sm mt-1">Select exactly 11 players, and assign 1 Captain (C) and 1 Vice-Captain (VC).</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                    >
                                        <span className="text-xl leading-none">×</span>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mb-6 px-4 py-3 rounded-xl bg-[#2bb5cc]/10 border border-[#2bb5cc]/20">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-[#7a9ab0] uppercase tracking-widest font-bold">Selected</span>
                                        <span className={`text-2xl font-black ${selectedIds.length === 11 ? 'text-[#2dd4a0]' : 'text-[#2bb5cc]'}`}>
                                            {selectedIds.length} / 11
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className={`px-4 py-2 rounded-lg border ${captainId ? 'bg-[#f5d569]/20 border-[#f5d569]/40 text-[#f5d569]' : 'bg-white/5 border-white/10 text-white/40'} flex items-center gap-2 transition-colors`}>
                                            <span className="font-black">C</span>
                                            <span className="text-[10px] uppercase font-bold tracking-widest">{captainId ? 'Assigned' : 'Required'}</span>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg border ${vcId ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-white/5 border-white/10 text-white/40'} flex items-center gap-2 transition-colors`}>
                                            <span className="font-black">VC</span>
                                            <span className="text-[10px] uppercase font-bold tracking-widest">{vcId ? 'Assigned' : 'Required'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {purchasedPlayers.map((player) => {
                                        const isSelected = selectedIds.includes(player.rank);
                                        const isC = captainId === player.rank;
                                        const isVC = vcId === player.rank;
                                        return (
                                            <div 
                                                key={player.rank}
                                                className={`p-3 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                                                    isSelected 
                                                        ? 'bg-[#2bb5cc]/10 border-[#2bb5cc]/40' 
                                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                                onClick={() => toggleSelection(player.rank)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className={`text-sm font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-[#e8ecf1]'}`}>
                                                            {player.player}
                                                        </div>
                                                        <div className="text-[9px] font-bold uppercase tracking-widest text-[#7a9ab0]">
                                                            {player.category} • {player.nationality}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-black text-[#f5d569] leading-none" style={{ fontFamily: "'Cinzel', serif" }}>
                                                            {player.rating}
                                                        </div>
                                                        <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">Rating</div>
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                                                        <button 
                                                            onClick={() => handleRoleAssign(player.rank, 'C')}
                                                            className={`flex-1 py-1 rounded border text-xs font-black transition-colors ${
                                                                isC 
                                                                    ? 'bg-[#f5d569]/20 border-[#f5d569] text-[#f5d569]' 
                                                                    : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                                            }`}
                                                        >
                                                            CAPTAIN
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRoleAssign(player.rank, 'VC')}
                                                            className={`flex-1 py-1 rounded border text-xs font-black transition-colors ${
                                                                isVC 
                                                                    ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                                                                    : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                                            }`}
                                                        >
                                                            VICE
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {error && (
                                    <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                                        {error}
                                    </div>
                                )}
                                
                                {successMessage && (
                                    <div className="mt-6 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold text-center">
                                        {successMessage}
                                    </div>
                                )}

                                <div className="mt-8 flex gap-4">
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 font-bold uppercase tracking-widest hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={loading || selectedIds.length !== 11 || !captainId || !vcId}
                                        className={`flex-[2] py-3 rounded-xl font-black uppercase tracking-widest transition-all ${
                                            loading || selectedIds.length !== 11 || !captainId || !vcId
                                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                                : 'bg-[#2bb5cc] text-[#0a1628] hover:bg-[#2dd4a0] shadow-[0_0_15px_rgba(43,181,204,0.4)]'
                                        }`}
                                    >
                                        {loading ? 'Submitting...' : 'Confirm Lineup Lock'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
