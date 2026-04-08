import { notFound } from "next/navigation";
import { PageContentForm } from "@/components/admin/page-content-form";
import { getMediaAssets, getPageContent } from "@/lib/admin-cms";
import type { PageKey } from "@/lib/cms-types";

interface AdminPageContentPageProps {
  params: Promise<{ pageKey: string }>;
}

const validPageKeys: PageKey[] = [
  "home",
  "buy",
  "rent",
  "daily-rent",
  "about",
  "contact",
];

export default async function AdminPageContentPage({
  params,
}: AdminPageContentPageProps) {
  const { pageKey } = await params;

  if (!validPageKeys.includes(pageKey as PageKey)) {
    notFound();
  }

  const key = pageKey as PageKey;
  const [page, mediaAssets] = await Promise.all([getPageContent(key), getMediaAssets()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Page content</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">
          Edit {key === "daily-rent" ? "daily rent" : key}
        </h1>
      </div>

      <PageContentForm page={page} mediaAssets={mediaAssets} />
    </div>
  );
}
