import { supabase } from '../lib/supabase'

/**
 * Parses rate-limit specific information from Supabase errors
 */
export function parseRateLimitInfo(error) {
  if (!error) return { isRateLimit: false, retryAfter: 0, message: null }

  const status = error.status
  const code = (error.code || '').toLowerCase()
  const rawMsg = (error.message || '').toLowerCase()

  const isRateLimit =
    status === 429 ||
    code.includes('rate_limit') ||
    code.includes('over_request_rate_limit') ||
    code.includes('over_email_send_rate_limit') ||
    rawMsg.includes('rate limit') ||
    rawMsg.includes('too many requests') ||
    rawMsg.includes('over_request_rate_limit') ||
    rawMsg.includes('over_email_send_rate_limit') ||
    rawMsg.includes('for security purposes') ||
    rawMsg.includes('once every')

  if (!isRateLimit) {
    return { isRateLimit: false, retryAfter: 0, message: null }
  }

  // Extract seconds if specified in error message (e.g. "once every 60 seconds")
  const secMatch = error.message && error.message.match(/(\d+)\s*(?:seconds|sec|s\b)/i)
  const retryAfter = secMatch ? parseInt(secMatch[1], 10) : 60

  let message = 'Rate limit reached: Too many requests. Please wait a moment before trying again.'
  if (rawMsg.includes('email') || code.includes('email') || rawMsg.includes('security purposes')) {
    message = `For security purposes, email requests are rate-limited. Please wait ${retryAfter} seconds before requesting again.`
  } else {
    message = `Too many attempts. For security purposes, please wait ${retryAfter} seconds before trying again.`
  }

  return { isRateLimit: true, retryAfter, message }
}

/**
 * Human-readable error translator for Supabase Auth errors
 */
export function getReadableAuthError(error) {
  if (!error) return 'An unexpected error occurred. Please try again.'

  // Check rate limit first
  const rateLimitInfo = parseRateLimitInfo(error)
  if (rateLimitInfo.isRateLimit) {
    return rateLimitInfo.message
  }

  const message = (error.message || '').toLowerCase()
  const status = error.status

  if (
    message.includes('missing supabase url') ||
    message.includes('missing env') ||
    message.includes('invalid api key') ||
    message.includes('api key') ||
    message.includes('project not found') ||
    message.includes('invalid supabase url') ||
    message.includes('not a valid url')
  ) {
    return 'Supabase configuration error. Please verify the app credentials in the environment settings.'
  }

  if (message.includes('invalid login credentials') || message.includes('invalid_grant')) {
    return 'Incorrect email or password.'
  }

  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'An account with this email address already exists. Please log in instead.'
  }

  if (message.includes('password should be at least') || message.includes('weak password')) {
    return 'Password is too weak. Please use at least 6 characters.'
  }

  if (message.includes('email not confirmed')) {
    return 'Please check your email and confirm your account before signing in.'
  }

  if (message.includes('network') || message.includes('fetch') || message.includes('failed to fetch')) {
    return 'Network connection issue. Please check your internet connection and try again.'
  }

  if (message.includes('invalid email') || message.includes('unable to validate email')) {
    return 'Please enter a valid email address.'
  }

  return error.message || 'Authentication failed. Please try again.'
}

// In-flight mutex tracker to prevent duplicate concurrent network requests at service layer
const inFlightRequests = new Set()

export const authService = {
  /**
   * Sign up a new user with email, password, and optional user metadata (e.g. full_name)
   */
  async signUp(email, password, metadata = {}) {
    const key = `signup:${email.trim().toLowerCase()}`
    if (inFlightRequests.has(key)) {
      return {
        data: null,
        error: { message: 'A signup request is already in progress.' },
        readableMessage: 'A signup request is currently processing. Please wait.',
        isRateLimit: false,
        retryAfter: 0,
      }
    }

    inFlightRequests.add(key)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata,
        },
      })
      if (error) throw error
      return { data, error: null, isRateLimit: false, retryAfter: 0 }
    } catch (err) {
      const rateLimitInfo = parseRateLimitInfo(err)
      return {
        data: null,
        error: err,
        readableMessage: getReadableAuthError(err),
        isRateLimit: rateLimitInfo.isRateLimit,
        retryAfter: rateLimitInfo.retryAfter,
      }
    } finally {
      inFlightRequests.delete(key)
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    const key = `signin:${email.trim().toLowerCase()}`
    if (inFlightRequests.has(key)) {
      return {
        data: null,
        error: { message: 'A signin request is already in progress.' },
        readableMessage: 'A signin request is currently processing. Please wait.',
        isRateLimit: false,
        retryAfter: 0,
      }
    }

    inFlightRequests.add(key)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
      return { data, error: null, isRateLimit: false, retryAfter: 0 }
    } catch (err) {
      const rateLimitInfo = parseRateLimitInfo(err)
      return {
        data: null,
        error: err,
        readableMessage: getReadableAuthError(err),
        isRateLimit: rateLimitInfo.isRateLimit,
        retryAfter: rateLimitInfo.retryAfter,
      }
    } finally {
      inFlightRequests.delete(key)
    }
  },

  /**
   * Sign out the currently authenticated user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err, readableMessage: getReadableAuthError(err) }
    }
  },

  /**
   * Retrieve active session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: { session: null }, error: err }
    }
  },

  /**
   * Retrieve current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data?.user || null
    } catch {
      return null
    }
  },

  /**
   * Trigger password reset email
   */
  async resetPassword(email, redirectTo) {
    const key = `reset:${email.trim().toLowerCase()}`
    if (inFlightRequests.has(key)) {
      return {
        data: null,
        error: { message: 'A password reset request is already in progress.' },
        readableMessage: 'A password reset request is currently processing. Please wait.',
        isRateLimit: false,
        retryAfter: 0,
      }
    }

    inFlightRequests.add(key)
    try {
      const redirectUrl = redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      })
      if (error) throw error
      return { data, error: null, isRateLimit: false, retryAfter: 0 }
    } catch (err) {
      const rateLimitInfo = parseRateLimitInfo(err)
      return {
        data: null,
        error: err,
        readableMessage: getReadableAuthError(err),
        isRateLimit: rateLimitInfo.isRateLimit,
        retryAfter: rateLimitInfo.retryAfter,
      }
    } finally {
      inFlightRequests.delete(key)
    }
  },

  /**
   * Update password for an active session (e.g. after recovery link)
   */
  async updatePassword(newPassword) {
    const key = 'update_password'
    if (inFlightRequests.has(key)) {
      return {
        data: null,
        error: { message: 'Password update already in progress.' },
        readableMessage: 'Password update is currently processing. Please wait.',
        isRateLimit: false,
        retryAfter: 0,
      }
    }

    inFlightRequests.add(key)
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      return { data, error: null, isRateLimit: false, retryAfter: 0 }
    } catch (err) {
      const rateLimitInfo = parseRateLimitInfo(err)
      return {
        data: null,
        error: err,
        readableMessage: getReadableAuthError(err),
        isRateLimit: rateLimitInfo.isRateLimit,
        retryAfter: rateLimitInfo.retryAfter,
      }
    } finally {
      inFlightRequests.delete(key)
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}