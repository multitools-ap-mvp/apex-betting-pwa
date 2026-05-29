import { useQuery } from '@tanstack/react-query'
import { matchesApi } from '../services/api'
import MatchCard from '../components/MatchCard'
import { Swords, Filter } from 'lucide-react'
import { useState } from 'react'

export default function BettingPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all')

  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['matches', filter],
    queryFn: () => matchesApi.getAll({ status: filter === 'all' ? undefined : filter }),
  })

  const filters = [
    { key: 'all', label: 'All Matches' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'live', label: 'Live' },
    { key: 'completed', label: 'Completed' },
  ] as const

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Swords size={28} className="text-apex-red" />
          <div>
            <h1 className="text-2xl font-bold text-white font-apex">BETTING</h1>
            <p className="text-sm text-apex-text-muted">Place your bets on pro matches</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter size={16} className="text-apex-text-muted flex-shrink-0" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.key
                ? 'bg-apex-red text-white'
                : 'bg-apex-gray border border-apex-border text-apex-text-muted hover:text-white hover:border-apex-red/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-apex-red" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-apex-text-muted">Failed to load matches</p>
        </div>
      ) : matches?.length === 0 ? (
        <div className="text-center py-20 bg-apex-gray border border-apex-border rounded-xl">
          <Swords size={48} className="mx-auto text-apex-text-muted mb-4" />
          <p className="text-apex-text-muted">No matches found</p>
          <p className="text-sm text-apex-text-muted mt-1">Check back soon for new events!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {matches?.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
