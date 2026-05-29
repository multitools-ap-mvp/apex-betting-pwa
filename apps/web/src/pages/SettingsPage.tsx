import { useAuthStore } from '../stores/authStore'
import { Settings, User, Bell, Shield, Moon } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Settings size={28} className="text-apex-red" />
        <div>
          <h1 className="text-2xl font-bold text-white font-apex">SETTINGS</h1>
          <p className="text-sm text-apex-text-muted">Manage your account preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-apex-red" />
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-apex-text-muted mb-1.5">Display Name</label>
              <input
                type="text"
                defaultValue={user?.displayName}
                className="w-full bg-apex-dark border border-apex-border rounded-lg px-4 py-2.5 text-white focus:border-apex-red focus:outline-none"
                readOnly
              />
              <p className="text-xs text-apex-text-muted mt-1">Display name cannot be changed (MVP)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-apex-text-muted mb-1.5">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full bg-apex-dark border border-apex-border rounded-lg px-4 py-2.5 text-white focus:border-apex-red focus:outline-none"
                readOnly
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={20} className="text-apex-gold" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Match starting reminders', desc: 'Get notified 15 minutes before matches start' },
              { label: 'Bet results', desc: 'Receive notifications when your bets are resolved' },
              { label: 'Daily coins available', desc: 'Reminder when your daily coins are ready to claim' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-apex-text-muted">{item.desc}</p>
                </div>
                <div className="w-12 h-6 bg-apex-red rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-apex-text-muted mt-4">
            Push notifications require enabling in your browser. (OneSignal integration coming soon)
          </p>
        </section>

        {/* Security */}
        <section className="bg-apex-gray border border-apex-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-green-400" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full py-2.5 bg-apex-dark border border-apex-border hover:border-apex-red/50 text-white text-sm font-medium rounded-lg transition-all">
              Change Password
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-apex-gray border border-red-500/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
          <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-all">
            Delete Account
          </button>
          <p className="text-xs text-apex-text-muted mt-2">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </section>
      </div>
    </div>
  )
}
