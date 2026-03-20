import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyTypeCard } from "@/components/property-type-card";
import { PROPERTY_TYPES, TRANSACTION_TYPES } from "@/lib/data";

export const metadata = {
  title: "Locations Journalières | Aurum Tanger",
  description: "Expérimentez le luxe selon vos termes avec nos propriétés en location journalière. Parfait pour séjours courts, événements et expériences exclusives.",
};

export default function DailyRentPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80"
            alt="Luxury daily rental"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            Locations Journalières
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Expériences
            <br />
            <span className="text-gold">Exclusives</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            De magnifiques retraites de vacances aux lieux d'événements sophistiqués, 
            découvrez des propriétés premium disponibles en location journalière.
          </p>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Choose Your Experience</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Property Types
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a property type to explore our exclusive daily rental options.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {PROPERTY_TYPES.map((type) => (
              <PropertyTypeCard
                key={type}
                propertyType={type}
                transactionType={TRANSACTION_TYPES[2]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                    alt="Luxury interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative overflow-hidden mt-8">
                  <Image
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80"
                    alt="Premium amenities"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold -z-10" />
            </div>
            
            <div className="order-1 lg:order-2">
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Premium Services</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
                Every Day is
                <br />
                Extraordinary
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our daily rental properties come with exceptional amenities and services 
                designed to make every moment unforgettable.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold" />
                  <span className="text-sm">Concierge Service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold" />
                  <span className="text-sm">Private Chef Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold" />
                  <span className="text-sm">Chauffeur Service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold" />
                  <span className="text-sm">Daily Housekeeping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold" />
                  <span className="text-sm">Event Planning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold" />
                  <span className="text-sm">24/7 Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Perfect For</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              Every Occasion
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative aspect-[3/4] overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80"
                alt="Vacation"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-serif text-xl text-white mb-1">Vacation Retreats</h3>
                <p className="text-white/60 text-sm">Luxury escapes</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80"
                alt="Events"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-serif text-xl text-white mb-1">Private Events</h3>
                <p className="text-white/60 text-sm">Memorable celebrations</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
                alt="Business"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-serif text-xl text-white mb-1">Corporate Meetings</h3>
                <p className="text-white/60 text-sm">Impressive venues</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
                alt="Film"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-serif text-xl text-white mb-1">Film & Photo</h3>
                <p className="text-white/60 text-sm">Stunning backdrops</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
