import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://socbwttziawbomgvwdki.supabase.co'
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_XTL5nsRFj4nZfECcfc_x5g_uB1-IIxn'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim()
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY
).trim()
const normalizedSupabaseUrl = supabaseUrl.replace(/\/+$/, '')

const isValidSupabaseProjectUrl =
  /^https:\/\/[a-z0-9-]+\.supabase\.co(?:\/.*)?$/i.test(normalizedSupabaseUrl)

if (!isValidSupabaseProjectUrl) {
  console.error('[Supabase] Invalid project URL:', normalizedSupabaseUrl)
}

if (!supabasePublishableKey) {
  console.error('[Supabase] Publishable API key is missing.')
}

export const supabase = createClient(normalizedSupabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

export const supabaseConfig = {
  url: normalizedSupabaseUrl,
  configured: Boolean(normalizedSupabaseUrl && supabasePublishableKey),
}
