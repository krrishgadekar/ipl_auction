const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const teams = await prisma.team.findMany({
        select: { id: true, name: true, franchise_name: true, brand_key: true }
    });
    console.log(JSON.stringify(teams, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
