import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PropertyCard } from "@/components/property-card";
import { PropertyFilters } from "@/components/property-filters";
import {
  findPropertyType,
  findTransactionType,
  getProperties,
  getPropertyCities,
  getPropertyCountsByTransaction,
  getPropertyTypes,
  getSiteSettings,
  getTransactionTypes,
} from "@/lib/cms";
import { getRequestLocale } from "@/lib/i18n-server";
import {
  localizeProperties,
  localizePropertyType,
  localizePropertyTypes,
  localizeSiteSettings,
  localizeTransactionType,
  localizeTransactionTypes,
} from "@/lib/i18n-content";
import { localizePath } from "@/lib/i18n";

interface PropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  searchParams,
}: PropertiesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = await getRequestLocale();
  const [rawTransactionType, rawPropertyType, rawSiteSettings] = await Promise.all([
    findTransactionType(toValue(params.transaction)),
    findPropertyType(toValue(params.type)),
    getSiteSettings(),
  ]);
  const transactionType = rawTransactionType ? localizeTransactionType(rawTransactionType, locale) : undefined;
  const propertyType = rawPropertyType ? localizePropertyType(rawPropertyType, locale) : undefined;
  const siteSettings = localizeSiteSettings(rawSiteSettings, locale);
  const city = toValue(params.city) || undefined;
  const featured = toValue(params.featured) === "1";
  const keyword = toValue(params.keyword) || undefined;
  const minPrice = toValue(params.minPrice) || undefined;
  const maxPrice = toValue(params.maxPrice) || undefined;
  const filters = new URLSearchParams();

  if (transactionType) filters.set("transaction", transactionType.slug);
  if (propertyType) filters.set("type", propertyType.slug);
  if (city) filters.set("city", city);
  if (keyword) filters.set("keyword", keyword);
  if (minPrice) filters.set("minPrice", minPrice);
  if (maxPrice) filters.set("maxPrice", maxPrice);
  if (featured) filters.set("featured", "1");

  const frenchCanonical = filters.size > 0 ? `/properties?${filters.toString()}` : "/properties";
  const canonical = localizePath(frenchCanonical, locale);
  const title = transactionType
    ? propertyType
      ? `${propertyType.label} - ${transactionType.label}`
      : `${locale === "en" ? "Properties" : "Proprietes"} - ${transactionType.label}`
    : propertyType
      ? propertyType.label
      : locale === "en" ? "All properties" : "Toutes les proprietes";
  const locationSuffix = city ? (locale === "en" ? ` in ${city}` : ` a ${city}`) : "";
  const description =
    keyword || minPrice || maxPrice || featured
      ? locale === "en"
        ? `Browse filtered real estate listings${locationSuffix} on ${siteSettings.siteName}.`
        : `Parcourez les annonces immobilieres filtrees${locationSuffix} sur ${siteSettings.siteName}.`
      : locale === "en"
        ? `Browse ${title.toLowerCase()}${locationSuffix} on ${siteSettings.siteName}.`
        : `Parcourez ${title.toLowerCase()}${locationSuffix} sur ${siteSettings.siteName}.`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: frenchCanonical,
        en: localizePath(frenchCanonical, "en"),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: siteSettings.defaultOgImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteSettings.defaultOgImage],
    },
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const locale = await getRequestLocale();
  const transactionParam = toValue(params.transaction);
  const propertyTypeParam = toValue(params.type);
  const city = toValue(params.city) || undefined;
  const keyword = toValue(params.keyword) || undefined;
  const minPrice = toValue(params.minPrice) || undefined;
  const maxPrice = toValue(params.maxPrice) || undefined;
  const featured = toValue(params.featured) === "1";

  const [rawTransactionType, rawPropertyType, rawTransactionTypes, rawPropertyTypes, rawSiteSettings] = await Promise.all([
    findTransactionType(transactionParam),
    findPropertyType(propertyTypeParam),
    getTransactionTypes(),
    getPropertyTypes(),
    getSiteSettings(),
  ]);
  const siteSettings = localizeSiteSettings(rawSiteSettings, locale);
  const transactionType = rawTransactionType ? localizeTransactionType(rawTransactionType, locale) : undefined;
  const propertyType = rawPropertyType ? localizePropertyType(rawPropertyType, locale) : undefined;
  const transactionTypes = localizeTransactionTypes(rawTransactionTypes, locale);
  const propertyTypes = localizePropertyTypes(rawPropertyTypes, locale);
  const properties = localizeProperties(await getProperties({
    transactionSlug: transactionType?.slug,
    propertyTypeSlug: propertyType?.slug,
    city,
    keyword,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    featuredOnly: featured,
  }), locale);

  const countsByTransaction = Object.fromEntries(await getPropertyCountsByTransaction());

  const cities = await getPropertyCities({
    transactionSlug: transactionType?.slug,
    propertyTypeSlug: propertyType?.slug,
  });

  const pageTitle = transactionType
    ? propertyType
      ? `${propertyType.label} - ${transactionType.label}`
      : `${locale === "en" ? "Properties" : "Proprietes"} - ${transactionType.label}`
    : propertyType
      ? propertyType.label
      : locale === "en" ? "All properties" : "Toutes les proprietes";
  const text = {
    home: locale === "en" ? "Home" : "Accueil",
    properties: locale === "en" ? "Properties" : "Biens",
    found: locale === "en"
      ? properties.length === 1 ? "property found" : "properties found"
      : properties.length === 1 ? "bien trouve" : "biens trouves",
    noResult: locale === "en" ? "No property found" : "Aucun bien trouve",
    noResultBody: locale === "en"
      ? "Adjust your filters to find available listings."
      : "Modifiez vos filtres pour trouver les annonces disponibles.",
    clear: locale === "en" ? "Clear filters" : "Effacer les filtres",
  };

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href={localizePath("/", locale)} className="text-white/60 hover:text-gold transition-colors">
              {text.home}
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-gold">{text.properties}</span>
            {transactionType ? (
              <>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-white/80">{transactionType.label}</span>
              </>
            ) : null}
            {propertyType ? (
              <>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-white/80">{propertyType.label}</span>
              </>
            ) : null}
          </nav>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            {pageTitle}
          </h1>
          <p className="text-white/60">
            {properties.length} {text.found}
          </p>
        </div>
      </section>

      <section className="py-8 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PropertyFilters
            transactionTypes={transactionTypes}
            propertyTypes={propertyTypes}
            cities={cities}
            countsByTransaction={countsByTransaction}
            locale={locale}
            value={{
              transaction: transactionType?.slug,
              type: propertyType?.slug,
              city,
              keyword,
              minPrice,
              maxPrice,
              featured,
            }}
          />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} siteSettings={siteSettings} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-secondary mx-auto flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">{text.noResult}</h3>
              <p className="text-muted-foreground mb-6">
                {text.noResultBody}
              </p>
              <Link
                href={localizePath("/properties", locale)}
                className="cta-dark-button inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wide uppercase"
              >
                {text.clear}
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
