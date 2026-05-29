import { useQuery } from '@tanstack/react-query'
import { betsApi } from '../services/api'
import { BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react'
import { formatCoins, formatDate, formatOdds } from '../lib/utils'

export default function ResultsPage() {
  const { data: bets, isLoading } = useQuery({
    queryKey: ['my-bets'],
    queryFn: betsApi.getMyBets,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <CheckCircle size={18} className="text-green-400" />
      case 'lost': return <XCircle size={18} className="text-red-400" />
      default: return <Clock size={18} className="text-yellow-400" />
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 size={28} className="text-apex-red" />
        <div>
          <h1 className="text-2xl font-bold text-white font-apex">MY RESULTS</h1>
          <p className="text-sm text-apex-text-muted">Your betting history and outcomes</p>
        </div>
      </div>

      {/* Stats Summary */}
      {bets && bets.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-apex-gray border border-apex-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white font-apex">{bets.length}</p>
            <p className="text-xs text-apex-text-muted">Total Bets</p>
          </div>
          <div className="bg-apex-gray border border-apex-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400 font-apex">
              {bets.filter((b: any) => b.status === 'won').length}
            </p>
            <p className="text-xs text-apex-text-muted">Wins</p>
          </div>
          <div className="bg-apex-gray border border-apex-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-apex-gold font-apex">
              {formatCoins(bets.reduce((sum: number, b: any) => sum + (b.potential_payout || 0), 0))}
            </p>
            <p className="text-xs text-apex-text-muted">Total Won</p>
          </div>
        </div>
      )}

      {/* Bets List */}
      <div className="bg-apex-gray border border-apex-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-apex-border">
          <h2 className="text-lg font-semibold text-white">Bet History</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-apex-red mx-auto" />
          </div>
        ) : bets?.length === 0 ? (
          <div className="p-8 text-center text-apex-text-muted">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p>No bets placed yet</p>
            <p className="text-sm mt-1">Head to the betting page to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-apex-border">
            {bets?.map((bet: any) => (
              <div key={bet.id} className="px-6 py-4 hover:bg-apex-gray-light/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(bet.status)}
                    <span className="text-sm font-semibold text-white">{bet.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusStyle(bet.status)}`}>
                    {bet.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-xs text-apex-text-muted">Picked</p>
                    <p className="text-white font-medium">
                      {bet.picked_team === 'team_a' ? bet.team_a : bet.team_b}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-apex-text-muted">Amount</p>
                    <p className="text-white font-medium">{formatCoins(bet.amount)} AC</p>
                  </div>
                  <div>
                    <p className="text-xs text-apex-text-muted">Odds</p>
                    <p className="text-apex-gold font-medium">{formatOdds(parseFloat(bet.odds_at_bet))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-apex-text-muted">
                      {bet.status === 'won' ? 'Won' : bet.status === 'lost' ? 'Lost' : 'Potential'}
                    </p>
                    <p className={`font-bold ${bet.status === 'won' ? 'text-green-400' : 'text-white'}`}>
                      {bet.status === 'won' 
                        ? `+${formatCoins(bet.potential_payout - bet.amount)} AC`
                        : bet.status === 'placed'
                        ? `${formatCoins(Math.floor(bet.amount * parseFloat(bet.odds_at_bet)))} AC`
                        : `-${formatCoins(bet.amount)} AC`
                      }
                    </p>
                  </div>
                </div>

                <p className="text-xs text-apex-text-muted mt-2">
                  Placed on {formatDate(bet.placed_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
