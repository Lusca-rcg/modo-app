import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Zap } from 'lucide-react'

/* ── Constants ── */
const BG = '#09001A'
const CARD_BG = '#130728'
const GOLD = '#FFD700'
const GOLD_DIM = 'rgba(255,215,0,0.55)'
const TEXT_DIM = 'rgba(255,255,255,0.45)'

/* ── Pre-generated stars (deterministic) ── */
const STARS = Array.from({ length: 55 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: i % 7 === 0 ? 2 : 1,
  opacity: 0.08 + (i % 6) * 0.07,
}))

/* ── Types ── */
type GameMode = 'tranquilo' | 'velocidade' | 'brutal'
type OperationId = 'soma' | 'subtracao' | 'multiplicacao' | 'divisao'
type ActiveOp = OperationId | 'sobrevivencia'
type Phase = 'hub' | 'playing' | 'gameover'

interface Question {
  problem: string
  answer: number
  options: number[]
}

/* ── Helpers ── */
function generateQuestion(op: ActiveOp): Question {
  const base: OperationId = op === 'sobrevivencia'
    ? (['soma', 'subtracao', 'multiplicacao', 'divisao'] as OperationId[])[Math.floor(Math.random() * 4)]
    : op

  let a: number, b: number, answer: number, problem: string

  if (base === 'soma') {
    a = Math.floor(Math.random() * 60) + 5
    b = Math.floor(Math.random() * 60) + 5
    answer = a + b; problem = `${a} + ${b}`
  } else if (base === 'subtracao') {
    a = Math.floor(Math.random() * 50) + 30
    b = Math.floor(Math.random() * 28) + 2
    answer = a - b; problem = `${a} − ${b}`
  } else if (base === 'multiplicacao') {
    a = Math.floor(Math.random() * 12) + 2
    b = Math.floor(Math.random() * 12) + 2
    answer = a * b; problem = `${a} × ${b}`
  } else {
    b = Math.floor(Math.random() * 10) + 2
    answer = Math.floor(Math.random() * 10) + 2
    a = answer * b; problem = `${a} ÷ ${b}`
  }

  const set = new Set<number>([answer])
  let attempts = 0
  while (set.size < 4 && attempts < 40) {
    attempts++
    const off = Math.floor(Math.random() * 12) + 1
    const wrong = Math.random() > 0.5 ? answer + off : Math.max(1, answer - off)
    if (wrong !== answer) set.add(wrong)
  }

  return {
    problem: `${problem} = ?`,
    answer,
    options: [...set].sort(() => Math.random() - 0.5),
  }
}

const MODE_SECONDS: Record<GameMode, number> = {
  tranquilo: 20,
  velocidade: 10,
  brutal: 6,
}

const OPS = [
  { id: 'soma' as OperationId, symbol: '+', label: 'Soma', color: '#22D3EE', desc: 'Iniciante • 100 níveis', bg: 'rgba(34,211,238,0.07)' },
  { id: 'subtracao' as OperationId, symbol: '−', label: 'Subtração', color: '#4ADE80', desc: 'Intermediário • 100 níveis', bg: 'rgba(74,222,128,0.07)' },
  { id: 'multiplicacao' as OperationId, symbol: '×', label: 'Multiplicação', color: '#F97316', desc: 'Avançado • 100 níveis', bg: 'rgba(249,115,22,0.07)' },
  { id: 'divisao' as OperationId, symbol: '÷', label: 'Divisão', color: '#A78BFA', desc: 'Especialista • 100 níveis', bg: 'rgba(167,139,250,0.07)' },
]

