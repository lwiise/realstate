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
  getPropertyTypes,
  getSiteSettings,
  getTransactionTypes,
} from "@/lib/cms";

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
  const [transactionType, propertyType, siteSettings] = await Promise.all([
    findTransactionType(toValue(params.transaction)),
    findPropertyType(toValue(params.type)),
    getSiteSettings(),
  ]);
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

  const canonical = filters.size > 0 ? `/properties?${filters.toString()}` : "/properties";
  const title = transactionType
    ? propertyType
      ? `${propertyType.label} - ${transactionType.label}`
      : `Properties - ${transactionType.label}`
    : propertyType
      ? propertyType.label
      : "All properties";
  const locationSuffix = city ? ` in ${city}` : "";
  const description =
    keyword || minPrice || maxPrice || featured
      ? `Browse filtered property listings${locationSuffix} on ${siteSettings.siteName}.`
      : `Browse ${title.toLowerCase()}${locationSuffix} on ${siteSettings.siteName}.`;

  return {
    title,
    description,
    alternates: {
      canonical,
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
  const transactionParam = toValue(params.transaction);
  const propertyTypeParam = toValue(params.type);
  const city = toValue(params.city) || undefined;
  const keyword = toValue(params.keyword) || undefined;
  const minPrice = toValue(params.minPrice) || undefined;
  const maxPrice = toValue(params.maxPrice) || undefined;
  const featured = toValue(params.featured) === "1";

  const [transactionType, propertyType, transactionTypes, propertyTypes] = await Promise.all([
    findTransactionType(transactionParam),
    findPropertyType(propertyTypeParam),
    getTransactionTypes(),
    getPropertyTypes(),
  ]);
  const properties = await getProperties({
    transactionSlug: transactionType?.slug,
    propertyTypeSlug: propertyType?.slug,
    city,
    keyword,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    featuredOnly: featured,
  });

  const countEntries = await Promise.all(
    transactionTypes.map(async (item) => [item.slug, (await getProperties({ transactionSlug: item.slug })).length] as const)
  );
  const countsByTransaction = Object.fromEntries(countEntries);

  const cities = await getPropertyCities({
    transactionSlug: transactionType?.slug,
    propertyTypeSlug: propertyType?.slug,
  });

  const pageTitle = transactionType
    ? propertyType
      ? `${propertyType.label} - ${transactionType.label}`
      : `Proprietes - ${transactionType.label}`
    : propertyType
      ? propertyType.label
      : "Toutes les proprietes";

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-gold">Properties</span>
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
            {properties.length} {properties.length === 1 ? "property" : "properties"} found
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
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-secondary mx-auto flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to find available listings.
              </p>
              <Link
                href="/properties"
                className="cta-dark-button inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wide uppercase"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
