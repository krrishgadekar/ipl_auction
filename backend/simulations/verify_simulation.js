import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    const soldCount = await prisma.auctionPlayer.count({
        where: { status: 'SOLD' }
    });
    console.log(`Total players sold: ${soldCount}`);

    const teamPlayersCount = await prisma.teamPlayer.count();
    console.log(`Total team_player entries: ${teamPlayersCount}`);

    const teams = await prisma.team.findMany({
        include: { _count: { select: { team_players: true } } }
    });

    teams.forEach(t => {
        console.log(`${t.name}: ${t._count.team_players} players`);
    });
}

verify().catch(console.error).finally(() => prisma.$disconnect());
