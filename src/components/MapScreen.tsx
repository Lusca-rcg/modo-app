import { useState } from 'react'
import {
  Bell,
  User,
  BookOpen,
  ChevronDown,
  Plus,
  Minus,
  BarChart2,
  Navigation,
} from 'lucide-react'
import BottomNav from './BottomNav'
import type { TabId } from '../types'

const DARK_GREEN = '#1B3B2B'

interface ClassData {
  id: string
  name: string
  percentage: number
  color: string
  barBg: string
  dotColor: string
}

const CLASSES: ClassData[] = [
  { id: '801', name: '801', percentage: 28, color: '#3B82F6', barBg: '#3B82F6', dotColor: '#3B82F6' },
  { id: '802', name: '802', percentage: 76, color: '#1B5732', barBg: '#1B5732', dotColor: '#1B5732' },
  { id: '803', name: '803', percentage: 54, color: '#D97706', barBg: '#EAB308', dotColor: '#EAB308' },
  { id: '804', name: '804', percentage: 19, color: '#EF4444', barBg: '#EF4444', dotColor: '#EF4444' },
]

interface MapScreenProps {
  onTabChange: (tab: TabId) => void
}

export default function MapScreen({ onTabChange }: MapScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'escola' | 'interclasse'>('escola')
  const [selectedSubject] = useState('Matemática')
  const [selectedGrade] = useState('8º Ano')
  const [zoomLevel, setZoomLevel] = useState(1)

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

          {/* Title + Subject Dropdown */}
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Mapa de domínio</h1>

            {/* Subject Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 shadow-xs text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
              <BookOpen size={14} className="text-gray-700" strokeWidth={2} />
              <span>{selectedSubject}</span>
              <ChevronDown size={14} className="text-gray-500 ml-0.5" />
            </div>
          </div>

          {/* Sub-tabs & Grade Selector */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveFilter('escola')}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: activeFilter === 'escola' ? DARK_GREEN : 'transparent',
                  color: activeFilter === 'escola' ? '#fff' : '#64748B',
                }}
              >
                Minha escola
              </button>
              <button
                onClick={() => setActiveFilter('interclasse')}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: activeFilter === 'interclasse' ? DARK_GREEN : 'transparent',
                  color: activeFilter === 'interclasse' ? '#fff' : '#64748B',
                }}
              >
                Interclasse
              </button>
            </div>

            {/* Grade Selector */}
            <div className="flex items-center gap-1 text-xs font-bold text-gray-800 cursor-pointer pr-1">
              <span>{selectedGrade}</span>
              <ChevronDown size={14} className="text-gray-600" />
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-4">

          {/* ── MAP CANVAS CONTAINER ── */}
          <div className="relative w-full h-[360px] rounded-3xl overflow-hidden shadow-sm border border-gray-200/60 bg-emerald-950/20">

            {/* SVG Interactive Campus Map */}
            <svg
              viewBox="0 0 400 360"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Territory Gradients */}
                <radialGradient id="blueTerritory" cx="30%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#1D4ED8" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.8" />
                </radialGradient>

                <radialGradient id="greenTerritory" cx="70%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#15803D" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#14532D" stopOpacity="0.85" />
                </radialGradient>

                <radialGradient id="redTerritory" cx="30%" cy="75%" r="65%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#B91C1C" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.85" />
                </radialGradient>

                <radialGradient id="yellowTerritory" cx="75%" cy="75%" r="65%">
                  <stop offset="0%" stopColor="#EAB308" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#B45309" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#78350F" stopOpacity="0.85" />
                </radialGradient>

                {/* Glow filter */}
                <filter id="borderGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base terrain with campus trees background */}
              <rect width="400" height="360" fill="#2E5632" />

              {/* Campus grounds and textured terrain paths */}
              <g opacity="0.35">
                <path d="M 0,0 L 400,360 M 400,0 L 0,360" stroke="#4B774E" strokeWidth="40" fill="none" />
                <circle cx="200" cy="180" r="140" fill="#3D683F" />
              </g>

              {/* ── ZONE 801 (BLUE - Top Left) ── */}
              <path
                d="M 0,0 L 195,0 Q 185,90 140,140 Q 90,165 0,175 Z"
                fill="url(#blueTerritory)"
                stroke="#60A5FA"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                filter="url(#borderGlow)"
              />
              {/* Blue Zone Buildings & Paths */}
              <g fill="#1E40AF" opacity="0.75">
                {/* Main Blue Hall */}
                <polygon points="40,80 90,55 130,75 80,100" fill="#93C5FD" />
                <polygon points="40,80 80,100 80,120 40,100" fill="#2563EB" />
                <polygon points="80,100 130,75 130,95 80,120" fill="#1D4ED8" />
                {/* Annex */}
                <polygon points="30,130 65,115 90,128 55,143" fill="#BFDBFE" />
                <polygon points="30,130 55,143 55,155 30,142" fill="#3B82F6" />
                <polygon points="55,143 90,128 90,140 55,155" fill="#1E40AF" />
              </g>

              {/* ── ZONE 802 (GREEN - Top Right) ── */}
              <path
                d="M 195,0 L 400,0 L 400,165 Q 310,170 260,140 Q 210,110 195,0 Z"
                fill="url(#greenTerritory)"
                stroke="#4ADE80"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                filter="url(#borderGlow)"
              />
              {/* Green Zone: Soccer Field */}
              <g transform="translate(265, 45) rotate(15)" opacity="0.9">
                <rect x="0" y="0" width="75" height="48" rx="4" fill="#15803D" stroke="#86EFAC" strokeWidth="1.5" />
                <line x1="37.5" y1="0" x2="37.5" y2="48" stroke="#86EFAC" strokeWidth="1.5" />
                <circle cx="37.5" cy="24" r="10" fill="none" stroke="#86EFAC" strokeWidth="1.5" />
                <rect x="0" y="14" width="12" height="20" fill="none" stroke="#86EFAC" strokeWidth="1.2" />
                <rect x="63" y="14" width="12" height="20" fill="none" stroke="#86EFAC" strokeWidth="1.2" />
              </g>
              {/* Green Zone: School Pavilion */}
              <g fill="#166534">
                <polygon points="210,80 250,60 280,75 240,95" fill="#86EFAC" />
                <polygon points="210,80 240,95 240,110 210,95" fill="#22C55E" />
                <polygon points="240,95 280,75 280,90 240,110" fill="#15803D" />
              </g>

              {/* ── ZONE 804 (RED - Bottom Left) ── */}
              <path
                d="M 0,175 Q 90,165 140,140 Q 180,180 190,200 L 230,270 Q 170,330 0,360 Z"
                fill="url(#redTerritory)"
                stroke="#F87171"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                filter="url(#borderGlow)"
              />
              {/* Red Zone: Multi-sports court */}
              <g transform="translate(130, 230) rotate(-18)" opacity="0.85">
                <rect x="0" y="0" width="60" height="38" rx="3" fill="#991B1B" stroke="#FCA5A5" strokeWidth="1.5" />
                <circle cx="30" cy="19" r="8" fill="none" stroke="#FCA5A5" strokeWidth="1.2" />
                <line x1="30" y1="0" x2="30" y2="38" stroke="#FCA5A5" strokeWidth="1.2" />
              </g>
              {/* Red Zone: Buildings */}
              <g fill="#991B1B">
                <polygon points="50,225 100,200 135,218 85,243" fill="#FCA5A5" />
                <polygon points="50,225 85,243 85,260 50,242" fill="#EF4444" />
                <polygon points="85,243 135,218 135,235 85,260" fill="#B91C1C" />

                <polygon points="70,285 110,265 135,278 95,298" fill="#F87171" />
                <polygon points="70,285 95,298 95,310 70,297" fill="#DC2626" />
                <polygon points="95,298 135,278 135,290 95,310" fill="#991B1B" />
              </g>

              {/* ── ZONE 803 (YELLOW - Bottom Right) ── */}
              <path
                d="M 400,165 Q 310,170 260,140 Q 210,170 190,200 L 230,270 Q 170,330 0,360 L 400,360 Z"
                fill="url(#yellowTerritory)"
                stroke="#FBBF24"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                filter="url(#borderGlow)"
              />
              {/* Yellow Zone: Soccer Field */}
              <g transform="translate(260, 270) rotate(-10)" opacity="0.85">
                <rect x="0" y="0" width="70" height="42" rx="3" fill="#854D0E" stroke="#FDE047" strokeWidth="1.5" />
                <circle cx="35" cy="21" r="8" fill="none" stroke="#FDE047" strokeWidth="1.2" />
                <line x1="35" y1="0" x2="35" y2="42" stroke="#FDE047" strokeWidth="1.2" />
              </g>
              {/* Yellow Zone: Class blocks */}
              <g fill="#854D0E">
                <polygon points="260,195 315,168 350,188 295,215" fill="#FEF08A" />
                <polygon points="260,195 295,215 295,232 260,212" fill="#EAB308" />
                <polygon points="295,215 350,188 350,205 295,232" fill="#CA8A04" />

                <polygon points="310,245 355,225 380,238 335,258" fill="#FDE047" />
                <polygon points="310,245 335,258 335,270 310,257" fill="#D97706" />
                <polygon points="335,258 380,238 380,250 335,270" fill="#B45309" />
              </g>

              {/* ── Scattered Isometric Trees ── */}
              {[
                { x: 25, y: 40 }, { x: 150, y: 35 }, { x: 160, y: 95 },
                { x: 370, y: 45 }, { x: 320, y: 120 }, { x: 220, y: 155 },
                { x: 30, y: 195 }, { x: 105, y: 165 }, { x: 205, y: 225 },
                { x: 340, y: 330 }, { x: 245, y: 335 }, { x: 185, y: 320 }
              ].map((t, i) => (
                <g key={i} transform={`translate(${t.x}, ${t.y})`}>
                  <ellipse cx="0" cy="5" rx="6" ry="3" fill="#14341B" opacity="0.4" />
                  <circle cx="0" cy="0" r="7" fill="#2E7D32" opacity="0.9" />
                  <circle cx="-2" cy="-2" r="4.5" fill="#4CAF50" opacity="0.8" />
                </g>
              ))}
            </svg>

            {/* ── PINS & BADGES OVERLAY ── */}

            {/* PIN 801 (Blue) */}
            <div className="absolute top-[82px] left-[78px] flex flex-col items-center pointer-events-none transform -translate-x-1/2 -translate-y-full">
              <div
                className="rounded-xl px-2.5 py-1 text-center shadow-lg border border-blue-400/40"
                style={{ background: '#1E3A8A' }}
              >
                <div className="text-xs font-bold text-white leading-tight">801</div>
                <div className="text-[11px] font-semibold text-blue-200 leading-tight">28%</div>
              </div>
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#1E3A8A]" />
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-0.5 shadow-sm" />
            </div>

            {/* PIN 802 (Green) */}
            <div className="absolute top-[88px] right-[115px] flex flex-col items-center pointer-events-none transform translate-x-1/2 -translate-y-full">
              <div
                className="rounded-xl px-2.5 py-1 text-center shadow-lg border border-emerald-400/50"
                style={{ background: '#14532D' }}
              >
                <div className="text-xs font-bold text-white leading-tight">802</div>
                <div className="text-[11px] font-semibold text-emerald-300 leading-tight">76%</div>
              </div>
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#14532D]" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-0.5 shadow-sm" />
            </div>

            {/* PIN 804 (Red) */}
            <div className="absolute top-[215px] left-[125px] flex flex-col items-center pointer-events-none transform -translate-x-1/2 -translate-y-full">
              <div
                className="rounded-xl px-2.5 py-1 text-center shadow-lg border border-red-400/40"
                style={{ background: '#7F1D1D' }}
              >
                <div className="text-xs font-bold text-white leading-tight">804</div>
                <div className="text-[11px] font-semibold text-red-200 leading-tight">19%</div>
              </div>
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#7F1D1D]" />
              <div className="w-2 h-2 rounded-full bg-red-400 mt-0.5 shadow-sm" />
            </div>

            {/* PIN 803 (Yellow) */}
            <div className="absolute top-[195px] right-[88px] flex flex-col items-center pointer-events-none transform translate-x-1/2 -translate-y-full">
              <div
                className="rounded-xl px-2.5 py-1 text-center shadow-lg border border-amber-400/40"
                style={{ background: '#78350F' }}
              >
                <div className="text-xs font-bold text-white leading-tight">803</div>
                <div className="text-[11px] font-semibold text-amber-200 leading-tight">54%</div>
              </div>
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#78350F]" />
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-0.5 shadow-sm" />
            </div>

            {/* ── MAP CONTROLS OVERLAY ── */}

            {/* Top-Left: Compass / North Button */}
            <div className="absolute top-3 left-3">
              <button
                type="button"
                className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-md hover:bg-slate-900 cursor-pointer transition-colors"
                title="Orientação Norte"
              >
                <span className="text-[9px] font-extrabold -mb-1">N</span>
                <Navigation size={12} className="text-white transform fill-white" />
              </button>
            </div>

            {/* Top-Right: Zoom Controls */}
            <div className="absolute top-3 right-3 flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
                className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 cursor-pointer border-b border-gray-100 transition-colors"
                title="Aumentar zoom"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.9))}
                className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition-colors"
                title="Diminuir zoom"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
            </div>

            {/* Bottom-Left: Floating Legend Card */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md p-3 text-white shadow-lg border border-white/10">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                <BarChart2 size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-tight">Território por turma</p>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  Quanto maior a área, maior o domínio da turma.
                </p>
              </div>
            </div>

          </div>

          {/* ── RANKING DA TURMA SECTION ── */}
          <div className="rounded-3xl bg-white p-5 shadow-xs border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Turmas do 8º ano</h2>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-0.5">
                Ver ranking completo <span className="text-xs">›</span>
              </button>
            </div>

            {/* Class Rows */}
            <div className="space-y-4">
              {CLASSES.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  {/* Color dot */}
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs"
                    style={{ background: c.dotColor }}
                  />

                  {/* Class Name */}
                  <span className="text-sm font-bold text-gray-900 w-10">
                    {c.name}
                  </span>

                  {/* Percentage */}
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">
                    {c.percentage}%
                  </span>

                  {/* Progress Bar */}
                  <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${c.percentage}%`,
                        background: c.barBg,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── UNIFIED BOTTOM NAV ── */}
        <BottomNav activeTab="mapa" onTabChange={onTabChange} />

      </div>
    </div>
  )
}
