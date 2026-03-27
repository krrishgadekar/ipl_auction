import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Team } from '@/lib/api/teams';
import { AuctionState } from '@/lib/api/auction';
import { type Player } from '@/lib/api/players';
import FinalTeamPanel from './FinalTeamPanel';
import { 
    setPhase, setAuctionDay, advanceToNextObject, stepBackToPreviousObject,
    assignFranchise, assignPlayer, deassignPlayer,
    assignPowerCard, deassignPowerCard, markUnsold, markItemUnsold,
    unveilRiddlePlayer, sellPlayer, getAllSequences, selectSequence,
    getAllFranchises, fineTeam, togglePowerCard, addPurse
} from '@/lib/api/admin';
import { getPowerCardImage, getPowerCardName } from '@/lib/utils/powerCard';
import PokemonPlayerCard from '../team/PokemonPlayerCard';

interface AdminDashboardControlsProps {
    teams: Team[];
    state: AuctionState;
    allPlayers: Player[];
}

interface Sequence {
    id: number;
    name: string;
    type: string;
}

interface Franchise {
    id: number;
    short_name: string;
    name: string;
}

const PHASES = [
    'NOT_STARTED', 'FRANCHISE_PHASE', 'POWER_CARD_PHASE', 
    'LIVE', 'POST_AUCTION', 'COMPLETED'
];

const POWER_CARDS = [
    'GOD_EYE', 'MULLIGAN', 'FINAL_STRIKE', 'BID_FREEZER', 'RIGHT_TO_MATCH'
];

