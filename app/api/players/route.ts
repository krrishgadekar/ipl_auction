import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Player, calculateGrade } from '@/lib/db/schema';

// GET /api/players - Get all players
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pool = searchParams.get('pool');
        const grade = searchParams.get('grade');
        const unsold = searchParams.get('unsold');

        let query = 'SELECT * FROM players WHERE 1=1';
        const params: any[] = [];

        if (pool) {
            query += ' AND pool = ?';
            params.push(pool);
        }

        if (grade) {
            query += ' AND grade = ?';
            params.push(grade);
        }

        if (unsold !== null) {
            query += ' AND is_unsold = ?';
            params.push(unsold === 'true' ? 1 : 0);
        }

        query += ' ORDER BY rank ASC';

        const players = db.prepare(query).all(...params) as Player[];

        return NextResponse.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/players - Bulk import players from CSV (admin only)
export async function POST(request: NextRequest) {
    try {
        const { players } = await request.json();

        if (!Array.isArray(players) || players.length === 0) {
            return NextResponse.json(
                { error: 'Players array is required' },
                { status: 400 }
            );
        }

        const stmt = db.prepare(`
      INSERT INTO players (
        rank, name, team, role, category, pool, rating, grade, legacy,
        profile_url, sub_experience,
        sub_scoring, sub_impact, sub_consistency,
        sub_wicket_taking, sub_economy, sub_efficiency,
        sub_batting, sub_bowling, sub_versatility,
        base_price
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?
      )
    `);

        const insertMany = db.transaction((playerList: any[]) => {
            for (const player of playerList) {
                const grade = calculateGrade(player.rating);

                stmt.run(
                    player.rank,
                    player.name,
                    player.team,
                    player.role,
                    player.category,
                    player.pool,
                    player.rating,
                    grade,
                    player.legacy || 0,
                    player.profile_url || '',
                    player.sub_experience || 0,
                    player.sub_scoring || null,
                    player.sub_impact || null,
                    player.sub_consistency || null,
                    player.sub_wicket_taking || null,
                    player.sub_economy || null,
                    player.sub_efficiency || null,
                    player.sub_batting || null,
                    player.sub_bowling || null,
                    player.sub_versatility || null,
                    player.base_price || 0.5
                );
            }
        });

        insertMany(players);

        return NextResponse.json({
            message: `Successfully imported ${players.length} players`,
            count: players.length,
        });
    } catch (error) {
        console.error('Error importing players:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
