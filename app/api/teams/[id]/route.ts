import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Team, SquadPlayer } from '@/lib/db/schema';

// GET /api/teams/[id] - Get team by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const teamId = parseInt(params.id);

        const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId) as Team;

        if (!team) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/teams/[id] - Update team (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const teamId = parseInt(params.id);
        const body = await request.json();

        const { budget_remaining, rtm_used, final_xi_locked, captain_player_id, vice_captain_player_id } = body;

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (budget_remaining !== undefined) {
            updateFields.push('budget_remaining = ?');
            updateValues.push(budget_remaining);
        }

        if (rtm_used !== undefined) {
            updateFields.push('rtm_used = ?');
            updateValues.push(rtm_used ? 1 : 0);
        }

        if (final_xi_locked !== undefined) {
            updateFields.push('final_xi_locked = ?');
            updateValues.push(final_xi_locked ? 1 : 0);
        }

        if (captain_player_id !== undefined) {
            updateFields.push('captain_player_id = ?');
            updateValues.push(captain_player_id);
        }

        if (vice_captain_player_id !== undefined) {
            updateFields.push('vice_captain_player_id = ?');
            updateValues.push(vice_captain_player_id);
        }

        updateFields.push('updated_at = datetime("now")');
        updateValues.push(teamId);

        const stmt = db.prepare(`
      UPDATE teams
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);

        stmt.run(...updateValues);

        const updated = db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId);

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating team:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
