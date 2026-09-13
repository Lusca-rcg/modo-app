import {
  Bell,
  User,
  CalendarDays,
  ChevronRight,
  CheckSquare,
  Clock,
  Calculator,
  BookOpen,
  Heart,
  FlaskConical,
  Globe,
  MessageCircle,
  Palette,
  PersonStanding,
  Landmark,
  Trophy,
  BarChart3,
} from 'lucide-react'
import BottomNav from './BottomNav'
import type { TabId } from '../types'

/* ─── types ─── */
interface Mission {
  id: string
  subject: string
  detail: string
  minutes: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

interface Subject {
  id: string
  name: string
  pct: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  barColor: string
}

/* ─── data ─── */
const MISSIONS: Mission[] = [
  { id: 'm1', subject: 'Matemática', detail: '10 questões', minutes: 15, icon: Calculator, iconBg: '#EBF3FF', iconColor: '#3B82F6' },
  { id: 'm2', subject: 'Português',  detail: '8 questões',  minutes: 10, icon: BookOpen,   iconBg: '#FFF7EB', iconColor: '#F59E0B' },
  { id: 'm3', subject: 'Bem-estar',  detail: 'Questionário', minutes: 5, icon: Heart,      iconBg: '#F3EBFF', iconColor: '#A855F7' },
]

const SUBJECTS: Subject[] = [
  { id: 's1', name: 'Matemática',       pct: 72, icon: Calculator,      iconBg: '#EBF3FF', iconColor: '#3B82F6', barColor: '#3B82F6' },
  { id: 's2', name: 'Português',        pct: 58, icon: BookOpen,        iconBg: '#FFF7EB', iconColor: '#F59E0B', barColor: '#F59E0B' },
  { id: 's3', name: 'Ciências',         pct: 41, icon: FlaskConical,    iconBg: '#FFF0F0', iconColor: '#EF4444', barColor: '#EF4444' },
  { id: 's4', name: 'Geografia',        pct: 63, icon: Globe,           iconBg: '#EDFFF4', iconColor: '#22C55E', barColor: '#22C55E' },
  { id: 's5', name: 'Inglês',           pct: 48, icon: MessageCircle,   iconBg: '#F3EBFF', iconColor: '#8B5CF6', barColor: '#8B5CF6' },
  { id: 's6', name: 'Artes',            pct: 35, icon: Palette,         iconBg: '#FFF0F0', iconColor: '#F43F5E', barColor: '#F43F5E' },
  { id: 's7', name: 'Educação Física',  pct: 79, icon: PersonStanding,  iconBg: '#EBF3FF', iconColor: '#0EA5E9', barColor: '#0EA5E9' },
  { id: 's8', name: 'História',         pct: 67, icon: Landmark,        iconBg: '#EDFFF4', iconColor: '#16A34A', barColor: '#16A34A' },
]

const DARK_GREEN = '#1B5732'

/* ─── sub-components ─── */

function MissionRow({ m }: { m: Mission }) {
  const Icon = m.icon
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ background: m.iconBg }}>
        <Icon size={20} style={{ color: m.iconColor }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-tight">{m.subject}</p>
        <p className="text-xs text-gray-400 mt-0.5">{m.detail}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
        <Clock size={13} strokeWidth={1.8} />
        <span>{m.minutes} min</span>
      </div>
      <button
        className="ml-2 flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all active:scale-95 hover:brightness-110"
        style={{ background: DARK_GREEN }}
      >
        Iniciar
      </button>
    </div>
  )
}

function SubjectCard({ s }: { s: Subject }) {
  const Icon = s.icon
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: s.iconBg }}>
          <Icon size={18} style={{ color: s.iconColor }} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-xs text-gray-500 leading-tight">{s.name}</p>
          <p className="text-lg font-bold text-gray-800 leading-tight">{s.pct}%</p>
        </div>
      </div>
      {/* progress bar */}
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${s.pct}%`, background: s.barColor }}
        />
      </div>
    </div>
  )
}

interface HomeScreenProps {
  onTabChange?: (tab: TabId) => void
}

export default function HomeScreen({ onTabChange = () => {} }: HomeScreenProps) {
  return (
    <div className="flex min-h-screen w-full items-start justify-center" style={{ background: '#EDEFED' }}>
      {/* phone shell — max-w-sm keeps it phone-sized on desktop */}
      <div className="relative flex w-full max-w-sm flex-col" style={{ background: '#F5F6F5', minHeight: '100svh' }}>

        {/* ── TOP BAR ── */}
        <div className="sticky top-0 z-10 bg-white px-5 pt-5 pb-4 shadow-sm">
          {/* logo + actions */}
          <div className="flex items-center justify-between">
            {/* MODO logotype */}
            <div>
              <span className="text-3xl font-black tracking-tight" style={{ color: '#111' }}>MODO</span>
              <div className="mt-0.5 h-1 w-10 rounded-full" style={{ background: DARK_GREEN }} />
            </div>
            <div className="flex items-center gap-2">
              {/* bell */}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                <Bell size={20} className="text-gray-600" strokeWidth={1.8} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>
              {/* avatar */}
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                <User size={20} className="text-gray-600" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* greeting + date */}
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Olá, Mateus</h1>
              <p className="text-sm text-gray-400 mt-0.5">8º Ano • Turma 802</p>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
              style={{ background: '#EDFFF4', color: DARK_GREEN }}
            >
              <CalendarDays size={14} strokeWidth={2} />
              Qui, 12 de set
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4">

          {/* ── MISSIONS CARD ── */}
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} strokeWidth={2} style={{ color: DARK_GREEN }} />
                <h2 className="text-base font-bold text-gray-800">Missões de hoje</h2>
              </div>
              <button
                onClick={() => onTabChange('missoes')}
                className="flex items-center gap-0.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                Ver todas <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {MISSIONS.map((m) => <MissionRow key={m.id} m={m} />)}
            </div>
          </div>

          {/* ── DOMAIN SECTION ── */}
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} strokeWidth={2} style={{ color: DARK_GREEN }} />
                <h2 className="text-base font-bold text-gray-800">Domínio da sua turma</h2>
              </div>
              <button
                onClick={() => onTabChange('mapa')}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <ChevronRight size={15} strokeWidth={2} className="text-gray-500" />
              </button>
            </div>

            {/* 2-col grid */}
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((s) => <SubjectCard key={s.id} s={s} />)}
            </div>

            {/* overall row */}
            <div
              onClick={() => onTabChange('mapa')}
              className="mt-3 flex flex-col gap-2 rounded-2xl p-3.5 cursor-pointer hover:brightness-95 transition-all"
              style={{ background: '#EDFFF4' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: '#D0F5E0' }}>
                  <Trophy size={20} style={{ color: DARK_GREEN }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 leading-tight">Geral da turma</p>
                  <p className="text-lg font-bold text-gray-800 leading-tight">62%</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-white/70 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '62%', background: DARK_GREEN }} />
              </div>
            </div>
          </div>

        </div>

        {/* ── UNIFIED BOTTOM NAV ── */}
        <BottomNav activeTab="inicio" onTabChange={onTabChange} />

      </div>
    </div>
  )
}
