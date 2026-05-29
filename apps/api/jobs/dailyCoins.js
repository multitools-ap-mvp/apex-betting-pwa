import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis.js';
import { pool } from '../config/database.js';

const DAILY_COINS_QUEUE = 'daily-coins';

export const dailyCoinsQueue = new Queue(DAILY_COINS_QUEUE, {
  connection: redis
});

export async function initializeQueue() {
  console.log('🔄 Initializing BullMQ daily coins queue...');

  const worker = new Worker(DAILY_COINS_QUEUE, async (job) => {
    console.log(`⏰ Processing daily coins job: ${job.id}`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Find users who haven't claimed in 24h
      const eligibleUsers = await client.query(`
        SELECT id FROM users 
        WHERE is_active = true 
        AND role = 'user'
        AND (daily_coins_claimed_at IS NULL OR daily_coins_claimed_at < NOW() - INTERVAL '24 hours')
      `);

      console.log(`💰 Auto-crediting ${eligibleUsers.rows.length} users with daily coins`);

      for (const user of eligibleUsers.rows) {
        // Get current balance
        const balanceResult = await client.query(
          'SELECT amount FROM balances WHERE user_id = $1 FOR UPDATE',
          [user.id]
        );

        let newBalance;
        if (balanceResult.rows.length === 0) {
          await client.query(
            'INSERT INTO balances (user_id, amount) VALUES ($1, 300)',
            [user.id]
          );
          newBalance = 300;
        } else {
          newBalance = balanceResult.rows[0].amount + 300;
          await client.query(
            'UPDATE balances SET amount = $1, updated_at = NOW() WHERE user_id = $2',
            [newBalance, user.id]
          );
        }

        // Update claim time
        await client.query(
          'UPDATE users SET daily_coins_claimed_at = NOW() WHERE id = $1',
          [user.id]
        );

        // Log transaction
        await client.query(
          `INSERT INTO transactions (user_id, type, amount, balance_after, metadata)
           VALUES ($1, 'daily_bonus', 300, $2, $3)`,
          [user.id, newBalance, JSON.stringify({ reason: 'Auto daily bonus', source: 'cron' })]
        );
      }

      await client.query('COMMIT');
      console.log(`✅ Daily coins processed for ${eligibleUsers.rows.length} users`);

      return { processed: eligibleUsers.rows.length };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }, {
    connection: redis,
    concurrency: 1
  });

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed:`, job.returnvalue);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed:`, err.message);
  });

  // Schedule recurring job (runs every day at midnight UTC)
  await dailyCoinsQueue.add('daily-coins-job', {}, {
    repeat: {
      cron: '0 0 * * *' // Every day at midnight UTC
    },
    jobId: 'daily-coins-recurring'
  });

  console.log('✅ Daily coins queue initialized (runs at midnight UTC)');
}

// Manual trigger for testing
export async function triggerDailyCoins() {
  return dailyCoinsQueue.add('daily-coins-manual', {}, {
    jobId: `daily-coins-manual-${Date.now()}`
  });
}
