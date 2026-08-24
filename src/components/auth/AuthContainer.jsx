import React, { useState, useEffect } from 'react'
import { LogoIcon, Icons } from '../common/Icons'
import { Login } from './Login'
import { Signup } from './Signup'
import { ForgotPassword } from './ForgotPassword'
import { ResetPassword } from './ResetPassword'
import { useAuth } from '../../context/AuthContext'

export function AuthContainer() {
  const { isPasswordRecovery } = useAuth()
  const [view, setView] = useState('login') // 'login' | 'signup' | 'forgot' | 'reset'

  useEffect(() => {
    if (isPasswordRecovery) {
      setView('reset')
    }
  }, [isPasswordRecovery])

  const getTitle = () => {
    switch (view) {
      case 'signup':
        return 'Create your Continuity account'
      case 'forgot':
        return 'Reset master password'
      case 'reset':
        return 'Set new password'
      case 'login':
      default:
        return 'Welcome back'
    }
  }

  const getSubtitle = () => {
    switch (view) {
      case 'signup':
        return 'One intelligent command center for your financial continuity'
      case 'forgot':
        return 'We will send a secure recovery link to your registered email'
      case 'reset':
        return 'Choose a strong password with at least 6 characters'
      case 'login':
      default:
        return 'Your financial continuity, connected and protected.'
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '24px 16px',
        fontFamily: 'var(--font)',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* LOGO & BRAND */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(45, 106, 79, 0.3)',
              marginBottom: 12,
            }}
          >
            <LogoIcon size={24} />
          </div>

          <h1
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            {getTitle()}
          </h1>

          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginTop: 6,
              maxWidth: 340,
              lineHeight: 1.4,
            }}
          >
            {getSubtitle()}
          </p>
        </div>

        {/* AUTH CARD */}
        <div
          className="card"
          style={{
            width: '100%',
            padding: '28px 26px',
            boxShadow: 'var(--shadow-md)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {view === 'login' && (
            <Login
              onSwitchToSignup={() => setView('signup')}
              onSwitchToForgot={() => setView('forgot')}
            />
          )}

          {view === 'signup' && (
            <Signup
              onSwitchToLogin={() => setView('login')}
            />
          )}

          {view === 'forgot' && (
            <ForgotPassword
              onSwitchToLogin={() => setView('login')}
            />
          )}

          {view === 'reset' && (
            <ResetPassword
              onSuccess={() => setView('login')}
            />
          )}
        </div>

        {/* REASSURANCE FOOTER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <Icons.lock size={13} style={{ opacity: 0.7 }} />
          <span>Encrypted Session & Authenticated Identity</span>
        </div>
      </div>
    </div>
  )
}
