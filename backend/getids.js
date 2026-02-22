import prisma from './src/config/db.js';

async function getIds() {
    const team = await prisma.team.findFirst();
    const player = await prisma.player.findFirst();
    console.log(`TEAM_ID=${team.id}`);
    console.log(`PLAYER_ID=${player.id}`);
    await prisma.$disconnect();
}

getIds();
