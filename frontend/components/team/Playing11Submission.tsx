import { useState } from 'react';
import { Player } from '@/lib/api/players';
import { lockLineup } from '@/lib/api/teams';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    teamId: string | number;
    squadCount: number;
    purchasedPlayers: Player[];
    onSuccess?: () => void;
}

export default function Playing11Submission({ teamId, squadCount, purchasedPlayers, onSuccess }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [captainId, setCaptainId] = useState<number | null>(null);
    const [vcId, setVcId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
        if (!selectedIds.includes(id)) return; // Must be in top 11 first
        
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
        setLoading(true);
        try {
            await lockLineup(teamId, selectedIds.map(String), String(captainId), String(vcId));
            setSuccessMessage('Playing XI successfully locked!');
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

    if (squadCount < 15) {
        return (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mt-6 backdrop-blur-md">
                <h3 className="text-red-400 font-black text-lg tracking-widest uppercase mb-2">Incomplete Squad (Disqualified)</h3>
                <p className="text-red-400/70 text-sm leading-relaxed">Your squad currently has {squadCount} players. You must have exactly 15 players to submit your official Playing XI and qualify for the final scoring mechanics.</p>
            </div>
        );
    }

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