export default function AdminDashboardControls({ teams, state, allPlayers }: AdminDashboardControlsProps) {
    const [selectedPhase, setSelectedPhase] = useState((state as any).phase || state.status || 'NOT_STARTED');
    const [selectedDay, setSelectedDay] = useState<'Day 1' | 'Day 2'>((state.auctionDay as any) || 'Day 1');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [finalPrice, setFinalPrice] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [franchises, setFranchises] = useState<Franchise[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const franches = await getAllFranchises();
                setFranchises(franches);
            } catch (err) {
                console.error('Failed to load franchises:', err);
            }
        };
        loadInitialData();
    }, []);

    const withLoading = async (fn: () => Promise<any>) => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await fn();
            setSuccess('Action successful');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Action failed');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleFineTeam = (teamId: string, teamName: string) => {
        const amountStr = prompt(`Enter amount (₹ CR) to deduct from ${teamName}:`, '0.5');
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) return;
        
        const reason = prompt(`Reason for fine on ${teamName}:`, 'Rule violation');
        if (!reason) return;

        withLoading(() => fineTeam(teamId, amount, reason));
    };

    const handleAddPurse = (teamId: string, teamName: string) => {
        const amountStr = prompt(`Enter amount (₹ CR) to ADD to ${teamName}:`, '0.5');
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) return;
        
        const reason = prompt(`Reason for purse addition on ${teamName}:`, 'Error correction');
        if (!reason) return;

        withLoading(() => addPurse(teamId, amount, reason));
    };

    const handleTogglePowerCard = (teamId: string, type: string, currentUsed: boolean) => {
        if (!window.confirm(`Mark power card ${type} for this team as ${currentUsed ? 'AVAILABLE' : 'USED'}?`)) return;
        withLoading(() => togglePowerCard(teamId, type, !currentUsed));
    };

    const phase = (state as any).phase || state.status;

    // Resolve current item details
    const renderCurrentItemInfo = () => {
        if (state.currentPlayer) {
            const p = state.currentPlayer;
            return (
                <div className="flex items-start gap-8">
                    {/* The Player Card rendering */}
                    <div className="shrink-0 transform scale-90 translate-y-[-10px] transform-origin-top-left">
                        <PokemonPlayerCard 
                            player={p as any} 
                            showPrice={true}
                            price={p.basePrice}
                            isRiddle={p.isRiddle}
                            riddleClue={state.riddleClue}
                        />
                    </div>
                    {/* Compact Details next to the card for Quick Admin Reference */}
                    <div className="pt-2">
                        <div className="text-[10px] text-blue-300 uppercase font-black tracking-widest mb-1">Current Player</div>
                        <div className="text-3xl font-black text-white tracking-tight leading-none mb-1">
                            {p.name || p.player}
                        </div>
                        <div className="flex gap-3 text-xs font-bold text-white/60 mt-3">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-blue-300">{p.category}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-orange-300">Grade {p.grade}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-green-300">Base: ₹{p.basePrice} CR</span>
                        </div>
                        {p.isRiddle && (
                            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg max-w-sm">
                                <div className="text-[10px] font-black uppercase text-yellow-500 mb-1">⚠️ Riddle Player Note</div>
                                <div className="text-xs text-yellow-200/70">
                                    Identity is hidden from teams. They only see the clue on the player card until you press UNVEIL.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (phase === 'FRANCHISE_PHASE' && state.currentItemId) {
            const fr = franchises.find(f => f.id.toString() === state.currentItemId || f.short_name === state.currentItemId);
            const franchiseId = state.currentItemId;
            const franchiseShort = fr?.short_name || '';
            
            return (
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center relative overflow-hidden">
                        {franchiseShort ? (
                            <img 
                                src={`/teams/${franchiseShort.toLowerCase()}.png`} 
                                alt={franchiseShort} 
                                className="w-full h-full object-contain p-2" 
                                onError={(e) => { (e.target as HTMLImageElement).src = '🏢'; }}
                            />
                        ) : (
                            <span className="text-4xl">🏢</span>
                        )}
                    </div>
                    <div>
                        <div className="text-[10px] text-purple-300 uppercase font-black tracking-widest mb-1">Franchise Auction</div>
                        <div className="text-3xl font-black text-white tracking-tight leading-none mb-1">
                            {fr?.name || `Franchise ${state.currentItemId}`}
                        </div>
                        <div className="flex gap-3 text-xs font-bold text-white/60">
                            <span className="bg-purple-500/20 px-2 py-0.5 rounded text-purple-300">Base Price: ₹3.00 CR</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-blue-300">Awarded: RTM Card</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (phase === 'POWER_CARD_PHASE' && state.currentItemId) {
            return (
                <div className="flex items-center gap-6">
                    <div className="w-20 h-28 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center relative overflow-hidden">
                        <img 
                            src={getPowerCardImage(state.currentItemId)} 
                            alt={state.currentItemId}
                            className="w-full h-full object-contain p-2"
                        />
                    </div>
                    <div>
                        <div className="text-[10px] text-yellow-300 uppercase font-black tracking-widest mb-1">Power Card Auction</div>
                        <div className="text-3xl font-black text-white tracking-tight leading-none mb-1">
                            {getPowerCardName(state.currentItemId)}
                        </div>
                        <div className="flex gap-3 text-xs font-bold text-white/60">
                            <span className="bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-300">Base Price: ₹1.00 CR</span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="py-4 text-white/30 font-medium italic">
                Waiting for next item to be called...
            </div>
        );
    };

    const handleFinalSale = () => {
        if (!selectedTeam) { setError('Select winning team'); return; }
        const price = parseFloat(finalPrice);

        if (state.currentPlayer) {
            const pid = state.currentPlayer.id || state.currentPlayer.rank?.toString();
            if (pid) withLoading(() => sellPlayer(pid, selectedTeam, price));
        } else if (phase === 'FRANCHISE_PHASE' && state.currentItemId) {
            withLoading(() => assignFranchise(selectedTeam, parseInt(state.currentItemId!), price));
        } else if (phase === 'POWER_CARD_PHASE' && state.currentItemId) {
            withLoading(() => assignPowerCard(selectedTeam, state.currentItemId!, price));
        }
    };

    const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter text-white">
                        ADMIN <span className="text-orange-500">CONTROL</span> PANEL
                    </h2>
                    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Auction Management System v2.1</div>
                </div>
                <div className="flex gap-4 items-center">
                    {(loading || error || success) && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className={`px-4 py-2 rounded-full text-xs font-bold border ${
                                error ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                success ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                                'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 animate-pulse'
                            }`}
                        >
                            {loading ? 'PROCESSING...' : error ? `ERROR: ${error}` : 'SUCCESS!'}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Top Row: Global State */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    <div className="text-[10px] text-white/40 uppercase font-black mb-3">Master Phase Transition</div>
                    <div className="flex gap-2">
                        <select 
                            value={selectedPhase} 
                            onChange={(e) => setSelectedPhase(e.target.value)}
                            className="flex-1 bg-black/60 border border-white/10 rounded-lg p-3 text-white font-bold text-sm outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
                        >
                            {PHASES.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
                        </select>
                        <button 
                            onClick={() => withLoading(() => setPhase(selectedPhase))}
                            disabled={loading}
                            className="px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-black text-sm transition-all active:scale-95 shadow-lg shadow-orange-900/20 disabled:opacity-50"
                        >
                            UPDATE
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    <div className="text-[10px] text-white/40 uppercase font-black mb-3">Auction Day</div>
                    <div className="flex gap-2">
                        <select 
                            value={selectedDay} 
                            onChange={(e) => setSelectedDay(e.target.value as 'Day 1' | 'Day 2')}
                            className="flex-1 bg-black/60 border border-white/10 rounded-lg p-3 text-white font-bold text-sm outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                        >
                            <option value="Day 1">DAY 1 (Primary)</option>
                            <option value="Day 2">DAY 2 (Accelerated)</option>
                        </select>
                        <button 
                            onClick={() => withLoading(() => setAuctionDay(selectedDay))}
                            disabled={loading}
                            className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-sm transition-all active:scale-95 shadow-lg shadow-blue-900/20 disabled:opacity-50"
                        >
                            SET
                        </button>
                    </div>
                </div>
            </div>

            {/* Center Area: Current Auction */}
            <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
                    {renderCurrentItemInfo()}
                    {state.currentSequenceIndex !== undefined && (
                        <div className="text-right">
                            <div className="text-[10px] text-white/30 uppercase font-black mb-1">Position</div>
                            <div className="text-3xl font-black text-white/80">
                                #{(state as any).currentSequenceIndex}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => withLoading(() => stepBackToPreviousObject())}
                        disabled={loading}
                        className="py-5 px-6 bg-white/5 hover:bg-white/10 text-white/70 border border-white/20 rounded-xl font-black shadow-lg transform transition-all hover:scale-[1.01] active:scale-95 text-xl disabled:opacity-30 flex items-center justify-center"
                        title="Step Back to Previous Item"
                    >
                        <span>⏮️</span>
                    </button>
                    <button 
                        onClick={() => withLoading(() => advanceToNextObject())}
                        disabled={loading}
                        className="flex-1 py-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-black shadow-lg transform transition-all hover:scale-[1.01] active:scale-95 text-xl disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                        <span>⏭️</span> CALL NEXT ITEM
                    </button>
                    <button 
                        onClick={() => {
                            if (state.currentPlayer) {
                                const pid = state.currentPlayer.id || state.currentPlayer.rank?.toString();
                                if (!pid) return;
                                if (!window.confirm(`Mark ${state.currentPlayer.name || state.currentPlayer.player} as UNSOLD?`)) return;
                                withLoading(() => markUnsold(pid));
                            } else if (state.currentItemId) {
                                const itemType = phase === 'FRANCHISE_PHASE' ? 'FRANCHISE' : 'POWERCARD';
                                if (!window.confirm(`Mark current ${itemType} as UNSOLD and re-queue?`)) return;
                                withLoading(() => markItemUnsold(state.currentItemId!, itemType as any));
                            }
                        }}
                        disabled={loading || (!state.currentPlayer && !state.currentItemId)}
                        className="px-8 py-5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl font-black shadow-lg transform transition-all active:scale-95 text-lg disabled:opacity-30"
                    >
                        ✗ UNSOLD
                    </button>
                    <button 
                        onClick={() => {
                            if (!state.currentPlayer) return;
                            const pid = state.currentPlayer.id || state.currentPlayer.rank?.toString();
                            if (!pid) return;
                            withLoading(() => unveilRiddlePlayer(pid));
                        }}
                        disabled={loading || !state.currentPlayer?.isRiddle}
                        className={`px-8 py-5 flex items-center gap-2 rounded-xl font-black shadow-lg transition-all text-lg ${
                            state.currentPlayer?.isRiddle 
                                ? 'bg-amber-500 text-black hover:bg-amber-400 animate-pulse active:scale-95' 
                                : 'bg-white/5 text-white/20 border border-white/10 grayscale cursor-not-allowed'
                        }`}
                    >
                        🎭 UNVEIL
                    </button>
                </div>
            </div>

            {/* Final Sale & Team Summary */}
            <div className="grid grid-cols-[380px_1fr] gap-8">
                <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                    <h3 className="text-sm font-black text-white/60 uppercase tracking-widest border-b border-white/5 pb-2">Finalize Decision</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-white/40 uppercase font-black">Winning Team</label>
                            <select 
                                value={selectedTeam} 
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-white font-bold text-sm outline-none focus:border-green-500/50 transition-colors"
                            >
                                <option value="">Select Team...</option>
                                {sortedTeams.map(t => (
                                    <option key={t.id} value={t.id.toString()}>
                                        {t.name} (₹{t.purseRemaining} CR)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-white/40 uppercase font-black">Sale Price (₹ CR)</label>
                            <div className="relative">
                                <input 
                                    type="number" step="0.1"
                                    value={finalPrice} 
                                    onChange={(e) => setFinalPrice(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-lg p-3 pl-8 text-white font-bold text-lg outline-none focus:border-green-500/50 transition-colors"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-bold">₹</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleFinalSale}
                            disabled={loading || !selectedTeam || (!state.currentPlayer && !state.currentItemId)}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-black shadow-xl shadow-green-900/20 transform transition-all active:scale-95 disabled:opacity-20"
                        >
                            CONFIRM FINAL SALE
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-black text-white/60 uppercase tracking-widest border-b border-white/5 pb-2 flex justify-between">
                        <span>Participant Teams Overview</span>
                        <span className="text-blue-400">{teams.length} Active Teams</span>
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20 overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-white/5 uppercase text-white/30 font-black">
                                    <th className="p-3">Team</th>
                                    <th className="p-3">Rem. Purse</th>
                                    <th className="p-3">Squad</th>
                                    <th className="p-3">Power Cards</th>
                                    <th className="p-3">Players</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sortedTeams.map(team => (
                                    <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {/* Import TeamAvatar where needed or use a local version */}
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-white/40 overflow-hidden">
                                                        {team.logo && team.logo.startsWith('/') ? (
                                                            <img src={team.logo} alt={team.shortName} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span>{team.shortName?.charAt(0) || 'T'}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-white text-sm truncate">{team.name}</div>
                                                    <div className="text-[10px] text-white/30 truncate max-w-[120px]">
                                                        {team.franchiseName || 'No Franchise'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`font-black text-lg ${team.budgetRemaining < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                                    ₹{team.budgetRemaining} <span className="text-[10px] opacity-40">CR</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleAddPurse(team.id.toString(), team.name)}
                                                    className="p-1.5 bg-green-500/10 hover:bg-green-500/30 rounded-lg text-green-500/60 hover:text-green-500 border border-green-500/20 hover:border-green-500/50 transition-all flex items-center justify-center text-lg"
                                                    title="Add Purse"
                                                >
                                                    ➕
                                                </button>
                                                <button 
                                                    onClick={() => handleFineTeam(team.id.toString(), team.name)}
                                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/30 rounded-lg text-red-500/60 hover:text-red-500 border border-red-500/20 hover:border-red-500/50 transition-all flex items-center justify-center text-lg"
                                                    title="Fine Team"
                                                >
                                                    💸
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-white/80 font-bold">{team.squadCount || 0} / {team.squadLimit}</div>
                                            <div className="text-[10px] text-white/40 font-mono mt-0.5 whitespace-nowrap">
                                                <span>B:{(team as any).batsmanCount || 0}</span>
                                                <span className="mx-1">|</span>
                                                <span>Bo:{(team as any).bowlerCount || 0}</span>
                                                <span className="mx-1">|</span>
                                                <span>A:{(team as any).allrounderCount || 0}</span>
                                                <span className="mx-1">|</span>
                                                <span>W:{(team as any).wicketkeeperCount || 0}</span>
                                            </div>
                                            <div className={`text-[10px] mt-1 font-bold ${team.overseasCount >= 5 ? 'text-orange-400' : 'text-blue-300/60'}`}>
                                                {team.overseasCount || 0} / 5 Overseas
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 flex-wrap max-w-[180px]">
                                                {POWER_CARDS.map(type => {
                                                    const cardKey = {
                                                        'FINAL_STRIKE': 'finalStrike',
                                                        'BID_FREEZER': 'bidFreezer',
                                                        'GOD_EYE': 'godsEye',
                                                        'MULLIGAN': 'mulligan',
                                                        'RIGHT_TO_MATCH': 'rightToMatch'
                                                    }[type] || type;

                                                    const card = (team.powerCards as any)?.[cardKey];
                                                    const isAssigned = card?.available === true;
                                                    const isUsed = card?.used === true;

                                                    return (
                                                        <span 
                                                            key={type}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!isAssigned) {
                                                                    if (window.confirm(`Assign ${type} to ${team.name}?`)) {
                                                                        withLoading(() => assignPowerCard(team.id.toString(), type, 1.0));
                                                                    }
                                                                } else {
                                                                    handleTogglePowerCard(team.id.toString(), type, isUsed);
                                                                }
                                                            }}
                                                            onContextMenu={(e) => {
                                                                e.preventDefault();
                                                                if (isAssigned && !isUsed) {
                                                                    if (window.confirm(`Remove/Deassign ${type} from ${team.name}?`)) {
                                                                        withLoading(() => deassignPowerCard(team.id.toString(), type));
                                                                    }
                                                                }
                                                            }}
                                                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase cursor-pointer transition-all border ${
                                                                !isAssigned 
                                                                    ? 'bg-black/40 border-white/5 text-white/10 hover:border-white/20' 
                                                                    : isUsed
                                                                        ? 'bg-red-500/20 border-red-500/40 text-red-500 line-through decoration-2'
                                                                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:scale-105 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                                            }`}
                                                            title={!isAssigned ? 'Click to Assign' : isUsed ? 'Click to mark Available' : 'Click to mark Used | Right-click to Deassign'}
                                                        >
                                                            {type === 'RIGHT_TO_MATCH' ? 'RTM' : type.split('_').map(w => w[0]).join('')}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-1">
                                                {team.players && team.players.length > 0 ? (
                                                    team.players.map(pRank => (
                                                        <div key={pRank} className="group relative flex items-center bg-white/5 border border-white/10 rounded-md px-3 py-1.5 hover:border-red-500/60 transition-all hover:bg-red-500/5">
                                                            <span className="text-white/80 font-mono text-xs font-bold">#{pRank}</span>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (window.confirm(`Deassign player #${pRank} from ${team.name}?`)) {
                                                                        withLoading(async () => {
                                                                            console.log(`Deassigning player rank: ${pRank}`);
                                                                            await deassignPlayer(pRank.toString());
                                                                            // Force state refresh
                                                                            setTimeout(() => window.location.reload(), 800);
                                                                        });
                                                                    }
                                                                }}
                                                                className="ml-1.5 p-1 bg-red-500/10 hover:bg-red-500/30 rounded text-red-500/60 hover:text-red-500 border border-red-500/20 hover:border-red-500/40 transition-all flex items-center justify-center text-xs w-6 h-6"
                                                                title="Deassign Player"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-white/20 italic">Squad empty</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Status Footer */}
            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                <div className="flex gap-4">
                    <span>• System Healthy</span>
                    <span>• {teams.reduce((acc, t) => acc + (t.players?.length || 0), 0)} Players Sold Total</span>
                </div>
                <div className="text-white/10 italic">
                    Press CALL NEXT to continue sequence
                </div>
            </div>
        </div>
    );
}
