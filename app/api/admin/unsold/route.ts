import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// POST /api/admin/unsold - Mark player as unsold
export async function POST(request: NextRequest) {
    try {
        const { auctionId, playerId } = await request.json();

        if (!auctionId || !playerId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Mark player as unsold
        const playerStmt = db.prepare(`
      UPDATE players
      SET is_unsold = 1
      WHERE id = ?
    `);

        playerStmt.run(playerId);

        // Update auction state
        const auctionStmt = db.prepare(`
      UPDATE auctions
      SET auction_state = 'unsold',
          current_bid_amount = 0,
          current_bidding_team_id = NULL,
          updated_at = datetime('now')
      WHERE id = ?
    `);

        auctionStmt.run(auctionId);

        // Log to audit
        const auditStmt = db.prepare(`
      INSERT INTO audit_logs (auction_id, action, user_role, entity_type, entity_id, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        auditStmt.run(
            auctionId,
            'player_unsold',
            'admin_operator',
            'player',
            playerId,
            JSON.stringify({ playerId })
        );

        return NextResponse.json({
            success: true,
            message: 'Player marked as unsold',
        });
    } catch (error) {
        console.error('Error marking player unsold:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