/* ── Component ── */
export default function MatSpeedGame({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<GameMode>('velocidade')
  const [phase, setPhase] = useState<Phase>('hub')
  const [activeOp, setActiveOp] = useState<ActiveOp>('soma')
  const [xp, setXp] = useState(1240)

  // Playing state
  const [question, setQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [answered, setAnswered] = useState<number | null>(null)  // selected option
  const [timeLeft, setTimeLeft] = useState(100)
  const [questionCount, setQuestionCount] = useState(0)

  // Refs to avoid stale closures in timer
  const livesRef = useRef(lives)
  const answeredRef = useRef(answered)
  const activeOpRef = useRef(activeOp)

  useEffect(() => { livesRef.current = lives }, [lives])
  useEffect(() => { answeredRef.current = answered }, [answered])
  useEffect(() => { activeOpRef.current = activeOp }, [activeOp])

  const timerSeconds = MODE_SECONDS[mode]

  function startGame(op: ActiveOp) {
    const maxLives = op === 'sobrevivencia' ? 3 : 99
    setActiveOp(op)
    setScore(0)
    setStreak(0)
    setLives(maxLives)
    livesRef.current = maxLives
    setTimeLeft(100)
    setQuestionCount(0)
    setAnswered(null)
    answeredRef.current = null
    setQuestion(generateQuestion(op))
    setPhase('playing')
  }

  // Timer tick
  useEffect(() => {
    if (phase !== 'playing') return
    const tick = 100 / (timerSeconds * 10)
    const id = setInterval(() => {
      if (answeredRef.current !== null) return
      setTimeLeft(t => {
        if (t <= tick) {
          // Time out
          handleWrong(true)
          return 0
        }
        return t - tick
      })
    }, 100)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question, timerSeconds])

  function handleWrong(isTimeout = false) {
    if (answeredRef.current !== null && !isTimeout) return
    setAnswered(-1)
    answeredRef.current = -1
    setStreak(0)
    const curOp = activeOpRef.current
    if (curOp === 'sobrevivencia') {
      const nl = livesRef.current - 1
      setLives(nl)
      livesRef.current = nl
      if (nl <= 0) {
        setTimeout(() => setPhase('gameover'), 1100)
        return
      }
    }
    setTimeout(advanceQuestion, 1100)
  }

  function handleAnswer(opt: number) {
    if (answered !== null) return
    setAnswered(opt)
    answeredRef.current = opt
    const correct = opt === question!.answer

    if (correct) {
      const pts = 10 * (streak + 1)
      setScore(s => s + pts)
      setStreak(s => s + 1)
      setXp(x => x + pts)
    } else {
      handleWrong()
      return
    }
    setTimeout(advanceQuestion, 900)
  }

  function advanceQuestion() {
    setQuestion(generateQuestion(activeOpRef.current))
    setAnswered(null)
    answeredRef.current = null
    setTimeLeft(100)
    setQuestionCount(q => q + 1)
  }

  const opColor = OPS.find(o => o.id === activeOp)?.color ?? '#EF4444'
  const accentColor = activeOp === 'sobrevivencia' ? '#EF4444' : opColor

  /* ════════════════════════════════
     HUB
  ════════════════════════════════ */
  if (phase === 'hub') return (
    <div style={{
      background: BG, minHeight: '100svh', maxWidth: 390,
      margin: '0 auto', fontFamily: 'Inter, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Star field */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: s.left, top: s.top,
            width: s.size, height: s.size, borderRadius: '50%',
            background: '#fff', opacity: s.opacity,
          }} />
        ))}
      </div>

      {/* ── Header ── */}
      <div style={{ padding: '48px 18px 12px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: GOLD,
            display: 'flex', alignItems: 'center', gap: 5, padding: 0,
          }}>
            <ArrowLeft size={18} strokeWidth={2} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>VOLTAR</span>
          </button>

          <div style={{ fontSize: 9, color: GOLD, opacity: 0.5, letterSpacing: '0.22em', fontWeight: 700 }}>
            ASSAAD GAMES
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: GOLD_DIM, letterSpacing: '0.1em' }}>XP TOTAL</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{xp}</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Zap size={26} fill={GOLD} style={{ color: GOLD, filter: `drop-shadow(0 0 8px ${GOLD}80)` }} />
            <h1 style={{
              fontSize: 34, fontWeight: 900, color: GOLD, margin: 0,
              letterSpacing: '-0.02em',
              textShadow: `0 0 24px ${GOLD}60`,
            }}>
              MATEMÁTICA
            </h1>
            <Zap size={26} fill={GOLD} style={{ color: GOLD, filter: `drop-shadow(0 0 8px ${GOLD}80)` }} />
          </div>
          <p style={{ color: TEXT_DIM, fontSize: 12, margin: '8px 0 0', letterSpacing: '0.04em' }}>
            Escolha sua trilha: 100 níveis em cada modo.
          </p>
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ padding: '0 18px 14px', position: 'relative' }}>
        <div style={{
          display: 'flex', gap: 8, background: 'rgba(255,255,255,0.04)',
          borderRadius: 14, padding: 6, border: `1px solid rgba(255,215,0,0.1)`,
        }}>
          {([
            { id: 'tranquilo' as GameMode, label: 'Tranquilo', icon: '🌱' },
            { id: 'velocidade' as GameMode, label: 'Velocidade', icon: '⚡' },
            { id: 'brutal' as GameMode, label: 'Brutal', icon: '🔥' },
          ] as const).map(m => {
            const active = mode === m.id
            return (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                flex: 1, padding: '10px 4px', borderRadius: 10,
                background: active ? GOLD : 'transparent',
                border: active ? 'none' : `1px solid rgba(255,215,0,0.18)`,
                color: active ? '#000' : GOLD_DIM,
                fontSize: 11, fontWeight: 800, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                transition: 'all 0.2s',
                boxShadow: active ? `0 4px 16px ${GOLD}40` : 'none',
              }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ overflowY: 'auto', padding: '0 18px 48px', maxHeight: 'calc(100svh - 220px)', position: 'relative' }}>

        {/* 2×2 operation grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {OPS.map(op => (
            <div key={op.id} style={{
              background: op.bg, border: `1.5px solid ${op.color}45`,
              borderRadius: 18, padding: '18px 14px',
              boxShadow: `0 4px 20px rgba(0,0,0,0.35)`,
            }}>
              {/* Neon symbol */}
              <div style={{
                fontSize: 42, fontWeight: 900, color: op.color, lineHeight: 1, marginBottom: 10,
                textShadow: `0 0 20px ${op.color}70`,
              }}>
                {op.symbol}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{op.label}</div>
              <div style={{ fontSize: 10, color: TEXT_DIM, marginBottom: 14 }}>{op.desc}</div>
              <button onClick={() => startGame(op.id)} style={{
                width: '100%', padding: '9px 0',
                background: 'linear-gradient(135deg, #1B5732, #22C55E)',
                border: 'none', borderRadius: 9,
                color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 12px rgba(34,197,94,0.3)',
              }}>
                Nível Atual
              </button>
            </div>
          ))}
        </div>

        {/* Survival card */}
        <div style={{
          background: 'rgba(239,68,68,0.06)', border: `1.5px solid rgba(239,68,68,0.35)`,
          borderRadius: 18, padding: '18px',
          boxShadow: '0 4px 20px rgba(239,68,68,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>💀</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#EF4444', marginBottom: 3 }}>
                Sobrevivência
              </div>
              <div style={{ fontSize: 11, color: TEXT_DIM, lineHeight: 1.5 }}>
                Erre 3 vezes e o jogo acaba. Mistura todas as operações. Até onde vai?
              </div>
            </div>
          </div>
          <button onClick={() => startGame('sobrevivencia')} style={{
            width: '100%', padding: '14px 0',
            background: 'linear-gradient(135deg, #7F1D1D, #DC2626)',
            border: 'none', borderRadius: 12,
            color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
          }}>
            💀 Iniciar Sobrevivência
          </button>
        </div>
      </div>
    </div>
  )

  /* ════════════════════════════════
     GAME OVER
  ════════════════════════════════ */
  if (phase === 'gameover') return (
    <div style={{
      background: BG, minHeight: '100svh', maxWidth: 390,
      margin: '0 auto', fontFamily: 'Inter, sans-serif',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {STARS.slice(0, 30).map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', opacity: s.opacity, pointerEvents: 'none' }} />
      ))}
      <div style={{ fontSize: 72, marginBottom: 16, position: 'relative' }}>💀</div>
      <h2 style={{ fontSize: 30, fontWeight: 900, color: '#EF4444', margin: '0 0 8px', letterSpacing: '-0.02em', position: 'relative' }}>
        GAME OVER
      </h2>
      <p style={{ color: TEXT_DIM, fontSize: 14, margin: '0 0 28px', position: 'relative' }}>
        Você respondeu {questionCount} questões
      </p>

      <div style={{
        background: CARD_BG, borderRadius: 20, padding: '24px 40px',
        border: `1.5px solid ${GOLD}35`, marginBottom: 28,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4)`, position: 'relative',
      }}>
        <div style={{ fontSize: 11, color: GOLD_DIM, letterSpacing: '0.15em', marginBottom: 6 }}>PONTUAÇÃO FINAL</div>
        <div style={{ fontSize: 52, fontWeight: 900, color: GOLD, textShadow: `0 0 20px ${GOLD}50` }}>{score}</div>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%', position: 'relative' }}>
        <button onClick={() => startGame(activeOp)} style={{
          flex: 1, padding: '15px', borderRadius: 14,
          background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
          color: '#000', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer',
        }}>
          Tentar de novo
        </button>
        <button onClick={() => setPhase('hub')} style={{
          flex: 1, padding: '15px', borderRadius: 14,
          background: 'rgba(255,255,255,0.07)',
          color: '#fff', fontWeight: 700, fontSize: 14,
          border: `1px solid rgba(255,255,255,0.15)`, cursor: 'pointer',
        }}>
          Menu
        </button>
      </div>
    </div>
  )

  /* ════════════════════════════════
     PLAYING
  ════════════════════════════════ */
  const timerColor = timeLeft > 50 ? '#4ADE80' : timeLeft > 25 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{
      background: BG, minHeight: '100svh', maxWidth: 390,
      margin: '0 auto', fontFamily: 'Inter, sans-serif',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      {STARS.slice(0, 25).map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', opacity: s.opacity * 0.6, pointerEvents: 'none' }} />
      ))}

      {/* Playing header */}
      <div style={{
        padding: '48px 18px 12px', borderBottom: `1px solid rgba(255,255,255,0.06)`,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setPhase('hub')} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: TEXT_DIM,
            display: 'flex', alignItems: 'center', gap: 4, padding: 0,
          }}>
            <ArrowLeft size={18} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {activeOp === 'sobrevivencia' ? '💀 Sobrevivência' : `${OPS.find(o => o.id === activeOp)?.label} • ${mode}`}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: TEXT_DIM, letterSpacing: '0.1em' }}>PONTOS</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: GOLD }}>{score}</div>
          </div>
        </div>

        {/* Combo + lives */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ fontSize: 12, color: streak >= 3 ? '#F97316' : TEXT_DIM, fontWeight: 700 }}>
            {streak >= 3 ? `🔥 Combo ×${streak}!` : `Sequência: ${streak}`}
          </div>
          {activeOp === 'sobrevivencia' && (
            <div style={{ fontSize: 18, letterSpacing: 2 }}>
              {'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}
            </div>
          )}
          <div style={{ fontSize: 11, color: TEXT_DIM }}>#{questionCount + 1}</div>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{
          height: '100%', width: `${timeLeft}%`,
          background: timerColor,
          boxShadow: `0 0 8px ${timerColor}80`,
          transition: 'width 0.1s linear, background 0.5s',
        }} />
      </div>

      {/* Question area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px 0', position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: '0.12em', marginBottom: 20 }}>
          CALCULE
        </div>
        <div style={{
          fontSize: 56, fontWeight: 900, color: '#fff',
          letterSpacing: '-0.03em', textAlign: 'center', lineHeight: 1,
          textShadow: `0 0 30px ${accentColor}50`,
        }}>
          {question?.problem}
        </div>
      </div>

      {/* Answer grid */}
      <div style={{ padding: '24px 18px 44px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {question?.options.map((opt) => {
            const isSel = answered === opt
            const isRight = opt === question.answer
            const showResult = answered !== null
            const isTimeout = answered === -1

            let bg = CARD_BG
            let border = `1.5px solid ${accentColor}40`
            let col = '#fff'
            let shadow = 'none'

            if (showResult) {
              if (isRight) {
                bg = 'rgba(74,222,128,0.14)'
                border = '2px solid #4ADE80'
                col = '#4ADE80'
                shadow = '0 4px 20px rgba(74,222,128,0.3)'
              } else if (isSel || isTimeout) {
                bg = 'rgba(239,68,68,0.12)'
                border = '2px solid #EF4444'
                col = '#EF4444'
              }
            }

            return (
              <button key={opt} onClick={() => handleAnswer(opt)}
                disabled={answered !== null}
                style={{
                  padding: '22px 12px', borderRadius: 18,
                  background: bg, border, color: col,
                  fontSize: 28, fontWeight: 900,
                  cursor: answered === null ? 'pointer' : 'default',
                  boxShadow: shadow, transition: 'all 0.2s',
                  textShadow: showResult && isRight ? '0 0 14px #4ADE8070' : 'none',
                }}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
