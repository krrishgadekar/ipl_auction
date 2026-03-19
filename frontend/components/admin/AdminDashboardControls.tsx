'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Team } from '@/lib/mockData/teams';
import { AuctionState } from '@/lib/mockData/auctionState';
import { 
    setPhase, setAuctionDay, advanceToNextPlayer, 
    assignFranchise, assignPlayer, deassignPlayer,
    assignPowerCard, deassignPowerCard, markUnsold,
    unveilRiddlePlayer 
} from '@/lib/api/admin';

interface AdminDashboardControlsProps {
    teams: Team[];
    state: AuctionState;
}

const PHASES = [
    'NOT_STARTED', 'FRANCHISE_PHASE', 'POWER_CARD_PHASE', 
    'LIVE', 'POST_AUCTION', 'COMPLETED'
];

const POWER_CARDS = [
    'GOD_EYE', 'MULLIGAN', 'FINAL_STRIKE', 'BID_FREEZER', 'RIGHT_TO_MATCH'
];

export default function AdminDashboardControls({ teams, state }: AdminDashboardControlsProps) {
    const [selectedPhase, setSelectedPhase] = useState((state as any).phase || state.status || 'NOT_STARTED');
    const [selectedDay, setSelectedDay] = useState<'Day 1' | 'Day 2'>(state.auctionDay || 'Day 1');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedFranchiseId, setSelectedFranchiseId] = useState('');
    const [playerIdInput, setPlayerIdInput] = useState(''); // UUID or rank
    const [deassignPlayerId, setDeassignPlayerId] = useState(''); // UUID only typically
    const [selectedPowerCard, setSelectedPowerCard] = useState(POWER_CARDS[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-8 backdrop-blur-sm">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Admin Master Controls
                </h2>
                {(loading || error || success) && (
                    <div className="text-sm font-bold animate-pulse">
                        {loading && <span className="text-yellow-400">Processing...</span>}
                        {error && <span className="text-red-400">{error}</span>}
                        {success && <span className="text-green-400">{success}</span>}
                    </div>
                )}
            </div>

            {/* 1. Global State Controls */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white/80 border-b border-white/10 pb-2">Global State</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase">Update Phase</label>
                        <div className="flex gap-2">
                            <select 
                                value={selectedPhase} 
                                onChange={(e) => setSelectedPhase(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                            >
                                {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <button 
                                onClick={() => withLoading(() => setPhase(selectedPhase))}
                                disabled={loading}
                                className="px-4 bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 rounded-lg font-bold text-sm transition-colors"
                            >
                                Set
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase">Auction Day</label>
                        <div className="flex gap-2">
                            <select 
                                value={selectedDay} 
                                onChange={(e) => setSelectedDay(e.target.value as 'Day 1' | 'Day 2')}
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                            >
                                <option value="Day 1">Day 1</option>
                                <option value="Day 2">Day 2</option>
                            </select>
                            <button 
                                onClick={() => withLoading(() => setAuctionDay(selectedDay))}
                                disabled={loading}
                                className="px-4 bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 rounded-lg font-bold text-sm transition-colors"
                            >
                                Set
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Stepping & Sequence */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white/80 border-b border-white/10 pb-2">Auction Sequence</h3>
                <div className="flex gap-4">
                    <button 
                        onClick={() => withLoading(() => advanceToNextPlayer())}
                        disabled={loading}
                        className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 text-lg"
                    >
                        ⏭️ Advance to Next Object/Player
                    </button>
                    <button 
                        onClick={() => {
                            const playerId = state.currentPlayer?.id || state.currentPlayer?.rank?.toString() || '';
                            if (!playerId) { setError('No current player to mark unsold'); return; }
                            if (!window.confirm(`Mark current player as UNSOLD?`)) return;
                            withLoading(() => markUnsold(playerId));
                        }}
                        disabled={loading || !state.currentPlayer}
                        className="py-4 px-6 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white rounded-xl font-bold shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ✗ Mark Unsold
                    </button>
                    {/* Unveil Riddle Player — only visible when current player is a riddle */}
                    {state.currentPlayer?.isRiddle && (
                        <button 
                            onClick={() => {
                                const playerId = state.currentPlayer?.id || '';
                                if (!playerId) { setError('No current player to unveil'); return; }
                                if (!window.confirm('🎭 Unveil this riddle player? Their real identity will be revealed to everyone!')) return;
                                withLoading(() => unveilRiddlePlayer(playerId));
                            }}
                            disabled={loading}
                            className="py-4 px-6 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black rounded-xl font-bold shadow-lg shadow-yellow-500/20 transform transition-all hover:scale-[1.02] active:scale-95 text-lg animate-pulse"
                        >
                            ✨ Unveil Riddle Player
                        </button>
                    )}
                </div>
            </div>

            {/* 3. Franchise Assignment */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white/80 border-b border-white/10 pb-2">Franchise Assignment</h3>
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase">Team</label>
                        <select 
                            value={selectedTeam} 
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                        >
                            <option value="">Select Team</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase">Franchise ID (1-10)</label>
                        <input 
                            type="number"
                            value={selectedFranchiseId} 
                            onChange={(e) => setSelectedFranchiseId(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                            placeholder="1, 2, 3..."
                        />
                    </div>
                    <button 
                        onClick={() => withLoading(() => assignFranchise(selectedTeam, parseInt(selectedFranchiseId)))}
                        disabled={loading || !selectedTeam || !selectedFranchiseId}
                        className="px-6 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded-lg font-bold text-sm h-10 transition-colors disabled:opacity-50"
                    >
                        Assign
                    </button>
                </div>
            </div>

            {/* 4. Player Assignment */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white/80 border-b border-white/10 pb-2">Player Overrides</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase">Manual Assign Player (Rank or UUID)</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={playerIdInput} 
                                onChange={(e) => setPlayerIdInput(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                                placeholder="Rank e.g 42"
                            />
                            <button 
                                onClick={() => withLoading(() => assignPlayer(playerIdInput))}
                                disabled={loading || !playerIdInput}
                                className="px-4 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                            >
                                Override
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-red-500/80 uppercase">Revoke / Deassign Player (UUID)</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={deassignPlayerId} 
                                onChange={(e) => setDeassignPlayerId(e.target.value)}
                                className="flex-1 bg-red-950/40 border border-red-500/20 rounded-lg p-2 text-red-100 text-sm focus:outline-none"
                                placeholder="Player UUID"
                            />
                            <button 
                                onClick={() => withLoading(() => deassignPlayer(deassignPlayerId))}
                                disabled={loading || !deassignPlayerId}
                                className="px-4 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                            >
                                Revoke
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Powercard Assignment */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white/80 border-b border-white/10 pb-2">Powercard Overrides</h3>
                <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase">Team</label>
                        <select 
                            value={selectedTeam} 
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                        >
                            <option value="">Select Team</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase">Card Type</label>
                        <select 
                            value={selectedPowerCard} 
                            onChange={(e) => setSelectedPowerCard(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                        >
                            {POWER_CARDS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button 
                        onClick={() => withLoading(() => assignPowerCard(selectedTeam, selectedPowerCard))}
                        disabled={loading || !selectedTeam}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-lg font-bold text-sm h-10 transition-colors disabled:opacity-50"
                    >
                        Assign Card
                    </button>
                    <button 
                        onClick={() => withLoading(() => deassignPowerCard(selectedTeam, selectedPowerCard))}
                        disabled={loading || !selectedTeam}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg font-bold text-sm h-10 transition-colors disabled:opacity-50"
                    >
                        Revoke Card
                    </button>
                </div>
            </div>

        </div>
    );
}
