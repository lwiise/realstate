import { NavigationForm } from "@/components/admin/navigation-form";
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
        <h1 className="mt-2 font-serif text-3xl text-foreground">Navbar settings</h1>
      </div>

      <NavigationForm navigation={navigation} mediaAssets={mediaAssets} />
    </div>
  );
}
