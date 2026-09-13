import { useState, useId } from 'react'
import {
  Eye,
  EyeOff,
  IdCard,
  Lock,
  ArrowRight,
  Loader2,
  Zap,
  Leaf,
  Smartphone,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FormFields {
  matricula: string
  senha: string
  lembrar: boolean
}

interface FieldErrors {
  matricula?: string
  senha?: string
  form?: string
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Animated focus glyph in the hero area */
function BrandGlyph() {
  return (
    <div className="animate-float animate-glow relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
      {/* orbiting dot */}
      <span
        className="animate-pulse-slow absolute -right-1 -top-1 h-4 w-4 rounded-full"
        style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', boxShadow: '0 0 12px #34d399' }}
      />
      {/* stacked icon composition */}
      <div className="relative flex items-center justify-center">
        <Smartphone size={28} className="text-white/90 absolute" strokeWidth={1.5} />
        <Leaf size={13} className="text-emerald-300 absolute translate-x-2 -translate-y-2" strokeWidth={2.5} />
      </div>
    </div>
  )
}

/** Individual form input row */
function InputField({
  id,
  label,
  type,
  value,
  placeholder,
  icon: Icon,
  onChange,
  error,
  suffix,
}: {
  id: string
  label: string
  type: string
  value: string
  placeholder: string
  icon: React.ElementType
  onChange: (v: string) => void
  error?: string
  suffix?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={17} strokeWidth={1.8} />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={type === 'password' ? 'current-password' : 'username'}
          className={`glass-input w-full rounded-xl py-3.5 pl-10 pr-${suffix ? '12' : '4'} text-sm text-white placeholder-slate-500 ${error ? 'input-error' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>
        )}
      </div>
      {error && (
        <p className="animate-fade-in flex items-center gap-1.5 text-xs text-red-400" role="alert">
          <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  )
}

/** Smooth toggle switch */
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      style={{
        background: checked
          ? 'linear-gradient(135deg, #6366f1, #a855f7)'
          : 'rgba(255,255,255,0.1)',
      }}
    >
      <span
        className="toggle-thumb pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function LoginScreen() {
  const matriculaId = useId()
  const senhaId = useId()
  const toggleId = useId()

  const [form, setForm] = useState<FormFields>({ matricula: '', senha: '', lembrar: false })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function setField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key !== 'lembrar') setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }))
  }

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!form.matricula.trim()) next.matricula = 'Informe sua matrícula.'
    if (!form.senha) next.senha = 'Informe sua senha.'
    else if (form.senha.length < 4) next.senha = 'A senha deve ter ao menos 4 caracteres.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    // Simulated async login — replace with real API call
    await new Promise((r) => setTimeout(r, 1800))

    // Demo: matricula=12345, senha=1234 → success
    const isValid = form.matricula === '12345' && form.senha === '1234'
    if (isValid) {
      setSuccess(true)
    } else {
      setErrors({ form: 'Matrícula ou senha incorretos. Tente novamente.' })
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 110%, rgba(168,85,247,0.18) 0%, transparent 70%), #080b16',
      }}
    >
      {/* Decorative grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Card */}
      <div
        className="animate-slide-up glass relative w-full max-w-sm rounded-3xl p-8 shadow-2xl"
        style={{ opacity: 0 }}
      >
        {/* HEADER */}
        <div className="mb-8 text-center animate-fade-in delay-100" style={{ opacity: 0 }}>
          <BrandGlyph />

          <div className="mb-1 flex items-center justify-center gap-2">
            <Zap size={16} className="text-indigo-400" strokeWidth={2.5} />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Foco<span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #c084fc)' }}
              >Zero</span>
            </h1>
            <Zap size={16} className="text-purple-400" strokeWidth={2.5} />
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-400 max-w-xs mx-auto">
            Equilibre seu tempo de tela,{' '}
            <span className="text-indigo-300 font-medium">potencialize seu aprendizado.</span>
          </p>

          <div
            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-emerald-300"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            <ShieldCheck size={12} strokeWidth={2.5} />
            Plataforma Escolar Segura
          </div>
        </div>

        {/* SUCCESS STATE */}
        {success ? (
          <div className="animate-scale-in flex flex-col items-center gap-4 py-8 text-center" style={{ opacity: 0 }}>
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', boxShadow: '0 0 32px rgba(52,211,153,0.4)' }}
            >
              <ShieldCheck size={32} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Bem-vindo(a)! 🎉</p>
              <p className="mt-1 text-sm text-slate-400">Carregando sua jornada de foco…</p>
            </div>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full animate-shimmer rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent 0%, #818cf8 50%, transparent 100%)' }}
              />
            </div>
          </div>
        ) : (
          /* FORM */
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {errors.form && (
              <div
                className="animate-slide-up flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm text-red-300"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', opacity: 0 }}
                role="alert"
              >
                <span className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-red-400/20 flex items-center justify-center text-[10px]">✕</span>
                {errors.form}
              </div>
            )}

            <div className="animate-slide-up delay-200" style={{ opacity: 0 }}>
              <InputField
                id={matriculaId}
                label="Matrícula"
                type="text"
                value={form.matricula}
                placeholder="Ex: 20240001"
                icon={IdCard}
                onChange={(v) => setField('matricula', v)}
                error={errors.matricula}
              />
            </div>

            <div className="animate-slide-up delay-300" style={{ opacity: 0 }}>
              <InputField
                id={senhaId}
                label="Senha"
                type={showSenha ? 'text' : 'password'}
                value={form.senha}
                placeholder="••••••••"
                icon={Lock}
                onChange={(v) => setField('senha', v)}
                error={errors.senha}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowSenha((p) => !p)}
                    aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    className="text-slate-400 transition-colors hover:text-indigo-300 focus-visible:text-indigo-300 focus-visible:outline-none"
                  >
                    {showSenha ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
                  </button>
                }
              />
            </div>

            <div className="animate-slide-up delay-400 flex items-center justify-between" style={{ opacity: 0 }}>
              <label
                htmlFor={toggleId}
                className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-400"
              >
                <Toggle id={toggleId} checked={form.lembrar} onChange={(v) => setField('lembrar', v)} />
                <span>Manter conectado</span>
              </label>
            </div>

            <div className="animate-slide-up delay-500 mt-1" style={{ opacity: 0 }}>
              <button
                id="btn-login"
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-sm font-semibold text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" strokeWidth={2} />
                    <span>Verificando…</span>
                  </>
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* FOOTER */}
        {!success && (
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
            />
            <div
              className="mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-xs text-slate-500"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <HelpCircle size={13} className="mt-0.5 shrink-0 text-slate-500" strokeWidth={1.8} />
              <span>
                Esqueceu sua senha ou matrícula?{' '}
                <a
                  href="mailto:secretaria@escola.edu.br"
                  className="font-medium text-indigo-400 underline-offset-2 hover:underline transition-colors hover:text-indigo-300"
                >
                  Contate a secretaria
                </a>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
