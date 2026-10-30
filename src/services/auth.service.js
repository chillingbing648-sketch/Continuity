const USERS_KEY = 'continuity_local_users_v1'
const SESSION_KEY = 'continuity_local_session_v1'
const COOKIE_NAME = 'continuity_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30
const listeners = new Set()
const inFlightRequests = new Set()

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()
const makeError = (message) => ({ message })

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const prefix = name + '='
  const item = document.cookie.split('; ').find((part) => part.startsWith(prefix))
  return item ? decodeURIComponent(item.slice(prefix.length)) : null
}

function writeSessionCookie(token) {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = token
    ? `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; SameSite=Lax${secure}`
    : `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`
}

function emitAuthChange(event, session) {
  listeners.forEach((callback) => {
    try { callback(event, session) } catch (error) { console.error('[LocalAuth] listener failed', error) }
  })
}

function publicUser(record) {
  return record ? {
    id: record.id,
    email: record.email,
    user_metadata: record.metadata || {},
    created_at: record.createdAt,
  } : null
}

function currentSession() {
  const session = readJson(SESSION_KEY, null)
  const cookieToken = readCookie(COOKIE_NAME)
  if (!session || !cookieToken || cookieToken !== session.access_token || session.expires_at <= Math.floor(Date.now() / 1000)) {
    if (session) {
      localStorage.removeItem(SESSION_KEY)
      writeSessionCookie(null)
    }
    return null
  }
  const users = readJson(USERS_KEY, [])
  const record = users.find((item) => item.id === session.user?.id)
  if (!record) {
    localStorage.removeItem(SESSION_KEY)
    writeSessionCookie(null)
    return null
  }
  return { ...session, user: publicUser(record) }
}

function saveSession(record) {
  const token = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const session = {
    access_token: token,
    token_type: 'bearer',
    expires_at: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    user: publicUser(record),
  }
  writeJson(SESSION_KEY, session)
  writeSessionCookie(token)
  emitAuthChange('SIGNED_IN', session)
  return session
}

async function derivePassword(password, salt) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure browser cryptography is unavailable. Use HTTPS or localhost.')
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 210000, hash: 'SHA-256' },
    key,
    256,
  )
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function resultError(message) {
  const error = makeError(message)
  return { data: null, error, readableMessage: message, isRateLimit: false, retryAfter: 0 }
}

export const authService = {
  async signUp(email, password, metadata = {}) {
    const normalizedEmail = normalizeEmail(email)
    const key = `signup:${normalizedEmail}`
    if (inFlightRequests.has(key)) return resultError('A signup request is already processing. Please wait.')
    inFlightRequests.add(key)
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return resultError('Please enter a valid email address.')
      if (String(password || '').length < 8) return resultError('Password must contain at least 8 characters.')
      const users = readJson(USERS_KEY, [])
      if (users.some((item) => item.email === normalizedEmail)) return resultError('An account with this email address already exists. Please log in instead.')
      const salt = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
      const record = {
        id: crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
        email: normalizedEmail,
        passwordSalt: salt,
        passwordHash: await derivePassword(password, salt),
        metadata,
        createdAt: new Date().toISOString(),
      }
      users.push(record)
      writeJson(USERS_KEY, users)
      const session = saveSession(record)
      return { data: { user: session.user, session }, error: null, isRateLimit: false, retryAfter: 0 }
    } catch (error) {
      return resultError(error.message || 'Could not create the local account.')
    } finally {
      inFlightRequests.delete(key)
    }
  },

  async signIn(email, password) {
    const normalizedEmail = normalizeEmail(email)
    const key = `signin:${normalizedEmail}`
    if (inFlightRequests.has(key)) return resultError('A sign-in request is already processing. Please wait.')
    inFlightRequests.add(key)
    try {
      const users = readJson(USERS_KEY, [])
      const record = users.find((item) => item.email === normalizedEmail)
      if (!record) return resultError('Incorrect email or password.')
      const hash = await derivePassword(password, record.passwordSalt)
      if (hash !== record.passwordHash) return resultError('Incorrect email or password.')
      const session = saveSession(record)
      return { data: { user: session.user, session }, error: null, isRateLimit: false, retryAfter: 0 }
    } catch (error) {
      return resultError(error.message || 'Could not sign in.')
    } finally {
      inFlightRequests.delete(key)
    }
  },

  async signOut() {
    localStorage.removeItem(SESSION_KEY)
    writeSessionCookie(null)
    emitAuthChange('SIGNED_OUT', null)
    return { error: null }
  },

  async getSession() {
    const session = currentSession()
    return { data: { session }, error: null }
  },

  async getCurrentUser() {
    return currentSession()?.user || null
  },

  async resetPassword() {
    return resultError('Email-based password recovery is unavailable in local-only mode. Sign in and change your password from account settings.')
  },

  async updatePassword(newPassword) {
    if (String(newPassword || '').length < 8) return resultError('Password must contain at least 8 characters.')
    const session = currentSession()
    if (!session) return resultError('Please sign in again before changing your password.')
    try {
      const users = readJson(USERS_KEY, [])
      const index = users.findIndex((item) => item.id === session.user.id)
      if (index < 0) return resultError('Local account not found.')
      const salt = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
      users[index] = { ...users[index], passwordSalt: salt, passwordHash: await derivePassword(newPassword, salt) }
      writeJson(USERS_KEY, users)
      const nextSession = saveSession(users[index])
      return { data: { user: nextSession.user, session: nextSession }, error: null, isRateLimit: false, retryAfter: 0 }
    } catch (error) {
      return resultError(error.message || 'Could not update the password.')
    }
  },

  onAuthStateChange(callback) {
    listeners.add(callback)
    return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } }
  },
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === SESSION_KEY) {
      const session = currentSession()
      emitAuthChange(session ? 'SIGNED_IN' : 'SIGNED_OUT', session)
    }
  })
}
