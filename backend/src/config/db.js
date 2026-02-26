// Prisma Client singleton for IPL Auction backend
// Uses the generated client from `prisma generate`
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

export default prisma;
