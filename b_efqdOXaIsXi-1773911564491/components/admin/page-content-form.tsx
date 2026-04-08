import { savePageContentAction } from "@/app/admin/actions";
import { ImageInput } from "@/components/admin/image-input";
import { ImageListInput } from "@/components/admin/image-list-input";
import { ObjectListInput } from "@/components/admin/object-list-input";
import { StringListInput } from "@/components/admin/string-list-input";
import type { MediaAsset, PageKey, PageRecord } from "@/lib/cms-types";

interface PageContentFormProps {
  page: PageRecord<PageKey>;
  mediaAssets: MediaAsset[];
}

function SeoFields({
  page,
  mediaAssets,
}: {
  page: PageRecord<PageKey>;
  mediaAssets: MediaAsset[];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-serif text-2xl text-foreground">SEO</h2>
      <div className="mt-6 grid gap-4">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Page label</span>
          <input
            name="title"
            defaultValue={page.title}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">SEO title</span>
          <input
            name="seoTitle"
            defaultValue={page.seoTitle ?? ""}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">SEO description</span>
          <textarea
            name="seoDescription"
            rows={4}
            defaultValue={page.seoDescription ?? ""}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
          />
        </label>
        <ImageInput
          name="ogImageUrl"
          label="Open Graph image"
          defaultValue={page.ogImageUrl}
          library={mediaAssets}
        />
      </div>
    </section>
  );
}

function HeroFields({
  data,
  mediaAssets,
}: {
  data: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    backgroundImage: string;
  };
  mediaAssets: MediaAsset[];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-serif text-2xl text-foreground">Hero</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Eyebrow</span>
          <input
            name="heroEyebrow"
            defaultValue={data.eyebrow}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Highlight</span>
          <input
            name="heroHighlight"
            defaultValue={data.highlight}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Title</span>
          <input
            name="heroTitle"
            defaultValue={data.title}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Description</span>
          <textarea
            name="heroDescription"
            rows={4}
            defaultValue={data.description}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
          />
        </label>
      </div>
      <div className="mt-6">
        <ImageInput
          name="heroBackgroundImage"
          label="Hero background image"
          defaultValue={data.backgroundImage}
          library={mediaAssets}
        />
      </div>
    </section>
  );
}

