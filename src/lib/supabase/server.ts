import { createClient } from '@supabase/supabase-js';

// Server-only client using the service role key. The app has no auth layer,
// so all reads/writes are funneled through server actions/routes using this
// client rather than exposing table access to the browser.
export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase server env vars are not configured.');
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
