import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    console.log('--- Team Franchise Check ---');
    const teams = await prisma.team.findMany();
    for (const t of teams) {
        console.log(`Team: ${t.name} | Franchise: ${t.franchise_name || 'None'} | Brand Key: ${t.brand_key || 'None'}`);
    }
    const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
    console.log('--- Auction State ---');
    console.log(`Phase: ${state?.phase}`);
}

check().catch(console.error).finally(() => prisma.$disconnect());
