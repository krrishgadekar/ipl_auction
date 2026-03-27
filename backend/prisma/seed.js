// ═══════════════════════════════════════════════════════════════
// IPL Auction 2026 — Database Seed Script (Final Fixed)
// ═══════════════════════════════════════════════════════════════
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// ── FRANCHISE METADATA (From Frontend) ─────────────────────────
const FRANCHISE_META = {
    'MI':   { logo: '/teams/mi.png',   color: '#004BA0' },
    'CSK':  { logo: '/teams/csk.png',  color: '#FCBD02' },
    'RCB':  { logo: '/teams/rcb.png',  color: '#EC1C24' },
    'KKR':  { logo: '/teams/kkr.png',  color: '#3A225D' },
    'DC':   { logo: '/teams/dc.png',   color: '#0078BC' },
    'PBKS': { logo: '/teams/pbks.png', color: '#ED1B24' },
    'RR':   { logo: '/teams/rr.png',   color: '#254AA5' },
    'GT':   { logo: '/teams/gt.png',   color: '#1D5E84' },
    'SRH':  { logo: '/teams/srh.png',  color: '#F7A721' },
    'LSG':  { logo: '/teams/lsg.png',  color: '#A72056' },
};

const GRADE_BASE_PRICE = { A: 2.0, B: 1.0, C: 0.5, D: 0.2 };
const POWER_CARDS_FOR_BIDDING = ['MULLIGAN', 'FINAL_STRIKE', 'BID_FREEZER', 'GOD_EYE'];

// ── HELPERS ──────────────────────────────────────────────────

function generateStrongPassword() {
  return crypto.randomBytes(6).toString('hex');
}

function mapNationality(raw) {
  if (!raw) return 'INDIAN';
  const r = raw.trim().toLowerCase();
  return (r === 'indian' || r === 'india') ? 'INDIAN' : 'OVERSEAS';
}

function parseCSV(csvPath) {
  if (!fs.existsSync(csvPath)) return [];
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => row[h] = values[i]?.trim() || '');
    return row;
  });
}

