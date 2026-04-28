import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, FileText, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { SiteContactForm } from "@/components/site-contact-form";
import { TestimonialsSection } from "@/components/testimonials-section";
import { getFeaturedProperties, getPageContent, getPropertyTypes, getSiteSettings, getTransactionTypes } from "@/lib/cms";
import { buildWhatsAppLink } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", "/");
}

export default async function HomePage() {
  const homePage = await getPageContent("home");
  const [siteSettings, transactionTypes, propertyTypes] = await Promise.all([
    getSiteSettings(),
    getTransactionTypes(),
    getPropertyTypes(),
  ]);
  const featuredProperties = await getFeaturedProperties(homePage.content.featured.limit);
  const aboutImages = homePage.content.about.images;
  const ownerWhatsappHref = buildWhatsAppLink(
    siteSettings.whatsappNumber,
    "Bonjour, je souhaite louer ou vendre mon bien avec MDK IMMOBILIER. Merci de me contacter."
  );

  return (
    <main className="min-h-screen">
      <section className="premium-top-bar fixed inset-x-0 top-0 z-[60]">
        <div className="premium-top-bar-shell mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 px-2 py-2 sm:h-14 sm:flex-row sm:gap-3 sm:px-6 sm:py-0 md:h-16 md:gap-5 lg:px-8">
          <p className="whitespace-nowrap text-center text-[9px] font-semibold uppercase leading-none tracking-[0.015em] text-white [text-shadow:0_0_18px_rgba(212,175,55,0.18)] min-[360px]:text-[10px] sm:text-[13px] md:text-base lg:text-[1.15rem] xl:text-[1.3rem]">
            Proprietaires ? Louez et vendez sans perte de temps.
          </p>

          <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
            <Link
              href="/contact"
              className="premium-top-bar-button inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-[10px] font-semibold text-black sm:h-9 sm:flex-none sm:gap-2 sm:px-3.5 sm:text-xs md:h-10 md:px-5 md:text-sm"
            >
              <FileText className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate sm:hidden">Formulaire</span>
              <span className="hidden sm:inline">Remplir le formulaire</span>
            </Link>
            <a
              href={ownerWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-top-bar-button premium-top-bar-button-alt inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-[10px] font-semibold text-black sm:h-9 sm:gap-2 sm:px-3.5 sm:text-xs md:h-10 md:px-4 md:text-sm"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Navbar topOffsetClassName="top-16 sm:top-14 md:top-16" />

      <section className="relative flex min-h-screen items-center justify-center pt-40 sm:pt-36 md:h-screen md:min-h-[700px] md:pt-36">
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
          <div className="mb-12 text-center">
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

          <div className="mx-auto max-w-4xl pb-10 sm:pb-0">
            <SearchBar transactionTypes={transactionTypes} propertyTypes={propertyTypes} />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      <section id="about" className="scroll-mt-36 bg-white py-24 lg:py-32 md:scroll-mt-40">
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

      <section id="contact" className="scroll-mt-36 bg-white py-24 lg:py-32 md:scroll-mt-40">
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
