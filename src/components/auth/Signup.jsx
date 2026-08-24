import React, { useState, useRef, useEffect } from 'react'
import { Icons } from '../common/Icons'
import { useAuth } from '../../context/AuthContext'
import { validateEmail, validateRequired } from '../../utils/validation'

export function Signup({ onSwitchToLogin }) {
  const { signup } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successInfo, setSuccessInfo] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0)

  // Synchronous ref to prevent race conditions from duplicate clicks or Enter presses
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

    const nameErr = validateRequired(fullName, 'Full Name')
    if (nameErr) errs.fullName = nameErr

    const emailErr = validateEmail(email)
    if (emailErr) errs.email = emailErr

    if (!password) {
      errs.password = 'Password is required'
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password'
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

    // Immediately block duplicate submissions synchronously
    if (isSubmittingRef.current || isSubmitting || rateLimitSeconds > 0) {
      return
    }

    setError(null)
    setSuccessInfo(null)

    if (!validateForm()) return

    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      const result = await signup(email, password, {
        full_name: fullName.trim(),
      })

      if (!result.success) {
        setError(result.error || 'Failed to create account. Please try again.')
        if (result.isRateLimit && result.retryAfter) {
          setRateLimitSeconds(result.retryAfter)
        }
      } else {
        // Check if email confirmation is required by Supabase settings
        if (result.user && !result.session) {
          setSuccessInfo('Account created! Please check your email inbox to confirm your account, then log in.')
        }
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
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
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

      {successInfo && (
        <div
          role="status"
          style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            border: '1px solid var(--success-border)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            lineHeight: 1.45,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <Icons.checkCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: 'block', marginBottom: 2 }}>Registration Successful</strong>
            <span>{successInfo}</span>
          </div>
        </div>
      )}

      {/* FULL NAME */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="signup-name">
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          className="form-input"
          placeholder="Harsh Dubey"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: null }))
          }}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.fullName && (
          <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: 4 }}>
            {fieldErrors.fullName}
          </div>
        )}
      </div>

      {/* EMAIL */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="signup-email">
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          className="form-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }))
          }}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.email && (
          <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: 4 }}>
            {fieldErrors.email}
          </div>
        )}
      </div>

      {/* PASSWORD */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="signup-password">
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="signup-password"
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

      {/* CONFIRM PASSWORD */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="signup-confirm-password">
          Confirm Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="form-input"
            placeholder="Re-enter password"
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

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isFormDisabled}
        style={{
          width: '100%',
          padding: '11px 16px',
          fontSize: '0.92rem',
          fontWeight: 600,
          marginTop: 6,
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
            Creating Account...
          </span>
        ) : rateLimitSeconds > 0 ? (
          `Please wait (${rateLimitSeconds}s)...`
        ) : (
          'Create Continuity Account'
        )}
      </button>

      {/* FOOTER SWITCH */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginTop: 8,
          borderTop: '1px solid var(--border-light)',
          paddingTop: 16,
        }}
      >
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isSubmitting}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            padding: 0,
            fontSize: 'inherit',
          }}
        >
          Sign in
        </button>
      </div>
    </form>
  )
}
