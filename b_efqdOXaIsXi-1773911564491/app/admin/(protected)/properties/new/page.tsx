import Link from "next/link";
import { PropertyForm } from "@/components/admin/property-form";
import { getAgents, getMediaAssets, getPropertyTypes, getTransactionTypes } from "@/lib/cms";

export default async function AdminNewPropertyPage() {
  const [transactionTypes, propertyTypes, agents, mediaAssets] = await Promise.all([
    getTransactionTypes({ includeInactive: true }),
    getPropertyTypes({ includeInactive: true }),
    getAgents({ includeUnpublished: true }),
    getMediaAssets(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Properties</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Add property</h1>
        </div>
        <Link
          href="/admin/properties"
          className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold"
        >
          Back to properties
        </Link>
      </div>

      <PropertyForm
        transactionTypes={transactionTypes}
        propertyTypes={propertyTypes}
        agents={agents}
        mediaAssets={mediaAssets}
      />
    </div>
  );
}
