import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-cms";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total des propriétés", value: stats.propertiesCount, href: "/admin/properties" },
    { label: "Annonces publiées", value: stats.publishedCount, href: "/admin/properties" },
    { label: "Agents publiés", value: stats.agentsCount, href: "/admin/agents" },
    { label: "Demandes", value: stats.inquiriesCount, href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Vue d’ensemble</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Tableau de bord admin</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Gérez les annonces, les taxonomies, le contenu des pages, la navigation, le pied de
          page, les médias et les demandes entrantes depuis un seul endroit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{card.label}</p>
            <p className="mt-4 font-serif text-4xl text-foreground">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Actions rapides</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/properties/new" className="cta-dark-button rounded-md px-4 py-3 text-xs uppercase tracking-wide">
              Ajouter une propriété
            </Link>
            <Link href="/admin/agents/new" className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold">
              Ajouter un agent
            </Link>
            <Link href="/admin/content/home" className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold">
              Modifier l’accueil
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Périmètre</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Les propriétés, types de transaction et types de propriété sont entièrement pilotés par la base de données.</li>
            <li>La page d’accueil et les pages d’atterrissage par transaction sont modifiables depuis la section contenu.</li>
            <li>La navigation, le pied de page, les valeurs SEO globales et les téléversements sont gérés dans l’admin.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
