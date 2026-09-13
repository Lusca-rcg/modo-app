import { useState, useRef } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'

/* ── Constants ── */
const DARK_BROWN = '#180C05'
const CARD_BROWN = '#2C1408'
const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E8C96A'
const PARCHMENT = '#F3E4C2'
const DARK_TEXT = '#3D2008'

/* ── Data ── */
interface HistEvent {
  id: string
  year: string
  title: string
  region: string
  category: string
  catColor: string
  summary: string
  question: string
  options: { text: string; correct: boolean }[]
}

const EVENTS: HistEvent[] = [
  {
    id: 'e1', year: '1789', title: 'Revolução Francesa', region: 'MUNDO',
    category: 'Político', catColor: '#6B2F2F',
    summary: 'O povo francês derruba a monarquia absolutista e proclama os ideais de Liberdade, Igualdade e Fraternidade, transformando para sempre a política mundial.',
    question: 'Qual era o principal lema da Revolução Francesa?',
    options: [
      { text: 'Liberdade, Igualdade e Fraternidade', correct: true },
      { text: 'Fé, Pátria e Honra', correct: false },
      { text: 'Paz, Terra e Pão', correct: false },
    ],
  },
  {
    id: 'e2', year: '1822', title: 'Independência do Brasil', region: 'BRASIL',
    category: 'Político', catColor: '#6B2F2F',
    summary: 'Dom Pedro I proclama a independência do Brasil às margens do Rio Ipiranga, separando definitivamente o país de Portugal após mais de 300 anos de colonização.',
    question: 'Onde Dom Pedro I proclamou a Independência do Brasil?',
    options: [
      { text: 'Rio de Janeiro', correct: false },
      { text: 'Rio Ipiranga, São Paulo', correct: true },
      { text: 'Salvador, Bahia', correct: false },
    ],
  },
  {
    id: 'e3', year: '1888', title: 'Lei Áurea', region: 'BRASIL',
    category: 'Social', catColor: '#2E5E4E',
    summary: 'A Princesa Isabel assina a Lei Áurea, abolindo a escravidão no Brasil. O país foi o último das Américas a abolir o regime escravista.',
    question: 'Quem assinou a Lei Áurea em 1888?',
    options: [
      { text: 'Dom Pedro II', correct: false },
      { text: 'Princesa Isabel', correct: true },
      { text: 'Rui Barbosa', correct: false },
    ],
  },
  {
    id: 'e4', year: '1929', title: 'Grande Depressão', region: 'MUNDO',
    category: 'Econômico', catColor: '#7A5C00',
    summary: 'A quebra da Bolsa de Nova York desencadeia a maior depressão econômica do século XX, gerando desemprego em massa e instabilidade política global.',
    question: 'O que desencadeou a Grande Depressão de 1929?',
    options: [
      { text: 'Conflitos europeus pós-guerra', correct: false },
      { text: 'Quebra da Bolsa de Nova York', correct: true },
      { text: 'Hiperinflação na Alemanha', correct: false },
    ],
  },
  {
    id: 'e5', year: '1930', title: 'Revolução de 1930', region: 'BRASIL',
    category: 'Político', catColor: '#6B2F2F',
    summary: 'Getúlio Vargas lidera um golpe de Estado que derruba a República Velha e inaugura a Era Vargas no Brasil, encerrando a política do café com leite.',
    question: 'Quem liderou a Revolução de 1930 no Brasil?',
    options: [
      { text: 'Júlio Prestes', correct: false },
      { text: 'Getúlio Vargas', correct: true },
      { text: 'Washington Luís', correct: false },
    ],
  },
  {
    id: 'e6', year: '1945', title: 'Fim da II Guerra', region: 'MUNDO',
    category: 'Geopolítico', catColor: '#4A3060',
    summary: 'A rendição do Japão após os bombardeios atômicos de Hiroshima e Nagasaki encerra a Segunda Guerra Mundial, dando início à Guerra Fria.',
    question: 'O que levou à rendição definitiva do Japão em 1945?',
    options: [
      { text: 'Invasão soviética da Manchúria', correct: false },
      { text: 'Bombas atômicas em Hiroshima e Nagasaki', correct: true },
      { text: 'Bloqueio naval americano', correct: false },
    ],
  },
]

type Phase = 'hub' | 'question' | 'result'

