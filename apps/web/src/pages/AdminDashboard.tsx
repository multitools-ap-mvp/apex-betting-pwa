import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, matchesApi } from '../services/api'
import { useUIStore } from '../stores/uiStore'
import { 
  Shield, Users, Trophy, Mail, Coins, Plus, Check, X, 
  BarChart3, AlertTriangle, Send 
} from 'lucide-react'
import { formatCoins, formatDate } from '../lib/utils'

type AdminTab = 'matches' | 'users' | 'email' | 'stats'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('matches')
  const { showToast } = useUIStore()
  const queryClient = useQueryClient()

  // Create match form state
  const [matchForm, setMatchForm] = useState({
    title: '',
    teamA: '',
    teamB: '',
    tournament: '',
    matchStartAt: '',
  })

  // Resolve match state
  const [resolvingMatch, setResolvingMatch] = useState<string | null>(null)
  const [winner, setWinner] = useState<'team_a' | 'team_b' | ''>('')

  // Email blast state
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')

  // Queries
  const { data: matches } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: adminApi.getMatches,
  })

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getUsers,
  })

  // Mutations
  const createMatchMutation = useMutation({
    mutationFn: adminApi.createMatch,
    onSuccess: () => {
      showToast('Match created successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      setMatchForm({ title: '', teamA: '', teamB: '', tournament: '', matchStartAt: '' })
    },
    onError: (err: any) => showToast(err.message, 'error'),
  })

  const resolveMatchMutation = useMutation({
    mutationFn: ({ id, winner }: { id: string; winner: string }) => 
      adminApi.resolveMatch(id, winner),
    onSuccess: () => {
      showToast('Match resolved and payouts distributed', 'success')
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['my-bets'] })
      setResolvingMatch(null)
      setWinner('')
    },
    onError: (err: any) => showToast(err.message, 'error'),
  })

  const emailBlastMutation = useMutation({
    mutationFn: () => adminApi.emailBlast(emailSubject, emailBody),
    onSuccess: () => {
      showToast('Email blast sent', 'success')
      setEmailSubject('')
      setEmailBody('')
    },
    onError: (err: any) => showToast(err.message, 'error'),
  })

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault()
    createMatchMutation.mutate({
      ...matchForm,
      matchStartAt: new Date(matchForm.matchStartAt).toISOString(),
    })
  }

  const tabs = [
    { key: 'matches' as AdminTab, label: 'Matches', icon: Trophy },
    { key: 'users' as AdminTab, label: 'Users', icon: Users },
    { key: 'email' as AdminTab, label: 'Email Blast', icon: Mail },
    { key: 'stats' as AdminTab, label: 'Stats', icon: BarChart3 },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield size={28} className="text-apex-red" />
        <div>
          <h1 className="text-2xl font-bold text-white font-apex">ADMIN PANEL</h1>
          <p className="text-sm text-apex-text-muted">Manage matches, users, and platform</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-apex-red text-white'
                  : 'bg-apex-gray border border-apex-border text-apex-text-muted hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          {/* Create Match Form */}
          <div className="bg-apex-gray border border-apex-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus size={18} className="text-apex-red" />
              <h2 className="text-lg font-semibold text-white">Create New Match</h2>
            </div>

            <form onSubmit={handleCreateMatch} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-apex-text-muted mb-1">Match Title</label>
                <input
                  type="text"
                  value={matchForm.title}
                  onChange={(e) => setMatchForm({ ...matchForm, title: e.target.value })}
                  required
                  className="w-full bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none"
                  placeholder="ALGS Split 2 - Finals"
                />
              </div>
              <div>
                <label className="block text-xs text-apex-text-muted mb-1">Tournament</label>
                <input
                  type="text"
                  value={matchForm.tournament}
                  onChange={(e) => setMatchForm({ ...matchForm, tournament: e.target.value })}
                  className="w-full bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none"
                  placeholder="ALGS 2025"
                />
              </div>
              <div>
                <label className="block text-xs text-apex-text-muted mb-1">Team A</label>
                <input
                  type="text"
                  value={matchForm.teamA}
                  onChange={(e) => setMatchForm({ ...matchForm, teamA: e.target.value })}
                  required
                  className="w-full bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none"
                  placeholder="TSM"
                />
              </div>
              <div>
                <label className="block text-xs text-apex-text-muted mb-1">Team B</label>
                <input
                  type="text"
                  value={matchForm.teamB}
                  onChange={(e) => setMatchForm({ ...matchForm, teamB: e.target.value })}
                  required
                  className="w-full bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none"
                  placeholder="NRG"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-apex-text-muted mb-1">Match Start Time</label>
                <input
                  type="datetime-local"
                  value={matchForm.matchStartAt}
                  onChange={(e) => setMatchForm({ ...matchForm, matchStartAt: e.target.value })}
                  required
                  className="w-full bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={createMatchMutation.isPending}
                  className="px-6 py-2.5 bg-apex-red hover:bg-apex-red-dark text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {createMatchMutation.isPending ? 'Creating...' : 'Create Match'}
                </button>
              </div>
            </form>
          </div>

          {/* Matches List */}
          <div className="bg-apex-gray border border-apex-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-apex-border">
              <h2 className="text-lg font-semibold text-white">All Matches</h2>
            </div>

            <div className="divide-y divide-apex-border">
              {matches?.map((match: any) => (
                <div key={match.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{match.title}</p>
                      <p className="text-xs text-apex-text-muted">
                        {match.team_a} vs {match.team_b} • {match.tournament}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      match.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400' :
                      match.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-apex-red/20 text-apex-red'
                    }`}>
                      {match.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-apex-text-muted mb-3">
                    <span>Starts: {formatDate(match.match_start_at)}</span>
                    <span>Bets: {match.total_bets}</span>
                    <span>Volume: {formatCoins(match.total_volume)} AC</span>
                  </div>

                  {match.status === 'upcoming' && (
                    <div className="flex items-center gap-2">
                      {resolvingMatch === match.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={winner}
                            onChange={(e) => setWinner(e.target.value as 'team_a' | 'team_b')}
                            className="bg-apex-dark border border-apex-border rounded px-2 py-1 text-white text-sm"
                          >
                            <option value="">Select winner</option>
                            <option value="team_a">{match.team_a}</option>
                            <option value="team_b">{match.team_b}</option>
                          </select>
                          <button
                            onClick={() => winner && resolveMatchMutation.mutate({ id: match.id, winner })}
                            disabled={!winner || resolveMatchMutation.isPending}
                            className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm hover:bg-green-500/30 disabled:opacity-50"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => { setResolvingMatch(null); setWinner('') }}
                            className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm hover:bg-red-500/30"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingMatch(match.id)}
                          className="px-3 py-1.5 bg-apex-red/20 text-apex-red border border-apex-red/30 rounded text-sm hover:bg-apex-red/30 transition-all"
                        >
                          Mark Result
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-apex-gray border border-apex-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-apex-border">
            <h2 className="text-lg font-semibold text-white">All Users ({users?.length || 0})</h2>
          </div>

          <div className="divide-y divide-apex-border">
            {users?.map((user: any) => (
              <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user.display_name}</p>
                  <p className="text-xs text-apex-text-muted">{user.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-apex-gold">{formatCoins(user.balance)} AC</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    user.role === 'admin' ? 'bg-apex-red/20 text-apex-red' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.is_active ? 'Active' : 'Banned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === 'email' && (
        <div className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={18} className="text-apex-red" />
            <h2 className="text-lg font-semibold text-white">Email Blast</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-apex-text-muted mb-1">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none"
                placeholder="New matches available!"
              />
            </div>
            <div>
              <label className="block text-xs text-apex-text-muted mb-1">Message</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={6}
                className="w-full bg-apex-dark border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:border-apex-red focus:outline-none resize-none"
                placeholder="Hey legends, new matches are up for betting..."
              />
            </div>
            <button
              onClick={() => emailBlastMutation.mutate()}
              disabled={emailBlastMutation.isPending || !emailSubject || !emailBody}
              className="flex items-center gap-2 px-6 py-2.5 bg-apex-red hover:bg-apex-red-dark text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              <Send size={16} />
              {emailBlastMutation.isPending ? 'Sending...' : 'Send to All Users'}
            </button>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total Users" 
            value={users?.length || 0} 
            icon={<Users size={20} className="text-blue-400" />} 
          />
          <StatCard 
            label="Total Matches" 
            value={matches?.length || 0} 
            icon={<Trophy size={20} className="text-apex-red" />} 
          />
          <StatCard 
            label="Total Bets" 
            value={matches?.reduce((sum: number, m: any) => sum + parseInt(m.total_bets || 0), 0) || 0} 
            icon={<Coins size={20} className="text-apex-gold" />} 
          />
          <StatCard 
            label="Total Volume" 
            value={`${formatCoins(matches?.reduce((sum: number, m: any) => sum + parseInt(m.total_volume || 0), 0) || 0)} AC`} 
            icon={<BarChart3 size={20} className="text-green-400" />} 
          />
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-apex-gray border border-apex-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
      </div>
      <p className="text-3xl font-bold text-white font-apex">{value}</p>
      <p className="text-sm text-apex-text-muted mt-1">{label}</p>
    </div>
  )
}
