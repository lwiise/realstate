import { redirect } from "next/navigation";
import { countAdminUsers, getCurrentAdminUser } from "@/lib/auth";
import { loginAdminAction, setupAdminAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

interface AdminLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const errorCopy: Record<string, string> = {
  "setup-disabled": "Initial setup has already been completed.",
  "setup-invalid": "Name, email and a password with at least 8 characters are required.",
  "missing-fields": "Email and password are required.",
  "invalid-credentials": "Invalid email or password.",
};

function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white md:p-12">
            <p className="text-gold text-xs uppercase tracking-[0.28em]">MDK CMS</p>
            <h1 className="mt-6 font-serif text-4xl md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-xl text-white/70">{description}</p>
          </div>
          <div className="rounded-3xl bg-white p-8 md:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [admin, params] = await Promise.all([getCurrentAdminUser(), searchParams]);

  if (admin) {
    redirect("/admin");
  }

  const hasUsers = (await countAdminUsers()) > 0;
  const errorParam = params.error;
  const errorKey = Array.isArray(errorParam) ? errorParam[0] : errorParam;
  const errorMessage = errorKey ? errorCopy[errorKey] : "";

  return (
    <AuthShell
      title={hasUsers ? "Admin sign in" : "Create the first admin"}
      description={
        hasUsers
          ? "Access the content management area to update pages, listings, agents, taxonomies and media."
          : "The CMS has not been initialized yet. Create the first admin account to activate the protected management area."
      }
    >
      {errorMessage ? (
        <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {hasUsers ? (
        <form action={loginAdminAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-wide text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="cta-dark-button h-12 w-full rounded-md text-sm font-medium uppercase tracking-wide"
          >
            Sign in
          </button>
        </form>
      ) : (
        <form action={setupAdminAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="Admin name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-wide text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            className="cta-dark-button h-12 w-full rounded-md text-sm font-medium uppercase tracking-wide"
          >
            Create admin account
          </button>
        </form>
      )}
    </AuthShell>
  );
}