/* ── Component ── */
export default function CronixGame({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('hub')
  const [selected, setSelected] = useState<HistEvent | null>(null)
  const [answered, setAnswered] = useState<Record<string, boolean>>({})
  const [lastResult, setLastResult] = useState<boolean | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleEventClick(ev: HistEvent) {
    setSelected(ev)
    setPhase('question')
    setLastResult(null)
    setSelectedOption(null)
  }

  function handleAnswer(idx: number) {
    if (phase !== 'question') return
    const correct = selected!.options[idx].correct
    setSelectedOption(idx)
    setLastResult(correct)
    if (correct && answered[selected!.id] === undefined) {
      setScore(s => s + 100)
    }
    setAnswered(prev => ({ ...prev, [selected!.id]: correct }))
    setPhase('result')
  }

  function handleNextEvent() {
    setPhase('hub')
    setSelected(null)
  }

  const correctCount = Object.values(answered).filter(Boolean).length

  return (
    <div style={{
      background: DARK_BROWN, minHeight: '100svh', maxWidth: 390,
      margin: '0 auto', fontFamily: 'Inter, sans-serif',
      position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Subtle dot texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035,
        backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }} />

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '48px 18px 14px',
        borderBottom: `1px solid rgba(201,168,76,0.18)`,
        position: 'relative', zIndex: 1,
      }}>
        {/* Back */}
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: GOLD,
          display: 'flex', alignItems: 'center', gap: 5, padding: 0,
        }}>
          <ArrowLeft size={18} strokeWidth={2} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>VOLTAR</span>
        </button>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', color: GOLD, opacity: 0.55, textTransform: 'uppercase' }}>
            Assaad Games
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', lineHeight: 1 }}>
            CRONIX
          </div>
          <div style={{
            width: 32, height: 2, background: GOLD, margin: '3px auto 0',
            opacity: 0.5, borderRadius: 99,
          }} />
        </div>

        {/* Score + Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: GOLD, opacity: 0.55, letterSpacing: '0.1em' }}>PONTOS</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{score}</div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, opacity: 0.6 }}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <div style={{
        textAlign: 'center', padding: '8px 0',
        fontSize: 10, letterSpacing: '0.18em', color: GOLD, opacity: 0.4,
        textTransform: 'uppercase', position: 'relative', zIndex: 1,
      }}>
        Linha do Tempo — História Geral
      </div>

      {/* ── HORIZONTAL TIMELINE ── */}
      <div ref={scrollRef} style={{
        overflowX: 'auto', padding: '12px 20px 20px',
        scrollbarWidth: 'none', position: 'relative', zIndex: 1,
        flexShrink: 0,
      }}>
        {/* Background gold line */}
        <div style={{
          height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}60, ${GOLD}60, transparent)`,
          margin: '36px 28px 0', position: 'absolute', left: 0, right: 0,
        }} />

        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', position: 'relative', paddingBottom: 4 }}>
          {EVENTS.map((ev) => {
            const isAnswered = answered[ev.id] !== undefined
            const isCorrect = answered[ev.id] === true
            const isSelected = selected?.id === ev.id && phase !== 'hub'

            return (
              <div key={ev.id} onClick={() => handleEventClick(ev)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, minWidth: 88, cursor: 'pointer', position: 'relative', zIndex: 1,
                transition: 'opacity 0.3s',
              }}>
                {/* Year */}
                <div style={{
                  fontSize: 12, fontWeight: 800,
                  color: isSelected ? GOLD_LIGHT : GOLD,
                  letterSpacing: '0.04em',
                  textShadow: isSelected ? `0 0 12px ${GOLD}80` : 'none',
                }}>
                  {ev.year}
                </div>

                {/* Marker */}
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: isAnswered ? (isCorrect ? '#4ADE80' : '#EF4444') : (isSelected ? GOLD : CARD_BROWN),
                  border: `2px solid ${isSelected ? GOLD_LIGHT : GOLD}`,
                  boxShadow: isSelected ? `0 0 14px ${GOLD}90` : (isAnswered ? `0 0 8px ${isCorrect ? '#4ADE8060' : '#EF444460'}` : 'none'),
                  transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#fff',
                }}>
                  {isAnswered && (isCorrect ? '✓' : '✗')}
                </div>

                {/* Region tag */}
                <div style={{ fontSize: 8, color: GOLD, opacity: 0.5, letterSpacing: '0.12em', fontWeight: 700 }}>
                  {ev.region}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: 10, color: isSelected ? PARCHMENT : 'rgba(243,228,194,0.55)',
                  textAlign: 'center', maxWidth: 78, lineHeight: 1.3, fontWeight: 600,
                }}>
                  {ev.title}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '0 16px 24px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Empty state */}
        {phase === 'hub' && (
          <div style={{
            border: `1px solid rgba(201,168,76,0.18)`,
            borderRadius: 20, padding: '36px 24px',
            textAlign: 'center', background: `rgba(44,20,8,0.5)`,
            marginTop: 4,
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>📜</div>
            <p style={{
              color: GOLD, opacity: 0.65, fontSize: 14,
              fontFamily: 'Georgia, serif', lineHeight: 1.7, margin: 0,
            }}>
              Toque em um marco histórico na linha do tempo para iniciar o desafio.
            </p>
          </div>
        )}

        {/* Parchment card */}
        {selected && (
          <div style={{
            background: PARCHMENT,
            borderRadius: 20, padding: '20px',
            boxShadow: `0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.3)`,
            position: 'relative', overflow: 'hidden', marginTop: 4,
          }}>
            {/* Ruled lines */}
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: 18, right: 18,
                top: 48 + i * 28, height: 1,
                background: 'rgba(139,100,20,0.1)',
              }} />
            ))}

            {/* Category badge */}
            <div style={{
              position: 'absolute', top: 14, right: 14,
              background: selected.catColor, color: '#fff',
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              padding: '3px 9px', borderRadius: 99, textTransform: 'uppercase',
            }}>
              {selected.category}
            </div>

            {/* Year & Region */}
            <div style={{
              fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: '0.18em',
              marginBottom: 4, textTransform: 'uppercase', position: 'relative',
            }}>
              {selected.year} • {selected.region}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: 20, fontWeight: 900, color: DARK_TEXT,
              margin: '0 0 12px', fontFamily: 'Georgia, serif', lineHeight: 1.2, position: 'relative',
            }}>
              {selected.title}
            </h3>

            {/* Divider */}
            <div style={{
              height: 1, marginBottom: 12,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              opacity: 0.45, position: 'relative',
            }} />

            {/* Summary */}
            <p style={{
              fontSize: 13, color: '#5C3A1E', lineHeight: 1.7,
              fontFamily: 'Georgia, serif', margin: '0 0 16px', position: 'relative',
            }}>
              {selected.summary}
            </p>

            {/* Result banner */}
            {phase === 'result' && (
              <div style={{
                padding: '10px 14px', borderRadius: 12, marginBottom: 14,
                background: lastResult ? 'rgba(74,222,128,0.13)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${lastResult ? '#4ADE80' : '#EF4444'}`,
                display: 'flex', alignItems: 'flex-start', gap: 10,
                position: 'relative',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{lastResult ? '✅' : '❌'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: lastResult ? '#15803D' : '#B91C1C' }}>
                    {lastResult ? `+100 pontos! Excelente!` : 'Resposta incorreta.'}
                  </div>
                  {!lastResult && (
                    <div style={{ fontSize: 11, color: '#6B4226', marginTop: 3 }}>
                      Correta: <strong>{selected.options.find(o => o.correct)?.text}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Question box */}
            <div style={{
              background: 'rgba(139,100,20,0.1)',
              borderRadius: 12, padding: '12px 14px', marginBottom: 14,
              border: `1px solid rgba(201,168,76,0.3)`, position: 'relative',
            }}>
              <p style={{
                fontSize: 14, fontWeight: 700, color: DARK_TEXT,
                margin: 0, fontFamily: 'Georgia, serif', lineHeight: 1.45,
              }}>
                ❓ {selected.question}
              </p>
            </div>

            {/* Answer options – question phase */}
            {phase === 'question' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, position: 'relative' }}>
                {selected.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} style={{
                    background: CARD_BROWN,
                    border: `1.5px solid rgba(201,168,76,0.35)`,
                    borderRadius: 12, padding: '12px 16px',
                    color: PARCHMENT, fontSize: 14, fontFamily: 'Georgia, serif',
                    textAlign: 'left', cursor: 'pointer', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all 0.15s',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(201,168,76,0.12)',
                      border: `1px solid ${GOLD}60`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: GOLD,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            {/* Answer options – result phase */}
            {phase === 'result' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, position: 'relative', marginBottom: 14 }}>
                {selected.options.map((opt, i) => {
                  const isSel = i === selectedOption
                  const isRight = opt.correct
                  return (
                    <div key={i} style={{
                      borderRadius: 10, padding: '10px 14px',
                      border: `1.5px solid ${isRight ? '#4ADE80' : isSel ? '#EF4444' : 'rgba(201,168,76,0.18)'}`,
                      background: isRight ? 'rgba(74,222,128,0.1)' : isSel ? 'rgba(239,68,68,0.08)' : 'transparent',
                      color: isRight ? '#15803D' : isSel ? '#B91C1C' : '#8B6914',
                      fontSize: 13, fontFamily: 'Georgia, serif',
                      display: 'flex', alignItems: 'center', gap: 9,
                    }}>
                      <span style={{ fontSize: 14, width: 14, textAlign: 'center' }}>
                        {isRight ? '✓' : isSel ? '✗' : '·'}
                      </span>
                      {opt.text}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Next button */}
            {phase === 'result' && (
              <button onClick={handleNextEvent} style={{
                width: '100%', padding: '15px',
                background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                color: DARK_BROWN, fontWeight: 900, fontSize: 14,
                border: 'none', borderRadius: 12, cursor: 'pointer',
                letterSpacing: '0.05em', position: 'relative',
              }}>
                Próximo marco histórico →
              </button>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, color: GOLD, opacity: 0.45, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {correctCount}/{EVENTS.length} corretas
          </span>
          <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(201,168,76,0.15)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${(correctCount / EVENTS.length) * 100}%`,
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {EVENTS.map(ev => (
              <div key={ev.id} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: answered[ev.id] !== undefined
                  ? (answered[ev.id] ? '#4ADE80' : '#EF4444')
                  : 'rgba(201,168,76,0.25)',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
