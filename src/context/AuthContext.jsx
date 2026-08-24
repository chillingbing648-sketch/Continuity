import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

  useEffect(() => {
    let mounted = true

    // Check if the URL hash contains password recovery tokens
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || ''
      const search = window.location.search || ''
      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setIsPasswordRecovery(true)
      }
    }

    // Initial session bootstrap
    authService.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data?.session ?? null)
        setUser(data?.session?.user ?? null)
        setLoading(false)
      }
    }).catch(() => {
      if (mounted) {
        setSession(null)
        setUser(null)
        setLoading(false)
      }
    })

    // Listen to live auth state transitions
    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true)
      }

      setSession(newSession ?? null)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await authService.signIn(email, password)
    if (result.error) {
      return {
        success: false,
        error: result.readableMessage || result.error.message,
        isRateLimit: result.isRateLimit,
        retryAfter: result.retryAfter,
      }
    }
    setUser(result.data?.user || null)
    setSession(result.data?.session || null)
    return { success: true, user: result.data?.user, session: result.data?.session }
  }, [])

  const signup = useCallback(async (email, password, metadata = {}) => {
    const result = await authService.signUp(email, password, metadata)
    if (result.error) {
      return {
        success: false,
        error: result.readableMessage || result.error.message,
        isRateLimit: result.isRateLimit,
        retryAfter: result.retryAfter,
      }
    }
    setUser(result.data?.user || null)
    setSession(result.data?.session || null)
    return {
      success: true,
      user: result.data?.user,
      session: result.data?.session,
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    const result = await authService.signOut()
    setUser(null)
    setSession(null)
    setIsPasswordRecovery(false)
    setLoading(false)
    return result
  }, [])

  const resetPassword = useCallback(async (email) => {
    const result = await authService.resetPassword(email)
    if (result.error) {
      return {
        success: false,
        error: result.readableMessage || result.error.message,
        isRateLimit: result.isRateLimit,
        retryAfter: result.retryAfter,
      }
    }
    return { success: true }
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    const result = await authService.updatePassword(newPassword)
    if (result.error) {
      return {
        success: false,
        error: result.readableMessage || result.error.message,
        isRateLimit: result.isRateLimit,
        retryAfter: result.retryAfter,
      }
    }
    setIsPasswordRecovery(false)
    return { success: true }
  }, [])

  const clearRecoveryState = useCallback(() => {
    setIsPasswordRecovery(false)
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const value = {
    user,
    session,
    loading,
    isAuthenticated: Boolean(user),
    isPasswordRecovery,
    clearRecoveryState,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}