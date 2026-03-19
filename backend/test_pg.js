import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://auction_user:auction_pass@127.0.0.1:5432/ipl_auction?schema=public'
});

async function test() {
  try {
    await client.connect();
    console.log('✅ pg driver connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Result:', res.rows[0]);
  } catch (err) {
    console.error('❌ pg driver failed:', err.message);
  } finally {
    await client.end();
  }
}

test();
