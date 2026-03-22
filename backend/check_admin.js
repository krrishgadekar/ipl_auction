import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const admins = await prisma.adminUser.findMany();
  console.log('Admins found:', admins.map(a => ({ id: a.id, username: a.username, role: a.role })));
  await prisma.$disconnect();
}
check();
