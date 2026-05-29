import { pool, testConnection } from '../config/database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to database');
    process.exit(1);
  }

  try {
    // Check if admin already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@apex-betting.com']);

    if (existing.rows.length > 0) {
      console.log('ℹ️  Admin user already exists, skipping seed');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Apex123', 12);

    const adminResult = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['admin@apex-betting.com', hashedPassword, 'Apex', 'admin']
    );

    const adminId = adminResult.rows[0].id;

    // Give admin starting balance
    await pool.query(
      'INSERT INTO balances (user_id, amount) VALUES ($1, $2)',
      [adminId, 10000]
    );

    console.log('✅ Admin user created:');
    console.log('   Email: admin@apex-betting.com');
    console.log('   Password: Apex123');
    console.log('   Balance: 10,000 ApeXCoins');

    // Create sample matches for testing
    const sampleMatches = [
      {
        title: 'ALGS Split 2 Playoffs - Grand Finals',
        team_a: 'TSM',
        team_b: 'NRG',
        tournament: 'ALGS 2025',
        match_start_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        betting_closes_at: new Date(Date.now() + 86400000 * 2).toISOString()
      },
      {
        title: 'EWC 2025 - Group Stage',
        team_a: 'DarkZero',
        team_b: 'FaZe Clan',
        tournament: 'Esports World Cup 2025',
        match_start_at: new Date(Date.now() + 86400000 * 3).toISOString(),
        betting_closes_at: new Date(Date.now() + 86400000 * 3).toISOString()
      },
      {
        title: 'ALGS Pro League - Week 4',
        team_a: 'Complexity',
        team_b: '100 Thieves',
        tournament: 'ALGS 2025',
        match_start_at: new Date(Date.now() + 86400000).toISOString(),
        betting_closes_at: new Date(Date.now() + 86400000).toISOString()
      }
    ];

    for (const match of sampleMatches) {
      await pool.query(
        `INSERT INTO matches (title, team_a, team_b, tournament, match_start_at, betting_closes_at, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [match.title, match.team_a, match.team_b, match.tournament, 
         match.match_start_at, match.betting_closes_at, adminId]
      );
    }

    console.log(`✅ Created ${sampleMatches.length} sample matches`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
