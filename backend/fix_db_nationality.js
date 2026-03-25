import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const playersCsvPath = path.resolve(__dirname, 'resources', 'ipl2026_rated_players_auction.csv');
  const content = fs.readFileSync(playersCsvPath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const csvPlayers = lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => row[h] = values[i]?.trim() || '');
    return row;
  });

  console.log(`Found ${csvPlayers.length} players in CSV. Updating database...`);

  for (const csvP of csvPlayers) {
    const rank = parseInt(csvP.Rank, 10);
    if (isNaN(rank)) continue;

    await prisma.player.updateMany({
      where: { rank: rank },
      data: {
        nationality_raw: csvP.Nationality
      }
    });
  }

  console.log('✅ Nationality data updated successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
