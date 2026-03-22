// Bid Controls Component
// Enforces rulebook bid increment rules: 0.2 CR below 5 CR, 0.25 CR above 5 CR
// Max bid capped at 25 CR (triggers Closed Bidding)
// Phase 2: Closed Bidding sealed-bid panel with God's Eye reveal

'use client';

import { useState, useEffect } from 'react';
import { type Team } from '@/lib/api/teams';
import { placeBid, updateAuctionPhase } from '@/lib/api/auction';
import { MAX_BID, getIncrement, roundToCr as r2 } from '@/lib/constants';

interface BidControlsProps {
    teams: Team[];
    currentBid: number;
    baseBid: number;
    status: string;
}

// getIncrement and r2 moved to constants.ts

export default function BidControls({ teams, currentBid, baseBid, status }: BidControlsProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<string | number>(teams[0]?.id || 1);
    const [bidAmount, setBidAmount] = useState<number>(r2(currentBid + getIncrement(currentBid)));
    const [placing, setPlacing] = useState(false);
    const [triggeringClosed, setTriggeringClosed] = useState(false);

    // Closed Bidding state
    const [sealedBids, setSealedBids] = useState<Record<string | number, string>>({});
    const [submittingSealed, setSubmittingSealed] = useState<string | number | null>(null);
    const [godsEyeRevealed, setGodsEyeRevealed] = useState(false);
    const [highestSealedBidder, setHighestSealedBidder] = useState<{ team: Team; amount: number } | null>(null);

    const inc = getIncrement(bidAmount);
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    const isClosedBidding = status === 'CLOSED_BIDDING';

    // Sync bid amount when current bid changes externally
    useEffect(() => {
        setBidAmount(r2(currentBid + getIncrement(currentBid)));
    }, [currentBid]);

    // Reset closed bidding state when status changes
    useEffect(() => {
        if (!isClosedBidding) {
            setSealedBids({});
            setGodsEyeRevealed(false);
            setHighestSealedBidder(null);
        }
    }, [isClosedBidding]);

    const handleQuickIncrement = (steps: number) => {
        setBidAmount(prev => {
            let next = prev;
            for (let i = 0; i < steps; i++) {
                next = r2(next + getIncrement(next));
            }
            return Math.min(next, MAX_BID);
        });
    };

    const handlePlaceBid = async () => {
        if (!selectedTeam) return;
        setPlacing(true);
        try {
            // Auto-trigger Closed Bidding if hitting 25 CR
            if (bidAmount >= MAX_BID) {
                await placeBid(String(selectedTeam.id), MAX_BID);
                await updateAuctionPhase('CLOSED_BIDDING');
                return;
            }
            await placeBid(String(selectedTeam.id), bidAmount);
        } catch (error) {
            console.error('Failed to place bid:', error);
        } finally {
            setPlacing(false);
        }
    };

    const handleTriggerClosedBidding = async () => {
        setTriggeringClosed(true);
        try {
            await updateAuctionPhase('CLOSED_BIDDING');
        } catch (e) {
            console.error(e);
        } finally {
            setTriggeringClosed(false);
        }
    };

    const handleSealedBidChange = (teamId: string | number, value: string) => {
        setSealedBids(prev => ({ ...prev, [teamId]: value }));
    };

    const handleSubmitSealedBid = async (team: Team) => {
        const raw = sealedBids[team.id];
        const amount = parseFloat(raw);
        if (isNaN(amount) || amount <= 0) return;
        setSubmittingSealed(team.id);
        try {
            await placeBid(String(team.id), amount);
        } catch (e) {
            console.error('Failed to submit sealed bid:', e);
        } finally {
            setSubmittingSealed(null);
        }
    };

    const handleGodsEyeReveal = () => {
        // Find highest sealed bid from entered values
        let highest: { team: Team; amount: number } | null = null;
        for (const team of teams) {
            const raw = sealedBids[team.id];
            const amount = parseFloat(raw || '0');
            if (!isNaN(amount) && amount > 0) {
                if (!highest || amount > highest.amount) {
                    highest = { team, amount };
                }
            }
        }
        setHighestSealedBidder(highest);
        setGodsEyeRevealed(true);
    };

    const canPlaceBid = bidAmount > currentBid
        && selectedTeam
        && (selectedTeam as any).purseRemaining >= bidAmount
        && !isClosedBidding;

    const submittedTeams = Object.entries(sealedBids).filter(([, v]) => parseFloat(v) > 0).length;

    return (
        <div className="backdrop-blur-md rounded-2xl p-6" style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(43,181,204,0.15)' }}>
            <h2 className="text-2xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Cinzel', serif" }}>Bid Controls</h2>

            {/* Current Bid Display */}
            <div className="mb-6 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(14,77,94,0.3), rgba(43,181,204,0.1))', border: '1px solid rgba(43,181,204,0.3)' }}>
                <div className="text-sm mb-1" style={{ color: 'rgba(122,148,176,0.8)' }}>Current Bid</div>
                <div className="text-4xl font-black" style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>₹{currentBid.toFixed(2)} CR</div>
                {currentBid > baseBid && (
                    <div className="text-sm mt-1" style={{ color: 'rgba(122,148,176,0.6)' }}>Base: ₹{baseBid.toFixed(2)} CR</div>
                )}
            </div>

            {/* ══════════════ CLOSED BIDDING STATE ══════════════ */}
            {isClosedBidding ? (
                <div className="space-y-4">
                    {/* Header */}
                    <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(14,77,94,0.25)', border: '1px solid rgba(43,181,204,0.35)' }}>
                        <div className="text-3xl mb-1">🔒</div>
                        <div className="font-black text-xl gradient-text" style={{ fontFamily: "'Cinzel', serif" }}>CLOSED BIDDING</div>
                        <div className="text-sm mt-1" style={{ color: 'rgba(122,148,176,0.7)' }}>
                            Max bid (₹{MAX_BID} CR) reached · Enter sealed bids below
                        </div>
                        <div className="mt-2 text-xs" style={{ color: 'rgba(43,181,204,0.6)' }}>
                            {submittedTeams}/{teams.length} teams entered · Admin only
                        </div>
                    </div>

                    {/* Per-team Sealed Bid Inputs */}
                    <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider px-1" style={{ color: 'rgba(43,181,204,0.6)' }}>
                            Enter each team&apos;s sealed bid
                        </div>
                        {teams.map(team => {
                            const val = sealedBids[team.id] ?? '';
                            const amount = parseFloat(val);
                            const isValid = !isNaN(amount) && amount > 0;
                            const isSubmitting = submittingSealed === team.id;
                            return (
                                <div
                                    key={team.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                                    style={{
                                        background: isValid ? 'rgba(14,77,94,0.2)' : 'rgba(10,22,40,0.3)',
                                        border: `1px solid ${isValid ? 'rgba(43,181,204,0.3)' : 'rgba(43,181,204,0.1)'}`,
                                    }}
                                >
                                    <div className="w-12 text-center">
                                        <span className="text-xs font-bold" style={{ color: '#2bb5cc' }}>{team.shortName}</span>
                                    </div>
                                    <input
                                        type="number"
                                        min={MAX_BID}
                                        max={(team as any).purseRemaining}
                                        step={0.25}
                                        placeholder="CR amount"
                                        value={val}
                                        onChange={e => handleSealedBidChange(team.id, e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg text-white text-sm focus:outline-none"
                                        style={{ background: 'rgba(14,77,94,0.3)', border: '1px solid rgba(43,181,204,0.2)' }}
                                    />
                                    <span className="text-xs" style={{ color: 'rgba(122,148,176,0.5)' }}>CR</span>
                                    <button
                                        onClick={() => handleSubmitSealedBid(team)}
                                        disabled={!isValid || isSubmitting}
                                        className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
                                        style={{
                                            background: isValid && !isSubmitting ? 'linear-gradient(135deg, #0e4d5e, #1a8a9e)' : 'rgba(43,181,204,0.05)',
                                            color: isValid && !isSubmitting ? '#fff' : 'rgba(43,181,204,0.3)',
                                            cursor: !isValid || isSubmitting ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {isSubmitting ? '...' : '✓ Log'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* God's Eye Reveal */}
                    <div className="pt-2" style={{ borderTop: '1px solid rgba(43,181,204,0.1)' }}>
                        <button
                            onClick={handleGodsEyeReveal}
                            disabled={submittedTeams === 0}
                            className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                            style={{
                                background: submittedTeams > 0 ? 'linear-gradient(135deg, #7a5c00, #d4af37)' : 'rgba(212,175,55,0.05)',
                                color: submittedTeams > 0 ? '#0a1628' : 'rgba(212,175,55,0.3)',
                                cursor: submittedTeams === 0 ? 'not-allowed' : 'pointer',
                                boxShadow: submittedTeams > 0 ? '0 4px 20px rgba(212,175,55,0.25)' : 'none',
                            }}
                        >
                            👁️ God&apos;s Eye — Reveal Highest Sealed Bid
                        </button>

                        {/* Reveal Result */}
                        {godsEyeRevealed && (
                            <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(100,70,0,0.2)', border: '1px solid rgba(212,175,55,0.35)' }}>
                                {highestSealedBidder ? (
                                    <div className="text-center">
                                        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#d4af37' }}>
                                            👁️ Highest Sealed Bid
                                        </div>
                                        <div className="text-2xl font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                                            {highestSealedBidder.team.shortName}
                                        </div>
                                        <div className="text-sm" style={{ color: 'rgba(122,148,176,0.7)' }}>{highestSealedBidder.team.name}</div>
                                        <div className="text-3xl font-black mt-1" style={{ color: '#d4af37', fontFamily: "'Cinzel', serif" }}>
                                            ₹{highestSealedBidder.amount.toFixed(2)} CR
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-sm" style={{ color: 'rgba(122,148,176,0.5)' }}>
                                        No sealed bids entered yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Return to Open Bidding */}
                    <button
                        onClick={() => updateAuctionPhase('BIDDING')}
                        className="w-full py-2 rounded-xl text-xs font-bold transition-all"
                        style={{ background: 'rgba(43,181,204,0.05)', border: '1px solid rgba(43,181,204,0.12)', color: 'rgba(43,181,204,0.5)' }}
                    >
                        ← Return to Open Bidding
                    </button>
                </div>
            ) : (
                <>
                    {/* Team Selector */}
                    <div className="mb-4">
                        <label className="block text-sm mb-2" style={{ color: 'rgba(122,148,176,0.8)' }}>Bidding Team</label>
                        <select
                            value={String(selectedTeamId)}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                            style={{ background: 'rgba(14,77,94,0.2)', border: '1px solid rgba(43,181,204,0.2)' }}
                        >
                            {teams.map(team => (
                                <option key={team.id} value={team.id} className="bg-slate-900">
                                    {team.shortName} — ₹{(team as any).purseRemaining} CR left
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bid Amount with step control */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm" style={{ color: 'rgba(122,148,176,0.8)' }}>Bid Amount (CR)</label>
                            <span className="text-xs" style={{ color: 'rgba(43,181,204,0.5)' }}>
                                Step: ₹{getIncrement(bidAmount).toFixed(2)} CR
                                {bidAmount >= 5 ? ' (above 5 CR)' : ' (below 5 CR)'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setBidAmount(prev => Math.max(r2(prev - getIncrement(prev)), r2(currentBid + getIncrement(currentBid))))}
                                className="w-12 h-12 rounded-xl text-white font-bold text-xl transition-all"
                                style={{ background: 'rgba(14,77,94,0.3)', border: '1px solid rgba(43,181,204,0.2)' }}
                            >
                                −
                            </button>
                            <input
                                type="number"
                                step={inc}
                                min={r2(currentBid + getIncrement(currentBid))}
                                max={MAX_BID}
                                value={bidAmount}
                                onChange={(e) => {
                                    const v = Math.min(Number(e.target.value), MAX_BID);
                                    setBidAmount(r2(v));
                                }}
                                className="flex-1 px-4 py-3 rounded-xl text-white text-2xl font-bold text-center focus:outline-none"
                                style={{ background: 'rgba(14,77,94,0.2)', border: '1px solid rgba(43,181,204,0.2)', fontFamily: "'Cinzel', serif" }}
                            />
                            <button
                                onClick={() => setBidAmount(prev => Math.min(r2(prev + getIncrement(prev)), MAX_BID))}
                                className="w-12 h-12 rounded-xl text-white font-bold text-xl transition-all"
                                style={{ background: 'rgba(14,77,94,0.3)', border: '1px solid rgba(43,181,204,0.2)' }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Quick Increment Buttons */}
                    <div className="mb-6">
                        <label className="block text-sm mb-2" style={{ color: 'rgba(122,148,176,0.8)' }}>Quick Steps</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 5, 10].map(steps => {
                                let label = bidAmount;
                                for (let i = 0; i < steps; i++) label = r2(label + getIncrement(label));
                                label = Math.min(label, MAX_BID);
                                return (
                                    <button
                                        key={steps}
                                        onClick={() => handleQuickIncrement(steps)}
                                        className="px-3 py-3 rounded-xl font-bold text-xs transition-all"
                                        style={{ background: 'rgba(14,77,94,0.2)', border: '1px solid rgba(43,181,204,0.15)', color: '#7eeaf5' }}
                                    >
                                        → ₹{label.toFixed(2)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Max Bid Warning */}
                    {bidAmount >= MAX_BID && (
                        <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(14,77,94,0.25)', border: '1px solid rgba(43,181,204,0.3)' }}>
                            <div className="text-sm font-bold" style={{ color: '#7eeaf5' }}>
                                ⚠️ Maximum bid reached! Confirming will trigger Closed Bidding.
                            </div>
                        </div>
                    )}

                    {/* Place Bid Button */}
                    <button
                        onClick={handlePlaceBid}
                        disabled={!canPlaceBid || placing}
                        className="w-full py-4 rounded-xl font-bold text-lg transition-all"
                        style={{
                            background: canPlaceBid && !placing
                                ? bidAmount >= MAX_BID
                                    ? 'linear-gradient(135deg, #0e4d5e, #1a8a9e)'
                                    : 'linear-gradient(135deg, #1a6a52, #2dd4a0)'
                                : 'rgba(43,181,204,0.05)',
                            color: canPlaceBid && !placing ? '#fff' : 'rgba(122,148,176,0.4)',
                            cursor: !canPlaceBid || placing ? 'not-allowed' : 'pointer',
                            boxShadow: canPlaceBid && !placing ? '0 4px 20px rgba(43,181,204,0.2)' : 'none',
                            fontFamily: "'Cinzel', serif",
                        }}
                    >
                        {placing ? 'Placing...' : bidAmount >= MAX_BID ? '🔒 Trigger Closed Bidding (₹25 CR)' : `Place Bid — ₹${bidAmount.toFixed(2)} CR`}
                    </button>

                    {/* Manual Closed Bidding Trigger */}
                    <button
                        onClick={handleTriggerClosedBidding}
                        disabled={triggeringClosed}
                        className="w-full mt-2 py-3 rounded-xl font-bold text-sm transition-all"
                        style={{ background: 'rgba(14,77,94,0.15)', border: '1px solid rgba(43,181,204,0.2)', color: 'rgba(43,181,204,0.7)' }}
                    >
                        🔒 Force Closed Bidding
                    </button>

                    {/* Budget Warning */}
                    {selectedTeam && bidAmount > (selectedTeam as any).purseRemaining && (
                        <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(231,76,94,0.1)', border: '1px solid rgba(231,76,94,0.3)' }}>
                            <div className="text-sm" style={{ color: '#e74c5e' }}>
                                ⚠️ Insufficient budget! {selectedTeam.shortName} has only ₹{(selectedTeam as any).purseRemaining} CR left.
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
