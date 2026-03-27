import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.update({
        where: { username: 'admin' },
        data: { password_hash: hash }
    });
    console.log('✅ Admin password reset to: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
