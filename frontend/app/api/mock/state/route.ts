// ═══════════════════════════════════════════════════════════════
// Mock Auction State API Route
// Stores auction state in-memory (shared across all browser tabs)
// Used as fallback when the real backend is unavailable
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { mockAuctionState } from '@/lib/mockData/auctionState';

// Use globalThis to persist state across hot reloads in dev mode
const g = globalThis as any;
if (!g.__mockAuctionState) {
    g.__mockAuctionState = { ...mockAuctionState };
}

export async function GET() {
    return NextResponse.json(g.__mockAuctionState);
}

export async function POST(req: Request) {
    const updates = await req.json();
    g.__mockAuctionState = { ...g.__mockAuctionState, ...updates };
    return NextResponse.json(g.__mockAuctionState);
}
