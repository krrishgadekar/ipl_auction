import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Team } from '@/lib/db/schema';

// GET /api/auction/[id]/teams - Get all teams for auction
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auctionId = parseInt(params.id);

        const teams = db.prepare(`
      SELECT * FROM teams 
      WHERE auction_id = ?
      ORDER BY budget_spent DESC, final_rating DESC
    `).all(auctionId) as Team[];

        return NextResponse.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/auction/[id]/teams - Create team (admin only)
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auctionId = parseInt(params.id);
        const { name, franchise } = await request.json();

        if (!name || !franchise) {
            return NextResponse.json(
                { error: 'Name and franchise are required' },
                { status: 400 }
            );
        }

        const stmt = db.prepare(`
      INSERT INTO teams (auction_id, name, franchise, budget_total, budget_remaining)
      VALUES (?, ?, ?, 100, 100)
    `);

        const result = stmt.run(auctionId, name, franchise);

        const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(result.lastInsertRowid);

        // Create power cards for team
        const powerCardStmt = db.prepare(`
      INSERT INTO power_cards (team_id, card_type, card_name, price)
      VALUES (?, ?, ?, ?)
    `);

        const powerCards = [
            { type: 'final_strike', name: 'Final Strike', price: 7 },
            { type: 'bid_freezer', name: 'Bid Freezer', price: 5 },
            { type: 'gods_eye', name: "God's Eye", price: 4 },
            { type: 'mulligan', name: 'Mulligan', price: 3 },
        ];

        for (const card of powerCards) {
            powerCardStmt.run(result.lastInsertRowid, card.type, card.name, card.price);
        }

        return NextResponse.json(team, { status: 201 });
    } catch (error) {
        console.error('Error creating team:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
