import { Link } from 'react-router-dom'
import { Swords, Trophy, Coins, Zap, Shield, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-apex-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-apex-red/10 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-apex-red/20 border border-apex-red/30 rounded-full mb-8">
              <Zap size={16} className="text-apex-red" />
              <span className="text-sm font-medium text-apex-red">Now in Beta</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-apex tracking-wider">
              APEX <span className="text-apex-red">BETTING</span>
            </h1>

            <p className="text-xl md:text-2xl text-apex-text-muted max-w-2xl mx-auto mb-10">
              Bet virtual ApeXCoins on Apex Legends pro matches. 
              No real money. Pure competitive fun.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-apex-red hover:bg-apex-red-dark text-white font-bold rounded-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                Get Started
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-apex-gray-light border border-apex-border hover:border-apex-red/50 text-white font-semibold rounded-lg transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-16 font-apex">
          WHY APEX BETTING?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Coins size={32} className="text-apex-gold" />}
            title="Free Daily Coins"
            description="Get 300 ApeXCoins every 24 hours. No purchase required to play and compete."
          />
          <FeatureCard
            icon={<Trophy size={32} className="text-apex-red" />}
            title="Pro League Matches"
            description="Bet on ALGS, Esports World Cup, and major LAN tournaments with live odds."
          />
          <FeatureCard
            icon={<Shield size={32} className="text-green-400" />}
            title="Fair Parimutuel Odds"
            description="Odds are set by the community pool. Transparent, fair, and no house advantage."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-apex-gray border-y border-apex-border">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-white mb-16 font-apex">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your account in seconds' },
              { step: '02', title: 'Claim Coins', desc: 'Get your daily 300 ApeXCoins' },
              { step: '03', title: 'Place Bets', desc: 'Pick winners on pro matches' },
              { step: '04', title: 'Win Big', desc: 'Earn coins and climb the leaderboard' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto bg-apex-dark border border-apex-red/30 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-apex-red font-apex">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-apex-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Swords size={48} className="mx-auto text-apex-red mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-apex">
          READY TO DROP IN?
        </h2>
        <p className="text-apex-text-muted mb-8 max-w-xl mx-auto">
          Join thousands of Apex Legends fans competing for the top spot on the leaderboard.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-apex-red hover:bg-apex-red-dark text-white font-bold rounded-lg transition-all hover:scale-105"
        >
          Create Free Account
          <ChevronRight size={20} />
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-apex-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-apex-text-muted">
            Apex Betting is not affiliated with EA, Respawn Entertainment, or the Apex Legends franchise.
            This is a fan-made virtual betting platform for entertainment purposes only.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-apex-gray border border-apex-border rounded-xl p-6 hover:border-apex-red/30 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-apex-text-muted">{description}</p>
    </div>
  )
}
