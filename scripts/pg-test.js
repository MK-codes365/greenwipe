// scripts/pg-test.js
// Loads DATABASE_URL from .env and attempts a direct connection with `pg`.
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const { Client } = require('pg');

async function run() {
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error('No DATABASE_URL found in .env');
    process.exit(1);
  }

  console.log('Using connection string from .env (masked):', conn.replace(/:(.+)@/, ':*****@'));

  const client = new Client({
    connectionString: conn,
    // For debugging TLS issues, allow unauthorized certs temporarily. Not for production.
    ssl: { rejectUnauthorized: false },
    statement_timeout: 5000,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log('Connected. Postgres version:', res.rows[0]);
  } catch (err) {
    console.error('pg client error:', err && err.message ? err.message : err);
    console.error(err);
  } finally {
    try { await client.end(); } catch (e) {}
  }
}

run();
