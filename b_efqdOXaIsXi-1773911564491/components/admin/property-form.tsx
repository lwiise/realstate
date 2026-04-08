import { savePropertyAction } from "@/app/admin/actions";
import { ImageInput } from "@/components/admin/image-input";
import { ImageListInput } from "@/components/admin/image-list-input";
import { StringListInput } from "@/components/admin/string-list-input";
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
    <form action={savePropertyAction} className="space-y-8">
      {property ? <input type="hidden" name="id" value={property.id} /> : null}

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Core details</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Title</span>
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
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Status</span>
            <select
              name="status"
              defaultValue={property?.status ?? "draft"}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Transaction type
            </span>
            <select
              name="transactionTypeId"
              defaultValue={property?.transactionTypeId ? String(property.transactionTypeId) : ""}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            >
              <option value="">Select transaction type</option>
              {transactionTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Property type
            </span>
            <select
              name="propertyTypeId"
              defaultValue={property?.propertyTypeId ? String(property.propertyTypeId) : ""}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            >
              <option value="">Select property type</option>
              {propertyTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
            <input type="checkbox" name="featured" defaultChecked={property?.featured} />
            <span className="text-sm text-foreground">Featured listing</span>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Sort order</span>
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
        <h2 className="font-serif text-2xl text-foreground">Location and pricing</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">City</span>
            <input
              name="city"
              defaultValue={property?.city}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Neighborhood
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
              Full address
            </span>
            <input
              name="fullAddress"
              defaultValue={property?.fullAddress ?? ""}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Price</span>
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
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Price mode</span>
            <select
              name="priceMode"
              defaultValue={property?.priceMode ?? "sale"}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            >
              <option value="sale">Purchase</option>
              <option value="monthly">Monthly rent</option>
              <option value="daily">Daily rent</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Price suffix
            </span>
            <input
              name="priceSuffix"
              defaultValue={property?.priceSuffix ?? ""}
              placeholder="/mois, /jour, etc."
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Area</span>
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
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Area unit</span>
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
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Bedrooms</span>
            <input
              name="bedrooms"
              type="number"
              min="0"
              defaultValue={numberValue(property?.bedrooms)}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Bathrooms</span>
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
              Short description
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
              Long description
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
        <h2 className="font-serif text-2xl text-foreground">Media and features</h2>
        <div className="mt-6 grid gap-6">
          <ImageInput
            name="coverImage"
            label="Cover image"
            defaultValue={property?.coverImage}
            library={mediaAssets}
          />
          <ImageListInput
            name="images"
            label="Gallery images"
            defaultValue={property?.images}
            library={mediaAssets}
            helpText="Add gallery images in display order."
          />
          <StringListInput
            name="features"
            label="Amenities and features"
            defaultValue={property?.features}
            itemPlaceholder="Add one amenity"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Video URL
              </span>
              <input
                name="video"
                defaultValue={property?.video ?? ""}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                3D or virtual tour URL
              </span>
              <input
                name="virtualTourUrl"
                defaultValue={property?.virtualTourUrl ?? ""}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Agent and SEO</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Assigned agent</span>
            <select
              name="agentId"
              defaultValue={property?.agentId ? String(property.agentId) : ""}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            >
              <option value="">No agent assigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>
          <div />
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">SEO title</span>
            <input
              name="seoTitle"
              defaultValue={property?.seoTitle ?? ""}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              SEO description
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
            label="Open Graph image"
            defaultValue={property?.ogImage}
            library={mediaAssets}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="cta-dark-button rounded-md px-5 py-3 text-xs font-medium uppercase tracking-wide"
        >
          Save property
        </button>
      </div>
    </form>
  );
}
