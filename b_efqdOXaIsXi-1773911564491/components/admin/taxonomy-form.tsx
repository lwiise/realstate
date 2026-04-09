import { savePropertyTypeAction, saveTransactionTypeAction } from "@/app/admin/actions";
import { AdminFormSubmit } from "@/components/admin/admin-form-submit";
import { ImageInput } from "@/components/admin/image-input";
import type { MediaAsset, PropertyType, TransactionType } from "@/lib/cms-types";

type TaxonomyFormProps =
  | {
      mode: "property";
      item?: PropertyType;
      mediaAssets: MediaAsset[];
    }
  | {
      mode: "transaction";
      item?: TransactionType;
      mediaAssets: MediaAsset[];
    };

export function TaxonomyForm(props: TaxonomyFormProps) {
  const { mode, mediaAssets } = props;
  const item = props.item;
  const action = mode === "property" ? savePropertyTypeAction : saveTransactionTypeAction;

  return (
    <form action={action} className="space-y-8">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">
          {mode === "property" ? "Type de propriété" : "Type de transaction"}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Libellé</span>
            <input
              name="label"
              defaultValue={item?.label}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Slug</span>
            <input
              name="slug"
              defaultValue={item?.slug}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Description
            </span>
            <textarea
              name="description"
              rows={4}
              defaultValue={item?.description ?? ""}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Ordre de tri</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={item?.sortOrder ?? 0}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
            <input type="checkbox" name="isActive" defaultChecked={item?.isActive ?? true} />
            <span className="text-sm text-foreground">Actif</span>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Médias</h2>
        <div className="mt-6">
          <ImageInput
            name="imageUrl"
            label="Image de carte"
            defaultValue={item?.imageUrl}
            library={mediaAssets}
          />
        </div>
      </section>

      {mode === "transaction" ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl text-foreground">Routage et navigation</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Chemin de l’URL
              </span>
              <input
                name="routePath"
                defaultValue={item?.routePath ?? "/"}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Libellé de navigation
              </span>
              <input
                name="navLabel"
                defaultValue={item?.navLabel ?? ""}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Suffixe du prix
              </span>
              <input
                name="priceSuffix"
                defaultValue={item?.priceSuffix ?? ""}
                placeholder="/mois, /jour, etc."
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
            <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
              <input
                type="checkbox"
                name="showInNavigation"
                defaultChecked={item?.showInNavigation ?? true}
              />
              <span className="text-sm text-foreground">Afficher dans la navigation</span>
            </label>
          </div>
        </section>
      ) : null}

      <AdminFormSubmit
        label={`Enregistrer ${mode === "property" ? "le type de propriété" : "le type de transaction"}`}
      />
    </form>
  );
}
