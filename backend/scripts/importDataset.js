import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const FALLBACK_URLS = [
    process.env.DATABASE_URL,
    'postgresql://auction_user:auction_pass@localhost:5432/ipl_auction',
    'postgresql://postgres:auction_pass@localhost:5432/ipl_auction',
    'postgresql://postgres:postgres@localhost:5432/ipl_auction'
].filter(Boolean);

const CSV_PATH = path.resolve('resources/ipl2026_rated_players_auction.csv');

async function run() {
    let pool;
    for (const url of FALLBACK_URLS) {
        try {
            console.log(`尝试连接: ${url.split('@')[1]}`); // Mask credentials in log
            const tempPool = new Pool({ connectionString: url });
            await tempPool.query('SELECT 1');
            pool = tempPool;
            console.log("✅ Connection established!");
            break;
        } catch (e) {
            console.log(`❌ Connection failed for this URL.`);
        }
    }

    if (!pool) {
        console.error("❌ All connection attempts failed. Check database availability and credentials.");
        process.exit(1);
    }

    try {
        console.log("🚀 Starting Database Migration and Import...");

        // 1. Update Schema
        console.log("📝 Updating schema...");
        await pool.query(`
            ALTER TABLE players ADD COLUMN IF NOT EXISTS original_team_name VARCHAR(255);
            ALTER TABLE players ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
            ALTER TABLE players ADD COLUMN IF NOT EXISTS image_url TEXT;
            ALTER TABLE players ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}';
            ALTER TABLE players ALTER COLUMN overall_points TYPE DECIMAL(10, 2);
        `);

        // 2. Read CSV
        const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        console.log(`📊 Found ${lines.length - 1} players in CSV. Filtering Grade D...`);

        // 3. Clear existing players
        await pool.query('DELETE FROM players');

        let importCount = 0;

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const values = lines[i].split(',').map(v => v.trim());
            const player = {};
            headers.forEach((header, index) => {
                player[header] = values[index];
            });

            // Filter out Grade D
            if (player.Grade === 'D') continue;

            // Map Category to DB Column Role
            const roleMap = {
                'BAT': 'BAT',
                'BOWL': 'BOWL',
                'AR': 'AR',
                'WK': 'WK'
            };
            const role = roleMap[player.Category] || 'BAT';

            // Derived foreign status
            const isForeign = player.Nationality !== 'Indian';

            // Base Price Logic (based on Grade if not specified)
            let basePrice = 2.0;
            if (player.Grade === 'A') basePrice = 2.0;
            else if (player.Grade === 'B') basePrice = 1.0;
            else if (player.Grade === 'C') basePrice = 0.5;

            // Collect sub-stats into JSONB
            const stats = {};
            headers.forEach(h => {
                if (h.startsWith('Sub_') || h.includes('Bat_') || h.includes('Bowl_') || h === 'Matches' || h === 'Legacy') {
                    stats[h] = isNaN(parseFloat(player[h])) ? player[h] : parseFloat(player[h]);
                }
            });

            const query = `
                INSERT INTO players (
                    name, role, grade, base_price, overall_points, 
                    foreign_status, original_team_name, nationality, image_url, stats
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;

            await pool.query(query, [
                player.Player,
                role,
                player.Grade,
                basePrice,
                parseFloat(player.Rating) || 0,
                isForeign,
                player.Team,
                player.Nationality,
                player.URL,
                JSON.stringify(stats)
            ]);

            importCount++;
        }

        console.log(`✅ Success! Imported ${importCount} players.`);
        process.exit(0);

    } catch (err) {
        console.error("❌ Error during import:", err);
        process.exit(1);
    }
}

run();
