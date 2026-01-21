import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Auction } from '@/lib/db/schema';

// GET /api/auction/[id] - Get auction by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auctionId = parseInt(params.id);

        const auction = db.prepare(`
      SELECT * FROM auctions WHERE id = ?
    `).get(auctionId) as Auction;

        if (!auction) {
            return NextResponse.json(
                { error: 'Auction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(auction);
    } catch (error) {
        console.error('Error fetching auction:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/auction/[id] - Update auction (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auctionId = parseInt(params.id);
        const body = await request.json();

        // In production, verify role from session/auth token
        // For now, we'll allow updates

        const { status, auction_state, current_player_id, current_bid_amount, timer_seconds } = body;

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (status) {
            updateFields.push('status = ?');
            updateValues.push(status);
        }

        if (auction_state) {
            updateFields.push('auction_state = ?');
            updateValues.push(auction_state);
        }

        if (current_player_id !== undefined) {
            updateFields.push('current_player_id = ?');
            updateValues.push(current_player_id);
        }

        if (current_bid_amount !== undefined) {
            updateFields.push('current_bid_amount = ?');
            updateValues.push(current_bid_amount);
        }

        if (timer_seconds !== undefined) {
            updateFields.push('timer_seconds = ?');
            updateValues.push(timer_seconds);
        }

        updateFields.push('updated_at = datetime("now")');
        updateValues.push(auctionId);

        const stmt = db.prepare(`
      UPDATE auctions
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);

        stmt.run(...updateValues);

        const updated = db.prepare('SELECT * FROM auctions WHERE id = ?').get(auctionId);

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating auction:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
