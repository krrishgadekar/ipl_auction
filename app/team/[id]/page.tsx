// Team Dashboard Page
// Individual team view to monitor auction progress and squad

'use client';

import { use, useEffect, useState } from 'react';
import { AuctionState } from '@/lib/mockData/auctionState';
import { Team } from '@/lib/mockData/teams';
import { Player } from '@/lib/mockData/players';
import { getAuctionState, subscribeToAuctionUpdates } from '@/lib/api/auction';
import { getAllTeams } from '@/lib/api/teams';
import { getAllPlayers } from '@/lib/api/players';
import TeamHeader from '@/components/team/TeamHeader';
import MySquad from '@/components/team/MySquad';
import PowerCardStatus from '@/components/team/PowerCardStatus';
import PlayerCard from '@/components/PlayerCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TeamDashboard({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const teamId = Number(resolvedParams.id);

    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [state, teams, players] = await Promise.all([
                    getAuctionState(),
                    getAllTeams(),
                    getAllPlayers(),
                ]);

                setAuctionState(state);
                const foundTeam = teams.find(t => t.id === teamId);
                setTeam(foundTeam || null);
                setAllPlayers(players);
                setLoading(false);
            } catch (error) {
                console.error('Error loading team dashboard:', error);
                setLoading(false);
            }
        };

        loadData();

        const unsubscribe = subscribeToAuctionUpdates((newState) => {
            setAuctionState(newState);
        });

        const teamsInterval = setInterval(async () => {
            const teams = await getAllTeams();
            const foundTeam = teams.find(t => t.id === teamId);
            setTeam(foundTeam || null);
        }, 2000);

        return () => {
            unsubscribe();
            clearInterval(teamsInterval);
        };
    }, [teamId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
                <div className="text-2xl text-white font-bold">Loading Team Dashboard...</div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <div className="text-2xl text-white font-bold mb-2">Team Not Found</div>
                    <div className="text-white/60 mb-6">Team ID {teamId} does not exist</div>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Get purchased players for this team
    const purchasedPlayers = allPlayers.filter(p => team.players.includes(p.rank));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with Team Info */}
                <TeamHeader team={team} />

                {/* Status Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="font-bold text-red-400">LIVE AUCTION</span>
                            </div>
                            {auctionState && (
                                <>
                                    <div>
                                        <div className="text-white/60 text-sm">Status</div>
                                        <div className="text-lg font-bold text-white">{auctionState.status}</div>
                                    </div>
                                    {auctionState.currentBid > 0 && (
                                        <>
                                            <div className="w-px h-8 bg-white/20" />
                                            <div>
                                                <div className="text-white/60 text-sm">Current Bid</div>
                                                <div className="text-lg font-bold text-yellow-400">
                                                    ₹{auctionState.currentBid} CR
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Left Column - Current Auction */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Player Being Auctioned */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Current Auction</h2>
                            {auctionState?.currentPlayer ? (
                                <div>
                                    <PlayerCard player={auctionState.currentPlayer} currentBid={auctionState.currentBid} />
                                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                        <div className="text-sm text-yellow-400 text-center">
                                            💡 This is a read-only view. Only the auctioneer can place bids.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-white/60 py-12">
                                    <div className="text-4xl mb-2">⏳</div>
                                    <div>Waiting for auction to start...</div>
                                </div>
                            )}
                        </div>

                        {/* My Squad */}
                        <MySquad players={purchasedPlayers} budgetUsed={team.budgetUsed} />
                    </div>

                    {/* Right Column - Power Cards & Info */}
                    <div className="space-y-6">
                        <PowerCardStatus team={team} />

                        {/* Quick Stats */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="text-white/60">Players Owned</span>
                                    <span className="text-xl font-bold text-white">{team.squadCount}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="text-white/60">Budget Used</span>
                                    <span className="text-xl font-bold text-yellow-400">₹{team.budgetUsed} CR</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="text-white/60">Budget Left</span>
                                    <span className="text-xl font-bold text-green-400">₹{team.budgetRemaining} CR</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="text-white/60">Avg. Price/Player</span>
                                    <span className="text-xl font-bold text-cyan-400">
                                        {team.squadCount > 0 ? `₹${(team.budgetUsed / team.squadCount).toFixed(1)} CR` : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
