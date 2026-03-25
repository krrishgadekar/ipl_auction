const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const players = await prisma.player.findMany({
    where: {
      nationality: 'OVERSEAS'
    },
    select: {
      rank: true,
      name: true,
      nationality_raw: true
    }
  });

  console.log('Overseas Players Nationality Check:');
  console.log('-----------------------------------');
  players.forEach(p => {
    console.log(`Rank ${p.rank}: ${p.name} -> Raw: "${p.nationality_raw}"`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
