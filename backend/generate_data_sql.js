/* 
═══════════════════════════════════════════════════════════════
   IPL AUCTION 2026 — Data-to-SQL Generator
   Generates a full SQL dump with current secure credentials.
═══════════════════════════════════════════════════════════════
*/
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const GRADE_BASE_PRICE = { A: 2.0, B: 1.0, C: 0.5, D: 0.2 };

// Helper to escape SQL strings
const esc = (str) => {
    if (str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
};

async function generate() {
    console.log("🚀 Generating data_init.sql...");
    let sql = "-- ── DATA INITIALIZATION ──\n\n";

    // 1. Franchises
    console.log("📋 Processing Franchises...");
    const franchiseMap = {
        'CSK': 'Chennai Super Kings', 'MI': 'Mumbai Indians', 'RCB': 'Royal Challengers Bengaluru',
        'KKR': 'Kolkata Knight Riders', 'SRH': 'Sunrisers Hyderabad', 'RR': 'Rajasthan Royals',
        'GT': 'Gujarat Titans', 'DC': 'Delhi Capitals', 'PBKS': 'Punjab Kings', 'LSG': 'Lucknow Super Giants'
    };
    const FRANCHISE_META = {
        'MI': { logo: '/teams/mi.png', color: '#004BA0' }, 'CSK': { logo: '/teams/csk.png', color: '#FCBD02' },
        'RCB': { logo: '/teams/rcb.png', color: '#EC1C24' }, 'KKR': { logo: '/teams/kkr.png', color: '#3A225D' },
        'DC': { logo: '/teams/dc.png', color: '#0078BC' }, 'PBKS': { logo: '/teams/pbks.png', color: '#ED1B24' },
        'RR': { logo: '/teams/rr.png', color: '#254AA5' }, 'GT': { logo: '/teams/gt.png', color: '#1D5E84' },
        'SRH': { logo: '/teams/srh.png', color: '#F7A721' }, 'LSG': { logo: '/teams/lsg.png', color: '#A72056' }
    };

    const franchises = Object.keys(franchiseMap).map((key, i) => {
        const meta = FRANCHISE_META[key] || { logo: '🏏', color: '#808080' };
        return `(${i + 1}, ${esc(franchiseMap[key])}, ${esc(key)}, 50, ${esc(meta.logo)}, ${esc(meta.color)})`;
    });
    sql += `INSERT INTO "Franchise" (id, name, short_name, brand_score, logo, primary_color) VALUES\n${franchises.join(',\n')};\n\n`;

    // 2. Teams
    console.log("📋 Processing Teams...");
    const teamNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet'];
    const teamInserts = [];
    for (const name of teamNames) {
        const username = name.toLowerCase();
        const pass = `${username}2026`;
        const hash = await bcrypt.hash(pass, SALT_ROUNDS);
        const uuid = crypto.randomUUID();
        teamInserts.push(`(${esc(uuid)}, ${esc('Team ' + name)}, ${esc(username)}, ${esc(hash)}, 120, 0)`);
    }
    sql += `INSERT INTO "Team" (id, name, username, password_hash, purse_remaining, squad_count) VALUES\n${teamInserts.join(',\n')};\n\n`;

    // 3. Players
    console.log("📋 Processing Players (159)...");
    const playersCsvPath = 'resources/ipl2026_rated_players_auction.csv';
    const csvLines = fs.readFileSync(playersCsvPath, 'utf-8').split(/\r?\n/).filter(line => line.trim());
    const players = [];
    const auctionPlayers = [];
    const headers = csvLines[0].split(',').map(h => h.trim());

    for (const line of csvLines.slice(1, 160)) {
        const vals = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((h, i) => row[h] = vals[i] || '');
        
        const uuid = crypto.randomUUID();
        const rank = parseInt(row.Rank);
        const grade = ['A','B','C','D'].includes(row.Grade) ? row.Grade : 'D';
        const isRiddle = (rank === 20 || rank === 21);
        const basePrice = GRADE_BASE_PRICE[grade];
        const nationality = (row.Nationality?.toLowerCase().includes('india')) ? 'INDIAN' : 'OVERSEAS';

        players.push(`(${esc(uuid)}, ${rank}, ${esc(row.Player)}, ${esc(row.Team)}, ${esc(row.Role)}, ${esc(row.Category)}, ${esc(row.Pool)}, ${esc(grade)}, ${parseInt(row.Rating) || 50}, ${esc(nationality)}, ${basePrice}, ${isRiddle})`);
        auctionPlayers.push(`(${esc(crypto.randomUUID())}, ${esc(uuid)}, 'UNSOLD')`);
    }
    sql += `INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, base_price, is_riddle) VALUES\n${players.join(',\n')};\n\n`;
    sql += `INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES\n${auctionPlayers.join(',\n')};\n\n`;

    // 4. Admin
    console.log("📋 Processing Admins (Secure)...");
    const adminPass = '8d3ddcf02a122702'; // From instance 1 in our list
    const adminHash = '$2b$10$3b4vRlQLjfWhsGFUO7MqL.pkWGecQ.LTpiPRw.QsGeqJgewHZ14Ve';
    sql += `INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES\n(${esc(crypto.randomUUID())}, 'admin', ${esc(adminHash)}, 'ADMIN'),\n(${esc(crypto.randomUUID())}, 'screen', ${esc(adminHash)}, 'SCREEN');\n\n`;

    // 5. Sequence
    console.log("📋 Processing Sequences (Default Sequence 1)...");
    const seqCsvPath = 'resources/sequence_1.csv';
    const seqLines = fs.readFileSync(seqCsvPath, 'utf-8').split(/\r?\n/).filter(line => line.trim());
    // Assuming CSV has rank or player_id. Our seed.js uses the Player table.
    // For now, let's just create a basic sequence based on the 159 players we have.
    // Real sequences will come in 2 days from the user.
    const seqItems = [];
    for(let j=1; j<=159; j++) {
        seqItems.push({ rank: j, type: 'PLAYER' });
    }
    sql += `INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES\n(1, 'Sequence Alpha', 'PLAYER', ${esc(JSON.stringify(seqItems))});\n\n`;

    // 6. Global State
    sql += `INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');\n\n`;
    
    fs.writeFileSync('data_init.sql', sql);
    console.log("✅ data_init.sql generated!");
}

generate();
