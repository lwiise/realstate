import { FooterForm } from "@/components/admin/footer-form";
import { getFooterSettings } from "@/lib/cms";

export default async function AdminFooterPage() {
  const footer = await getFooterSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Site</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Footer settings</h1>
      </div>

      <FooterForm footer={footer} />
    </div>
  );
}
