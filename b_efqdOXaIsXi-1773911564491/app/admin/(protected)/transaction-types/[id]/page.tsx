import Link from "next/link";
import { notFound } from "next/navigation";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { getMediaAssets, getTransactionTypes } from "@/lib/admin-cms";

interface AdminEditTransactionTypePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditTransactionTypePage({
  params,
}: AdminEditTransactionTypePageProps) {
  const { id } = await params;
  const [transactionTypes, mediaAssets] = await Promise.all([
    getTransactionTypes({ includeInactive: true }),
    getMediaAssets(),
  ]);
  const transactionType = transactionTypes.find(
    (item) => item.id === Number(id)
  );

  if (!transactionType) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Taxonomie</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Modifier le type de transaction</h1>
        </div>
        <Link
          href="/admin/transaction-types"
          className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold"
        >
          Retour aux types de transaction
        </Link>
      </div>

      <TaxonomyForm
        mode="transaction"
        item={transactionType}
        mediaAssets={mediaAssets}
      />
    </div>
  );
}
