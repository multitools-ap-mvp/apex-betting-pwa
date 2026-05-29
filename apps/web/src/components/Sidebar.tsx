import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import {
  Menu,
  X,
  Home,
  Trophy,
  Coins,
  BarChart3,
  Users,
  Settings,
  Info,
  LogOut,
  Shield,
  Swords,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn, formatCoins } from '../lib/utils'

const navItems = [
  { path: '/betting', label: 'Betting', icon: Swords },
  { path: '/coins', label: 'ApeXCoins', icon: Coins },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/results', label: 'Results', icon: BarChart3 },
  { path: '/team-data', label: 'Team Data', icon: Users },
  { path: '/about', label: 'About', icon: Info },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const location = useLocation()

  const isAdmin = user?.role === 'admin'

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-apex-gray border border-apex-border p-2 rounded-lg text-apex-text hover:bg-apex-gray-light transition-colors"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-apex-gray border-r border-apex-border z-40 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-apex-border flex items-center justify-between">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "md:justify-center")}>
            <div className="w-10 h-10 bg-apex-red rounded-lg flex items-center justify-center flex-shrink-0">
              <Swords className="text-white" size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">APEX</h1>
                <p className="text-xs text-apex-red font-semibold tracking-wider">BETTING</p>
              </div>
            )}
          </div>

          {/* Desktop toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-1 rounded hover:bg-apex-gray-light text-apex-text-muted"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-apex-border">
            <div className={cn("flex items-center gap-3", !sidebarOpen && "md:justify-center")}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apex-red to-apex-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {user.displayName?.charAt(0).toUpperCase()}
                </span>
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                  <p className="text-xs text-apex-gold font-mono">
                    {formatCoins(user.balance)} AC
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-apex-red/20 text-apex-red border border-apex-red/30" 
                    : "text-apex-text-muted hover:bg-apex-gray-light hover:text-white"
                )}
              >
                <Icon size={20} className={cn("flex-shrink-0", isActive && "text-apex-red")} />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-apex-red animate-pulse" />
                )}
              </NavLink>
            )
          })}

          {/* Admin link */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mt-4",
                location.pathname === '/admin'
                  ? "bg-apex-red/20 text-apex-red border border-apex-red/30"
                  : "text-apex-text-muted hover:bg-apex-gray-light hover:text-white"
              )}
            >
              <Shield size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Admin Panel</span>}
            </NavLink>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="p-2 border-t border-apex-border">
          {user ? (
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-apex-text-muted hover:bg-apex-red/20 hover:text-apex-red transition-all"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-apex-red text-white hover:bg-apex-red-dark transition-colors"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Login</span>}
            </NavLink>
          )}
        </div>
      </aside>
    </>
  )
}
