import { pool } from '../config/database.js';

/**
 * Calculate parimutuel odds for a match
 * @param {string} matchId - UUID of the match
 * @returns {Promise<Object>} Odds and pool information
 */
export async function calculateOdds(matchId) {
  const result = await pool.query(
    `SELECT 
      COALESCE(SUM(CASE WHEN picked_team = 'team_a' THEN amount ELSE 0 END), 0) as pool_a,
      COALESCE(SUM(CASE WHEN picked_team = 'team_b' THEN amount ELSE 0 END), 0) as pool_b,
      COUNT(*) as total_bets
     FROM bets WHERE match_id = $1 AND status = 'placed'`,
    [matchId]
  );

  const poolA = parseInt(result.rows[0].pool_a) || 0;
  const poolB = parseInt(result.rows[0].pool_b) || 0;
  const totalPool = poolA + poolB;
  const houseFee = totalPool * 0.05;
  const prizePool = totalPool - houseFee;

  return {
    poolA,
    poolB,
    totalPool,
    houseFee,
    prizePool,
    odds: {
      teamA: poolA > 0 ? parseFloat((prizePool / poolA).toFixed(3)) : 1.0,
      teamB: poolB > 0 ? parseFloat((prizePool / poolB).toFixed(3)) : 1.0
    },
    impliedProbability: {
      teamA: totalPool > 0 ? ((poolA / totalPool) * 100).toFixed(1) + '%' : '50%',
      teamB: totalPool > 0 ? ((poolB / totalPool) * 100).toFixed(1) + '%' : '50%'
    }
  };
}

/**
 * Get odds for multiple matches at once
 */
export async function getOddsForMatches(matchIds) {
  const result = await pool.query(
    `SELECT match_id,
      COALESCE(SUM(CASE WHEN picked_team = 'team_a' THEN amount ELSE 0 END), 0) as pool_a,
      COALESCE(SUM(CASE WHEN picked_team = 'team_b' THEN amount ELSE 0 END), 0) as pool_b
     FROM bets 
     WHERE match_id = ANY($1) AND status = 'placed'
     GROUP BY match_id`,
    [matchIds]
  );

  const oddsMap = {};
  for (const row of result.rows) {
    const poolA = parseInt(row.pool_a) || 0;
    const poolB = parseInt(row.pool_b) || 0;
    const totalPool = poolA + poolB;
    const houseFee = totalPool * 0.05;
    const prizePool = totalPool - houseFee;

    oddsMap[row.match_id] = {
      teamA: poolA > 0 ? parseFloat((prizePool / poolA).toFixed(3)) : 1.0,
      teamB: poolB > 0 ? parseFloat((prizePool / poolB).toFixed(3)) : 1.0,
      totalPool,
      houseFee
    };
  }

  return oddsMap;
}
