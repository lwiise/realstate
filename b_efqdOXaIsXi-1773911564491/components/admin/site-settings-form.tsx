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
        <h2 className="font-serif text-2xl text-foreground">Paramètres globaux du site</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Nom du site</span>
            <input
              name="siteName"
              defaultValue={settings.siteName}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">URL du site</span>
            <input
              name="siteUrl"
              defaultValue={settings.siteUrl}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Description du site</span>
            <textarea
              name="siteDescription"
              rows={4}
              defaultValue={settings.siteDescription}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
          <StringListInput
            name="siteKeywords"
            label="Mots-clés SEO"
            defaultValue={settings.siteKeywords}
            itemPlaceholder="Ajouter un mot-clé"
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
            label="Image OG par défaut"
            defaultValue={settings.defaultOgImage}
            library={mediaAssets}
          />
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Texte alternatif du logo</span>
            <input
              name="logoAlt"
              defaultValue={settings.logoAlt}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Contact et localisation</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">E-mail de contact</span>
            <input
              name="contactEmail"
              type="email"
              defaultValue={settings.contactEmail}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Téléphone de contact</span>
            <input
              name="contactPhone"
              defaultValue={settings.contactPhone}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Numéro WhatsApp</span>
            <input
              name="whatsappNumber"
              defaultValue={settings.whatsappNumber}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Adresse de l’entreprise</span>
            <input
              name="companyAddress"
              defaultValue={settings.companyAddress}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Code devise</span>
            <input
              name="currencyCode"
              defaultValue={settings.currencyCode}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Paramètre régional de la devise</span>
            <input
              name="currencyLocale"
              defaultValue={settings.currencyLocale}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Texte de copyright</span>
            <input
              name="copyrightText"
              defaultValue={settings.copyrightText}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">SEO par défaut</h2>
        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre SEO par défaut</span>
            <input
              name="defaultSeoTitle"
              defaultValue={settings.defaultSeoTitle}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Description SEO par défaut</span>
            <textarea
              name="defaultSeoDescription"
              rows={4}
              defaultValue={settings.defaultSeoDescription}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
        </div>
      </section>

      <AdminFormSubmit label="Enregistrer les paramètres du site" />
    </form>
  );
}
