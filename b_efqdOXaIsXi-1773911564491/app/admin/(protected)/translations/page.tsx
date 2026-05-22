import { getTranslationOverview } from "@/lib/translation-service";
import { TranslationRunner } from "@/components/admin/translation-runner";

export default async function AdminTranslationsPage() {
  const overview = await getTranslationOverview();
  const pending = overview.pending + overview.failed;

  const cards = [
    { label: "Total", value: overview.total },
    { label: "Traduits", value: overview.translated },
    { label: "En attente", value: overview.pending },
    { label: "Échecs", value: overview.failed },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Traductions</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Traductions anglaises</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Le français est la source. L&apos;anglais est généré par Gemini puis enregistré : les pages
          <code className="mx-1 font-mono">/en</code> affichent la version enregistrée (repli automatique
          en français si une traduction manque). Lancez la traduction ci-dessous pour le contenu existant.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
            <p className="mt-1 font-serif text-2xl text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <TranslationRunner initialPending={pending} geminiConfigured={overview.geminiConfigured} />
    </div>
  );
}
