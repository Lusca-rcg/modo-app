import { useState } from 'react'
import { User, Lock, Eye, EyeOff, ArrowRight, QrCode } from 'lucide-react'

const DARK_GREEN = '#1B3B2B'
const BG = '#F5F6F0'

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!matricula || !senha) {
      setErrorMessage('Por favor, preencha a matrícula e a senha.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (matricula === '12345' && senha === '6789') {
        onLoginSuccess?.()
      } else {
        setErrorMessage('Matrícula ou senha incorretos.')
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-6"
      style={{ background: '#E8EAE3', fontFamily: 'Inter, sans-serif' }}>

      {/* Phone shell */}
      <div className="relative w-full max-w-sm overflow-hidden flex flex-col"
        style={{
          background: BG,
          minHeight: '100svh',
          borderRadius: 'clamp(0px, (100vw - 640px)*9999, 44px)',
          boxShadow: '0 32px 64px -12px rgba(0,0,0,0.22)',
        }}>

        {/* ── Decorative circles ── */}
        {/* top-left arc */}
        <div style={{
          position: 'absolute', top: -80, left: -80,
          width: 220, height: 220, borderRadius: '50%',
          border: '36px solid rgba(100,140,110,0.13)',
          pointerEvents: 'none',
        }} />
        {/* top-left smaller */}
        <div style={{
          position: 'absolute', top: 60, left: -60,
          width: 140, height: 140, borderRadius: '50%',
          border: '28px solid rgba(100,140,110,0.09)',
          pointerEvents: 'none',
        }} />
        {/* bottom-right arc */}
        <div style={{
          position: 'absolute', bottom: -100, right: -80,
          width: 260, height: 260, borderRadius: '50%',
          border: '40px solid rgba(100,140,110,0.11)',
          pointerEvents: 'none',
        }} />

        {/* ── CONTENT ── */}
        <div className="flex-1 flex flex-col justify-center px-7 py-10 relative z-10">

          {/* Logo */}
          <div className="text-center mb-10">
            <h1 style={{
              fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em',
              color: '#111', lineHeight: 1, margin: 0,
            }}>MODO</h1>
            {/* green underline */}
            <div style={{
              width: 48, height: 5, background: DARK_GREEN,
              borderRadius: 99, margin: '10px auto 0',
            }} />
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 6px' }}>
              Acesse sua conta
            </h2>
            <p style={{ fontSize: 14, color: '#7A8A7F', margin: 0, lineHeight: 1.5 }}>
              Entre com sua matrícula e senha para<br />continuar no MODO.
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FEE2E2',
              color: '#DC2626', borderRadius: 12, padding: '10px 14px',
              fontSize: 13, fontWeight: 500, marginBottom: 16,
            }} role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* ── Matrícula input ── */}
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1.5px solid #E0E4DC',
              display: 'flex', alignItems: 'center',
              padding: '12px 16px', gap: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              transition: 'border-color 0.2s',
            }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = DARK_GREEN)}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#E0E4DC')}
            >
              <User size={22} strokeWidth={1.6} style={{ color: '#9CA3A0', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3A0', marginBottom: 2, letterSpacing: '0.02em' }}>
                  Matrícula 
                </div>
                <input
                  id="matricula-input"
                  type="text"
                  value={matricula}
                  onChange={(e) => { setMatricula(e.target.value); setErrorMessage('') }}
                  placeholder="Digite sua matrícula - Entre com 12345"
                  autoComplete="username"
                  style={{
                    width: '100%', border: 'none', outline: 'none',
                    background: 'transparent', fontSize: 14,
                    fontWeight: 500, color: '#111',
                    padding: 0, margin: 0,
                  }}
                />
              </div>
            </div>

            {/* ── Senha input ── */}
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1.5px solid #E0E4DC',
              display: 'flex', alignItems: 'center',
              padding: '12px 16px', gap: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              transition: 'border-color 0.2s',
            }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = DARK_GREEN)}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#E0E4DC')}
            >
              <Lock size={22} strokeWidth={1.6} style={{ color: '#9CA3A0', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3A0', marginBottom: 2, letterSpacing: '0.02em' }}>
                  Senha
                </div>
                <input
                  id="senha-input"
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErrorMessage('') }}
                  placeholder="Digite sua senha - Entre com 6789"
                  autoComplete="current-password"
                  style={{
                    width: '100%', border: 'none', outline: 'none',
                    background: 'transparent', fontSize: 14,
                    fontWeight: 500, color: '#111',
                    padding: 0, margin: 0,
                  }}
                />
              </div>
              <button
                type="button"
                id="toggle-password"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, color: '#9CA3A0' }}
              >
                {showPassword
                  ? <Eye size={20} strokeWidth={1.6} />
                  : <EyeOff size={20} strokeWidth={1.6} />}
              </button>
            </div>

            {/* Forgot password */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#recuperar" style={{ fontSize: 13, fontWeight: 600, color: DARK_GREEN, textDecoration: 'none' }}>
                Esqueceu sua senha?
              </a>
            </div>

            {/* Submit button */}
            <button
              id="btn-login"
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', background: DARK_GREEN, color: '#fff',
                fontWeight: 700, fontSize: 16,
                padding: '18px 24px', borderRadius: 16, border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: `0 8px 28px ${DARK_GREEN}50`,
                transition: 'opacity 0.2s, transform 0.1s',
                opacity: isLoading ? 0.75 : 1,
                marginTop: 4,
              }}
            >
              {isLoading ? (
                <span style={{
                  width: 22, height: 22,
                  border: '2.5px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight size={20} strokeWidth={2.5} />
                </>
              )}
            </button>

            {/* Divider "ou" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#D4D9D0' }} />
              <span style={{ fontSize: 13, color: '#9CA3A0', fontWeight: 500 }}>ou</span>
              <div style={{ flex: 1, height: 1, background: '#D4D9D0' }} />
            </div>

            {/* QR Code button */}
            <button
              type="button"
              id="btn-qrcode"
              style={{
                width: '100%', background: '#fff', color: '#111',
                fontWeight: 600, fontSize: 15,
                padding: '16px 24px', borderRadius: 16,
                border: '1.5px solid #D4D9D0',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                transition: 'border-color 0.2s',
              }}
            >
              <QrCode size={20} strokeWidth={1.8} style={{ color: DARK_GREEN }} />
              <span>Entrar com QR Code</span>
            </button>

          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
