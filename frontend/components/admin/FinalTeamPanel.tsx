// Final Team Submission Panel — Admin Component
// Allows admin to select Top 11, Captain, VC per team and submit

'use client';

import { useState, useMemo } from 'react';
import { type Team } from '@/lib/api/teams';
import { type Player } from '@/lib/api/players';
import { TOP11_COMPOSITION, validateTop11 } from '@/lib/logic/finalTeam';
import { submitTeam } from '@/lib/api/finalTeam';
import { motion, AnimatePresence } from 'framer-motion';

interface FinalTeamPanelProps {
    teams: Team[];
    allPlayers: Player[];
}

export default function FinalTeamPanel({ teams, allPlayers }: FinalTeamPanelProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<string | number | null>(null);
    const [selectedRanks, setSelectedRanks] = useState<Set<number>>(new Set());
    const [captainRank, setCaptainRank] = useState<number | null>(null);
    const [vcRank, setVcRank] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<Set<string | number>>(new Set());
    const [successMsg, setSuccessMsg] = useState('');

    const selectedTeam = teams.find(t => t.id === selectedTeamId) ?? null;

    // Resolve team's purchased players
    const teamPlayers: Player[] = useMemo(() => {
        if (!selectedTeam) return [];
        return selectedTeam.players
            .map(r => allPlayers.find(p => p.rank === r))
            .filter((p): p is Player => !!p);
    }, [selectedTeam, allPlayers]);

    // Group players by category
    const grouped = useMemo(() => {
        const groups: Record<string, Player[]> = {
            BAT: [], BOWL: [], AR: [], WK: [],
        };
        teamPlayers.forEach(p => {
            if (groups[p.category]) groups[p.category].push(p);
        });
        return groups;
    }, [teamPlayers]);

    // Validation
    const validation = useMemo(() => {
        return validateTop11(
            Array.from(selectedRanks),
            captainRank,
            vcRank,
            teamPlayers,
        );
    }, [selectedRanks, captainRank, vcRank, teamPlayers]);

    // Category counts in current selection
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {
            BAT: 0, BOWL: 0, AR: 0, WK: 0,
        };
        selectedRanks.forEach(r => {
            const p = teamPlayers.find(pl => pl.rank === r);
            if (p) counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return counts;
    }, [selectedRanks, teamPlayers]);

    // (Overseas limit removed from Top 11)

    function togglePlayer(rank: number) {
        const next = new Set(selectedRanks);
        if (next.has(rank)) {
            next.delete(rank);
            if (captainRank === rank) setCaptainRank(null);
            if (vcRank === rank) setVcRank(null);
        } else {
            if (next.size >= 11) return; // can't select more than 11
            next.add(rank);
        }
        setSelectedRanks(next);
    }

    function handleTeamChange(id: string | number) {
        setSelectedTeamId(id);
        setSelectedRanks(new Set());
        setCaptainRank(null);
        setVcRank(null);
        setSuccessMsg('');
    }

    async function handleSubmit() {
        if (!selectedTeamId || !captainRank || !vcRank || !validation.valid) return;
        setSubmitting(true);
        try {
            await submitTeam(String(selectedTeamId), Array.from(selectedRanks), captainRank, vcRank);
            setSubmitted(prev => new Set(prev).add(selectedTeamId as any));
            setSuccessMsg(`✅ ${selectedTeam?.name} Top 11 submitted!`);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    const categoryEmojis: Record<string, string> = {
        BAT: '🏏', BOWL: '🎳', AR: '⚡', WK: '🧤',
    };
    const categoryRequired: Record<string, number> = {
        BAT: TOP11_COMPOSITION.BAT.required,
        BOWL: TOP11_COMPOSITION.BOWL.required,
        WK: TOP11_COMPOSITION.WK.required,
        AR: TOP11_COMPOSITION.AR.required,
    };

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                background: 'rgba(10,22,40,0.7)',
                border: '1px solid rgba(43,181,204,0.15)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <h2 className="text-xl font-black mb-4" style={{ fontFamily: "'Cinzel', serif", color: '#f5d569' }}>
                🏆 Final Team Submission
            </h2>

            {/* Team Selector */}
            <div className="mb-5">
                <label className="text-xs tracking-widest mb-2 block" style={{ color: 'rgba(122,148,176,0.6)' }}>
                    SELECT TEAM
                </label>
                <div className="grid grid-cols-5 gap-2">
                    {teams.filter(t => t.players.length > 0).map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleTeamChange(t.id)}
                            className="py-2 px-3 rounded-xl text-sm font-bold transition-all"
                            style={{
                                background: selectedTeamId === t.id
                                    ? `${t.primaryColor}30`
                                    : 'rgba(4,11,20,0.5)',
                                border: `1px solid ${selectedTeamId === t.id ? `${t.primaryColor}80` : 'rgba(43,181,204,0.1)'}`,
                                color: selectedTeamId === t.id ? '#e8f0f8' : 'rgba(122,148,176,0.6)',
                            }}
                        >
                            {t.logo} {t.shortName}
                            {submitted.has(t.id) && <span className="ml-1">✅</span>}
                        </button>
                    ))}
                </div>
                {teams.filter(t => t.players.length > 0).length === 0 && (
                    <p className="text-sm mt-2" style={{ color: 'rgba(231,76,94,0.7)' }}>
                        No teams have purchased players yet.
                    </p>
                )}
            </div>

            {/* Player Selection */}
            {selectedTeam && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Composition tracker */}
                    <div className="grid grid-cols-5 gap-2 mb-4">
                        {Object.entries(categoryRequired).map(([cat, req]) => {
                            const have = categoryCounts[cat] || 0;
                            const ok = have === req;
                            return (
                                <div
                                    key={cat}
                                    className="rounded-xl p-2 text-center"
                                    style={{
                                        background: ok ? 'rgba(45,212,160,0.1)' : 'rgba(4,11,20,0.5)',
                                        border: `1px solid ${ok ? 'rgba(45,212,160,0.3)' : 'rgba(43,181,204,0.1)'}`,
                                    }}
                                >
                                    <div className="text-lg">{categoryEmojis[cat]}</div>
                                    <div className="text-xs font-bold" style={{ color: ok ? '#2dd4a0' : 'rgba(122,148,176,0.7)' }}>
                                        {have}/{req}
                                    </div>
                                    <div className="text-[0.6rem]" style={{ color: 'rgba(122,148,176,0.5)' }}>
                                        {cat}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Players by category */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {Object.entries(grouped).map(([cat, players]) => players.length > 0 && (
                            <div key={cat}>
                                <div className="text-xs font-bold tracking-widest mb-1.5" style={{ color: 'rgba(122,148,176,0.5)' }}>
                                    {categoryEmojis[cat]} {cat.toUpperCase()} ({players.length} available)
                                </div>
                                <div className="space-y-1">
                                    {players.map(p => {
                                        const isSelected = selectedRanks.has(p.rank);
                                        const isCaptain = captainRank === p.rank;
                                        const isVC = vcRank === p.rank;
                                        return (
                                            <div
                                                key={p.rank}
                                                className="flex items-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer"
                                                style={{
                                                    background: isSelected
                                                        ? isCaptain
                                                            ? 'rgba(212,175,55,0.15)'
                                                            : isVC
                                                                ? 'rgba(43,181,204,0.12)'
                                                                : 'rgba(43,181,204,0.08)'
                                                        : 'rgba(4,11,20,0.3)',
                                                    border: `1px solid ${isSelected ? 'rgba(43,181,204,0.3)' : 'transparent'}`,
                                                }}
                                                onClick={() => togglePlayer(p.rank)}
                                            >
                                                {/* Checkbox */}
                                                <div
                                                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        background: isSelected ? 'rgba(43,181,204,0.3)' : 'rgba(4,11,20,0.5)',
                                                        border: `1px solid ${isSelected ? '#2bb5cc' : 'rgba(43,181,204,0.2)'}`,
                                                    }}
                                                >
                                                    {isSelected && <span className="text-xs text-cyan-400">✓</span>}
                                                </div>

                                                {/* Player name */}
                                                <span className="flex-1 text-sm font-medium truncate" style={{ color: isSelected ? '#e8f0f8' : 'rgba(122,148,176,0.7)' }}>
                                                    {p.nationality?.toUpperCase() === 'OVERSEAS' && '🌍 '}
                                                    {p.player}
                                                </span>

                                                {/* Rating */}
                                                <span className="text-sm font-bold w-8 text-center" style={{ color: '#d4af37' }}>
                                                    {p.rating}
                                                </span>

                                                {/* Captain / VC buttons (only if selected) */}
                                                {isSelected && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setCaptainRank(isCaptain ? null : p.rank); if (isVC) setVcRank(null); }}
                                                            className="text-xs px-2 py-0.5 rounded font-bold transition-all"
                                                            style={{
                                                                background: isCaptain ? 'rgba(212,175,55,0.3)' : 'rgba(4,11,20,0.5)',
                                                                border: `1px solid ${isCaptain ? '#d4af37' : 'rgba(212,175,55,0.2)'}`,
                                                                color: isCaptain ? '#f5d569' : 'rgba(212,175,55,0.5)',
                                                            }}
                                                        >
                                                            C
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setVcRank(isVC ? null : p.rank); if (isCaptain) setCaptainRank(null); }}
                                                            className="text-xs px-2 py-0.5 rounded font-bold transition-all"
                                                            style={{
                                                                background: isVC ? 'rgba(43,181,204,0.3)' : 'rgba(4,11,20,0.5)',
                                                                border: `1px solid ${isVC ? '#2bb5cc' : 'rgba(43,181,204,0.2)'}`,
                                                                color: isVC ? '#7eeaf5' : 'rgba(43,181,204,0.5)',
                                                            }}
                                                        >
                                                            VC
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Validation errors */}
                    {!validation.valid && selectedRanks.size > 0 && (
                        <div className="mt-3 space-y-1">
                            {validation.errors.map((err, i) => (
                                <div key={i} className="text-xs flex items-center gap-1.5" style={{ color: '#e74c5e' }}>
                                    <span>✕</span> {err}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Success message */}
                    <AnimatePresence>
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-3 py-2 px-4 rounded-xl text-sm font-bold text-center"
                                style={{ background: 'rgba(45,212,160,0.15)', border: '1px solid rgba(45,212,160,0.3)', color: '#2dd4a0' }}
                            >
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!validation.valid || submitting}
                        className="w-full mt-4 py-3 rounded-xl font-black text-lg tracking-wide transition-all"
                        style={{
                            background: validation.valid
                                ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.15))'
                                : 'rgba(4,11,20,0.5)',
                            border: `2px solid ${validation.valid ? 'rgba(212,175,55,0.5)' : 'rgba(43,181,204,0.1)'}`,
                            color: validation.valid ? '#f5d569' : 'rgba(122,148,176,0.3)',
                            cursor: validation.valid ? 'pointer' : 'not-allowed',
                            fontFamily: "'Cinzel', serif",
                        }}
                    >
                        {submitting ? '⏳ Submitting...'
                            : submitted.has(selectedTeamId!)
                                ? '🔄 Update Submission'
                                : '🏆 Submit Final Team'}
                    </button>

                    {/* Selection counter */}
                    <div className="mt-2 text-center text-xs" style={{ color: 'rgba(122,148,176,0.5)' }}>
                        {selectedRanks.size}/11 players selected
                        {captainRank && ` • C: ${teamPlayers.find(p => p.rank === captainRank)?.player}`}
                        {vcRank && ` • VC: ${teamPlayers.find(p => p.rank === vcRank)?.player}`}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
