import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { period = 'all', limit = 100 } = req.query;

    let query = `
      SELECT u.id, u.display_name, b.amount as balance,
        COUNT(DISTINCT bet.id) as total_bets,
        COUNT(DISTINCT CASE WHEN bet.status = 'won' THEN bet.id END) as wins,
        COALESCE(SUM(CASE WHEN bet.status = 'won' THEN bet.potential_payout - bet.amount 
                         WHEN bet.status = 'lost' THEN -bet.amount ELSE 0 END), 0) as net_profit
      FROM users u
      JOIN balances b ON u.id = b.user_id
      LEFT JOIN bets bet ON u.id = bet.user_id
      WHERE u.is_active = true
      GROUP BY u.id, u.display_name, b.amount
      ORDER BY b.amount DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [parseInt(limit) || 100]);

    // Add rank
    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      ...row,
      winRate: row.total_bets > 0 
        ? ((row.wins / row.total_bets) * 100).toFixed(1) + '%' 
        : '0%'
    }));

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

export { router as leaderboardRouter };
