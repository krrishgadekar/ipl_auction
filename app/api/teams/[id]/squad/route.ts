import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { SquadPlayer } from '@/lib/db/schema';

// GET /api/teams/[id]/squad - Get team squad
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const teamId = parseInt(params.id);

        const squad = db.prepare(`
      SELECT 
        sp.*,
        p.name, p.team, p.role, p.category, p.pool, p.rating, p.grade, p.legacy
      FROM squad_players sp
      LEFT JOIN players p ON sp.player_id = p.id
      WHERE sp.team_id = ?
      ORDER BY sp.purchase_price DESC
    `).all(teamId);

        // Transform data to include player info
        const squadWithPlayers = squad.map((row: any) => ({
            id: row.id,
            team_id: row.team_id,
            player_id: row.player_id,
            player_rank: row.player_rank,
            purchase_price: row.purchase_price,
            purchased_at: row.purchased_at,
            is_final_xi: row.is_final_xi,
            is_captain: row.is_captain,
            is_vice_captain: row.is_vice_captain,
            player: row.name ? {
                id: row.player_id,
                rank: row.player_rank,
                name: row.name,
                team: row.team,
                role: row.role,
                category: row.category,
                pool: row.pool,
                rating: row.rating,
                grade: row.grade,
                legacy: row.legacy,
            } : null,
        }));

        return NextResponse.json(squadWithPlayers);
    } catch (error) {
        console.error('Error fetching squad:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
