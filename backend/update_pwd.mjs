import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        const screenHash = await bcrypt.hash('screen123', 10);

        await prisma.adminUser.updateMany({
            where: { username: 'admin' },
            data: { password_hash: hash }
        });

        await prisma.adminUser.updateMany({
            where: { username: 'screen' },
            data: { password_hash: screenHash }
        });

        console.log("Passwords updated successfully!");
    } catch(e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
