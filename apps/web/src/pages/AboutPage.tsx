import { Info, Shield, Coins, Swords, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Info size={28} className="text-apex-red" />
        <div>
          <h1 className="text-2xl font-bold text-white font-apex">ABOUT</h1>
          <p className="text-sm text-apex-text-muted">Learn more about Apex Betting</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* What is Apex Betting */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Swords size={20} className="text-apex-red" />
            <h2 className="text-lg font-semibold text-white">What is Apex Betting?</h2>
          </div>
          <p className="text-sm text-apex-text-muted leading-relaxed">
            Apex Betting is a virtual currency betting platform for Apex Legends esports. 
            Users bet ApeXCoins (our virtual currency) on professional Apex Legends matches 
            including ALGS, Esports World Cup, and major LAN tournaments.
          </p>
        </section>

        {/* How It Works */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Coins size={20} className="text-apex-gold" />
            <h2 className="text-lg font-semibold text-white">How It Works</h2>
          </div>
          <div className="space-y-3">
            {[
              'Sign up for a free account and receive 300 ApeXCoins welcome bonus',
              'Claim 300 ApeXCoins every 24 hours from your ApeXCoins page',
              'Browse upcoming matches on the Betting page',
              'Place bets on your predicted winners using parimutuel odds',
              'Watch the match and collect your winnings when results are posted!',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-apex-red/20 text-apex-red text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-apex-text-muted">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Parimutuel Odds */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Coins size={20} className="text-green-400" />
            <h2 className="text-lg font-semibold text-white">Parimutuel Odds System</h2>
          </div>
          <p className="text-sm text-apex-text-muted leading-relaxed mb-4">
            We use a parimutuel (pool-based) betting system. All bets on a match go into a single pool. 
            After a 5% house fee, the remaining pool is distributed proportionally to all winning bettors.
          </p>
          <div className="bg-apex-dark rounded-lg p-4 text-sm text-apex-text-muted">
            <p className="font-mono text-xs mb-2 text-apex-gold">Example:</p>
            <p>Total pool: 10,000 AC | House fee (5%): 500 AC | Prize pool: 9,500 AC</p>
            <p className="mt-1">If Team A wins and has 7,000 AC in bets: 9,500 / 7,000 = 1.36x odds</p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Disclaimer</h2>
          </div>
          <div className="space-y-2 text-sm text-apex-text-muted">
            <p>
              Apex Betting uses virtual currency (ApeXCoins) only. There is no real-money gambling 
              and no cash withdrawals. This is an entertainment platform for esports fans.
            </p>
            <p>
              This platform is not affiliated with Electronic Arts, Respawn Entertainment, 
              or the Apex Legends franchise. All trademarks belong to their respective owners.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Contact</h2>
          </div>
          <p className="text-sm text-apex-text-muted">
            For support, feedback, or partnership inquiries, contact us at{' '}
            <a href="mailto:support@apex-betting.com" className="text-apex-red hover:underline">
              support@apex-betting.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
