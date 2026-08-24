import React, { useState, useRef, useEffect } from 'react'
import { Icons } from '../common/Icons'
import { useAuth } from '../../context/AuthContext'

export function ResetPassword({ onSuccess }) {
  const { updatePassword, clearRecoveryState } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
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

  const validateForm = () => {
    const errs = {}
    if (!password) {
      errs.password = 'New password is required'
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your new password'
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    if (isSubmittingRef.current || isSubmitting || rateLimitSeconds > 0) {
      return
    }

    setError(null)

    if (!validateForm()) return

    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      const result = await updatePassword(password)

      if (!result.success) {
        setError(result.error || 'Failed to update password. Please try again.')
        if (result.isRateLimit && result.retryAfter) {
          setRateLimitSeconds(result.retryAfter)
        }
      } else {
        setSuccess(true)
        clearRecoveryState?.()
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
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

      {success ? (
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
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Icons.checkCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>
              Password Updated Successfully
            </strong>
            <span style={{ fontSize: '0.8rem' }}>
              Redirecting you to your Continuity command center...
            </span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Enter your new master password to regain full access to your financial continuity vault.
          </p>

          {/* NEW PASSWORD */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="reset-new-password">
              New Master Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }))
                }}
                disabled={isSubmitting}
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Icons.eyeOff size={16} /> : <Icons.eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: 4 }}>
                {fieldErrors.password}
              </div>
            )}
          </div>

          {/* CONFIRM NEW PASSWORD */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="reset-confirm-password">
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="form-input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: null }))
                }}
                disabled={isSubmitting}
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                }}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <Icons.eyeOff size={16} /> : <Icons.eye size={16} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: 4 }}>
                {fieldErrors.confirmPassword}
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
                Updating Password...
              </span>
            ) : rateLimitSeconds > 0 ? (
              `Please wait (${rateLimitSeconds}s)...`
            ) : (
              'Save New Password'
            )}
          </button>
        </form>
      )}
    </div>
  )
}
