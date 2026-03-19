import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Share2,
  Phone,
  Check,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import {
  getPropertyBySlug,
  getSimilarProperties,
  formatPrice,
  properties,
} from "@/lib/data";
import { PropertyGallery } from "./property-gallery";
import { ContactForm } from "./contact-form";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found | Aurum Estates" };

  return {
    title: `${property.title} | Aurum Estates`,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similarProperties = getSimilarProperties(
    property.id,
    property.transactionType,
    property.propertyType
  );

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      {/* Header */}
      <section className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/"
              className="text-white/60 hover:text-gold transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <Link
              href="/properties"
              className="text-white/60 hover:text-gold transition-colors"
            >
              Properties
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <Link
              href={`/properties?transaction=${encodeURIComponent(property.transactionType)}`}
              className="text-white/60 hover:text-gold transition-colors"
            >
              {property.transactionType}
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-gold truncate max-w-[200px]">{property.title}</span>
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
                {formatPrice(property.price, property.priceUnit)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PropertyGallery images={property.images} video={property.video} title={property.title} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4">
                <span className="bg-black text-white text-sm px-4 py-2 font-medium">
                  {property.transactionType}
                </span>
                <span className="bg-gold text-black text-sm px-4 py-2 font-medium">
                  {property.propertyType}
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-secondary">
                {property.bedrooms && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black flex items-center justify-center">
                      <Bed className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-serif">{property.bedrooms}</p>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black flex items-center justify-center">
                      <Bath className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-serif">{property.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black flex items-center justify-center">
                    <Square className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-serif">
                      {property.area.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Sq Ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-lg font-serif truncate">{property.city}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-serif text-2xl mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h2 className="font-serif text-2xl mb-6">Features & Amenities</h2>
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

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <button className="flex items-center gap-2 px-6 py-3 border border-border hover:border-gold transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Save</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-border hover:border-gold transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Agent Card */}
                <div className="bg-black text-white p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={property.agent.image}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{property.agent.name}</h3>
                      <p className="text-white/60 text-sm">Luxury Property Specialist</p>
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
                      Appel
                    </a>
                    <a
                      href={`https://wa.me/${property.agent.phone.replace(/\D/g, '')}?text=Bonjour, Je suis intéressé par une propriété. Pouvez-vous m'aider?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-sm font-medium hover:bg-[#20BA5A] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Contact Form */}
                <ContactForm propertyTitle={property.title} agentPhone={property.agent.phone} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-gold uppercase tracking-[0.2em] text-sm mb-2">
                  Explore More
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  Similar Properties
                </h2>
              </div>
              <Link
                href={`/properties?transaction=${encodeURIComponent(property.transactionType)}&type=${encodeURIComponent(property.propertyType)}`}
                className="hidden md:inline-flex items-center gap-2 text-gold hover:gap-4 transition-all duration-300 text-sm font-medium"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="py-8 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
