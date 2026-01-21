import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateBid } from '@/lib/validation';
import { Team, Bid } from '@/lib/db/schema';

// POST /api/admin/bid - Place a bid (admin operator only)
export async function POST(request: NextRequest) {
    try {
        const { auctionId, playerId, playerRank, teamId, amount, bidType = 'open' } = await request.json();

        // Validate required fields
        if (!auctionId || !playerId || !teamId || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get team
        const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId) as Team;

        if (!team) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }

        // Get current bid
        const currentBidResult = db.prepare(`
      SELECT MAX(amount) as current_bid 
      FROM bids 
      WHERE auction_id = ? AND player_id = ?
    `).get(auctionId, playerId) as { current_bid: number };

        const currentBid = currentBidResult?.current_bid || 0;

        // Validate bid
        const increment = amount - currentBid;
        const validation = validateBid(team, amount, currentBid, increment);

        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Insert bid
        const bidStmt = db.prepare(`
      INSERT INTO bids (auction_id, player_id, player_rank, team_id, amount, bid_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const result = bidStmt.run(auctionId, playerId, playerRank, teamId, amount, bidType);

        // Update auction current bid
        const auctionStmt = db.prepare(`
      UPDATE auctions
      SET current_bid_amount = ?, current_bidding_team_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

        auctionStmt.run(amount, teamId, auctionId);

        // Log to audit
        const auditStmt = db.prepare(`
      INSERT INTO audit_logs (auction_id, action, user_role, entity_type, entity_id, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        auditStmt.run(
            auctionId,
            'bid_placed',
            'admin_operator',
            'bid',
            result.lastInsertRowid,
            JSON.stringify({ playerId, teamId, amount, bidType })
        );

        const bid = db.prepare('SELECT * FROM bids WHERE id = ?').get(result.lastInsertRowid) as Bid;

        return NextResponse.json({
            success: true,
            bid,
            teamBudgetRemaining: team.budget_remaining,
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
