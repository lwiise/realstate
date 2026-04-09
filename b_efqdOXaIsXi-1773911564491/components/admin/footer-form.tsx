import { saveFooterAction } from "@/app/admin/actions";
import { AdminFormSubmit } from "@/components/admin/admin-form-submit";
import { ObjectListInput } from "@/components/admin/object-list-input";
import type { FooterSettings } from "@/lib/cms-types";

interface FooterFormProps {
  footer: FooterSettings;
}

const linkFields = [
  { key: "label", label: "Libellé" },
  { key: "href", label: "Lien", type: "url" as const },
  { key: "isEnabled", label: "Activé", type: "checkbox" as const },
];

export function FooterForm({ footer }: FooterFormProps) {
  return (
    <form action={saveFooterAction} className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Texte de marque</h2>
        <div className="mt-6">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Texte de marque</span>
            <textarea
              name="brandText"
              rows={4}
              defaultValue={footer.brandText}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Groupes de liens</h2>
        <div className="mt-6 grid gap-6">
          <ObjectListInput
            name="quickLinks"
            label="Liens rapides"
            itemLabel="un lien rapide"
            defaultValue={footer.quickLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />

          <ObjectListInput
            name="propertyLinks"
            label="Liens propriétés"
            itemLabel="un lien propriété"
            defaultValue={footer.propertyLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />

          <ObjectListInput
            name="socialLinks"
            label="Liens sociaux"
            itemLabel="un lien social"
            defaultValue={footer.socialLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />

          <ObjectListInput
            name="legalLinks"
            label="Liens légaux"
            itemLabel="un lien légal"
            defaultValue={footer.legalLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />
        </div>
      </section>

      <AdminFormSubmit label="Enregistrer le pied de page" />
    </form>
  );
}
