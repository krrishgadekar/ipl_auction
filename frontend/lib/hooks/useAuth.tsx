// ═══════════════════════════════════════════════════════════════
// Auth Context — Team session management with localStorage
// Provides login/logout + auth state across the app
// ═══════════════════════════════════════════════════════════════

'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { loginTeam as apiLogin, LoginResponse } from '@/lib/api/auth';

interface AuthState {
    isAuthenticated: boolean;
    teamId: string | null;
    teamName: string | null;
    sessionId: string | null;
    brandKey: string | null;
    franchiseName: string | null;
    loading: boolean;
}

interface AuthContextValue extends AuthState {
    login: (username: string, password: string, force?: boolean) => Promise<LoginResponse>;
    logout: () => void;
}

const STORAGE_KEY = 'ipl_auction_auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        teamId: null,
        teamName: null,
        sessionId: null,
        brandKey: null,
        franchiseName: null,
        loading: true,
    });

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setState({
                    isAuthenticated: true,
                    teamId: parsed.teamId,
                    teamName: parsed.teamName,
                    sessionId: parsed.sessionId,
                    brandKey: parsed.brandKey,
                    franchiseName: parsed.franchiseName,
                    loading: false,
                });
            } else {
                setState(prev => ({ ...prev, loading: false }));
            }
        } catch {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    const login = useCallback(async (username: string, password: string, force?: boolean) => {
        const result = await apiLogin(username, password, force);

        const authData = {
            teamId: result.teamId,
            teamName: result.teamName,
            sessionId: result.sessionId,
            brandKey: result.brandKey,
            franchiseName: result.franchiseName,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

        setState({
            isAuthenticated: true,
            ...authData,
            loading: false,
        });

        return result;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setState({
            isAuthenticated: false,
            teamId: null,
            teamName: null,
            sessionId: null,
            brandKey: null,
            franchiseName: null,
            loading: false,
        });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
