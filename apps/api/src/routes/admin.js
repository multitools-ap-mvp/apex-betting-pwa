import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { pool, withTransaction } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Create match
router.post('/matches', async (req, res, next) => {
  try {
    const matchSchema = z.object({
      title: z.string().min(3),
      teamA: z.string().min(1),
      teamB: z.string().min(1),
      teamALogoUrl: z.string().url().optional().nullable(),
      teamBLogoUrl: z.string().url().optional().nullable(),
      tournament: z.string().optional().nullable(),
      matchStartAt: z.string().datetime(),
      bettingClosesAt: z.string().datetime().optional()
    });

    const data = matchSchema.parse(req.body);

    const bettingClosesAt = data.bettingClosesAt || data.matchStartAt;

    const result = await pool.query(
      `INSERT INTO matches (title, team_a, team_b, team_a_logo_url, team_b_logo_url, 
        tournament, match_start_at, betting_closes_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [data.title, data.teamA, data.teamB, data.teamALogoUrl, data.teamBLogoUrl,
       data.tournament, data.matchStartAt, bettingClosesAt, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// List all matches (admin view with more details)
router.get('/matches', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT m.*,
        u.display_name as created_by_name,
        COUNT(b.id) as total_bets,
        COALESCE(SUM(b.amount), 0) as total_volume
       FROM matches m
       LEFT JOIN users u ON m.created_by = u.id
       LEFT JOIN bets b ON m.id = b.match_id
       GROUP BY m.id, u.display_name
       ORDER BY m.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Mark match result & process payouts
router.post('/matches/:id/resolve', async (req, res, next) => {
  try {
    const { winner } = z.object({
      winner: z.enum(['team_a', 'team_b', 'draw'])
    }).parse(req.body);

    const matchId = req.params.id;

    await withTransaction(async (client) => {
      // 1. Lock match
      const matchResult = await client.query(
        `SELECT * FROM matches WHERE id = $1 AND status = 'upcoming' FOR UPDATE`,
        [matchId]
      );

      if (matchResult.rows.length === 0) {
        throw { statusCode: 404, message: 'Match not found or already resolved' };
      }

      const match = matchResult.rows[0];

      // 2. Get all bets
      const betsResult = await client.query(
        `SELECT * FROM bets WHERE match_id = $1 AND status = 'placed' FOR UPDATE`,
        [matchId]
      );

      const totalPool = betsResult.rows.reduce((sum, b) => sum + parseInt(b.amount), 0);
      const houseFee = Math.floor(totalPool * 0.05);
      const prizePool = totalPool - houseFee;

      const winningBets = betsResult.rows.filter(b => b.picked_team === winner);
      const winningTotal = winningBets.reduce((sum, b) => sum + parseInt(b.amount), 0);

      // 3. Update match
      await client.query(
        `UPDATE matches SET status = 'completed', winner = $1, resolved_at = NOW() 
         WHERE id = $2`,
        [winner, matchId]
      );

      // 4. Process payouts
      for (const bet of betsResult.rows) {
        if (bet.picked_team === winner) {
          // Winner: calculate payout proportional to their bet
          const payout = Math.floor((bet.amount / winningTotal) * prizePool);
          const profit = payout - bet.amount;

          // Update balance
          await client.query(
            `UPDATE balances SET amount = amount + $1, updated_at = NOW() WHERE user_id = $2`,
            [payout, bet.user_id]
          );

          // Get new balance
          const balanceResult = await client.query(
            'SELECT amount FROM balances WHERE user_id = $1',
            [bet.user_id]
          );

          // Update bet
          await client.query(
            `UPDATE bets SET status = 'won', potential_payout = $1, resolved_at = NOW() 
             WHERE id = $2`,
            [payout, bet.id]
          );

          // Log transaction
          await client.query(
            `INSERT INTO transactions (user_id, type, amount, balance_after, reference_id, metadata)
             VALUES ($1, 'bet_won', $2, $3, $4, $5)`,
            [bet.user_id, profit, balanceResult.rows[0].amount, bet.id,
             JSON.stringify({ match_id: matchId, original_bet: bet.amount, payout: payout })]
          );
        } else {
          // Loser
          await client.query(
            `UPDATE bets SET status = 'lost', resolved_at = NOW() WHERE id = $1`,
            [bet.id]
          );
        }
      }

      return { matchId, totalPool, houseFee, prizePool, winnersCount: winningBets.length };
    });

    res.json({
      message: 'Match resolved successfully',
      details: result
    });
  } catch (error) {
    next(error);
  }
});

// List all users
router.get('/users', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.display_name, u.role, u.is_active, u.created_at, u.last_login_at,
        COALESCE(b.amount, 0) as balance
       FROM users u
       LEFT JOIN balances b ON u.id = b.user_id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Manual coin adjustment
router.post('/users/:id/adjust-balance', async (req, res, next) => {
  try {
    const { amount, reason } = z.object({
      amount: z.number().int(),
      reason: z.string().min(1)
    }).parse(req.body);

    const userId = req.params.id;

    await withTransaction(async (client) => {
      const balanceResult = await client.query(
        'SELECT amount FROM balances WHERE user_id = $1 FOR UPDATE',
        [userId]
      );

      if (balanceResult.rows.length === 0 && amount > 0) {
        await client.query(
          'INSERT INTO balances (user_id, amount) VALUES ($1, $2)',
          [userId, amount]
        );
      } else if (balanceResult.rows.length > 0) {
        const newBalance = balanceResult.rows[0].amount + amount;
        if (newBalance < 0) {
          throw { statusCode: 400, message: 'Balance cannot go negative' };
        }
        await client.query(
          'UPDATE balances SET amount = $1, updated_at = NOW() WHERE user_id = $2',
          [newBalance, userId]
        );
      } else {
        throw { statusCode: 400, message: 'User has no balance record' };
      }

      const newBalanceResult = await client.query(
        'SELECT amount FROM balances WHERE user_id = $1',
        [userId]
      );

      await client.query(
        `INSERT INTO transactions (user_id, type, amount, balance_after, metadata)
         VALUES ($1, 'admin_adjustment', $2, $3, $4)`,
        [userId, amount, newBalanceResult.rows[0].amount, 
         JSON.stringify({ reason, admin_id: req.user.id })]
      );

      return newBalanceResult.rows[0].amount;
    });

    res.json({ message: 'Balance adjusted', newBalance: result });
  } catch (error) {
    next(error);
  }
});

// Email all users (basic implementation)
router.post('/email-blast', async (req, res, next) => {
  try {
    const { subject, body } = z.object({
      subject: z.string().min(1),
      body: z.string().min(1)
    }).parse(req.body);

    // For MVP: just log it. In production, integrate with SendGrid/AWS SES
    const users = await pool.query('SELECT email, display_name FROM users WHERE is_active = true');

    console.log(`📧 Email blast to ${users.rows.length} users:`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    res.json({ 
      message: 'Email blast queued', 
      recipientCount: users.rows.length,
      note: 'Integrate with email service (SendGrid/AWS SES) for production'
    });
  } catch (error) {
    next(error);
  }
});

export { router as adminRouter };
