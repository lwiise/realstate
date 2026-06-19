import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

// Refreshes the Supabase Auth session during a middleware pass. Supabase access tokens
// are short-lived; calling getUser() here rotates them when needed and writes the new
// cookies onto the outgoing response, so server components downstream see a valid session.
//
// The response is created by the caller (middleware.ts) so it can keep the existing
// locale headers/cookies; this helper only attaches refreshed auth cookies to it.
export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Auth not configured (e.g. local dev without Supabase) — nothing to refresh.
  if (!url || !anonKey) {
    return;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and getUser() — it must be the
  // first auth call so token rotation happens before anything reads the session.
  await supabase.auth.getUser();
}
