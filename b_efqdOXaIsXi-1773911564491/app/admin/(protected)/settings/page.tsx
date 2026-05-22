import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { TranslationStatus } from "@/components/admin/translation-status";
import { getMediaAssets, getSiteSettings } from "@/lib/admin-cms";

export default async function AdminSettingsPage() {
  const [settings, mediaAssets] = await Promise.all([getSiteSettings(), getMediaAssets()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Site</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Paramètres globaux et SEO</h1>
      </div>

      <TranslationStatus entityType="site-settings" entityId="1" redirectTo="/admin/settings" />

      <SiteSettingsForm settings={settings} mediaAssets={mediaAssets} />
    </div>
  );
}
