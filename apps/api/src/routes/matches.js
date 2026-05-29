import express from 'express';
import { z } from 'zod';
import { pool } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

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

// Get all matches (public)
router.get('/', async (req, res, next) => {
  try {
    const { status = 'all', upcoming = false } = req.query;

    let query = `
      SELECT m.*,
        COALESCE(SUM(CASE WHEN b.picked_team = 'team_a' THEN b.amount ELSE 0 END), 0) as pool_team_a,
        COALESCE(SUM(CASE WHEN b.picked_team = 'team_b' THEN b.amount ELSE 0 END), 0) as pool_team_b,
        COUNT(b.id) as total_bets
      FROM matches m
      LEFT JOIN bets b ON m.id = b.match_id AND b.status = 'placed'
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (status !== 'all') {
      query += ` AND m.status = $${paramIndex++}`;
      params.push(status);
    }

    if (upcoming === 'true') {
      query += ` AND m.match_start_at > NOW()`;
    }

    query += ` GROUP BY m.id ORDER BY m.match_start_at DESC`;

    const result = await pool.query(query, params);

    // Calculate parimutuel odds for each match
    const matches = result.rows.map(match => {
      const poolA = parseInt(match.pool_team_a) || 0;
      const poolB = parseInt(match.pool_team_b) || 0;
      const totalPool = poolA + poolB;
      const houseFee = totalPool * 0.05;
      const prizePool = totalPool - houseFee;

      return {
        ...match,
        odds: {
          teamA: poolA > 0 ? (prizePool / poolA).toFixed(3) : '1.000',
          teamB: poolB > 0 ? (prizePool / poolB).toFixed(3) : '1.000'
        },
        pool: {
          teamA: poolA,
          teamB: poolB,
          total: totalPool,
          houseFee: houseFee
        }
      };
    });

    res.json(matches);
  } catch (error) {
    next(error);
  }
});

// Get single match
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT m.*,
        COALESCE(SUM(CASE WHEN b.picked_team = 'team_a' THEN b.amount ELSE 0 END), 0) as pool_team_a,
        COALESCE(SUM(CASE WHEN b.picked_team = 'team_b' THEN b.amount ELSE 0 END), 0) as pool_team_b
       FROM matches m
       LEFT JOIN bets b ON m.id = b.match_id AND b.status = 'placed'
       WHERE m.id = $1
       GROUP BY m.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = result.rows[0];
    const poolA = parseInt(match.pool_team_a) || 0;
    const poolB = parseInt(match.pool_team_b) || 0;
    const totalPool = poolA + poolB;
    const houseFee = totalPool * 0.05;
    const prizePool = totalPool - houseFee;

    res.json({
      ...match,
      odds: {
        teamA: poolA > 0 ? (prizePool / poolA).toFixed(3) : '1.000',
        teamB: poolB > 0 ? (prizePool / poolB).toFixed(3) : '1.000'
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as matchesRouter };
