import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PropertyCard } from "@/components/property-card";
import { PropertyTypeCard } from "@/components/property-type-card";
import { getPageContent, getProperties, getPropertyCountByType, getPropertyTypes } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("rent", "/rent");
}

export default async function RentPage() {
  const [page, propertyTypes, propertyCounts, properties] = await Promise.all([
    getPageContent("rent"),
    getPropertyTypes(),
    getPropertyCountByType("rent"),
    getProperties({ transactionSlug: "rent", limit: 6 }),
  ]);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={page.content.hero.backgroundImage}
            alt={page.content.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            {page.content.hero.eyebrow}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {page.content.hero.title}
            <br />
            <span className="text-gold">{page.content.hero.highlight}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {page.content.hero.description}
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
              {page.content.categorySection.eyebrow}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              {page.content.categorySection.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {page.content.categorySection.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {propertyTypes.map((type) => (
              <PropertyTypeCard
                key={type.id}
                propertyType={type}
                count={propertyCounts.get(type.slug) ?? 0}
                href={`/properties?transaction=rent&type=${type.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
              {page.content.benefits.eyebrow}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              {page.content.benefits.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {page.content.benefits.items.map((item) => (
              <div
                key={item.title}
                className="text-center p-8 border border-white/10 hover:border-gold transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-gold mx-auto flex items-center justify-center mb-6">
                  <span className="text-black font-serif text-lg">
                    {item.title.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
                {page.content.listing.eyebrow}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                {page.content.listing.title}
              </h2>
              <p className="text-muted-foreground max-w-2xl">{page.content.listing.description}</p>
            </div>
            <Link
              href="/properties?transaction=rent"
              className="hidden md:inline-flex rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold"
            >
              View all
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
