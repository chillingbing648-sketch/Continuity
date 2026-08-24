import React, { useState, useRef, useEffect } from 'react'
import { Icons } from '../common/Icons'
import { useAuth } from '../../context/AuthContext'
import { validateEmail } from '../../utils/validation'

export function ForgotPassword({ onSwitchToLogin }) {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [fieldError, setFieldError] = useState(null)
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0)

  const isSubmittingRef = useRef(false)
  const timerRef = useRef(null)

  // Cooldown countdown timer effect
  useEffect(() => {
    if (rateLimitSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRateLimitSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [rateLimitSeconds])

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    if (isSubmittingRef.current || isSubmitting || rateLimitSeconds > 0) {
      return
    }

    setError(null)
    setFieldError(null)

    const emailErr = validateEmail(email)
    if (emailErr) {
      setFieldError(emailErr)
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      const result = await resetPassword(email)

      if (!result.success) {
        setError(result.error || 'Failed to send recovery link. Please try again.')
        if (result.isRateLimit && result.retryAfter) {
          setRateLimitSeconds(result.retryAfter)
        }
      } else {
        setSentSuccess(true)
      }
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isSubmittingRef.current || isSubmitting || rateLimitSeconds > 0) {
        e.preventDefault()
        return
      }
    }
  }

  const isFormDisabled = isSubmitting || rateLimitSeconds > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && (
        <div
          role="alert"
          style={{
            background: 'var(--error-light)',
            color: 'var(--error)',
            border: '1px solid var(--error-border)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            lineHeight: 1.45,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Icons.alertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <span>{error}</span>
            {rateLimitSeconds > 0 && (
              <div style={{ fontWeight: 600, marginTop: 4, fontSize: '0.8rem' }}>
                Please wait {rateLimitSeconds}s before retrying.
              </div>
            )}
          </div>
        </div>
      )}

      {sentSuccess ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            role="status"
            style={{
              background: 'var(--success-light)',
              color: 'var(--success)',
              border: '1px solid var(--success-border)',
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <Icons.checkCircle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: 4 }}>
                Password Reset Link Sent
              </strong>
              <span>
                If an account exists for <strong>{email}</strong>, we have dispatched a secure password recovery link to your inbox.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onSwitchToLogin}
            style={{ width: '100%', padding: '11px 16px', fontWeight: 600 }}
          >
            <Icons.arrowLeft size={16} />
            Return to Sign In
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Enter your registered email address below. We'll send you a secure link to reset your Continuity master password.
          </p>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="forgot-email">
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldError) setFieldError(null)
              }}
              disabled={isSubmitting}
              required
            />
            {fieldError && (
              <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: 4 }}>
                {fieldError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFormDisabled}
            style={{
              width: '100%',
              padding: '11px 16px',
              fontSize: '0.92rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              cursor: isFormDisabled ? 'not-allowed' : 'pointer',
              opacity: isFormDisabled ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'authSpinner 0.8s infinite linear',
                  }}
                />
                Sending link...
              </span>
            ) : rateLimitSeconds > 0 ? (
              `Please wait (${rateLimitSeconds}s)...`
            ) : (
              'Send Password Reset Link'
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={isSubmitting}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Icons.arrowLeft size={14} />
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
