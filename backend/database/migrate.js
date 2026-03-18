import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    console.log('Connecting to database...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('Connected.');
        
        const schemaPath = path.join(__dirname, 'init_schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Executing schema...');
        await client.query(sql);
        console.log('✅ Migration completed successfully.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigration();
