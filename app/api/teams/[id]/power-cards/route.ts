import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { PowerCard } from '@/lib/db/schema';

// GET /api/teams/[id]/power-cards - Get team power cards
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const teamId = parseInt(params.id);

        const powerCards = db.prepare(`
      SELECT * FROM power_cards
      WHERE team_id = ?
      ORDER BY price DESC
    `).all(teamId) as PowerCard[];

        return NextResponse.json(powerCards);
    } catch (error) {
        console.error('Error fetching power cards:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/teams/[id]/power-cards/use - Use a power card (admin only)
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const teamId = parseInt(params.id);
        const { cardType, playerId, effectData } = await request.json();

        // Get power card
        const card = db.prepare(`
      SELECT * FROM power_cards
      WHERE team_id = ? AND card_type = ?
    `).get(teamId, cardType) as PowerCard;

        if (!card) {
            return NextResponse.json(
                { error: 'Power card not found' },
                { status: 404 }
            );
        }

        if (card.used) {
            return NextResponse.json(
                { error: 'Power card already used' },
                { status: 400 }
            );
        }

        // Get team
        const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId) as any;

        if (team.budget_remaining < card.price) {
            return NextResponse.json(
                { error: 'Insufficient budget for power card' },
                { status: 400 }
            );
        }

        // Mark card as used and deduct budget
        const transaction = db.transaction(() => {
            db.prepare(`
        UPDATE power_cards
        SET used = 1, used_at = datetime('now'), used_on_player_id = ?, effect_data = ?
        WHERE id = ?
      `).run(playerId, effectData ? JSON.stringify(effectData) : null, card.id);

            db.prepare(`
        UPDATE teams
        SET budget_remaining = budget_remaining - ?,
            budget_spent = budget_spent + ?
        WHERE id = ?
      `).run(card.price, card.price, teamId);
        });

        transaction();

        const updatedCard = db.prepare('SELECT * FROM power_cards WHERE id = ?').get(card.id);

        return NextResponse.json({
            success: true,
            card: updatedCard,
            message: `${card.card_name} activated!`,
        });
    } catch (error) {
        console.error('Error using power card:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
