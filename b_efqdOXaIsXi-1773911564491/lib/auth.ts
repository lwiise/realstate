import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseAuthConfigured } from "@/lib/supabase/server";

// Admin authentication is backed by Supabase Auth. Any user that can authenticate with
// Supabase (i.e. a user you created in the Supabase dashboard) is treated as an admin —
// keep "Allow new users to sign up" OFF in Supabase so no one can self-register.

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

function resolveDisplayName(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}) {
  const metadata = user.user_metadata ?? {};
  const fullName = typeof metadata.full_name === "string" ? metadata.full_name : "";
  const name = typeof metadata.name === "string" ? metadata.name : "";
  return fullName || name || user.email || "Admin";
}

// Returns the signed-in admin, or null when there is no valid Supabase session.
// getUser() validates the access token against Supabase Auth (it does not trust the
// cookie blindly), so this is safe to use for route protection.
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  if (!isSupabaseAuthConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    name: resolveDisplayName(data.user),
    email: data.user.email ?? "",
  };
}

// Guards a protected admin route/server action: redirects to the login page when there
// is no authenticated admin, otherwise returns the user.
export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

// Backs the login page's "is the admin area usable?" message. With Supabase Auth the
// only failure mode we can detect cheaply up front is missing configuration.
export function getAdminAuthStatus() {
  if (!isSupabaseAuthConfigured()) {
    return {
      available: false,
      message:
        "La connexion admin n’est pas encore configurée. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY, puis redéployez.",
    };
  }

  return { available: true, message: "" };
}
