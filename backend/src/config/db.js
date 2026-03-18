import pkg from 'pg';
const { Pool } = pkg;

// Basic PostgreSQL connection pool setup
// Schema and models will be defined in future prompts
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export default pool;
