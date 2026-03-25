const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function esc(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'string') return `'${str.replace(/'/g, "''")}'`;
    return str;
}

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    const header = lines[0].split(',');
    return lines.slice(1).map(line => {
        // Handle commas inside quoted fields if any (though these CSVs seem simple)
        const values = line.split(',');
        const obj = {};
        header.forEach((h, i) => {
            obj[h.trim()] = values[i] ? values[i].trim() : null;
        });
        return obj;
    });
}

function parseRiddles(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const answers = [];
    const lines = content.split(/\r?\n/);
    lines.forEach(line => {
        if (line.toLowerCase().startsWith('answer:')) {
            answers.push(line.split(':')[1].trim());
        }
    });
    return answers;
}

async function generateInstance(n) {
    console.log(`🚀 Processing Instance ${n}...`);
    let sql = `-- INSTANCE ${n} INITIALIZATION\n`;
    sql += `-- RESETS THE DATABASE FOR A FRESH START\n`;
    sql += `DROP SCHEMA public CASCADE;\nCREATE SCHEMA public;\nSET search_path TO public;\n\n`;

    // 1. Enums & Schema (Load from schema_init.sql)
    const schemaSql = fs.readFileSync('schema_init.sql', 'utf-8');
    sql += schemaSql + "\n\n";

    sql += `-- ── DATA FOR INSTANCE ${n} ──\n\n`;

    // 2. Franchises (Static)
    sql += `INSERT INTO "Franchise" (id, name, short_name, brand_score, logo, primary_color) VALUES
(1, 'Chennai Super Kings', 'CSK', 67.84, '/teams/csk.png', '#FCBD02'),
(2, 'Mumbai Indians', 'MI', 66.46, '/teams/mi.png', '#004BA0'),
(3, 'Royal Challengers Bengaluru', 'RCB', 56.50, '/teams/rcb.png', '#EC1C24'),
(4, 'Kolkata Knight Riders', 'KKR', 52.87, '/teams/kkr.png', '#3A225D'),
(5, 'Sunrisers Hyderabad', 'SRH', 47.12, '/teams/srh.png', '#F7A721'),
(6, 'Rajasthan Royals', 'RR', 45.62, '/teams/rr.png', '#254AA5'),
(7, 'Gujarat Titans', 'GT', 45.29, '/teams/gt.png', '#1D5E84'),
(8, 'Delhi Capitals', 'DC', 42.23, '/teams/dc.png', '#0078BC'),
(9, 'Punjab Kings', 'PBKS', 42.16, '/teams/pbks.png', '#ED1B24'),
(10, 'Lucknow Super Giants', 'LSG', 40.00, '/teams/lsg.png', '#A72056');\n\n`;

    // 3. Teams (Unique Passwords)
    const teams = [
        { name: 'Team Alpha', user: 'alpha' },
        { name: 'Team Bravo', user: 'bravo' },
        { name: 'Team Charlie', user: 'charlie' },
        { name: 'Team Delta', user: 'delta' },
        { name: 'Team Echo', user: 'echo' },
        { name: 'Team Foxtrot', user: 'foxtrot' },
        { name: 'Team Golf', user: 'golf' },
        { name: 'Team Hotel', user: 'hotel' },
        { name: 'Team India', user: 'india' },
        { name: 'Team Juliet', user: 'juliet' }
    ];

    const teamCreds = [];
    sql += `INSERT INTO "Team" (id, name, username, password_hash, purse_remaining, squad_count) VALUES\n`;
    for (let i = 0; i < teams.length; i++) {
        const pass = crypto.randomBytes(4).toString('hex'); // 8 chars
        const hash = await bcrypt.hash(pass, SALT_ROUNDS);
        const id = crypto.randomUUID();
        teamCreds.push({ username: teams[i].user, password: pass });
        sql += `(${esc(id)}, ${esc(teams[i].name)}, ${esc(teams[i].user)}, ${esc(hash)}, 120, 0)${i === teams.length - 1 ? ';' : ','}\n`;
    }
    sql += `\n`;

    // 4. Players (from sequence CSV and Riddle TXT)
    const players = parseCSV(`resources/sequence_${n}.csv`);
    const riddlePlayers = parseRiddles(`resources/sequence_${n}_riddles.txt`);

    sql += `INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES\n`;
    
    const playerIds = [];
    players.forEach((p, i) => {
        const id = crypto.randomUUID();
        playerIds.push({ name: p.Player, id: id, rank: parseInt(p.Rank) });
        const isRiddle = riddlePlayers.includes(p.Player);
        
        // Map nationality to Enum values
        const nationality = p.Nationality.toUpperCase() === 'INDIAN' ? 'INDIAN' : 'OVERSEAS';
        
        // Compute base price from grade (A=2, B=1, C=0.5)
        const GRADE_PRICE = { A: 2, B: 1, C: 0.5 };
        const basePrice = GRADE_PRICE[p.Grade] || 0.5;
        
        sql += `(${esc(id)}, ${p.Rank}, ${esc(p.Player)}, ${esc(p.Team)}, ${esc(p.Role)}, ${esc(p.Category)}, ${esc(p.Pool)}, ${esc(p.Grade)}, ${p.Rating}, ${esc(nationality)}, ${esc(p.Nationality)}, ${basePrice}, ${isRiddle}, ${p.Legacy || 0}, ${esc(p.URL)}, ${p.Matches || 'NULL'}, ${p.Bat_Runs || 'NULL'}, ${p.Bat_SR || 'NULL'}, ${p.Bat_Average || 'NULL'}, ${p.Bowl_Wickets || 'NULL'}, ${p.Bowl_Eco || 'NULL'}, ${p.Bowl_Avg || 'NULL'}, ${p.Sub_Scoring || 'NULL'}, ${p.Sub_Impact || 'NULL'}, ${p.Sub_Consistency || 'NULL'}, ${p.Sub_Experience || 'NULL'}, ${p.Sub_WicketTaking || 'NULL'}, ${p.Sub_Economy || 'NULL'}, ${p.Sub_Efficiency || 'NULL'}, ${p.Sub_Batting || 'NULL'}, ${p.Sub_Bowling || 'NULL'}, ${p.Sub_Versatility || 'NULL'})${i === players.length - 1 ? ';' : ','}\n`;
    });
    sql += `\n`;

    // 5. AuctionPlayer (Initial SOLD/UNSOLD status)
    sql += `INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES\n`;
    playerIds.forEach((p, i) => {
        sql += `(${esc(crypto.randomUUID())}, ${esc(p.id)}, 'UNSOLD')${i === playerIds.length - 1 ? ';' : ','}\n`;
    });
    sql += `\n`;

    // 6. Admins (Unique)
    const adminPass = crypto.randomBytes(8).toString('hex');
    const screenPass = crypto.randomBytes(8).toString('hex');
    const adminHash = await bcrypt.hash(adminPass, SALT_ROUNDS);
    const screenHash = await bcrypt.hash(screenPass, SALT_ROUNDS);
    
    sql += `INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES\n(${esc(crypto.randomUUID())}, 'admin', ${esc(adminHash)}, 'ADMIN'),\n(${esc(crypto.randomUUID())}, 'screen', ${esc(screenHash)}, 'SCREEN');\n\n`;

    // 7. Sequences (ID 1=Franchise, ID 2=PowerCard, ID 3=Player — matching phase auto-select in auctionService)
    
    // 7a. Franchise sequence (same order for all rooms, randomized once)
    const franchiseItems = [3, 7, 1, 9, 5, 10, 2, 6, 8, 4]; // randomized franchise IDs 1-10
    sql += `INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES\n(1, 'Franchise Auction', 'FRANCHISE', ${esc(JSON.stringify(franchiseItems))});\n\n`;

    // 7b. PowerCard sequence (same order for all rooms)
    const powerCardItems = ['GOD_EYE', 'MULLIGAN', 'FINAL_STRIKE', 'BID_FREEZER'];
    sql += `INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES\n(2, 'Power Card Auction', 'POWER_CARD', ${esc(JSON.stringify(powerCardItems))});\n\n`;

    // 7c. Player sequence — plain rank numbers (NOT objects), code does Number(items[i])
    const seqItems = playerIds.map(p => p.rank);
    sql += `INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES\n(3, 'Player Auction ${n}', 'PLAYER', ${esc(JSON.stringify(seqItems))});\n\n`;

    // 8. State
    sql += `INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');\n\n`;

    fs.writeFileSync(`instance_${n}_init.sql`, sql);
    
    return {
        instance: n,
        admin: adminPass,
        screen: screenPass,
        teams: teamCreds
    };
}

async function main() {
    const allCreds = [];
    for (let i = 1; i <= 5; i++) {
        const creds = await generateInstance(i);
        allCreds.push(creds);
    }

    let masterTxt = "========= MASTER CREDENTIALS FOR ALL 5 ROOMS =========\n\n";
    allCreds.forEach(c => {
        masterTxt += `ROOM ${c.instance}\n`;
        masterTxt += `--------------------------------------------------\n`;
        masterTxt += `ADMIN:  ${c.admin}\n`;
        masterTxt += `SCREEN: ${c.screen}\n\n`;
        masterTxt += `TEAMS:\n`;
        c.teams.forEach(t => {
            masterTxt += `${t.username.padEnd(10)} : ${t.password}\n`;
        });
        masterTxt += `\n\n`;
    });

    fs.writeFileSync('MASTER_CREDENTIALS.txt', masterTxt);
    console.log("✅ All 5 instances generated! MASTER_CREDENTIALS.txt created.");
}

main().catch(console.error);
