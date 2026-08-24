import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
const normalizedSupabaseUrl = supabaseUrl ? supabaseUrl.replace(/\/+$/, '') : ''

const isValidSupabaseProjectUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co(?:\/.*)?$/i.test(normalizedSupabaseUrl)

if (!normalizedSupabaseUrl || !supabasePublishableKey) {
  console.error('Supabase configuration is missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.')
}

if (normalizedSupabaseUrl && !isValidSupabaseProjectUrl) {
  console.error('Supabase URL is invalid. Expected a project URL like https://<project-ref>.supabase.co')
}

export const supabase = createClient(
  normalizedSupabaseUrl || 'https://example.supabase.co',
  supabasePublishableKey || 'placeholder-publishable-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
