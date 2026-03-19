import { PrismaClient } from '../generated/prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CSV_PATH = path.resolve(__dirname, '../data/ipl2026_rated_players_auction.csv');

async function main() {
  console.log('🚀 Starting Prisma Dataset Import...');

  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());

  console.log(`📊 Found ${lines.length - 1} rows. Emptying existing players...`);

  // Clear existing auction states related to players to avoid FK errors
  await prisma.auctionPlayer.deleteMany();
  await prisma.teamPlayer.deleteMany();
  await prisma.player.deleteMany();

  let importCount = 0;
  const BATCH_SIZE = 50;
  let batch = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Use regex to handle potential commas inside quotes (though unlikely for this CSV)
    const values = lines[i].split(',').map((v) => v.trim());
    const player = {};
    headers.forEach((header, index) => {
      // Fix duplicate 'Nationality' headers if they exist
      if (header === 'Nationality' && player['Nationality']) {
         player['Nationality_raw'] = values[index];
      } else {
         player[header] = values[index];
      }
    });

    if (player.Grade === 'D') continue;

    // Calculate Base Price
    let basePrice = 2.0;
    if (player.Grade === 'A') basePrice = 2.5;
    else if (player.Grade === 'B') basePrice = 1.5;
    else if (player.Grade === 'C') basePrice = 0.5;

    // Helper to safely parse numbers
    const parseNum = (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    const parseDbEnum = (str, defaultVal) => {
        return str ? str.toUpperCase().replace(/\s+/g, '_') : defaultVal;
    };

    batch.push({
      rank: parseInt(player.Rank),
      name: player.Player,
      team: player.Team,
      role: player.Role,
      category: parseDbEnum(player.Category, 'BAT'),
      pool: parseDbEnum(player.Pool, 'BAT_WK'),
      grade: parseDbEnum(player.Grade, 'C'),
      rating: parseInt(player.Rating) || 0,
      nationality: player.Nationality === 'Indian' ? 'INDIAN' : 'OVERSEAS',
      nationality_raw: player.Nationality,
      base_price: basePrice,
      legacy: parseInt(player.Legacy) || 0,
      url: player.URL || null,
      
      // Match Stats
      matches: parseNum(player.Matches),
      bat_runs: parseNum(player.Bat_Runs),
      bat_sr: parseNum(player.Bat_SR),
      bat_average: parseNum(player.Bat_Avg),
      bowl_wickets: parseNum(player.Bowl_Wickets),
      bowl_eco: parseNum(player.Bowl_Eco),
      bowl_avg: parseNum(player.Bowl_Avg),

      // Sub Stats
      sub_experience: parseNum(player.Sub_Experience),
      sub_scoring: parseNum(player.Sub_Scoring),
      sub_impact: parseNum(player.Sub_Impact),
      sub_consistency: parseNum(player.Sub_Consistency),
      sub_wicket_taking: parseNum(player.Sub_Wicket_Taking),
      sub_economy: parseNum(player.Sub_Economy),
      sub_efficiency: parseNum(player.Sub_Efficiency),
      sub_batting: parseNum(player.Sub_Batting),
      sub_bowling: parseNum(player.Sub_Bowling),
      sub_versatility: parseNum(player.Sub_Versatility),
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.player.createMany({
        data: batch,
        skipDuplicates: true,
      });
      importCount += batch.length;
      batch = [];
    }
  }

  // Final flush for remaining players
  if (batch.length > 0) {
    await prisma.player.createMany({
      data: batch,
      skipDuplicates: true,
    });
    importCount += batch.length;
    batch = [];
  }

  console.log(`✅ Success! Imported ${importCount} players from Grade A, B, and C.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
