import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  Bed,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Square,
} from "lucide-react";
import { ContactForm } from "./contact-form";
import { PropertyGallery } from "./property-gallery";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PropertyCard } from "@/components/property-card";
import { buildWhatsAppLink, formatArea, formatPrice } from "@/lib/data";
import { getPropertyBySlug, getSimilarProperties, getSiteSettings } from "@/lib/cms";
import { getRequestLocale } from "@/lib/i18n-server";
import { localizeProperties, localizeProperty, localizeSiteSettings } from "@/lib/i18n-content";
import { localizePath } from "@/lib/i18n";
import { buildPropertyMetadata } from "@/lib/seo";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  return buildPropertyMetadata(getPropertyBySlug(slug), `/property/${slug}`);
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [rawProperty, rawSiteSettings] = await Promise.all([getPropertyBySlug(slug), getSiteSettings()]);

  if (!rawProperty) {
    notFound();
  }

  const property = localizeProperty(rawProperty, locale);
  const siteSettings = localizeSiteSettings(rawSiteSettings, locale);
  const similarProperties = localizeProperties(
    await getSimilarProperties(
      rawProperty.id,
      rawProperty.transactionTypeSlug,
      rawProperty.propertyTypeSlug
    ),
    locale
  );
  const galleryImages =
    property.images.length > 0
      ? property.images
      : property.coverImage
        ? [property.coverImage]
        : [];

  const whatsappHref = buildWhatsAppLink(
    property.agent?.whatsapp || property.agent?.phone || siteSettings.whatsappNumber,
    locale === "en"
      ? `Hello, I am interested in "${property.title}". Can you contact me?`
      : `Bonjour, je suis interesse par "${property.title}". Pouvez-vous me contacter ?`
  );
  const text = {
    home: locale === "en" ? "Home" : "Accueil",
    properties: locale === "en" ? "Properties" : "Biens",
    bedrooms: locale === "en" ? "Bedrooms" : "Chambres",
    bathrooms: locale === "en" ? "Bathrooms" : "Salles de bain",
    area: locale === "en" ? "Area" : "Surface",
    location: locale === "en" ? "Location" : "Localisation",
    description: "Description",
    address: locale === "en" ? "Address" : "Adresse",
    features: locale === "en" ? "Features and amenities" : "Caracteristiques et prestations",
    save: locale === "en" ? "Save" : "Enregistrer",
    share: locale === "en" ? "Share" : "Partager",
    call: locale === "en" ? "Call" : "Appeler",
    exploreMore: locale === "en" ? "Explore more" : "Explorer plus",
    similar: locale === "en" ? "Similar properties" : "Biens similaires",
    viewAll: locale === "en" ? "View all" : "Voir tout",
    back: locale === "en" ? "Back to properties" : "Retour aux biens",
  };

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <section className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href={localizePath("/", locale)} className="text-white/60 hover:text-gold transition-colors">
              {text.home}
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <Link href={localizePath("/properties", locale)} className="text-white/60 hover:text-gold transition-colors">
              {text.properties}
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <Link
              href={localizePath(`/properties?transaction=${property.transactionTypeSlug}`, locale)}
              className="text-white/60 hover:text-gold transition-colors"
            >
              {property.transactionType}
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-gold truncate max-w-[220px]">{property.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-white/60">
                <MapPin className="w-4 h-4" />
                <span>
                  {property.neighborhood}, {property.city}
                </span>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-white/60 text-sm uppercase tracking-wide mb-1">
                {property.transactionType}
              </p>
              <p className="font-serif text-3xl md:text-4xl text-gold">
                {formatPrice(
                  property.price,
                  property.priceSuffix,
                  siteSettings.currencyLocale,
                  siteSettings.currencyCode
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PropertyGallery
            images={galleryImages}
            video={property.video ?? undefined}
            title={property.title}
            locale={locale}
            statusBadge={
              property.isUnavailable
                ? property.priceMode === "sale"
                  ? locale === "en" ? "Sold" : "Vendu"
                  : locale === "en" ? "Rented" : "Loué"
                : undefined
            }
          />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="flex flex-wrap gap-4">
                <span className="bg-black text-white text-sm px-4 py-2 font-medium">
                  {property.transactionType}
                </span>
                <span className="bg-gold text-black text-sm px-4 py-2 font-medium">
                  {property.propertyType}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-secondary">
                {property.bedrooms ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black flex items-center justify-center">
                      <Bed className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-serif">{property.bedrooms}</p>
                      <p className="text-sm text-muted-foreground">{text.bedrooms}</p>
                    </div>
                  </div>
                ) : null}
                {property.bathrooms ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black flex items-center justify-center">
                      <Bath className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-serif">{property.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">{text.bathrooms}</p>
                    </div>
                  </div>
                ) : null}
                {property.area ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black flex items-center justify-center">
                      <Square className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xl font-serif">{formatArea(property.area, property.areaUnit)}</p>
                      <p className="text-sm text-muted-foreground">{text.area}</p>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-lg font-serif truncate">{property.city}</p>
                    <p className="text-sm text-muted-foreground">{text.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl mb-4">{text.description}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {property.longDescription}
                </p>
                {property.fullAddress ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {text.address} : {property.fullAddress}
                  </p>
                ) : null}
              </div>

              <div>
                <h2 className="font-serif text-2xl mb-6">{text.features}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gold flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-border">
                <button className="flex items-center gap-2 px-6 py-3 border border-border hover:border-gold transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{text.save}</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-border hover:border-gold transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{text.share}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {property.agent ? (
                  <div className="bg-black text-white p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={property.agent.photoUrl || "/placeholder-user.jpg"}
                          alt={property.agent.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{property.agent.name}</h3>
                        <p className="text-white/60 text-sm">{property.agent.role}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{property.agent.phone}</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center justify-center gap-2 bg-gold text-black py-3 text-sm font-medium hover:bg-white transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {text.call}
                      </a>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-sm font-medium hover:bg-[#20BA5A] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ) : null}

                <ContactForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {similarProperties.length > 0 ? (
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-gold uppercase tracking-[0.2em] text-sm mb-2">{text.exploreMore}</p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  {text.similar}
                </h2>
              </div>
              <Link
                href={localizePath(`/properties?transaction=${property.transactionTypeSlug}&type=${property.propertyTypeSlug}`, locale)}
                className="hidden md:inline-flex items-center gap-2 text-gold hover:gap-4 transition-all duration-300 text-sm font-medium"
              >
                {text.viewAll}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty.id} property={relatedProperty} siteSettings={siteSettings} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-8 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={localizePath("/properties", locale)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {text.back}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
