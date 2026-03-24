// Prisma Client singleton for IPL Auction backend
// Uses the Neon adapter in production (Render) and standard client locally
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

let prisma;

if (process.env.NODE_ENV === 'production') {
  // Setup Neon Serverless adapter for production
  neonConfig.webSocketConstructor = ws;
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  prisma = new PrismaClient({ adapter });
  console.log('Using Neon Serverless database adapter (Production)');
} else {
  // Standard Prisma Client for local development (Docker)
  prisma = new PrismaClient();
  console.log('Using standard PostgreSQL client (Development)');
}

export default prisma;
