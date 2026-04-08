import { NavigationForm } from "@/components/admin/navigation-form";
import { getMediaAssets, getNavigationSettings } from "@/lib/cms";

export default function AdminNavigationPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Site</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Navbar settings</h1>
      </div>

      <NavigationForm navigation={getNavigationSettings()} mediaAssets={getMediaAssets()} />
    </div>
  );
}
