import Link from "next/link";
import { getDashboardStats } from "@/lib/cms";

export default function AdminDashboardPage() {
  const stats = getDashboardStats();

  const cards = [
    { label: "Total properties", value: stats.propertiesCount, href: "/admin/properties" },
    { label: "Published listings", value: stats.publishedCount, href: "/admin/properties" },
    { label: "Published agents", value: stats.agentsCount, href: "/admin/agents" },
    { label: "Inquiries", value: stats.inquiriesCount, href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Overview</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Admin dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manage listings, taxonomy, page content, navigation, footer settings, media and inbound
          inquiries from one place.
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
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Quick actions</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/properties/new" className="cta-dark-button rounded-md px-4 py-3 text-xs uppercase tracking-wide">
              Add property
            </Link>
            <Link href="/admin/agents/new" className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold">
              Add agent
            </Link>
            <Link href="/admin/content/home" className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold">
              Edit homepage
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Scope</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Properties, transaction types and property types are fully database driven.</li>
            <li>Homepage and transaction landing pages can be edited from the content section.</li>
            <li>Navbar, footer, global SEO defaults and uploads are managed inside the admin.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
