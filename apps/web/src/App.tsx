import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BettingPage from './pages/BettingPage'
import CoinsPage from './pages/CoinsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboard from './pages/AdminDashboard'
import ResultsPage from './pages/ResultsPage'
import TeamDataPage from './pages/TeamDataPage'
import { authApi } from './services/api'

function App() {
  const { user, isLoading, setUser, setToken, setLoading, logout } = useAuthStore()

  // Initialize auth on app mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const userData = await authApi.me()
          setUser(userData)
          // Token is valid, keep it
        } catch (err) {
          // Token expired or invalid
          console.log('Auth init failed, clearing token')
          logout()
        }
      }

      // Always set loading to false after check
      setLoading(false)
    }

    initAuth()
  }, [setUser, setLoading, logout])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-apex-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-apex-red" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/betting" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/betting" />} />

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/betting" element={user ? <BettingPage /> : <Navigate to="/login" />} />
        <Route path="/coins" element={user ? <CoinsPage /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={user ? <LeaderboardPage /> : <Navigate to="/login" />} />
        <Route path="/results" element={user ? <ResultsPage /> : <Navigate to="/login" />} />
        <Route path="/team-data" element={user ? <TeamDataPage /> : <Navigate to="/login" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
