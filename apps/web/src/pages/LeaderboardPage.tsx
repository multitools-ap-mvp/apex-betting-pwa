import { useQuery } from '@tanstack/react-query'
import { leaderboardApi } from '../services/api'
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react'
import { formatCoins } from '../lib/utils'

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardApi.getAll(100),
  })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-400" />
    if (rank === 2) return <Medal size={20} className="text-gray-300" />
    if (rank === 3) return <Medal size={20} className="text-amber-600" />
    return <span className="text-sm font-bold text-apex-text-muted w-5 text-center">{rank}</span>
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30'
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/30'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-transparent border-amber-600/30'
    return 'border-apex-border hover:border-apex-red/30'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Trophy size={28} className="text-apex-gold" />
        <div>
          <h1 className="text-2xl font-bold text-white font-apex">LEADERBOARD</h1>
          <p className="text-sm text-apex-text-muted">Top players by ApeXCoin balance</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-apex-gray border border-apex-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-apex-border text-xs font-medium text-apex-text-muted uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-3 text-right">Balance</div>
          <div className="col-span-3 text-right">Stats</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-apex-red mx-auto" />
          </div>
        ) : leaderboard?.length === 0 ? (
          <div className="p-8 text-center text-apex-text-muted">
            <p>No players yet</p>
          </div>
        ) : (
          <div className="divide-y divide-apex-border">
            {leaderboard?.map((player: any) => (
              <div 
                key={player.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-l-2 transition-all ${getRankStyle(player.rank)}`}
              >
                <div className="col-span-1 flex items-center">
                  {getRankIcon(player.rank)}
                </div>
                <div className="col-span-5">
                  <p className="text-sm font-semibold text-white">{player.display_name}</p>
                </div>
                <div className="col-span-3 text-right">
                  <p className="text-sm font-bold text-apex-gold font-apex">
                    {formatCoins(player.balance)} AC
                  </p>
                </div>
                <div className="col-span-3 text-right">
                  <div className="flex items-center justify-end gap-3 text-xs text-apex-text-muted">
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      {player.win_rate}
                    </span>
                    <span>{player.total_bets} bets</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
