import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase server client not fully configured (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing)');
}

export const getSupabaseServerClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase server client not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
};

export async function verifySupabaseAccessToken(authorizationHeader?: string | null) {
  if (!authorizationHeader) throw new Error('Missing Authorization header');
  const m = authorizationHeader.match(/^Bearer\s+(.*)$/i);
  if (!m) throw new Error('Invalid Authorization header');
  const token = m[1];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    throw new Error('Invalid token');
  }
  return data.user;
}
