import { saveSiteSettingsAction } from "@/app/admin/actions";
import { AdminFormSubmit } from "@/components/admin/admin-form-submit";
import { ImageInput } from "@/components/admin/image-input";
import { StringListInput } from "@/components/admin/string-list-input";
import type { MediaAsset, SiteSettings } from "@/lib/cms-types";

interface SiteSettingsFormProps {
  settings: SiteSettings;
  mediaAssets: MediaAsset[];
}

export function SiteSettingsForm({ settings, mediaAssets }: SiteSettingsFormProps) {
  return (
    <form action={saveSiteSettingsAction} className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Global site settings</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Site name</span>
            <input
              name="siteName"
              defaultValue={settings.siteName}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Site URL</span>
            <input
              name="siteUrl"
              defaultValue={settings.siteUrl}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Site description</span>
            <textarea
              name="siteDescription"
              rows={4}
              defaultValue={settings.siteDescription}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
          <StringListInput
            name="siteKeywords"
            label="SEO keywords"
            defaultValue={settings.siteKeywords}
            itemPlaceholder="Add one keyword"
          />
          <div />
          <ImageInput
            name="logoUrl"
            label="Logo"
            defaultValue={settings.logoUrl}
            library={mediaAssets}
          />
          <ImageInput
            name="defaultOgImage"
            label="Default OG image"
            defaultValue={settings.defaultOgImage}
            library={mediaAssets}
          />
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Logo alt text</span>
            <input
              name="logoAlt"
              defaultValue={settings.logoAlt}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Contact and localization</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Contact email</span>
            <input
              name="contactEmail"
              type="email"
              defaultValue={settings.contactEmail}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Contact phone</span>
            <input
              name="contactPhone"
              defaultValue={settings.contactPhone}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">WhatsApp number</span>
            <input
              name="whatsappNumber"
              defaultValue={settings.whatsappNumber}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Company address</span>
            <input
              name="companyAddress"
              defaultValue={settings.companyAddress}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Currency code</span>
            <input
              name="currencyCode"
              defaultValue={settings.currencyCode}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Currency locale</span>
            <input
              name="currencyLocale"
              defaultValue={settings.currencyLocale}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Copyright text</span>
            <input
              name="copyrightText"
              defaultValue={settings.copyrightText}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Default SEO</h2>
        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Default SEO title</span>
            <input
              name="defaultSeoTitle"
              defaultValue={settings.defaultSeoTitle}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Default SEO description</span>
            <textarea
              name="defaultSeoDescription"
              rows={4}
              defaultValue={settings.defaultSeoDescription}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
        </div>
      </section>

      <AdminFormSubmit label="Save site settings" />
    </form>
  );
}
