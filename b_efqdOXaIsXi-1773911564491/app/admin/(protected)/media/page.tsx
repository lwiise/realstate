import { getMediaAssets } from "@/lib/admin-cms";

export default async function AdminMediaPage() {
  const mediaAssets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Medias</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Mediatheque</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Televersez les medias directement depuis les champs des editeurs. Chaque ressource
          apparait ici et peut etre reutilisee sur les pages, les annonces et les agents.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mediaAssets.map((asset) => {
          const isVideo = asset.mimeType.startsWith("video/");

          return (
            <div key={asset.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[4/3] bg-secondary">
                {isVideo ? (
                  <video
                    src={asset.url}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img src={asset.url} alt={asset.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="space-y-1 px-4 py-3">
                <p className="truncate text-sm font-medium text-foreground">{asset.title}</p>
                <p className="text-xs text-muted-foreground">{isVideo ? "Video" : "Image"}</p>
                <p className="truncate text-xs text-muted-foreground">{asset.url}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
