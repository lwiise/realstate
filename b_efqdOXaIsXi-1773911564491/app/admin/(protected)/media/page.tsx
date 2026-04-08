import { getMediaAssets } from "@/lib/admin-cms";

export default async function AdminMediaPage() {
  const mediaAssets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Media</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Media library</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Upload media directly from image fields in the editors. Every uploaded asset appears here
          and can be reused across pages, listings and agents.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mediaAssets.map((asset) => (
          <div key={asset.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-[4/3] bg-secondary">
              <img src={asset.url} alt={asset.title} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-1 px-4 py-3">
              <p className="truncate text-sm font-medium text-foreground">{asset.title}</p>
              <p className="truncate text-xs text-muted-foreground">{asset.url}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