export function PageContentForm({ page, mediaAssets }: PageContentFormProps) {
  return (
    <form action={savePageContentAction} className="space-y-8">
      <input type="hidden" name="pageKey" value={page.pageKey} />

      {page.pageKey === "home" ? (
        <>
          <HeroFields data={page.content.hero} mediaAssets={mediaAssets} />

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">About section</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Eyebrow</span>
                <input name="aboutEyebrow" defaultValue={page.content.about.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Title</span>
                <input name="aboutTitle" defaultValue={page.content.about.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Primary description</span>
                <textarea name="aboutDescriptionPrimary" rows={4} defaultValue={page.content.about.descriptionPrimary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Secondary description</span>
                <textarea name="aboutDescriptionSecondary" rows={4} defaultValue={page.content.about.descriptionSecondary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">CTA label</span>
                <input name="aboutCtaLabel" defaultValue={page.content.about.ctaLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">CTA href</span>
                <input name="aboutCtaHref" defaultValue={page.content.about.ctaHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
            </div>
            <div className="mt-6 grid gap-6">
              <ImageListInput name="aboutImages" label="About images" defaultValue={page.content.about.images} library={mediaAssets} />
              <StringListInput name="aboutFeatures" label="About features" defaultValue={page.content.about.features} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Featured section</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Eyebrow</span>
                <input name="featuredEyebrow" defaultValue={page.content.featured.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Title</span>
                <input name="featuredTitle" defaultValue={page.content.featured.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">CTA label</span>
                <input name="featuredCtaLabel" defaultValue={page.content.featured.ctaLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">CTA href</span>
                <input name="featuredCtaHref" defaultValue={page.content.featured.ctaHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Listing limit</span>
                <input name="featuredLimit" type="number" defaultValue={page.content.featured.limit} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "home" ? (
        <>
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Testimonials</h2>
            <div className="mt-6 grid gap-4">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Eyebrow</span>
                <input name="testimonialsEyebrow" defaultValue={page.content.testimonials.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Title</span>
                <input name="testimonialsTitle" defaultValue={page.content.testimonials.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Description</span>
                <textarea name="testimonialsDescription" rows={4} defaultValue={page.content.testimonials.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              </label>
            </div>
            <div className="mt-6 grid gap-6">
              <ObjectListInput
                name="testimonialStats"
                label="Stats"
                itemLabel="Stat"
                defaultValue={page.content.testimonials.stats.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
                fields={[
                  { key: "label", label: "Label" },
                  { key: "value", label: "Value" },
                ]}
              />
              <ObjectListInput
                name="testimonialItems"
                label="Testimonials"
                itemLabel="Testimonial"
                defaultValue={page.content.testimonials.items.map((item) => ({
                  quote: item.quote,
                  name: item.name,
                  role: item.role,
                  focus: item.focus,
                }))}
                fields={[
                  { key: "quote", label: "Quote", type: "textarea" },
                  { key: "name", label: "Name" },
                  { key: "role", label: "Role" },
                  { key: "focus", label: "Focus" },
                ]}
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">CTA and contact</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">CTA eyebrow</span>
                  <input name="ctaEyebrow" defaultValue={page.content.cta.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">CTA title</span>
                  <input name="ctaTitle" defaultValue={page.content.cta.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">CTA description</span>
                  <textarea name="ctaDescription" rows={4} defaultValue={page.content.cta.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
                </label>
              </div>
              <ImageInput name="ctaBackgroundImage" label="CTA background" defaultValue={page.content.cta.backgroundImage} library={mediaAssets} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Primary label</span>
                  <input name="ctaPrimaryLabel" defaultValue={page.content.cta.primaryLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Primary href</span>
                  <input name="ctaPrimaryHref" defaultValue={page.content.cta.primaryHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Secondary label</span>
                  <input name="ctaSecondaryLabel" defaultValue={page.content.cta.secondaryLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Secondary href</span>
                  <input name="ctaSecondaryHref" defaultValue={page.content.cta.secondaryHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Contact eyebrow</span>
                  <input name="contactEyebrow" defaultValue={page.content.contact.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Contact title</span>
                  <input name="contactTitle" defaultValue={page.content.contact.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Form title</span>
                  <input name="contactFormTitle" defaultValue={page.content.contact.formTitle} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
              </div>
              <ObjectListInput
                name="contactOffices"
                label="Offices"
                itemLabel="Office"
                defaultValue={page.content.contact.offices.map((office) => ({
                  name: office.name,
                  lines: office.lines.join("\n"),
                }))}
                fields={[
                  { key: "name", label: "Office name" },
                  { key: "lines", label: "Address lines", type: "textarea" },
                ]}
              />
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "buy" ? (
        <>
          <HeroFields data={page.content.hero} mediaAssets={mediaAssets} />
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Sections</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category eyebrow</span><input name="categoryEyebrow" defaultValue={page.content.categorySection.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category title</span><input name="categoryTitle" defaultValue={page.content.categorySection.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category description</span><textarea name="categoryDescription" rows={4} defaultValue={page.content.categorySection.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ObjectListInput
                name="stats"
                label="Stats"
                itemLabel="Stat"
                defaultValue={page.content.stats.map((item) => ({ label: item.label, value: item.value }))}
                fields={[
                  { key: "label", label: "Label" },
                  { key: "value", label: "Value" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Why buy eyebrow</span><input name="whyEyebrow" defaultValue={page.content.whyBuy.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Why buy title</span><input name="whyTitle" defaultValue={page.content.whyBuy.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Why buy description</span><textarea name="whyDescription" rows={4} defaultValue={page.content.whyBuy.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ImageInput name="whyImage" label="Why buy image" defaultValue={page.content.whyBuy.image} library={mediaAssets} />
              <ObjectListInput
                name="whyItems"
                label="Why buy items"
                itemLabel="Item"
                defaultValue={page.content.whyBuy.items.map((item) => ({
                  number: item.number,
                  title: item.title,
                  description: item.description,
                }))}
                fields={[
                  { key: "number", label: "Number" },
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing eyebrow</span><input name="listingEyebrow" defaultValue={page.content.listing.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing title</span><input name="listingTitle" defaultValue={page.content.listing.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing description</span><textarea name="listingDescription" rows={4} defaultValue={page.content.listing.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "rent" ? (
        <>
          <HeroFields data={page.content.hero} mediaAssets={mediaAssets} />
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Sections</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category eyebrow</span><input name="categoryEyebrow" defaultValue={page.content.categorySection.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category title</span><input name="categoryTitle" defaultValue={page.content.categorySection.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category description</span><textarea name="categoryDescription" rows={4} defaultValue={page.content.categorySection.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Benefits eyebrow</span><input name="benefitsEyebrow" defaultValue={page.content.benefits.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Benefits title</span><input name="benefitsTitle" defaultValue={page.content.benefits.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
              <ObjectListInput
                name="benefitItems"
                label="Benefit cards"
                itemLabel="Benefit"
                defaultValue={page.content.benefits.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                }))}
                fields={[
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing eyebrow</span><input name="listingEyebrow" defaultValue={page.content.listing.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing title</span><input name="listingTitle" defaultValue={page.content.listing.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing description</span><textarea name="listingDescription" rows={4} defaultValue={page.content.listing.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "daily-rent" ? (
        <>
          <HeroFields data={page.content.hero} mediaAssets={mediaAssets} />
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Sections</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category eyebrow</span><input name="categoryEyebrow" defaultValue={page.content.categorySection.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category title</span><input name="categoryTitle" defaultValue={page.content.categorySection.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Category description</span><textarea name="categoryDescription" rows={4} defaultValue={page.content.categorySection.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Services eyebrow</span><input name="servicesEyebrow" defaultValue={page.content.services.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Services title</span><input name="servicesTitle" defaultValue={page.content.services.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Services description</span><textarea name="servicesDescription" rows={4} defaultValue={page.content.services.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ImageListInput name="servicesImages" label="Service images" defaultValue={page.content.services.images} library={mediaAssets} />
              <StringListInput name="servicesPoints" label="Service points" defaultValue={page.content.services.points} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Use cases eyebrow</span><input name="useCasesEyebrow" defaultValue={page.content.useCases.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Use cases title</span><input name="useCasesTitle" defaultValue={page.content.useCases.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
              <ObjectListInput
                name="useCaseItems"
                label="Use case cards"
                itemLabel="Use case"
                defaultValue={page.content.useCases.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                  image: item.image,
                }))}
                fields={[
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description" },
                  { key: "image", label: "Image URL", type: "url" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing eyebrow</span><input name="listingEyebrow" defaultValue={page.content.listing.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing title</span><input name="listingTitle" defaultValue={page.content.listing.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Listing description</span><textarea name="listingDescription" rows={4} defaultValue={page.content.listing.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "about" ? (
        <>
          <HeroFields data={page.content.hero} mediaAssets={mediaAssets} />
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Story and values</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Story eyebrow</span><input name="storyEyebrow" defaultValue={page.content.story.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Story title</span><input name="storyTitle" defaultValue={page.content.story.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Primary story</span><textarea name="storyDescriptionPrimary" rows={4} defaultValue={page.content.story.descriptionPrimary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Secondary story</span><textarea name="storyDescriptionSecondary" rows={4} defaultValue={page.content.story.descriptionSecondary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ImageInput name="storyImage" label="Story image" defaultValue={page.content.story.image} library={mediaAssets} />
              <StringListInput name="storyFeatures" label="Story features" defaultValue={page.content.story.features} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Values eyebrow</span><input name="valuesEyebrow" defaultValue={page.content.values.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Values title</span><input name="valuesTitle" defaultValue={page.content.values.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
              <ObjectListInput
                name="valueItems"
                label="Value cards"
                itemLabel="Value"
                defaultValue={page.content.values.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                }))}
                fields={[
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
              />
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "contact" ? (
        <>
          <HeroFields data={page.content.hero} mediaAssets={mediaAssets} />
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Contact details</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Intro eyebrow</span><input name="introEyebrow" defaultValue={page.content.intro.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Intro title</span><input name="introTitle" defaultValue={page.content.intro.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Intro description</span><textarea name="introDescription" rows={4} defaultValue={page.content.intro.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ObjectListInput
                name="offices"
                label="Offices"
                itemLabel="Office"
                defaultValue={page.content.offices.map((office) => ({
                  name: office.name,
                  lines: office.lines.join("\n"),
                }))}
                fields={[
                  { key: "name", label: "Office name" },
                  { key: "lines", label: "Address lines", type: "textarea" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Form title</span><input name="formTitle" defaultValue={page.content.form.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Submit label</span><input name="submitLabel" defaultValue={page.content.form.submitLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <SeoFields page={page} mediaAssets={mediaAssets} />

      <button
        type="submit"
        className="cta-dark-button rounded-md px-5 py-3 text-xs font-medium uppercase tracking-wide"
      >
        Save page content
      </button>
    </form>
  );
}
