import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import { authApi } from '../services/api'
import { Swords, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const { showToast } = useUIStore()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return
    }

    setIsLoading(true)

    try {
      const data = await authApi.register(email, password, displayName)
      setToken(data.token)
      setUser(data.user)
      showToast('Welcome to Apex Betting! +300 ApeXCoins bonus!', 'success')
      navigate('/betting')
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-apex-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-apex-red rounded-xl flex items-center justify-center mb-4">
            <Swords className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white font-apex">JOIN THE SQUAD</h1>
          <p className="text-apex-text-muted mt-2">Create your account and start betting</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-apex-text-muted mb-1.5">Display Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apex-text-muted" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                minLength={2}
                maxLength={50}
                className="w-full bg-apex-gray border border-apex-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-apex-text-muted focus:border-apex-red focus:outline-none transition-colors"
                placeholder="YourGamerTag"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apex-text-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apex-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-apex-gray border border-apex-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-apex-text-muted focus:border-apex-red focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apex-text-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apex-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-apex-gray border border-apex-border rounded-lg pl-10 pr-12 py-3 text-white placeholder-apex-text-muted focus:border-apex-red focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-apex-text-muted hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apex-text-muted mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apex-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-apex-gray border border-apex-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-apex-text-muted focus:border-apex-red focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-apex-red hover:bg-apex-red-dark text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-apex-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-apex-red hover:text-apex-accent font-medium">
            Sign in
          </Link>
        </p>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-apex-text-muted hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
