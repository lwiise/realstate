import Link from "next/link";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { getMediaAssets } from "@/lib/admin-cms";

export default async function AdminNewPropertyTypePage() {
  const mediaAssets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Taxonomie</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Ajouter un type de propriété</h1>
        </div>
        <Link
          href="/admin/property-types"
          className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold"
        >
          Retour aux types de propriété
        </Link>
      </div>

      <TaxonomyForm mode="property" mediaAssets={mediaAssets} />
    </div>
  );
}