function safeInt(val) {
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function safeFloat(val) {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── MAIN ─────────────────────────────────────────────────────

async function main() {
  console.log('🏏 Starting IPL Auction 2026 seeding...\n');

  const resourcesDir = path.resolve(__dirname, '..', 'resources');
  const playersCsvPath = path.resolve(resourcesDir, 'ipl2026_rated_players_auction.csv');
  const franchisesTxtPath = path.resolve(resourcesDir, 'Franchises.txt');
  const sequenceCsvPath = path.resolve(resourcesDir, 'sequence_1.csv');
  const credentialsFilePath = path.resolve(__dirname, '..', 'team_credentials.txt');

  // 0. Clean
  console.log('🧹 Cleaning database...');
  await prisma.auditLog.deleteMany();
  await prisma.top11Selection.deleteMany();
  await prisma.teamPlayer.deleteMany();
  await prisma.auctionPlayer.deleteMany();
  await prisma.powerCard.deleteMany();
  await prisma.auctionSequence.deleteMany();
  await prisma.auctionState.deleteMany();
  await prisma.player.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.team.deleteMany();
  await prisma.franchise.deleteMany();

  // 1. Franchises
  console.log('📋 Seeding Franchises...');
  const franchiseLines = fs.readFileSync(franchisesTxtPath, 'utf-8')
    .split(/\r?\n/)
    .filter(l => l.trim() && !l.startsWith('Team') && !l.startsWith('NOTE'));

  const franchiseIds = [];
  const franchiseMap = {
      'CSK': 'Chennai Super Kings',
      'MI': 'Mumbai Indians',
      'RCB': 'Royal Challengers Bengaluru',
      'KKR': 'Kolkata Knight Riders',
      'SRH': 'Sunrisers Hyderabad',
      'RR': 'Rajasthan Royals',
      'GT': 'Gujarat Titans',
      'DC': 'Delhi Capitals',
      'PBKS': 'Punjab Kings',
      'LSG': 'Lucknow Super Giants'
  };

  for (let i = 0; i < franchiseLines.length; i++) {
    const parts = franchiseLines[i].split('\t').filter(p => p.trim());
    const shortName = parts[0].trim();
    const bonus = safeFloat(parts[parts.length - 1]);
    const meta = FRANCHISE_META[shortName] || { logo: '🏏', color: '#808080' };

    const created = await prisma.franchise.create({
      data: {
        id: i + 1,
        short_name: shortName,
        name: franchiseMap[shortName] || shortName,
        brand_score: Math.round(bonus || 50),
        logo: meta.logo,
        primary_color: meta.color
      }
    });
    franchiseIds.push(created.id);
  }
  console.log(`  ✅ ${franchiseIds.length} franchises seeded`);

  // 2. Teams
  console.log('📋 Seeding 10 Participant Teams...');
  const teams = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet'];
  const franchiseKeys = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'RR', 'GT', 'DC', 'PBKS', 'LSG'];
  const credentials = [];
  for (let i = 0; i < teams.length; i++) {
    const t = teams[i];
    const username = t.toLowerCase();
    const pass = `${username}2026`; // Fixed password pattern for easy linking
    const fKey = franchiseKeys[i];
    await prisma.team.create({
      data: {
        name: `Team ${t}`,
        username: username,
        password_hash: await bcrypt.hash(pass, SALT_ROUNDS),
        purse_remaining: 120,
        squad_count: 0
      }
    });
    credentials.push(`${username}:${pass}`);
  }
  fs.writeFileSync(credentialsFilePath, credentials.join('\n'));
  console.log(`  🔑 Team credentials saved to team_credentials.txt`);

  // 3. Players
  console.log('📋 Seeding 159 Players...');
  const playerRows = parseCSV(playersCsvPath).slice(0, 159);
  for (const row of playerRows) {
    const rank = safeInt(row.Rank);
    const grade = ['A','B','C','D'].includes(row.Grade) ? row.Grade : 'D';
    const p = await prisma.player.create({
      data: {
        rank,
        name: row.Player,
        team: row.Team || '',
        role: row.Role || '',
        category: row.Category || 'BAT',
        pool: row.Pool || 'BAT_WK',
        grade,
        rating: safeInt(row.Rating) || 50,
        nationality: mapNationality(row.Nationality),
        nationality_raw: row.Nationality || null,
        base_price: GRADE_BASE_PRICE[grade],
        legacy: safeInt(row.Legacy) || 0,
        is_riddle: (rank === 20 || rank === 21),
        riddle_title: rank === 20 ? "The Scoop King" : rank === 21 ? "The Intense Allrounder" : null,
        riddle_question: rank === 20 
            ? "I am the absolute 'Boss' of scooping terrifyingly fast bowlers right over the keeper's head. I spent years painting the town pink with my centuries, but now I’m taking my English royalty to the biggest cricket stadium in the world. Who am I?" 
            : rank === 21 
                ? "I’ve got a cabinet full of IPL trophies, but I’m probably best known for my intense on-field death stares and my very famous younger brother. I recently traded my Nawabi vibes in Lucknow to join the chaos at the Chinnaswamy. Who am I?" 
                : null,
        matches: safeInt(row.Matches),
        bat_runs: safeInt(row.Bat_Runs),
        bat_sr: safeFloat(row.Bat_SR),
        bat_average: safeFloat(row.Bat_Average),
        bowl_wickets: safeInt(row.Bowl_Wickets),
        bowl_eco: safeFloat(row.Bowl_Eco),
        bowl_avg: safeFloat(row.Bowl_Avg),
        sub_experience: safeInt(row.Sub_Experience),
        sub_scoring: safeInt(row.Sub_Scoring),
        sub_impact: safeInt(row.Sub_Impact),
        sub_consistency: safeInt(row.Sub_Consistency),
        sub_wicket_taking: safeInt(row.Sub_WicketTaking),
        sub_economy: safeInt(row.Sub_Economy),
        sub_efficiency: safeInt(row.Sub_Efficiency),
        sub_batting: safeInt(row.Sub_Batting),
        sub_bowling: safeInt(row.Sub_Bowling),
        sub_versatility: safeInt(row.Sub_Versatility)
      }
    });
    await prisma.auctionPlayer.create({ data: { player_id: p.id, status: 'UNSOLD' } });
  }
  console.log(`  ✅ 159 players and auction records seeded`);

  // 4. Admin Users
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const screenPass = process.env.SCREEN_PASSWORD || 'screen123';
  
  await prisma.adminUser.create({
    data: { username: 'admin', password_hash: await bcrypt.hash(adminPass, SALT_ROUNDS), role: 'ADMIN' }
  });
  await prisma.adminUser.create({
    data: { username: 'screen', password_hash: await bcrypt.hash(screenPass, SALT_ROUNDS), role: 'SCREEN' }
  });
  console.log('  ✅ Admin users seeded');

  // 5. Sequences
  const shuffledFranchises = shuffle(franchiseIds);
  await prisma.auctionSequence.create({
    data: { id: 1, name: 'Franchise Sequence', type: 'FRANCHISE', sequence_items: shuffledFranchises.map(String) }
  });

  const shuffledCards = shuffle(POWER_CARDS_FOR_BIDDING);
  await prisma.auctionSequence.create({
    data: { id: 2, name: 'Power Card Sequence', type: 'POWER_CARD', sequence_items: shuffledCards }
  });

  const sequenceRows = parseCSV(sequenceCsvPath);
  const ranks = sequenceRows.map(r => r.Rank).filter(Boolean);
  await prisma.auctionSequence.create({
    data: { id: 3, name: 'Main Player Sequence', type: 'PLAYER', sequence_items: ranks.map(String) }
  });
  console.log('  ✅ Sequences initialized');

  // 6. State
  await prisma.auctionState.create({
    data: { id: 1, phase: 'NOT_STARTED', auction_day: 'Day 1', bid_history: [] }
  });
  console.log('  ✅ Auction state initialized');
  console.log('\n🏆 SEEDING COMPLETE!');
}

main().catch(e => { console.error('❌ Seed failed:', e); process.exit(1); }).finally(() => prisma.$disconnect());
