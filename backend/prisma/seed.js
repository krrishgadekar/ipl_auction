import prisma from '../src/config/db.js';

async function main() {
    console.log('Seeding database...');

    // 1. Initial Auction State
    await prisma.auctionState.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            auction_status: 'NOT_STARTED'
        }
    });

    // 2. Teams
    const teams = [
        { name: 'Mumbai Indians', brandKey: 'MI', purseRemaining: 800000000 },
        { name: 'Chennai Super Kings', brandKey: 'CSK', purseRemaining: 800000000 },
        { name: 'Royal Challengers Bangalore', brandKey: 'RCB', purseRemaining: 800000000 }
    ];

    for (const team of teams) {
        await prisma.team.upsert({
            where: { brandKey: team.brandKey },
            update: team,
            create: team
        });
    }

    // 3. Players
    const players = [
        { name: 'Virat Kohli', category: 'BAT', grade: 'A', rating: 9.5, nationality: 'IN', basePrice: 20000000 },
        { name: 'MS Dhoni', category: 'WK', grade: 'A', rating: 9.0, nationality: 'IN', basePrice: 20000000 },
        { name: 'Glenn Maxwell', category: 'AR', grade: 'A', rating: 8.5, nationality: 'OS', basePrice: 15000000 },
        { name: 'Jasprit Bumrah', category: 'BOWL', grade: 'A', rating: 9.8, nationality: 'IN', basePrice: 20000000 }
    ];

    for (const player of players) {
        const createdPlayer = await prisma.player.create({
            data: player
        });

        // Add to AuctionPlayer list
        await prisma.auctionPlayer.create({
            data: {
                playerId: createdPlayer.id,
                status: 'UNSOLD'
            }
        });
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
