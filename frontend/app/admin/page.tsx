// Admin Panel
// Main auctioneer control dashboard

'use client';

import { useEffect, useState } from 'react';
import { AuctionState } from '@/lib/mockData/auctionState';
import { Team } from '@/lib/mockData/teams';
import { getAuctionState, subscribeToAuctionUpdates, updateMockState } from '@/lib/api/auction';
import { AUCTIONABLE_POWER_CARDS } from '@/lib/mockData/powercards';
import { getAllTeams } from '@/lib/api/teams';
import { getAllPlayers } from '@/lib/api/players';
import CurrentPlayerPreview from '@/components/admin/CurrentPlayerPreview';
import AdminDashboardControls from '@/components/admin/AdminDashboardControls';
import TeamBudgets from '@/components/admin/TeamBudgets';
import AuctionTimer from '@/components/AuctionTimer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function AdminPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [totalPlayers, setTotalPlayers] = useState(8);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [auctionMode, setAuctionMode] = useState<'LIVE' | 'POWER_CARD_PHASE'>('LIVE');
    const [selectedCard, setSelectedCard] = useState(AUCTIONABLE_POWER_CARDS[0].id);
    const [toggling, setToggling] = useState(false);

    const handleModeToggle = async (mode: 'LIVE' | 'POWER_CARD_PHASE') => {
        setToggling(true);
        try {
            await updateMockState({
                phase: mode,
                active_power_card: mode === 'POWER_CARD_PHASE' ? selectedCard : undefined,
                current_bid: mode === 'POWER_CARD_PHASE' ? 0 : undefined,
                highest_bidder_id: mode === 'POWER_CARD_PHASE' ? undefined : undefined,
            });
            setAuctionMode(mode);
        } catch (err) {
            console.error('Failed to toggle mode:', err);
        }
        setToggling(false);
    };

    const handleCardChange = async (cardId: string) => {
        setSelectedCard(cardId);
        if (auctionMode === 'POWER_CARD_PHASE') {
            try {
                await updateMockState({ active_power_card: cardId, current_bid: 0, highest_bidder_id: undefined });
            } catch {}
        }
    };
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const auth = localStorage.getItem('ipl_admin_auth');
            if (auth === 'true') {
                setIsAuth(true);
            } else {
                router.push('/admin/login');
            }
        }
    }, [router]);

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            try {
                const [state, teamsData, playersData] = await Promise.all([
                    getAuctionState(),
                    getAllTeams(),
                    getAllPlayers(),
                ]);
                setAuctionState(state);
                setTeams(teamsData as any);
                setTotalPlayers(playersData.length);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToAuctionUpdates((newState) => {
            setAuctionState(newState);
        });

        // Refresh teams data periodically
        const teamsInterval = setInterval(async () => {
            const teamsData = await getAllTeams();
            setTeams(teamsData as any);
        }, 2000);

        return () => {
            unsubscribe();
            clearInterval(teamsInterval);
        };
    }, []);

    if (!isAuth) return null;

    if (loading || !auctionState) return <Loader text="LOADING ADMIN" />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                IPL AUCTION 2026
                            </h1>
                            <p className="text-white/70">Admin Control Panel</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="font-bold text-red-400">LIVE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── AUCTION MODE TOGGLE ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-gradient-to-r from-purple-950/40 to-blue-950/40 backdrop-blur-sm rounded-2xl border border-purple-500/20"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white/50 uppercase tracking-widest">Auction Mode</div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleModeToggle('LIVE')}
                                disabled={toggling}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                                    auctionMode === 'LIVE'
                                        ? 'bg-green-500/25 text-green-400 border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                                        : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                                }`}
                            >
                                🏏 Main Auction
                            </button>
                            <button
                                onClick={() => handleModeToggle('POWER_CARD_PHASE')}
                                disabled={toggling}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                                    auctionMode === 'POWER_CARD_PHASE'
                                        ? 'bg-purple-500/25 text-purple-400 border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                                        : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                                }`}
                            >
                                ⚡ Power Card Auction
                            </button>
                            {auctionMode === 'POWER_CARD_PHASE' && (
                                <select
                                    value={selectedCard}
                                    onChange={(e) => handleCardChange(e.target.value)}
                                    className="bg-purple-950/50 border border-purple-500/30 rounded-lg px-3 py-2.5 text-purple-300 text-sm font-bold focus:outline-none"
                                >
                                    {AUCTIONABLE_POWER_CARDS.map(c => (
                                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Status Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-white/60 text-sm">Auction Day</div>
                                <div className="text-lg font-bold text-white">{auctionState.auctionDay}</div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Status</div>
                                <div className="text-lg font-bold text-cyan-400">{auctionState.status}</div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Player Status</div>
                                <div className="text-lg font-bold text-white">{auctionState.playerStatus}</div>
                            </div>
                        </div>

                        {auctionState.timerActive && (
                            <div className="flex flex-col items-end">
                                <div className="text-white/60 text-xs mb-1">Time Remaining</div>
                                <AuctionTimer
                                    seconds={auctionState.timerSeconds}
                                    isActive={auctionState.timerActive}
                                    size="md"
                                />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Admin Master Controls */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6"
                >
                    <AdminDashboardControls teams={teams} state={auctionState} />
                </motion.div>

                {/* Current Player Preview (full width) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <CurrentPlayerPreview player={auctionState.currentPlayer} />
                </motion.div>

                {/* Team Budgets */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <TeamBudgets teams={teams} />
                </motion.div>
            </div>
        </div>
    );
}
