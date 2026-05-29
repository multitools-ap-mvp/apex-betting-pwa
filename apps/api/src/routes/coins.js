import express from 'express';
import { pool, withTransaction } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get balance & transaction history
router.get('/', authenticate, async (req, res, next) => {
  try {
    const [balanceResult, transactionsResult] = await Promise.all([
      pool.query('SELECT amount, updated_at FROM balances WHERE user_id = $1', [req.user.id]),
      pool.query(
        `SELECT * FROM transactions 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [req.user.id]
      )
    ]);

    res.json({
      balance: balanceResult.rows[0]?.amount || 0,
      lastUpdated: balanceResult.rows[0]?.updated_at,
      transactions: transactionsResult.rows,
      dailyCoinsAvailable: await checkDailyCoinsAvailable(req.user.id)
    });
  } catch (error) {
    next(error);
  }
});

// Claim daily 300 ApeXCoins
router.post('/claim-daily', authenticate, async (req, res, next) => {
  try {
    const canClaim = await checkDailyCoinsAvailable(req.user.id);

    if (!canClaim) {
      return res.status(400).json({ 
        error: 'Daily coins already claimed',
        nextClaimAt: await getNextClaimTime(req.user.id)
      });
    }

    await withTransaction(async (client) => {
      // Update or create balance
      const balanceResult = await client.query(
        'SELECT amount FROM balances WHERE user_id = $1 FOR UPDATE',
        [req.user.id]
      );

      let newBalance;
      if (balanceResult.rows.length === 0) {
        await client.query(
          'INSERT INTO balances (user_id, amount) VALUES ($1, 300)',
          [req.user.id]
        );
        newBalance = 300;
      } else {
        newBalance = balanceResult.rows[0].amount + 300;
        await client.query(
          'UPDATE balances SET amount = $1, updated_at = NOW() WHERE user_id = $2',
          [newBalance, req.user.id]
        );
      }

      // Update last claim time
      await client.query(
        'UPDATE users SET daily_coins_claimed_at = NOW() WHERE id = $1',
        [req.user.id]
      );

      // Log transaction
      await client.query(
        `INSERT INTO transactions (user_id, type, amount, balance_after, metadata)
         VALUES ($1, 'daily_bonus', 300, $2, $3)`,
        [req.user.id, newBalance, JSON.stringify({ reason: 'Daily login bonus' })]
      );

      return newBalance;
    });

    res.json({
      message: 'Daily coins claimed!',
      amount: 300,
      newBalance: result
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions
async function checkDailyCoinsAvailable(userId) {
  const result = await pool.query(
    'SELECT daily_coins_claimed_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) return true;

  const lastClaim = result.rows[0].daily_coins_claimed_at;
  if (!lastClaim) return true;

  const now = new Date();
  const lastClaimDate = new Date(lastClaim);
  const hoursSinceClaim = (now - lastClaimDate) / (1000 * 60 * 60);

  return hoursSinceClaim >= 24;
}

async function getNextClaimTime(userId) {
  const result = await pool.query(
    'SELECT daily_coins_claimed_at FROM users WHERE id = $1',
    [userId]
  );

  if (!result.rows[0]?.daily_coins_claimed_at) return null;

  const lastClaim = new Date(result.rows[0].daily_coins_claimed_at);
  const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
  return nextClaim.toISOString();
}

export { router as coinsRouter };
