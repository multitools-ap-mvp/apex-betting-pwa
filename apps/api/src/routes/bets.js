import express from 'express';
import { z } from 'zod';
import { pool, withTransaction } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const placeBetSchema = z.object({
  matchId: z.string().uuid(),
  pickedTeam: z.enum(['team_a', 'team_b']),
  amount: z.number().int().min(100, 'Minimum bet is 100 ApeXCoins').max(10000, 'Maximum bet is 10,000 ApeXCoins')
});

// Place a bet
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { matchId, pickedTeam, amount } = placeBetSchema.parse(req.body);
    const userId = req.user.id;

    await withTransaction(async (client) => {
      // 1. Check match exists and is open for betting
      const matchResult = await client.query(
        `SELECT id, status, betting_closes_at, match_start_at 
         FROM matches WHERE id = $1 FOR UPDATE`,
        [matchId]
      );

      if (matchResult.rows.length === 0) {
        throw { statusCode: 404, message: 'Match not found' };
      }

      const match = matchResult.rows[0];
      const now = new Date();

      if (match.status !== 'upcoming') {
        throw { statusCode: 400, message: 'Betting is closed for this match' };
      }

      if (new Date(match.betting_closes_at) < now) {
        throw { statusCode: 400, message: 'Betting window has closed' };
      }

      // 2. Check user balance
      const balanceResult = await client.query(
        'SELECT amount FROM balances WHERE user_id = $1 FOR UPDATE',
        [userId]
      );

      if (balanceResult.rows.length === 0) {
        throw { statusCode: 400, message: 'No balance found' };
      }

      const currentBalance = balanceResult.rows[0].amount;

      if (currentBalance < amount) {
        throw { statusCode: 400, message: `Insufficient balance. You have ${currentBalance} ApeXCoins` };
      }

      // 3. Calculate current odds snapshot
      const poolResult = await client.query(
        `SELECT 
          COALESCE(SUM(CASE WHEN picked_team = 'team_a' THEN amount ELSE 0 END), 0) as pool_a,
          COALESCE(SUM(CASE WHEN picked_team = 'team_b' THEN amount ELSE 0 END), 0) as pool_b
         FROM bets WHERE match_id = $1 AND status = 'placed'`,
        [matchId]
      );

      const poolA = parseInt(poolResult.rows[0].pool_a) || 0;
      const poolB = parseInt(poolResult.rows[0].pool_b) || 0;
      const totalPool = poolA + poolB + amount; // Include current bet
      const houseFee = totalPool * 0.05;
      const prizePool = totalPool - houseFee;
      const targetPool = pickedTeam === 'team_a' ? poolA + amount : poolB + amount;
      const oddsAtBet = targetPool > 0 ? prizePool / targetPool : 1;

      // 4. Deduct balance
      const newBalance = currentBalance - amount;
      await client.query(
        'UPDATE balances SET amount = $1, updated_at = NOW() WHERE user_id = $2',
        [newBalance, userId]
      );

      // 5. Create bet
      const betResult = await client.query(
        `INSERT INTO bets (user_id, match_id, picked_team, amount, odds_at_bet, status)
         VALUES ($1, $2, $3, $4, $5, 'placed')
         RETURNING *`,
        [userId, matchId, pickedTeam, amount, oddsAtBet.toFixed(4)]
      );

      // 6. Log transaction
      await client.query(
        `INSERT INTO transactions (user_id, type, amount, balance_after, reference_id, metadata)
         VALUES ($1, 'bet_placed', $2, $3, $4, $5)`,
        [userId, -amount, newBalance, betResult.rows[0].id, 
         JSON.stringify({ match_id: matchId, picked_team: pickedTeam, odds: oddsAtBet })]
      );

      return betResult.rows[0];
    });

    res.status(201).json({
      message: 'Bet placed successfully',
      bet: result
    });
  } catch (error) {
    next(error);
  }
});

// Get user's bets
router.get('/my-bets', authenticate, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT b.*, m.title, m.team_a, m.team_b, m.winner, m.status as match_status, m.result_details
       FROM bets b
       JOIN matches m ON b.match_id = m.id
       WHERE b.user_id = $1
       ORDER BY b.placed_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export { router as betsRouter };
