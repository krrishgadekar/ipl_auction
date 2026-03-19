import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import 'dotenv/config';

console.log('Prisma Client Version:', '7.4.1');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Connecting to database...');
  try {
    await prisma.$connect();
    console.log('✅ Connection successful.');
    const teams = await prisma.team.findMany();
    console.log('Teams count:', teams.length);
  } catch (e) {
    console.error('❌ Connection failed with details:');
    console.dir(e, { depth: null });
    if (e.message) console.error('Error Message:', e.message);
    if (e.code) console.error('Error Code:', e.code);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(err => {
  console.error('Fatal error in main:', err);
});
