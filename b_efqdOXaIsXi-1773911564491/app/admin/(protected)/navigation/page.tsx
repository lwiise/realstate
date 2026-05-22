import { NavigationForm } from "@/components/admin/navigation-form";
import { TranslationStatus } from "@/components/admin/translation-status";
import { getMediaAssets, getNavigationSettings } from "@/lib/admin-cms";

export default async function AdminNavigationPage() {
  const [navigation, mediaAssets] = await Promise.all([
    getNavigationSettings(),
    getMediaAssets(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Site</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Paramètres de la navigation</h1>
      </div>

      <TranslationStatus entityType="navigation-settings" entityId="1" redirectTo="/admin/navigation" />

      <NavigationForm navigation={navigation} mediaAssets={mediaAssets} />
    </div>
  );
}
