// ═══════════════════════════════════════════════════════════════
// IPL Auction 2026 — Database Seed Script (Normalized Schema)
// Seeds: Franchises, Teams, 246 Players, AuctionState, PowerCards
// Idempotent: skips if data exists unless --force flag is used
// ═══════════════════════════════════════════════════════════════
import { PrismaClient } from '../generated/prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

import bcrypt from 'bcrypt';
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
const FORCE = process.argv.includes('--force');
const SALT_ROUNDS = 10;

// ── CONSTANTS ────────────────────────────────────────────────

const GRADE_BASE_PRICE = { A: 2.0, B: 1.0, C: 0.5, D: 0.2 };

// 10 IPL Franchises — available for teams to purchase during FRANCHISE_PHASE
// brand_score is based on social media following + trophy count (normalized 0–100)
const FRANCHISE_DEFINITIONS = [
  { id: 1,  short_name: 'MI',   name: 'Mumbai Indians',              brand_score: 95, logo: '🔵', primary_color: '#004BA0' },
  { id: 2,  short_name: 'CSK',  name: 'Chennai Super Kings',         brand_score: 98, logo: '🦁', primary_color: '#FCBD02' },
  { id: 3,  short_name: 'RCB',  name: 'Royal Challengers Bengaluru', brand_score: 85, logo: '🔴', primary_color: '#EC1C24' },
  { id: 4,  short_name: 'KKR',  name: 'Kolkata Knight Riders',       brand_score: 80, logo: '⚔️', primary_color: '#3A225D' },
  { id: 5,  short_name: 'DC',   name: 'Delhi Capitals',              brand_score: 60, logo: '💙', primary_color: '#0078BC' },
  { id: 6,  short_name: 'PBKS', name: 'Punjab Kings',                brand_score: 45, logo: '🦅', primary_color: '#ED1B24' },
  { id: 7,  short_name: 'RR',   name: 'Rajasthan Royals',            brand_score: 70, logo: '💗', primary_color: '#254AA5' },
  { id: 8,  short_name: 'GT',   name: 'Gujarat Titans',              brand_score: 65, logo: '💎', primary_color: '#1D5E84' },
  { id: 9,  short_name: 'SRH',  name: 'Sunrisers Hyderabad',         brand_score: 55, logo: '🧡', primary_color: '#F7A721' },
  { id: 10, short_name: 'LSG',  name: 'Lucknow Super Giants',        brand_score: 40, logo: '🦊', primary_color: '#A72056' },
];

// 10 Participant teams (pre-seeded, one username/password each)
// Teams start without a franchise (assigned during FRANCHISE_PHASE)
const TEAM_DEFINITIONS = [
  { name: 'Team Alpha',   username: 'team1',  password: 'auction2026' },
  { name: 'Team Bravo',   username: 'team2',  password: 'auction2026' },
  { name: 'Team Charlie', username: 'team3',  password: 'auction2026' },
  { name: 'Team Delta',   username: 'team4',  password: 'auction2026' },
  { name: 'Team Echo',    username: 'team5',  password: 'auction2026' },
  { name: 'Team Foxtrot', username: 'team6',  password: 'auction2026' },
  { name: 'Team Golf',    username: 'team7',  password: 'auction2026' },
  { name: 'Team Hotel',   username: 'team8',  password: 'auction2026' },
  { name: 'Team India',   username: 'team9',  password: 'auction2026' },
  { name: 'Team Juliet',  username: 'team10', password: 'auction2026' },
];

// All 5 power card types (including RTM granted with franchise)
const POWER_CARD_TYPES = ['GOD_EYE', 'MULLIGAN', 'FINAL_STRIKE', 'BID_FREEZER', 'RIGHT_TO_MATCH'];

// ── HELPERS ──────────────────────────────────────────────────

function mapNationality(raw) {
  if (!raw) return 'OVERSEAS';
  return raw.trim().toLowerCase() === 'indian' ? 'INDIAN' : 'OVERSEAS';
}

function mapCategory(cat) {
  const map = { BAT: 'BAT', BOWL: 'BOWL', AR: 'AR', WK: 'WK' };
  return map[cat?.trim()] || 'BAT';
}

function mapPool(pool) {
  const map = { BAT_WK: 'BAT_WK', BOWL: 'BOWL', AR: 'AR' };
  return map[pool?.trim()] || 'BAT_WK';
}

