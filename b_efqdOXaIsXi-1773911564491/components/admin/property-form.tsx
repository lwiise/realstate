import { savePropertyAction } from "@/app/admin/actions";
import { AdminFormSubmit } from "@/components/admin/admin-form-submit";
import { AdminUploadProvider } from "@/components/admin/admin-upload-context";
import { ImageInput } from "@/components/admin/image-input";
import { ImageListInput } from "@/components/admin/image-list-input";
import { StringListInput } from "@/components/admin/string-list-input";
import { VideoInput } from "@/components/admin/video-input";
import type { Agent, MediaAsset, Property, PropertyType, TransactionType } from "@/lib/cms-types";

interface PropertyFormProps {
  property?: Property;
  transactionTypes: TransactionType[];
  propertyTypes: PropertyType[];
  agents: Agent[];
  mediaAssets: MediaAsset[];
}

function numberValue(value?: number | null) {
  return value == null ? "" : String(value);
}

export function PropertyForm({
  property,
  transactionTypes,
  propertyTypes,
  agents,
  mediaAssets,
}: PropertyFormProps) {
  return (
    <AdminUploadProvider>
      <form action={savePropertyAction} className="space-y-8">
        {property ? <input type="hidden" name="id" value={property.id} /> : null}

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl text-foreground">Informations principales</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre</span>
              <input
                name="title"
                defaultValue={property?.title}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Slug</span>
              <input
                name="slug"
                defaultValue={property?.slug}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Statut</span>
              <select
                name="status"
                defaultValue={property?.status ?? "draft"}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publie</option>
                <option value="archived">Archive</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Type de transaction
              </span>
              <select
                name="transactionTypeId"
                defaultValue={property?.transactionTypeId ? String(property.transactionTypeId) : ""}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              >
                <option value="">Selectionnez un type de transaction</option>
                {transactionTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Type de propriete
              </span>
              <select
                name="propertyTypeId"
                defaultValue={property?.propertyTypeId ? String(property.propertyTypeId) : ""}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              >
                <option value="">Selectionnez un type de propriete</option>
                {propertyTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
              <input type="checkbox" name="featured" defaultChecked={property?.featured} />
              <span className="text-sm text-foreground">Annonce mise en avant</span>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Ordre de tri
              </span>
              <input
                name="sortOrder"
                type="number"
                defaultValue={numberValue(property?.sortOrder)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl text-foreground">Localisation et tarification</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Ville</span>
              <input
                name="city"
                defaultValue={property?.city}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Quartier
              </span>
              <input
                name="neighborhood"
                defaultValue={property?.neighborhood}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Adresse complete
              </span>
              <input
                name="fullAddress"
                defaultValue={property?.fullAddress ?? ""}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Prix</span>
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue={numberValue(property?.price)}
                required
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Surface</span>
              <input
                name="area"
                type="number"
                min="0"
                step="0.01"
                defaultValue={numberValue(property?.area)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Unite de surface
              </span>
              <select
                name="areaUnit"
                defaultValue={property?.areaUnit ?? "sqft"}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              >
                <option value="sqft">sqft</option>
                <option value="m²">m²</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Chambres</span>
              <input
                name="bedrooms"
                type="number"
                min="0"
                defaultValue={numberValue(property?.bedrooms)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Salles de bain
              </span>
              <input
                name="bathrooms"
                type="number"
                min="0"
                defaultValue={numberValue(property?.bathrooms)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl text-foreground">Descriptions</h2>
          <div className="mt-6 grid gap-4">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Description courte
              </span>
              <textarea
                name="shortDescription"
                rows={4}
                defaultValue={property?.shortDescription}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Description longue
              </span>
              <textarea
                name="longDescription"
                rows={8}
                defaultValue={property?.longDescription}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl text-foreground">Medias et caracteristiques</h2>
          <div className="mt-6 grid gap-6">
            <ImageInput
              name="coverImage"
              label="Image de couverture"
              defaultValue={property?.coverImage}
              library={mediaAssets}
              allowLibrary={false}
            />
            <ImageListInput
              name="images"
              label="Images de la galerie"
              defaultValue={property?.images}
              library={mediaAssets}
              helpText="Ajoutez les images de la galerie dans l'ordre d'affichage."
            />
            <StringListInput
              name="features"
              label="Equipements et caracteristiques"
              defaultValue={property?.features}
              itemPlaceholder="Ajouter un equipement"
            />
            <VideoInput
              name="video"
              label="Video"
              defaultValue={property?.video}
              helpText="Televersez directement le fichier video a afficher sur la fiche."
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl text-foreground">Agent et SEO</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Agent assigne
              </span>
              <select
                name="agentId"
                defaultValue={property?.agentId ? String(property.agentId) : ""}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              >
                <option value="">Aucun agent assigne</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </label>
            <div />
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Titre SEO
              </span>
              <input
                name="seoTitle"
                defaultValue={property?.seoTitle ?? ""}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Description SEO
              </span>
              <textarea
                name="seoDescription"
                rows={4}
                defaultValue={property?.seoDescription ?? ""}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
              />
            </label>
            <ImageInput
              name="ogImage"
              label="Image Open Graph"
              defaultValue={property?.ogImage}
              library={mediaAssets}
            />
          </div>
        </section>

        <AdminFormSubmit label="Enregistrer la propriete" />
      </form>
    </AdminUploadProvider>
  );
}
