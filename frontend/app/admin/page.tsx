// Admin Panel
// Main auctioneer control dashboard

'use client';

import { useEffect, useState } from 'react';
import { type AuctionStatus, type PlayerStatus, type AuctionDay, getAuctionState, subscribeToAuctionUpdates, updateAuctionPhase, type AuctionState } from '@/lib/api/auction';
import { type Team, getAllTeams } from '@/lib/api/teams';
import { type Player, getAllPlayers } from '@/lib/api/players';
import AdminDashboardControls from '@/components/admin/AdminDashboardControls';
import AuctionTimer from '@/components/AuctionTimer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function AdminPage() {
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [totalPlayers, setTotalPlayers] = useState(8);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [updatingPhase, setUpdatingPhase] = useState(false);

    const handlePhaseChange = async (phase: string) => {
        setUpdatingPhase(true);
        try {
            await updateAuctionPhase(phase);
        } catch (err) {
            console.error('Failed to update phase:', err);
        }
        setUpdatingPhase(false);
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
                setAllPlayers(playersData);
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
                                <div className="text-lg font-bold text-white flex items-center gap-2">
                                    {auctionState.playerStatus}
                                    {auctionState.currentPlayer?.isRiddle && (
                                        <motion.span 
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold tracking-tighter"
                                        >
                                            RIDDLE
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div>
                                <div className="text-white/60 text-sm">Auction Phase</div>
                                <div className="text-lg font-bold text-purple-400 capitalize">
                                    {auctionState.phase.replace('_', ' ').toLowerCase()}
                                </div>
                            </div>
                        </div>

                        {auctionState.timerActive && (
                            <div className="flex flex-col items-end">
                                <div className="text-white/60 text-xs mb-1">Time Remaining</div>
                                <AuctionTimer
                                    seconds={auctionState.timerSeconds || 0}
                                    isActive={auctionState.timerActive || false}
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
                >
                    <AdminDashboardControls 
                        teams={teams} 
                        state={auctionState as any} 
                        allPlayers={allPlayers}
                    />
                </motion.div>
            </div>
        </div>
    );
}
