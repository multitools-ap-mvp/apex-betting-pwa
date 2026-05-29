import { pool, testConnection } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  console.log('🔄 Running database migrations...');

  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to database. Is PostgreSQL running?');
    process.exit(1);
  }

  try {
    // Read and execute migration file
    const migrationPath = path.join(__dirname, '../../migrations/001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await pool.query(sql);
    console.log('✅ Migrations completed successfully');

    // Create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Log this migration
    await pool.query(
      'INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT DO NOTHING',
      ['001_init.sql']
    );

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
