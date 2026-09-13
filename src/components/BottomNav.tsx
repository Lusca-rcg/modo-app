import { Home, Map, ClipboardList, Trophy, Brain } from 'lucide-react'
import type { TabId } from '../types'

export type { TabId }

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const DARK_GREEN = '#1B3B2B'

const NAV_ITEMS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: 'inicio', label: 'Início', Icon: Home },
  { id: 'mapa', label: 'Mapa', Icon: Map },
  { id: 'missoes', label: 'Missões', Icon: ClipboardList },
  { id: 'liga-modo', label: 'Liga MODO', Icon: Trophy },
]

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-sm -translate-x-1/2 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-2 py-2 z-30 shadow-lg">
      <div className="flex justify-around items-center">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              type="button"
              id={`nav-tab-${id}`}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all active:scale-95 cursor-pointer"
              style={{ color: active ? DARK_GREEN : '#94A3B8' }}
            >
              <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
              <span
                className="text-[11px] font-semibold"
                style={{ color: active ? DARK_GREEN : '#94A3B8' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
