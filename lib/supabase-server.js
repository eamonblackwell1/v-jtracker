import { createClient } from "@supabase/supabase-js";

// Server-only client — uses service_role key to bypass RLS.
// Only import this in API routes or server components.
export function getSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
