import { saveNavigationAction } from "@/app/admin/actions";
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
        <h2 className="font-serif text-2xl text-foreground">Branding</h2>
        <div className="mt-6 grid gap-6">
          <ImageInput
            name="logoUrl"
            label="Logo"
            defaultValue={navigation.logoUrl}
            library={mediaAssets}
          />
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Logo alt text</span>
            <input
              name="logoAlt"
              defaultValue={navigation.logoAlt}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Navigation links</h2>
        <div className="mt-6">
          <ObjectListInput
            name="links"
            label="Links"
            itemLabel="Link"
            defaultValue={navigation.links.map((link) => ({
              label: link.label,
              href: link.href,
              isEnabled: link.isEnabled ? "true" : "false",
            }))}
            fields={[
              { key: "label", label: "Label" },
              { key: "href", label: "Href", type: "url", placeholder: "/buy or /#about" },
              { key: "isEnabled", label: "Enabled", type: "checkbox" },
            ]}
          />
        </div>
      </section>

      <button
        type="submit"
        className="cta-dark-button rounded-md px-5 py-3 text-xs font-medium uppercase tracking-wide"
      >
        Save navigation
      </button>
    </form>
  );
}
