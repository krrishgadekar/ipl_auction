import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Team } from '@/lib/db/schema';

// POST /api/admin/sold - Assign player to team (admin operator only)
export async function POST(request: NextRequest) {
    try {
        const { auctionId, playerId, playerRank, teamId, finalAmount } = await request.json();

        // Validate required fields
        if (!auctionId || !playerId || !teamId || !finalAmount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Start transaction
        const transaction = db.transaction(() => {
            // Get team
            const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId) as Team;

            if (!team) {
                throw new Error('Team not found');
            }

            // Check budget
            if (finalAmount > team.budget_remaining) {
                throw new Error('Insufficient budget');
            }

            // Insert into squad_players
            const squadStmt = db.prepare(`
        INSERT INTO squad_players (team_id, player_id, player_rank, purchase_price)
        VALUES (?, ?, ?, ?)
      `);

            const squadResult = squadStmt.run(teamId, playerId, playerRank, finalAmount);

            // Update team budget and squad count
            const teamStmt = db.prepare(`
        UPDATE teams
        SET budget_remaining = budget_remaining - ?,
            budget_spent = budget_spent + ?,
            squad_count = squad_count + 1,
            updated_at = datetime('now')
        WHERE id = ?
      `);

            teamStmt.run(finalAmount, finalAmount, teamId);

            // Update auction state
            const auctionStmt = db.prepare(`
        UPDATE auctions
        SET auction_state = 'sold',
            current_bid_amount = 0,
            current_bidding_team_id = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `);

            auctionStmt.run(auctionId);

            // Mark player as sold (not unsold)
            const playerStmt = db.prepare(`
        UPDATE players
        SET is_unsold = 0
        WHERE id = ?
      `);

            playerStmt.run(playerId);

            // Create undo action
            const undoStmt = db.prepare(`
        INSERT INTO undo_actions (auction_id, action_type, reverse_action, data_snapshot)
        VALUES (?, ?, ?, ?)
      `);

            const undoData = {
                squadPlayerId: squadResult.lastInsertRowid,
                teamId,
                playerId,
                amount: finalAmount,
            };

            undoStmt.run(
                auctionId,
                'player_sold',
                'DELETE FROM squad_players WHERE id = ?; UPDATE teams SET budget_remaining = budget_remaining + ?, budget_spent = budget_spent - ?, squad_count = squad_count - 1 WHERE id = ?',
                JSON.stringify(undoData)
            );

            // Log to audit
            const auditStmt = db.prepare(`
        INSERT INTO audit_logs (auction_id, action, user_role, entity_type, entity_id, data)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

            auditStmt.run(
                auctionId,
                'player_sold',
                'admin_operator',
                'squad_player',
                squadResult.lastInsertRowid,
                JSON.stringify({ playerId, teamId, finalAmount })
            );

            // Get updated team
            return db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId);
        });

        const updatedTeam = transaction();

        return NextResponse.json({
            success: true,
            updatedTeam,
            message: 'Player assigned successfully',
        });
    } catch (error) {
        console.error('Error assigning player:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Internal server error' },
            { status: 500 }
        );
    }
}
