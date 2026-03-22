import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000/api/admin/auction/sell';

async function simulate() {
    const bravo = await prisma.team.findFirst({ where: { name: 'Team Bravo' } });
    if (!bravo) return console.log('Team Bravo not found.');

    const player = await prisma.player.findFirst({
        where: { name: 'Virat Kohli' }
    });
    if (!player) return console.log('Virat Kohli not found.');

    console.log(`Simulating API sale of ${player.name} to Team Bravo...`);

    // Set auction state to LIVE and set current player
    await prisma.auctionState.update({
        where: { id: 1 },
        data: { phase: 'LIVE', current_player_id: player.id }
    });

    const body = {
        playerId: player.id,
        teamId: bravo.id,
        pricePaid: 11.25
    };

    const token = Buffer.from('admin:your_admin_password_here').toString('base64');
    
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log('API Response:', data);
}

simulate().catch(console.error).finally(() => prisma.$disconnect());
