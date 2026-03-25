import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const players = await prisma.player.findMany({
    where: {
      name: {
        contains: 'Livingstone'
      }
    },
    select: {
      rank: true,
      name: true,
      nationality: true,
      nationality_raw: true
    }
  });

  console.log('Player Search Check:');
  console.log('--------------------');
  players.forEach(p => {
    console.log(`Rank ${p.rank}: ${p.name} -> Nationality: ${p.nationality}, Raw: "${p.nationality_raw}"`);
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
