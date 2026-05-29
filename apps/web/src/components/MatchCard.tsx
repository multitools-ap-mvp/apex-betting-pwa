import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import { betsApi } from '../services/api'
import { Swords, Clock, Users, TrendingUp } from 'lucide-react'
import { cn, formatDate, formatCoins, formatOdds } from '../lib/utils'

interface Match {
  id: string
  title: string
  team_a: string
  team_b: string
  team_a_logo_url?: string
  team_b_logo_url?: string
  tournament?: string
  match_start_at: string
  status: string
  odds: {
    teamA: string
    teamB: string
  }
  pool: {
    teamA: number
    teamB: number
    total: number
  }
}

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const { user } = useAuthStore()
  const { showToast } = useUIStore()
  const navigate = useNavigate()
  const [bettingTeam, setBettingTeam] = useState<'team_a' | 'team_b' | null>(null)
  const [betAmount, setBetAmount] = useState(100)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpcoming = match.status === 'upcoming'
  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'

  const handlePlaceBet = async () => {
    if (!bettingTeam || !user) return

    if (betAmount < 100) {
      showToast('Minimum bet is 100 ApeXCoins', 'error')
      return
    }

    if (betAmount > user.balance) {
      showToast('Insufficient balance', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await betsApi.place(match.id, bettingTeam, betAmount)
      showToast(`Bet placed on ${bettingTeam === 'team_a' ? match.team_a : match.team_b}!`, 'success')
      setBettingTeam(null)
      setBetAmount(100)
      // Refresh user balance
      const auth = useAuthStore.getState()
      // In real app, invalidate query or refetch user
    } catch (err: any) {
      showToast(err.message || 'Failed to place bet', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn(
      "bg-apex-gray border border-apex-border rounded-xl overflow-hidden transition-all hover:border-apex-red/50",
      isLive && "border-apex-red animate-pulse-glow"
    )}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-apex-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-apex-red" />
          <span className="text-xs font-medium text-apex-text-muted uppercase tracking-wider">
            {match.tournament || 'Pro Match'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-apex-text-muted" />
          <span className="text-xs text-apex-text-muted">
            {formatDate(match.match_start_at)}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-apex-text-muted mb-4">{match.title}</h3>

        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Team A */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-apex-gray-light rounded-xl flex items-center justify-center mb-2 border border-apex-border">
              {match.team_a_logo_url ? (
                <img src={match.team_a_logo_url} alt={match.team_a} className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-apex-text-muted">
                  {match.team_a.charAt(0)}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white">{match.team_a}</p>
            <div className="mt-2">
              <span className="text-lg font-bold text-apex-gold">{formatOdds(parseFloat(match.odds.teamA))}</span>
            </div>
            <p className="text-xs text-apex-text-muted mt-1">
              Pool: {formatCoins(match.pool.teamA)}
            </p>
          </div>

          {/* VS */}
          <div className="text-center">
            <span className="text-2xl font-bold text-apex-red font-apex">VS</span>
            <div className="mt-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                isUpcoming && "bg-yellow-500/20 text-yellow-400",
                isLive && "bg-apex-red/20 text-apex-red animate-pulse",
                isCompleted && "bg-green-500/20 text-green-400"
              )}>
                {isUpcoming ? 'UPCOMING' : isLive ? 'LIVE' : 'FINISHED'}
              </span>
            </div>
          </div>

          {/* Team B */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-apex-gray-light rounded-xl flex items-center justify-center mb-2 border border-apex-border">
              {match.team_b_logo_url ? (
                <img src={match.team_b_logo_url} alt={match.team_b} className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-apex-text-muted">
                  {match.team_b.charAt(0)}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white">{match.team_b}</p>
            <div className="mt-2">
              <span className="text-lg font-bold text-apex-gold">{formatOdds(parseFloat(match.odds.teamB))}</span>
            </div>
            <p className="text-xs text-apex-text-muted mt-1">
              Pool: {formatCoins(match.pool.teamB)}
            </p>
          </div>
        </div>

        {/* Betting Section */}
        {isUpcoming && user && (
          <div className="mt-4 pt-4 border-t border-apex-border">
            {!bettingTeam ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setBettingTeam('team_a')}
                  className="py-2.5 bg-apex-gray-light border border-apex-border rounded-lg text-sm font-semibold text-white hover:bg-apex-red/20 hover:border-apex-red/50 transition-all"
                >
                  Bet on {match.team_a}
                </button>
                <button
                  onClick={() => setBettingTeam('team_b')}
                  className="py-2.5 bg-apex-gray-light border border-apex-border rounded-lg text-sm font-semibold text-white hover:bg-apex-red/20 hover:border-apex-red/50 transition-all"
                >
                  Bet on {match.team_b}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-apex-text-muted">
                    Betting on: <span className="text-white font-semibold">
                      {bettingTeam === 'team_a' ? match.team_a : match.team_b}
                    </span>
                  </span>
                  <button 
                    onClick={() => setBettingTeam(null)}
                    className="text-xs text-apex-text-muted hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={100}
                    max={user.balance}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(100, parseInt(e.target.value) || 0))}
                    className="flex-1 bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none"
                  />
                  <button
                    onClick={handlePlaceBet}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-apex-red hover:bg-apex-red-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : 'Place Bet'}
                  </button>
                </div>

                <p className="text-xs text-apex-text-muted">
                  Potential win: <span className="text-apex-gold font-semibold">
                    {formatCoins(Math.floor(betAmount * parseFloat(bettingTeam === 'team_a' ? match.odds.teamA : match.odds.teamB)))} AC
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Total Pool */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-apex-text-muted">
          <TrendingUp size={14} />
          <span>Total Pool: {formatCoins(match.pool.total)} AC</span>
        </div>
      </div>
    </div>
  )
}
