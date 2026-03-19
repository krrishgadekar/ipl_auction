// Prisma Client singleton for IPL Auction backend
// Uses the generated client from `prisma generate`
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
