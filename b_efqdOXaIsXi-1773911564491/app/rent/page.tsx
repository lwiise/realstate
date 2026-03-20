import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyTypeCard } from "@/components/property-type-card";
import { PROPERTY_TYPES, TRANSACTION_TYPES } from "@/lib/data";

export const metadata = {
  title: "Louer une Propriété",
  description:
    "Trouvez des appartements, villas, bureaux, biens commerciaux et terrains à louer avec MDK IMMOBILIER Real Estate à Tanger.",
};

export default function RentPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80"
            alt="Luxury rental property"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            Propriétés à Louer
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Vivez dans le
            <br />
            <span className="text-gold">Luxe</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Expérimentez la vie premium avec notre sélection curatée de 
            propriétés à louer, offrant la flexibilité sans compromettre l'élégance.
          </p>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Choose Your Style</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Property Types
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a property type to explore our premium rental listings.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {PROPERTY_TYPES.map((type) => (
              <PropertyTypeCard
                key={type}
                propertyType={type}
                transactionType={TRANSACTION_TYPES[1]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Rental Benefits</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              Why Rent With Aurum
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-white/10 hover:border-gold transition-colors duration-300">
              <div className="w-16 h-16 bg-gold mx-auto flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-white mb-3">Verified Properties</h3>
              <p className="text-white/60 text-sm">
                Every property is personally inspected and verified by our team 
                to ensure it meets our luxury standards.
              </p>
            </div>
            <div className="text-center p-8 border border-white/10 hover:border-gold transition-colors duration-300">
              <div className="w-16 h-16 bg-gold mx-auto flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-white mb-3">Flexible Terms</h3>
              <p className="text-white/60 text-sm">
                Customizable lease terms to fit your lifestyle, whether you need 
                short-term or long-term arrangements.
              </p>
            </div>
            <div className="text-center p-8 border border-white/10 hover:border-gold transition-colors duration-300">
              <div className="w-16 h-16 bg-gold mx-auto flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-white mb-3">24/7 Support</h3>
              <p className="text-white/60 text-sm">
                Dedicated support team available around the clock to assist with 
                any needs during your tenancy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