function mapGrade(grade) {
  const map = { A: 'A', B: 'B', C: 'C', D: 'D' };
  return map[grade?.trim()] || 'D';
}

function parseCSV(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx]?.trim() || '';
    });
    rows.push(row);
  }
  return rows;
}

function safeInt(val) {
  if (!val || val === '') return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function safeFloat(val) {
  if (!val || val === '') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

// ── MAIN SEED FUNCTION ───────────────────────────────────────

async function main() {
  console.log('🏏 Starting IPL Auction 2026 seed...\n');

  // ── Check if seed already ran ──────────────────────────────
  if (!FORCE) {
    const existingTeams = await prisma.team.count();
    if (existingTeams > 0) {
      console.log('⚠️  Database already seeded. Use --force to re-seed.');
      return;
    }
  }

  // ── STEP 0: Clean existing data ────────────────────────────
  if (FORCE) {
    console.log('🧹 Force flag detected — cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.sealedBid.deleteMany();
    await prisma.top11Selection.deleteMany();
    await prisma.teamPlayer.deleteMany();
    await prisma.auctionPlayer.deleteMany();
    await prisma.powerCard.deleteMany();
    await prisma.auctionSequence.deleteMany();
    await prisma.auctionState.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    await prisma.franchise.deleteMany();
    console.log('  ✅ Cleaned\n');
  }

  // ── STEP 1: Seed Franchises ────────────────────────────────
  console.log('📋 Seeding 10 IPL Franchises...');
  for (const def of FRANCHISE_DEFINITIONS) {
    await prisma.franchise.upsert({
      where: { id: def.id },
      update: { brand_score: def.brand_score },
      create: {
        id: def.id,
        name: def.name,
        short_name: def.short_name,
        brand_score: def.brand_score,
        logo: def.logo,
        primary_color: def.primary_color,
      },
    });
    console.log(`  ✅ ${def.short_name} — ${def.name} (brand: ${def.brand_score})`);
  }

  // ── STEP 2: Seed Participant Teams ─────────────────────────
  console.log('\n📋 Seeding 10 Participant Teams...');
  const teamMap = {};

  for (const def of TEAM_DEFINITIONS) {
    const passwordHash = await bcrypt.hash(def.password, SALT_ROUNDS);
    const team = await prisma.team.create({
      data: {
        name: def.name,
        password_hash: passwordHash,
        purse_remaining: 120,
        squad_count: 0,
        overseas_count: 0,
        // brand_key, franchise_name, brand_score remain null/0 until FRANCHISE_PHASE
      },
    });
    teamMap[def.username] = team;
    console.log(`  ✅ ${def.name} (user: ${def.username})`);
  }

  // ── STEP 3: Seed Players from CSV ─────────────────────────
  console.log('\n📋 Seeding 246 players from CSV...');

  const csvPaths = [
    path.resolve(__dirname, '..', 'data', 'ipl2026_rated_players_auction.csv'),
    path.resolve(__dirname, '..', '..', '..', 'IPL AUCTION OCULUS', 'ipl2026_rated_players_auction.csv'),
  ];

  let csvPath = null;
  for (const p of csvPaths) {
    if (fs.existsSync(p)) {
      csvPath = p;
      break;
    }
  }

  if (!csvPath) {
    console.error('❌ CSV file not found! Tried:', csvPaths);
    console.error('   Place ipl2026_rated_players_auction.csv in backend/data/');
    process.exit(1);
  }

  console.log(`  📂 Using CSV: ${csvPath}`);
  const rows = parseCSV(csvPath);
  console.log(`  📊 Parsed ${rows.length} player rows\n`);

  let playerCount = 0;
  const playerMap = {};

  for (const row of rows) {
    const rank = safeInt(row.Rank);
    if (!rank) continue;

    const grade = mapGrade(row.Grade);
    if (grade === 'D') continue;
    const player = await prisma.player.create({
      data: {
        rank,
        name: row.Player,
        team: row.Team || '',
        role: row.Role || '',
        category: mapCategory(row.Category),
        pool: mapPool(row.Pool),
        grade,
        rating: safeInt(row.Rating) || 40,
        nationality: mapNationality(row.Nationality),
        nationality_raw: row.Nationality || null,
        base_price: GRADE_BASE_PRICE[grade],
        legacy: safeInt(row.Legacy) || 0,
        url: row.URL || null,
        image_url: null,
        is_riddle: false, // Admin can set riddle players later via API

        // Match stats
        matches: safeInt(row.Matches),
        bat_runs: safeInt(row.Bat_Runs),
        bat_sr: safeFloat(row.Bat_SR),
        bat_average: safeFloat(row.Bat_Average),
        bowl_wickets: safeInt(row.Bowl_Wickets),
        bowl_eco: safeFloat(row.Bowl_Eco),
        bowl_avg: safeFloat(row.Bowl_Avg),

        // Sub-ratings
        sub_experience: safeInt(row.Sub_Experience),
        sub_scoring: safeInt(row.Sub_Scoring),
        sub_impact: safeInt(row.Sub_Impact),
        sub_consistency: safeInt(row.Sub_Consistency),
        sub_wicket_taking: safeInt(row.Sub_WicketTaking),
        sub_economy: safeInt(row.Sub_Economy),
        sub_efficiency: safeInt(row.Sub_Efficiency),
        sub_batting: safeInt(row.Sub_Batting),
        sub_bowling: safeInt(row.Sub_Bowling),
        sub_versatility: safeInt(row.Sub_Versatility),
      },
    });

    playerMap[rank] = player;
    playerCount++;
    if (playerCount % 50 === 0) console.log(`  ... seeded ${playerCount} players`);
  }
  console.log(`  ✅ Seeded ${playerCount} players total\n`);

  // ── STEP 4: Create AuctionPlayer records ──────────────────
  console.log('📋 Creating AuctionPlayer records...');
  const playerIds = Object.values(playerMap).map(p => p.id);

  for (const playerId of playerIds) {
    await prisma.auctionPlayer.create({
      data: { player_id: playerId, status: 'UNSOLD' },
    });
  }
  console.log(`  ✅ Created ${playerIds.length} AuctionPlayer records\n`);

  // ── STEP 5: Create PowerCards (5 per team, including RTM) ──
  console.log('📋 Creating Power Cards...');
  const teams = Object.values(teamMap);
  for (const team of teams) {
    for (const cardType of POWER_CARD_TYPES) {
      await prisma.powerCard.create({
        data: { team_id: team.id, type: cardType, is_used: false },
      });
    }
  }
  console.log(`  ✅ Created ${teams.length * POWER_CARD_TYPES.length} Power Cards (${POWER_CARD_TYPES.length} per team)\n`);

  // ── STEP 6: Create AuctionState ───────────────────────────
  console.log('📋 Creating AuctionState...');
  await prisma.auctionState.create({
    data: {
      id: 1,
      phase: 'NOT_STARTED',
      current_player_id: null,
      current_bid: null,
      highest_bidder_id: null,
      current_sequence_id: null,
      current_sequence_index: 0,
      bid_frozen_team_id: null,
    },
  });
  console.log('  ✅ AuctionState created\n');

  // ── STEP 7: Create 5 Auction Sequences ────────────────────
  console.log('📋 Creating 5 Auction Sequences...');
  const defaultOrder = Object.keys(playerMap).map(Number).sort((a, b) => a - b);

  const sequenceNames = [
    'Sequence Alpha',
    'Sequence Bravo',
    'Sequence Charlie',
    'Sequence Delta',
    'Sequence Echo',
  ];

  for (let i = 0; i < 5; i++) {
    let order;
    if (i === 0) {
      order = [...defaultOrder];
    } else {
      // Deterministic seeded shuffle
      order = [...defaultOrder];
      for (let j = order.length - 1; j > 0; j--) {
        const seed = ((j * (i + 1) * 2654435761) >>> 0) % (j + 1);
        [order[j], order[seed]] = [order[seed], order[j]];
      }
    }

    await prisma.auctionSequence.create({
      data: {
        id: i + 1,
        name: sequenceNames[i],
        players: order.map((rank) => ({ rank, isRiddlePlayer: false })),
      },
    });
    console.log(`  ✅ ${sequenceNames[i]} (${order.length} players)`);
  }

  // ── Summary ────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════');
  console.log('🏆  SEED COMPLETE!');
  console.log(`    Franchises:     ${FRANCHISE_DEFINITIONS.length}`);
  console.log(`    Teams:          ${TEAM_DEFINITIONS.length}`);
  console.log(`    Players:        ${playerCount}`);
  console.log(`    AuctionPlayers: ${playerIds.length}`);
  console.log(`    PowerCards:     ${teams.length * POWER_CARD_TYPES.length}`);
  console.log(`    Sequences:      5`);
  console.log('═══════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
