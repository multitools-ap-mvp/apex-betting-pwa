import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coinsApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import { Coins, Gift, History, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import { formatCoins, formatDate } from '../lib/utils'

export default function CoinsPage() {
  const { user } = useAuthStore()
  const { showToast } = useUIStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['coins'],
    queryFn: coinsApi.getBalance,
  })

  const claimMutation = useMutation({
    mutationFn: coinsApi.claimDaily,
    onSuccess: () => {
      showToast('300 ApeXCoins claimed!', 'success')
      queryClient.invalidateQueries({ queryKey: ['coins'] })
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
    onError: (err: any) => {
      showToast(err.message || 'Failed to claim coins', 'error')
    },
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'welcome_bonus': return <Gift size={16} className="text-apex-gold" />
      case 'daily_bonus': return <Gift size={16} className="text-green-400" />
      case 'bet_placed': return <ArrowDownRight size={16} className="text-red-400" />
      case 'bet_won': return <ArrowUpRight size={16} className="text-green-400" />
      default: return <Coins size={16} className="text-apex-text-muted" />
    }
  }

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Coins size={28} className="text-apex-gold" />
        <div>
          <h1 className="text-2xl font-bold text-white font-apex">APEXCOINS</h1>
          <p className="text-sm text-apex-text-muted">Manage your virtual currency</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-apex-gray to-apex-gray-light border border-apex-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coins size={24} className="text-apex-gold" />
            <span className="text-sm font-medium text-apex-text-muted">Current Balance</span>
          </div>
          {data?.dailyCoinsAvailable && (
            <button
              onClick={() => claimMutation.mutate()}
              disabled={claimMutation.isPending}
              className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            >
              {claimMutation.isPending ? 'Claiming...' : 'Claim Daily +300'}
            </button>
          )}
        </div>
        <div className="text-4xl font-bold text-apex-gold font-apex">
          {isLoading ? '...' : formatCoins(data?.balance || 0)} <span className="text-lg text-apex-gold-light">AC</span>
        </div>
        {!data?.dailyCoinsAvailable && (
          <div className="flex items-center gap-2 mt-3 text-sm text-apex-text-muted">
            <Clock size={14} />
            <span>Next daily claim available in 24 hours</span>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-apex-gray border border-apex-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-apex-border flex items-center gap-2">
          <History size={18} className="text-apex-text-muted" />
          <h2 className="text-lg font-semibold text-white">Transaction History</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-apex-red mx-auto" />
          </div>
        ) : data?.transactions?.length === 0 ? (
          <div className="p-8 text-center text-apex-text-muted">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-apex-border">
            {data?.transactions?.map((tx: any) => (
              <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-apex-gray-light/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-apex-dark flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white capitalize">
                      {tx.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-apex-text-muted">
                      {formatDate(tx.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getTransactionColor(tx.amount)}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCoins(tx.amount)} AC
                  </p>
                  <p className="text-xs text-apex-text-muted">
                    Balance: {formatCoins(tx.balance_after)} AC
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
