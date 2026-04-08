import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { SiteContactForm } from "@/components/site-contact-form";
import { TestimonialsSection } from "@/components/testimonials-section";
import { getFeaturedProperties, getPageContent, getPropertyTypes, getSiteSettings, getTransactionTypes } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildPageMetadata("home", "/");
}

export default function HomePage() {
  const homePage = getPageContent("home");
  const siteSettings = getSiteSettings();
  const featuredProperties = getFeaturedProperties(homePage.content.featured.limit);
  const transactionTypes = getTransactionTypes();
  const propertyTypes = getPropertyTypes();
  const aboutImages = homePage.content.about.images;

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative h-screen min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={homePage.content.hero.backgroundImage}
            alt={homePage.content.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              {homePage.content.hero.eyebrow}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 text-balance">
              {homePage.content.hero.title}
              <br />
              <span className="text-gold">{homePage.content.hero.highlight}</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
              {homePage.content.hero.description}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar transactionTypes={transactionTypes} propertyTypes={propertyTypes} />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      <section id="about" className="py-24 lg:py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image src={aboutImages[0] ?? "/placeholder.jpg"} alt="About image 1" fill className="object-cover" />
                  </div>
                  <div className="aspect-square relative overflow-hidden">
                    <Image src={aboutImages[1] ?? aboutImages[0] ?? "/placeholder.jpg"} alt="About image 2" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image src={aboutImages[2] ?? aboutImages[0] ?? "/placeholder.jpg"} alt="About image 3" fill className="object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold -z-10" />
            </div>

            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
                {homePage.content.about.eyebrow}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                {homePage.content.about.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {homePage.content.about.descriptionPrimary}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {homePage.content.about.descriptionSecondary}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {homePage.content.about.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={homePage.content.about.ctaHref}
                className="inline-flex items-center gap-2 text-gold hover:gap-4 transition-all duration-300 font-medium"
              >
                {homePage.content.about.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
              {homePage.content.featured.eyebrow}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
              {homePage.content.featured.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={homePage.content.featured.ctaHref}
              className="cta-dark-button inline-flex items-center gap-3 px-8 py-4 font-medium text-sm tracking-wide uppercase"
            >
              {homePage.content.featured.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection content={homePage.content.testimonials} />

      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <Image
            src={homePage.content.cta.backgroundImage}
            alt={homePage.content.cta.title}
            fill
            className="object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
            {homePage.content.cta.eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            {homePage.content.cta.title}
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            {homePage.content.cta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={homePage.content.cta.primaryHref}
              className="inline-flex items-center justify-center gap-2 bg-gold text-black px-8 py-4 font-medium text-sm tracking-wide uppercase hover:bg-white transition-colors"
            >
              {homePage.content.cta.primaryLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={homePage.content.cta.secondaryHref}
              className="inline-flex items-center justify-center gap-2 border border-white text-white px-8 py-4 font-medium text-sm tracking-wide uppercase hover:bg-white hover:text-black transition-colors"
            >
              {homePage.content.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 lg:py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
                {homePage.content.contact.eyebrow}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
                {homePage.content.contact.title}
              </h2>

              <SiteContactForm sourcePage="home" submitLabel={homePage.content.contact.formTitle} />
            </div>

            <div className="lg:pl-16">
              <div className="bg-black text-white p-8 md:p-12 h-full">
                <h3 className="font-serif text-2xl text-gold mb-8">Our offices</h3>

                <div className="space-y-8">
                  {homePage.content.contact.offices.map((office) => (
                    <div key={office.name} className="flex gap-4">
                      <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">{office.name}</h4>
                        <p className="text-white/60 text-sm">
                          {office.lines.map((line) => (
                            <span key={line}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold" />
                    <a href={`tel:${siteSettings.contactPhone}`} className="hover:text-gold transition-colors">
                      {siteSettings.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold" />
                    <a href={`mailto:${siteSettings.contactEmail}`} className="hover:text-gold transition-colors">
                      {siteSettings.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
