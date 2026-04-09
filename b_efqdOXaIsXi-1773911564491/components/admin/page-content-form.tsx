import { savePageContentAction } from "@/app/admin/actions";
import { AdminFormSubmit } from "@/components/admin/admin-form-submit";
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
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Libellé de la page</span>
          <input
            name="title"
            defaultValue={page.title}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre SEO</span>
          <input
            name="seoTitle"
            defaultValue={page.seoTitle ?? ""}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Description SEO</span>
          <textarea
            name="seoDescription"
            rows={4}
            defaultValue={page.seoDescription ?? ""}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
          />
        </label>
        <ImageInput
          name="ogImageUrl"
          label="Image Open Graph"
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
      <h2 className="font-serif text-2xl text-foreground">Bannière principale</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre</span>
          <input
            name="heroEyebrow"
            defaultValue={data.eyebrow}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Mise en avant</span>
          <input
            name="heroHighlight"
            defaultValue={data.highlight}
            className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre</span>
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
          label="Image d’arrière-plan"
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
            <h2 className="font-serif text-2xl text-foreground">Section À propos</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre</span>
                <input name="aboutEyebrow" defaultValue={page.content.about.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre</span>
                <input name="aboutTitle" defaultValue={page.content.about.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Description principale</span>
                <textarea name="aboutDescriptionPrimary" rows={4} defaultValue={page.content.about.descriptionPrimary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Description secondaire</span>
                <textarea name="aboutDescriptionSecondary" rows={4} defaultValue={page.content.about.descriptionSecondary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Libellé du CTA</span>
                <input name="aboutCtaLabel" defaultValue={page.content.about.ctaLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Lien du CTA</span>
                <input name="aboutCtaHref" defaultValue={page.content.about.ctaHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
            </div>
            <div className="mt-6 grid gap-6">
              <ImageListInput name="aboutImages" label="Images À propos" defaultValue={page.content.about.images} library={mediaAssets} />
              <StringListInput name="aboutFeatures" label="Points forts À propos" defaultValue={page.content.about.features} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Section à la une</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre</span>
                <input name="featuredEyebrow" defaultValue={page.content.featured.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre</span>
                <input name="featuredTitle" defaultValue={page.content.featured.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Libellé du CTA</span>
                <input name="featuredCtaLabel" defaultValue={page.content.featured.ctaLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Lien du CTA</span>
                <input name="featuredCtaHref" defaultValue={page.content.featured.ctaHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Nombre d’annonces</span>
                <input name="featuredLimit" type="number" defaultValue={page.content.featured.limit} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "home" ? (
        <>
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Témoignages</h2>
            <div className="mt-6 grid gap-4">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre</span>
                <input name="testimonialsEyebrow" defaultValue={page.content.testimonials.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre</span>
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
                label="Statistiques"
                itemLabel="statistique"
                defaultValue={page.content.testimonials.stats.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
                fields={[
                  { key: "label", label: "Libellé" },
                  { key: "value", label: "Valeur" },
                ]}
              />
              <ObjectListInput
                name="testimonialItems"
                label="Témoignages"
                itemLabel="témoignage"
                defaultValue={page.content.testimonials.items.map((item) => ({
                  quote: item.quote,
                  name: item.name,
                  role: item.role,
                  focus: item.focus,
                }))}
                fields={[
                  { key: "quote", label: "Citation", type: "textarea" },
                  { key: "name", label: "Nom" },
                  { key: "role", label: "Rôle" },
                  { key: "focus", label: "Spécialité" },
                ]}
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">CTA et contact</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre du CTA</span>
                  <input name="ctaEyebrow" defaultValue={page.content.cta.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre du CTA</span>
                  <input name="ctaTitle" defaultValue={page.content.cta.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Description du CTA</span>
                  <textarea name="ctaDescription" rows={4} defaultValue={page.content.cta.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
                </label>
              </div>
              <ImageInput name="ctaBackgroundImage" label="Arrière-plan du CTA" defaultValue={page.content.cta.backgroundImage} library={mediaAssets} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Libellé principal</span>
                  <input name="ctaPrimaryLabel" defaultValue={page.content.cta.primaryLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Lien principal</span>
                  <input name="ctaPrimaryHref" defaultValue={page.content.cta.primaryHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Libellé secondaire</span>
                  <input name="ctaSecondaryLabel" defaultValue={page.content.cta.secondaryLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Lien secondaire</span>
                  <input name="ctaSecondaryHref" defaultValue={page.content.cta.secondaryHref} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre contact</span>
                  <input name="contactEyebrow" defaultValue={page.content.contact.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre contact</span>
                  <input name="contactTitle" defaultValue={page.content.contact.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre du formulaire</span>
                  <input name="contactFormTitle" defaultValue={page.content.contact.formTitle} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" />
                </label>
              </div>
              <ObjectListInput
                name="contactOffices"
                label="Bureaux"
                itemLabel="bureau"
                defaultValue={page.content.contact.offices.map((office) => ({
                  name: office.name,
                  lines: office.lines.join("\n"),
                }))}
                fields={[
                  { key: "name", label: "Nom du bureau" },
                  { key: "lines", label: "Lignes d’adresse", type: "textarea" },
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
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre catégorie</span><input name="categoryEyebrow" defaultValue={page.content.categorySection.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre catégorie</span><input name="categoryTitle" defaultValue={page.content.categorySection.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description catégorie</span><textarea name="categoryDescription" rows={4} defaultValue={page.content.categorySection.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ObjectListInput
                name="stats"
                label="Statistiques"
                itemLabel="statistique"
                defaultValue={page.content.stats.map((item) => ({ label: item.label, value: item.value }))}
                fields={[
                  { key: "label", label: "Libellé" },
                  { key: "value", label: "Valeur" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre pourquoi acheter</span><input name="whyEyebrow" defaultValue={page.content.whyBuy.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre pourquoi acheter</span><input name="whyTitle" defaultValue={page.content.whyBuy.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description pourquoi acheter</span><textarea name="whyDescription" rows={4} defaultValue={page.content.whyBuy.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ImageInput name="whyImage" label="Image pourquoi acheter" defaultValue={page.content.whyBuy.image} library={mediaAssets} />
              <ObjectListInput
                name="whyItems"
                label="Points pourquoi acheter"
                itemLabel="élément"
                defaultValue={page.content.whyBuy.items.map((item) => ({
                  number: item.number,
                  title: item.title,
                  description: item.description,
                }))}
                fields={[
                  { key: "number", label: "Numéro" },
                  { key: "title", label: "Titre" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre des annonces</span><input name="listingEyebrow" defaultValue={page.content.listing.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre des annonces</span><input name="listingTitle" defaultValue={page.content.listing.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description des annonces</span><textarea name="listingDescription" rows={4} defaultValue={page.content.listing.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
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
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre catégorie</span><input name="categoryEyebrow" defaultValue={page.content.categorySection.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre catégorie</span><input name="categoryTitle" defaultValue={page.content.categorySection.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description catégorie</span><textarea name="categoryDescription" rows={4} defaultValue={page.content.categorySection.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre avantages</span><input name="benefitsEyebrow" defaultValue={page.content.benefits.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre avantages</span><input name="benefitsTitle" defaultValue={page.content.benefits.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
              <ObjectListInput
                name="benefitItems"
                label="Cartes avantages"
                itemLabel="avantage"
                defaultValue={page.content.benefits.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                }))}
                fields={[
                  { key: "title", label: "Titre" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre des annonces</span><input name="listingEyebrow" defaultValue={page.content.listing.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre des annonces</span><input name="listingTitle" defaultValue={page.content.listing.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description des annonces</span><textarea name="listingDescription" rows={4} defaultValue={page.content.listing.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
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
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre catégorie</span><input name="categoryEyebrow" defaultValue={page.content.categorySection.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre catégorie</span><input name="categoryTitle" defaultValue={page.content.categorySection.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description catégorie</span><textarea name="categoryDescription" rows={4} defaultValue={page.content.categorySection.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre services</span><input name="servicesEyebrow" defaultValue={page.content.services.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre services</span><input name="servicesTitle" defaultValue={page.content.services.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description services</span><textarea name="servicesDescription" rows={4} defaultValue={page.content.services.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ImageListInput name="servicesImages" label="Images des services" defaultValue={page.content.services.images} library={mediaAssets} />
              <StringListInput name="servicesPoints" label="Points de service" defaultValue={page.content.services.points} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre cas d’usage</span><input name="useCasesEyebrow" defaultValue={page.content.useCases.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre cas d’usage</span><input name="useCasesTitle" defaultValue={page.content.useCases.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
              <ObjectListInput
                name="useCaseItems"
                label="Cartes cas d’usage"
                itemLabel="cas d’usage"
                defaultValue={page.content.useCases.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                  image: item.image,
                }))}
                fields={[
                  { key: "title", label: "Titre" },
                  { key: "description", label: "Description" },
                  { key: "image", label: "URL de l’image", type: "url" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre des annonces</span><input name="listingEyebrow" defaultValue={page.content.listing.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre des annonces</span><input name="listingTitle" defaultValue={page.content.listing.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description des annonces</span><textarea name="listingDescription" rows={4} defaultValue={page.content.listing.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {page.pageKey === "about" ? (
        <>
          <HeroFields data={page.content.hero} mediaAssets={mediaAssets} />
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Histoire et valeurs</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre histoire</span><input name="storyEyebrow" defaultValue={page.content.story.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre histoire</span><input name="storyTitle" defaultValue={page.content.story.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Histoire principale</span><textarea name="storyDescriptionPrimary" rows={4} defaultValue={page.content.story.descriptionPrimary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Histoire secondaire</span><textarea name="storyDescriptionSecondary" rows={4} defaultValue={page.content.story.descriptionSecondary} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ImageInput name="storyImage" label="Image de l’histoire" defaultValue={page.content.story.image} library={mediaAssets} />
              <StringListInput name="storyFeatures" label="Points forts de l’histoire" defaultValue={page.content.story.features} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre valeurs</span><input name="valuesEyebrow" defaultValue={page.content.values.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre valeurs</span><input name="valuesTitle" defaultValue={page.content.values.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
              <ObjectListInput
                name="valueItems"
                label="Cartes de valeurs"
                itemLabel="valeur"
                defaultValue={page.content.values.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                }))}
                fields={[
                  { key: "title", label: "Titre" },
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
            <h2 className="font-serif text-2xl text-foreground">Coordonnées</h2>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Sur-titre intro</span><input name="introEyebrow" defaultValue={page.content.intro.eyebrow} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre intro</span><input name="introTitle" defaultValue={page.content.intro.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Description intro</span><textarea name="introDescription" rows={4} defaultValue={page.content.intro.description} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" /></label>
              </div>
              <ObjectListInput
                name="offices"
                label="Bureaux"
                itemLabel="bureau"
                defaultValue={page.content.offices.map((office) => ({
                  name: office.name,
                  lines: office.lines.join("\n"),
                }))}
                fields={[
                  { key: "name", label: "Nom du bureau" },
                  { key: "lines", label: "Lignes d’adresse", type: "textarea" },
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Titre du formulaire</span><input name="formTitle" defaultValue={page.content.form.title} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
                <label className="space-y-2"><span className="text-xs uppercase tracking-wide text-muted-foreground">Libellé du bouton</span><input name="submitLabel" defaultValue={page.content.form.submitLabel} className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm" /></label>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <SeoFields page={page} mediaAssets={mediaAssets} />

      <AdminFormSubmit label="Enregistrer le contenu de la page" />
    </form>
  );
}
