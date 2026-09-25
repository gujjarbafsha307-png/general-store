import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jwryorbcytoyzljfpfpx.supabase.co'

const supabaseAnonKey = 'sb_publishable_tMqSEIao6uu0HVc9ZkcsBg_CoX3lqVs'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)