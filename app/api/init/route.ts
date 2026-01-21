import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// POST /api/init - Initialize sample data for testing
export async function POST(request: NextRequest) {
    try {
        const { day = 1 } = await request.json();

        // Create auction
        const auctionStmt = db.prepare(`
      INSERT INTO auctions (day, status, auction_state)
      VALUES (?, 'idle', 'idle')
    `);

        const auctionResult = auctionStmt.run(day);
        const auctionId = auctionResult.lastInsertRowid as number;

        // Create sample teams
        const teams = [
            { name: 'Mumbai Mavericks', franchise: 'Mumbai Indians' },
            { name: 'Chennai Champions', franchise: 'Chennai Super Kings' },
            { name: 'Kolkata Knights', franchise: 'Kolkata Knight Riders' },
            { name: 'Bangalore Bulls', franchise: 'Royal Challengers Bangalore' },
            { name: 'Delhi Dragons', franchise: 'Delhi Capitals' },
            { name: 'Punjab Panthers', franchise: 'Punjab Kings' },
        ];

        const teamStmt = db.prepare(`
      INSERT INTO teams (auction_id, name, franchise, budget_total, budget_remaining)
      VALUES (?, ?, ?, 100, 100)
    `);

        const powerCardStmt = db.prepare(`
      INSERT INTO power_cards (team_id, card_type, card_name, price)
      VALUES (?, ?, ?, ?)
    `);

        for (const team of teams) {
            const teamResult = teamStmt.run(auctionId, team.name, team.franchise);
            const teamId = teamResult.lastInsertRowid;

            // Create power cards
            powerCardStmt.run(teamId, 'final_strike', 'Final Strike', 7);
            powerCardStmt.run(teamId, 'bid_freezer', 'Bid Freezer', 5);
            powerCardStmt.run(teamId, 'gods_eye', "God's Eye", 4);
            powerCardStmt.run(teamId, 'mulligan', 'Mulligan', 3);
        }

        // Create sample players
        const samplePlayers = [
            {
                rank: 1,
                name: 'Virat Kohli',
                team: 'Royal Challengers Bangalore',
                role: 'Batsman',
                category: 'Batsmen',
                pool: 'BAT_WK',
                rating: 95,
                legacy: 10,
                sub_experience: 95,
                sub_scoring: 98,
                sub_impact: 96,
                sub_consistency: 92,
                base_price: 2,
            },
            {
                rank: 2,
                name: 'Rohit Sharma',
                team: 'Mumbai Indians',
                role: 'Batsman',
                category: 'Batsmen',
                pool: 'BAT_WK',
                rating: 94,
                legacy: 9,
                sub_experience: 94,
                sub_scoring: 95,
                sub_impact: 94,
                sub_consistency: 93,
                base_price: 2,
            },
            {
                rank: 3,
                name: 'Jasprit Bumrah',
                team: 'Mumbai Indians',
                role: 'Fast Bowler',
                category: 'Bowlers',
                pool: 'BOWL',
                rating: 96,
                legacy: 8,
                sub_experience: 85,
                sub_wicket_taking: 97,
                sub_economy: 95,
                sub_efficiency: 96,
                base_price: 2,
            },
            {
                rank: 4,
                name: 'Hardik Pandya',
                team: 'Mumbai Indians',
                role: 'All-Rounder',
                category: 'All-rounders',
                pool: 'AR',
                rating: 92,
                legacy: 7,
                sub_experience: 82,
                sub_batting: 88,
                sub_bowling: 85,
                sub_versatility: 85,
                base_price: 1.5,
            },
            {
                rank: 5,
                name: 'Rashid Khan',
                team: 'Gujarat Titans',
                role: 'Spinner',
                category: 'Bowlers',
                pool: 'BOWL',
                rating: 93,
                legacy: 7,
                sub_experience: 80,
                sub_wicket_taking: 94,
                sub_economy: 96,
                sub_efficiency: 92,
                base_price: 1.5,
            },
        ];

        const playerStmt = db.prepare(`
      INSERT INTO players (
        rank, name, team, role, category, pool, rating, grade, legacy, profile_url,
        sub_experience, sub_scoring, sub_impact, sub_consistency,
        sub_wicket_taking, sub_economy, sub_efficiency,
        sub_batting, sub_bowling, sub_versatility, base_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        for (const player of samplePlayers) {
            const grade = player.rating >= 85 ? 'A' : player.rating >= 70 ? 'B' : player.rating >= 55 ? 'C' : 'D';

            playerStmt.run(
                player.rank,
                player.name,
                player.team,
                player.role,
                player.category,
                player.pool,
                player.rating,
                grade,
                player.legacy,
                '',
                player.sub_experience,
                player.pool === 'BAT_WK' ? player.sub_scoring : null,
                player.pool === 'BAT_WK' ? player.sub_impact : null,
                player.pool === 'BAT_WK' ? player.sub_consistency : null,
                player.pool === 'BOWL' ? player.sub_wicket_taking : null,
                player.pool === 'BOWL' ? player.sub_economy : null,
                player.pool === 'BOWL' ? player.sub_efficiency : null,
                player.pool === 'AR' ? player.sub_batting : null,
                player.pool === 'AR' ? player.sub_bowling : null,
                player.pool === 'AR' ? player.sub_versatility : null,
                player.base_price
            );
        }

        // Set first player as current
        db.prepare(`
      UPDATE auctions
      SET current_player_id = (SELECT id FROM players WHERE rank = 1),
          current_player_rank = 1
      WHERE id = ?
    `).run(auctionId);

        return NextResponse.json({
            success: true,
            message: 'Sample data initialized successfully',
            auctionId,
            teamsCreated: teams.length,
            playersCreated: samplePlayers.length,
        });
    } catch (error) {
        console.error('Error initializing data:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
