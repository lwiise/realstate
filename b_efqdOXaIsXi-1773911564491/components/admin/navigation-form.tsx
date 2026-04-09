import { saveNavigationAction } from "@/app/admin/actions";
import { AdminFormSubmit } from "@/components/admin/admin-form-submit";
import { ImageInput } from "@/components/admin/image-input";
import { ObjectListInput } from "@/components/admin/object-list-input";
import type { MediaAsset, NavigationSettings } from "@/lib/cms-types";

interface NavigationFormProps {
  navigation: NavigationSettings;
  mediaAssets: MediaAsset[];
}

export function NavigationForm({ navigation, mediaAssets }: NavigationFormProps) {
  return (
    <form action={saveNavigationAction} className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Identité visuelle</h2>
        <div className="mt-6 grid gap-6">
          <ImageInput
            name="logoUrl"
            label="Logo"
            defaultValue={navigation.logoUrl}
            library={mediaAssets}
          />
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Texte alternatif du logo</span>
            <input
              name="logoAlt"
              defaultValue={navigation.logoAlt}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Liens de navigation</h2>
        <div className="mt-6">
          <ObjectListInput
            name="links"
            label="Liens"
            itemLabel="un lien"
            defaultValue={navigation.links.map((link) => ({
              label: link.label,
              href: link.href,
              isEnabled: link.isEnabled ? "true" : "false",
            }))}
            fields={[
              { key: "label", label: "Libellé" },
              { key: "href", label: "Lien", type: "url", placeholder: "/buy ou /#about" },
              { key: "isEnabled", label: "Activé", type: "checkbox" },
            ]}
          />
        </div>
      </section>

      <AdminFormSubmit label="Enregistrer la navigation" />
    </form>
  );
}
