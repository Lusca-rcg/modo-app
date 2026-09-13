import { useState } from 'react'
import {
  Bell,
  User,
  Calendar,
  ChevronRight,
  Sigma,
  Landmark,
  FlaskConical,
  BookOpen,
  Dna,
  Users,
} from 'lucide-react'
import BottomNav from './BottomNav'
import type { TabId } from '../types'

const DARK_GREEN = '#1B3B2B'

interface MissionItem {
  id: string
  subject: string
  task: string
  completed: number
  total: number
  icon: React.ElementType
  iconBg: string
}

const MISSIONS: MissionItem[] = [
  {
    id: 'matematica',
    subject: 'Matemática',
    task: 'Concluir 2 questões da lista de exercícios',
    completed: 0,
    total: 2,
    icon: Sigma,
    iconBg: '#1B5732',
  },
  {
    id: 'historia',
    subject: 'História',
    task: 'Revisar capítulo 4',
    completed: 0,
    total: 1,
    icon: Landmark,
    iconBg: '#D97706',
  },
  {
    id: 'quimica',
    subject: 'Química',
    task: 'Assistir à aula 3',
    completed: 0,
    total: 1,
    icon: FlaskConical,
    iconBg: '#2563EB',
  },
  {
    id: 'portugues',
    subject: 'Português',
    task: 'Ler e anotar o texto da página 56',
    completed: 0,
    total: 1,
    icon: BookOpen,
    iconBg: '#DC2626',
  },
  {
    id: 'biologia',
    subject: 'Biologia',
    task: 'Finalizar o resumo do sistema nervoso',
    completed: 0,
    total: 1,
    icon: Dna,
    iconBg: '#0D9488',
  },
]

interface SubjectStat {
  id: string
  name: string
  percentage: number
  dotColor: string
  barColor: string
}

const SUBJECT_STATS: SubjectStat[] = [
  { id: 'mat', name: 'Matemática', percentage: 67, dotColor: '#1B5732', barColor: '#1B5732' },
  { id: 'his', name: 'História',   percentage: 52, dotColor: '#EAB308', barColor: '#EAB308' },
  { id: 'qui', name: 'Química',    percentage: 38, dotColor: '#2563EB', barColor: '#2563EB' },
  { id: 'por', name: 'Português',  percentage: 71, dotColor: '#DC2626', barColor: '#DC2626' },
  { id: 'bio', name: 'Biologia',   percentage: 49, dotColor: '#0D9488', barColor: '#0D9488' },
]

// Missions that have a game associated
const GAME_MISSIONS = new Set(['matematica', 'historia'])

interface MissionsScreenProps {
  onTabChange: (tab: TabId) => void
  onMissionSelect?: (missionId: string) => void
}

export default function MissionsScreen({ onTabChange, onMissionSelect }: MissionsScreenProps) {
  const [missionList, setMissionList] = useState(MISSIONS)

  const handleToggleMission = (id: string) => {
    setMissionList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextVal = m.completed < m.total ? m.completed + 1 : 0
          return { ...m, completed: nextVal }
        }
        return m
      })
    )
  }

  return (
    <div className="flex min-h-screen w-full items-start justify-center" style={{ background: '#EDEFED' }}>
      {/* Phone shell */}
      <div className="relative flex w-full max-w-sm flex-col" style={{ background: '#F5F6F5', minHeight: '100svh' }}>

        {/* ── TOP BAR / HEADER ── */}
        <div className="sticky top-0 z-20 bg-white px-5 pt-4 pb-3 shadow-xs">
          {/* Logo + Actions */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-black tracking-tight" style={{ color: '#111' }}>MODO</span>
              <div className="mt-0.5 h-1 w-10 rounded-full" style={{ background: DARK_GREEN }} />
            </div>
            <div className="flex items-center gap-2">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                <Bell size={20} className="text-gray-600" strokeWidth={1.8} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                <User size={20} className="text-gray-600" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Title + Date Badge */}
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Missões de hoje</h1>

            {/* Date Pill */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 shadow-xs text-xs font-semibold text-gray-700">
              <Calendar size={14} className="text-gray-600" strokeWidth={2} />
              <span>12 de mai.</span>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-4">

          {/* ── MISSIONS LIST ── */}
          <div className="space-y-2.5">
            {missionList.map((m) => {
              const Icon = m.icon
              const isFinished = m.completed === m.total

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    if (GAME_MISSIONS.has(m.id) && onMissionSelect) {
                      onMissionSelect(m.id)
                    } else {
                      handleToggleMission(m.id)
                    }
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-xs border border-gray-100/80 cursor-pointer hover:border-gray-200 transition-all active:scale-[0.99]"
                >
                  {/* Subject Icon Box */}
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                    style={{ background: m.iconBg }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  {/* Subject & Task */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 leading-tight">{m.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">
                      {m.task}
                    </p>
                  </div>

                  {/* Status Badge & Arrow */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-bold transition-colors"
                      style={{
                        background: isFinished ? '#DCFCE7' : '#EDF4F0',
                        color: isFinished ? '#15803D' : '#166534',
                      }}
                    >
                      {m.completed}/{m.total}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" strokeWidth={2.5} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── DOMÍNIO DA TURMA CARD ── */}
          <div className="rounded-3xl bg-white p-5 shadow-xs border border-gray-100">
            {/* Section Header */}
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900 leading-tight">Domínio da turma</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Veja como a sua turma está em cada disciplina.
              </p>
            </div>

            {/* Horizontal Subjects Row */}
            <div className="grid grid-cols-5 gap-2 pb-1">
              {SUBJECT_STATS.map((s) => (
                <div key={s.id} className="flex flex-col gap-1.5 min-w-0">
                  {/* Dot + Label */}
                  <div className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: s.dotColor }}
                    />
                    <span className="text-[10px] font-semibold text-gray-700 truncate">
                      {s.name}
                    </span>
                  </div>

                  {/* Percentage */}
                  <span className="text-base font-bold text-gray-900 leading-tight">
                    {s.percentage}%
                  </span>

                  {/* Mini Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.percentage}%`,
                        background: s.barColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Overall row (Geral da turma) */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <Users size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 leading-tight font-medium">Geral</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">57%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 max-w-[150px] h-2.5 rounded-full bg-gray-100 overflow-hidden mx-1">
                <div
                  className="h-full rounded-full"
                  style={{ width: '57%', background: DARK_GREEN }}
                />
              </div>

              <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
            </div>
          </div>

        </div>

        {/* ── UNIFIED BOTTOM NAV ── */}
        <BottomNav activeTab="missoes" onTabChange={onTabChange} />

      </div>
    </div>
  )
}
