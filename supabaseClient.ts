import { createClient } from '@supabase/supabase-js'
import { Database } from './types_db';

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // Add the ! here
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Add the ! here
);