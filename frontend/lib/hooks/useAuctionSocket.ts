// ═══════════════════════════════════════════════════════════════
// Frontend — Socket.IO Client Hook
// Real-time connection to backend for live auction updates
// ═══════════════════════════════════════════════════════════════
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type AuctionEvent =
    | 'STATE_SYNC'
    | 'TEAM_STATE_SYNC'
    | 'PHASE_CHANGED'
    | 'DAY_CHANGED'
    | 'FRANCHISE_ASSIGNED'
    | 'SEQUENCE_SELECTED'
    | 'PLAYER_ANNOUNCED'
    | 'ITEM_ANNOUNCED'
    | 'RIDDLE_UNVEILED'
    | 'BID_UPDATED'
    | 'CLOSED_BIDDING_TRIGGERED'
    | 'PLAYER_SOLD'
    | 'PLAYER_UNSOLD'
    | 'PURSE_UPDATED'
    | 'POWER_CARD_USED'
    | 'PLAYER_RESET'
    | 'TEAM_FROZEN'
    | 'RTM_USED'
    | 'SEALED_BIDS_RESOLVED'
    | 'AUCTION_FINISHED'
    | 'LINEUP_LOCKED'
    | 'ERROR';

/** Hook to connect to the auction WebSocket */
export function useAuctionSocket() {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = io(API_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: Infinity,
        });

        socket.on('connect', () => {
            setConnected(true);
            // Request full state on connect/reconnect
            socket.emit('REQUEST_STATE');
        });

        socket.on('disconnect', () => setConnected(false));

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    /** Subscribe to an event */
    const on = useCallback((event: AuctionEvent, handler: (data: any) => void) => {
        socketRef.current?.on(event, handler);
        return () => { socketRef.current?.off(event, handler); };
    }, []);

    /** Send an event (only REQUEST_STATE and REQUEST_TEAM_STATE) */
    const emit = useCallback((event: string, data?: any) => {
        socketRef.current?.emit(event, data);
    }, []);

    /** Request full state sync */
    const requestState = useCallback(() => {
        socketRef.current?.emit('REQUEST_STATE');
    }, []);

    /** Request team-specific state */
    const requestTeamState = useCallback((teamId: string) => {
        socketRef.current?.emit('REQUEST_TEAM_STATE', { teamId });
    }, []);

    return { connected, on, emit, requestState, requestTeamState };
}
