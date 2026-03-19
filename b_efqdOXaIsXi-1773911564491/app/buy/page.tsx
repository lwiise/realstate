import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyTypeCard } from "@/components/property-type-card";
import { PROPERTY_TYPES } from "@/lib/data";

export const metadata = {
  title: "Acheter une Propriété | Aurum Tanger",
  description: "Découvrez les propriétés exceptionnelles à vendre. Des appartements de luxe aux villas en bord de mer, trouvez votre maison de rêve avec Aurum Tanger.",
};

export default function BuyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"
            alt="Luxury property for sale"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            Propriétés à Vendre
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Trouvez Votre Investissement
            <br />
            <span className="text-gold">de Rêve</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Explorez notre collection curatée de propriétés exceptionnelles disponibles à l'achat,
            chacune représentant le summum du luxe immobilier.
          </p>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Choisissez Votre Style</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Property Types
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a property type to explore our exclusive listings available for purchase.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {PROPERTY_TYPES.map((type) => (
              <PropertyTypeCard
                key={type}
                propertyType={type}
                transactionType="Buy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-serif text-4xl md:text-5xl text-gold mb-2">$2.5B+</p>
              <p className="text-white/60 text-sm uppercase tracking-wide">Sales Volume</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl text-gold mb-2">500+</p>
              <p className="text-white/60 text-sm uppercase tracking-wide">Properties Sold</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl text-gold mb-2">50+</p>
              <p className="text-white/60 text-sm uppercase tracking-wide">Expert Agents</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl text-gold mb-2">20+</p>
              <p className="text-white/60 text-sm uppercase tracking-wide">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy With Us */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Why Choose Us</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
                Expert Guidance for
                <br />
                Your Investment
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                When you purchase through Aurum Estates, you&apos;re not just buying a property—
                you&apos;re making a strategic investment with the support of industry-leading expertise.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold flex items-center justify-center shrink-0">
                    <span className="text-black font-serif text-xl">01</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Market Analysis</h3>
                    <p className="text-muted-foreground text-sm">
                      Comprehensive market insights to ensure your investment decision is well-informed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold flex items-center justify-center shrink-0">
                    <span className="text-black font-serif text-xl">02</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Legal Support</h3>
                    <p className="text-muted-foreground text-sm">
                      Full legal assistance throughout the purchase process for peace of mind.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold flex items-center justify-center shrink-0">
                    <span className="text-black font-serif text-xl">03</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Financing Options</h3>
                    <p className="text-muted-foreground text-sm">
                      Access to exclusive financing solutions tailored to your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="Luxury home exterior"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-gold -z-10" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
