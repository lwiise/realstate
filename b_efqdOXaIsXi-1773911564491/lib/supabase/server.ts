import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// The admin login uses Supabase Auth. Both values are safe to expose to the browser
// (the anon key is a public key); the service-role key is never used here.
function getSupabaseAuthEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return { url, anonKey };
}

// True only when the project has the public URL + anon key needed for Supabase Auth.
// The login page uses this to show a clear "not configured" message instead of failing
// with an opaque error.
export function isSupabaseAuthConfigured() {
  const { url, anonKey } = getSupabaseAuthEnv();
  return Boolean(url && anonKey);
}

// Server-side Supabase client bound to the Next.js request cookies. Reads the session
// from cookies and, when Supabase rotates the tokens, writes them back. The cookie
// writes throw in Server Components (where cookies are read-only) — that's expected and
// ignored, because the middleware (lib/supabase/middleware.ts) refreshes the session on
// every admin navigation.
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseAuthEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — cookies are read-only here. Safe to ignore.
        }
      },
    },
  });
}
