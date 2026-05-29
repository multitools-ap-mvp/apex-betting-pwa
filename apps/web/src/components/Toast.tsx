import { useUIStore } from '../stores/uiStore'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '../lib/utils'

export default function Toast() {
  const { toast, clearToast } = useUIStore()

  if (!toast) return null

  const icons = {
    success: <CheckCircle className="text-green-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
  }

  const borders = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
  }

  return (
    <div className="fixed top-4 right-4 z-[60] animate-slide-in">
      <div className={cn(
        "flex items-center gap-3 bg-apex-gray border rounded-lg px-4 py-3 shadow-lg shadow-black/50",
        borders[toast.type]
      )}>
        {icons[toast.type]}
        <p className="text-sm text-white">{toast.message}</p>
        <button 
          onClick={clearToast}
          className="text-apex-text-muted hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
