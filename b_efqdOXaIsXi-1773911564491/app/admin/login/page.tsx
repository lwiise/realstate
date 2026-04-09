import { redirect } from "next/navigation";
import { getAdminAuthStatus, getCurrentAdminUser } from "@/lib/auth";
import { loginAdminAction, setupAdminAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

interface AdminLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const errorCopy: Record<string, string> = {
  "setup-disabled": "La configuration initiale est déjà terminée.",
  "setup-invalid": "Le nom, l’e-mail et un mot de passe d’au moins 8 caractères sont requis.",
  "missing-fields": "L’e-mail et le mot de passe sont requis.",
  "invalid-credentials": "E-mail ou mot de passe invalide.",
  "auth-unavailable":
    "Le panneau d’administration ne peut pas se connecter à sa base de données pour le moment. Vérifiez vos variables d’environnement Netlify et Supabase, puis redéployez.",
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
  const [admin, params, authStatus] = await Promise.all([
    getCurrentAdminUser(),
    searchParams,
    getAdminAuthStatus(),
  ]);

  if (admin) {
    redirect("/admin");
  }

  const errorParam = params.error;
  const errorKey = Array.isArray(errorParam) ? errorParam[0] : errorParam;
  const errorMessage = !authStatus.available
    ? authStatus.message
    : errorKey
      ? errorCopy[errorKey]
      : "";
  const hasUsers = authStatus.hasUsers;

  return (
    <AuthShell
      title={!authStatus.available ? "Admin temporairement indisponible" : hasUsers ? "Connexion admin" : "Créer le premier compte admin"}
      description={
        !authStatus.available
          ? "Le site public reste en ligne, mais l’espace admin ne peut pas atteindre sa base de données distante."
          : hasUsers
            ? "Accédez à l’espace de gestion pour mettre à jour les pages, les annonces, les agents, les taxonomies et les médias."
            : "Le CMS n’a pas encore été initialisé. Créez le premier compte admin pour activer l’espace de gestion protégé."
      }
    >
      {errorMessage ? (
        <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {!authStatus.available ? null : hasUsers ? (
        <form action={loginAdminAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">
              E-mail
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
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="Votre mot de passe"
            />
          </div>

          <button
            type="submit"
            className="cta-dark-button h-12 w-full rounded-md text-sm font-medium uppercase tracking-wide"
          >
            Se connecter
          </button>
        </form>
      ) : (
        <form action={setupAdminAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground">
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="Nom de l’administrateur"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">
              E-mail
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
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              placeholder="Au moins 8 caractères"
            />
          </div>

          <button
            type="submit"
            className="cta-dark-button h-12 w-full rounded-md text-sm font-medium uppercase tracking-wide"
          >
            Créer le compte admin
          </button>
        </form>
      )}
    </AuthShell>
  );
}
