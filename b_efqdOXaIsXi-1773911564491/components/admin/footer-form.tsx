import { saveFooterAction } from "@/app/admin/actions";
import { ObjectListInput } from "@/components/admin/object-list-input";
import type { FooterSettings } from "@/lib/cms-types";

interface FooterFormProps {
  footer: FooterSettings;
}

const linkFields = [
  { key: "label", label: "Label" },
  { key: "href", label: "Href", type: "url" as const },
  { key: "isEnabled", label: "Enabled", type: "checkbox" as const },
];

export function FooterForm({ footer }: FooterFormProps) {
  return (
    <form action={saveFooterAction} className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Brand copy</h2>
        <div className="mt-6">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Brand text</span>
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
        <h2 className="font-serif text-2xl text-foreground">Link groups</h2>
        <div className="mt-6 grid gap-6">
          <ObjectListInput
            name="quickLinks"
            label="Quick links"
            itemLabel="Quick link"
            defaultValue={footer.quickLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />

          <ObjectListInput
            name="propertyLinks"
            label="Property links"
            itemLabel="Property link"
            defaultValue={footer.propertyLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />

          <ObjectListInput
            name="socialLinks"
            label="Social links"
            itemLabel="Social link"
            defaultValue={footer.socialLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />

          <ObjectListInput
            name="legalLinks"
            label="Legal links"
            itemLabel="Legal link"
            defaultValue={footer.legalLinks.map((item) => ({
              label: item.label,
              href: item.href,
              isEnabled: item.isEnabled ? "true" : "false",
            }))}
            fields={linkFields}
          />
        </div>
      </section>

      <button
        type="submit"
        className="cta-dark-button rounded-md px-5 py-3 text-xs font-medium uppercase tracking-wide"
      >
        Save footer
      </button>
    </form>
  );
}
