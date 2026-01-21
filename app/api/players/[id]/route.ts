import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Player } from '@/lib/db/schema';

// GET /api/players/[id] - Get player by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const playerId = parseInt(params.id);

        const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId) as Player;

        if (!player) {
            return NextResponse.json(
                { error: 'Player not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(player);
    } catch (error) {
        console.error('Error fetching player:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
