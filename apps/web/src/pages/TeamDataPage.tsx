import { ExternalLink, Globe, Trophy, Users } from 'lucide-react'

const externalSources = [
  {
    name: 'Liquipedia',
    url: 'https://liquipedia.net/apexlegends/Main_Page',
    description: 'Comprehensive wiki with team rosters, tournament results, and player stats.',
    icon: <Globe size={24} className="text-blue-400" />,
  },
  {
    name: 'ALGS Official',
    url: 'https://algs.ea.com/en',
    description: 'Official Apex Legends Global Series website with schedules and standings.',
    icon: <Trophy size={24} className="text-apex-red" />,
  },
  {
    name: 'Esports World Cup',
    url: 'https://esportsworldcup.com/en/competitions/2025/apex-legends',
    description: 'EWC 2025 Apex Legends competition page with brackets and results.',
    icon: <Users size={24} className="text-purple-400" />,
  },
]

export default function TeamDataPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Users size={28} className="text-apex-red" />
        <div>
          <h1 className="text-2xl font-bold text-white font-apex">TEAM DATA</h1>
          <p className="text-sm text-apex-text-muted">External sources for Apex Legends competitive data</p>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {externalSources.map((source) => (
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-apex-gray border border-apex-border rounded-xl p-6 hover:border-apex-red/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              {source.icon}
              <ExternalLink size={16} className="text-apex-text-muted group-hover:text-apex-red transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{source.name}</h3>
            <p className="text-sm text-apex-text-muted">{source.description}</p>
          </a>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-apex-gray-light border border-apex-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Coming Soon</h3>
        <p className="text-sm text-apex-text-muted mb-4">
          We're working on integrating live match data directly into the platform. 
          For now, use the external sources above for the most up-to-date team and match information.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-apex-text-muted">Planned integrations:</p>
          <ul className="text-sm text-apex-text-muted space-y-1 ml-4">
            <li>• Live ALGS match schedules</li>
            <li>• Team roster and player statistics</li>
            <li>• Real-time tournament brackets</li>
            <li>• Historical match results</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
