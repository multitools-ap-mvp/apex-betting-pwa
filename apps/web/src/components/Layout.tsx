import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Toast from './Toast'
import { useUIStore } from '../stores/uiStore'

export default function Layout() {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-apex-dark flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0 md:ml-20'
        }`}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Toast Notifications */}
      <Toast />
    </div>
  )
}
