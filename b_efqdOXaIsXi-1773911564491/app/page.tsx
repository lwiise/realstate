import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone, Mail, MapPin } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { getFeaturedProperties } from "@/lib/data";

export default function HomePage() {
  const featuredProperties = getFeaturedProperties();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Luxury estate"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Propriétés Exceptionnelles à Tanger
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 text-balance">
              Découvrez Votre Domaine
              <br />
              <span className="text-gold">de Luxe Idéal</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
              Sélectionnez les plus belles propriétés de Tanger pour les acheteurs et locataires exigeants en quête d'élégance et de sophistication inégalées.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-widest">Défiler</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 lg:py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                      alt="Luxury interior"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
                      alt="Luxury apartment"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80"
                      alt="Modern architecture"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold -z-10" />
            </div>

            {/* Content */}
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
                À Propos d'Aurum Tanger
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                Redéfinir le Luxe Immobilier
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Depuis plus de deux décennies, Aurum Tanger est la destination premier pour des propriétés exceptionnelles. Nous comprenons que trouver la maison parfaite est plus qu'une transaction—c'est découvrir un espace qui reflète vos aspirations et votre style de vie.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Notre portefeuille sélectionné présente les résidences les plus exclusives, des domaines en bord de mer aux retraites en penthouse, chacune choisie pour sa distinction architecturale et sa qualité incompromise.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm">Annonces Exclusives</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm">Agents Experts</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm">Réseau International</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm">Service Personnalisé</span>
                </div>
              </div>

              <Link
                href="/buy"
                className="inline-flex items-center gap-2 text-gold hover:gap-4 transition-all duration-300 font-medium"
              >
                Explorez Nos Propriétés
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
              Sélection Curatée
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
              Propriétés en Vedette
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-medium text-sm tracking-wide uppercase hover:bg-gold hover:text-black transition-all duration-300"
            >
              Voir Toutes les Propriétés
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80"
            alt="Luxury property"
            fill
            className="object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
            Commencez Votre Aventure
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            Prêt à Trouver Votre Propriété de Rêve?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Que vous cherchiez à acheter, louer ou investir, notre équipe d'experts est là pour vous guider à chaque étape de votre parcours immobilier.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 bg-gold text-black px-8 py-4 font-medium text-sm tracking-wide uppercase hover:bg-white transition-colors"
            >
              Parcourir les Propriétés
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 border border-white text-white px-8 py-4 font-medium text-sm tracking-wide uppercase hover:bg-white hover:text-black transition-colors"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 lg:py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
                Nous Contacter
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
                Contactez Notre Équipe
              </h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
                    >
                      Nom de Famille
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
                    placeholder="jean@exemple.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
                    placeholder="+212 6 12-34-56-78"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Décrivez vos exigences..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-black text-white font-medium text-sm tracking-wide uppercase hover:bg-gold hover:text-black transition-all duration-300"
                >
                  Envoyer le Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-16">
              <div className="bg-black text-white p-8 md:p-12 h-full">
                <h3 className="font-serif text-2xl text-gold mb-8">Nos Bureaux</h3>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Tanger</h4>
                      <p className="text-white/60 text-sm">
                        Boulevard Pasteur, Suite 500
                        <br />
                        Tanger, 90000 Maroc
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Casablanca</h4>
                      <p className="text-white/60 text-sm">
                        Boulevard de la Corniche
                        <br />
                        Casablanca, 20100 Maroc
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Marrakech</h4>
                      <p className="text-white/60 text-sm">
                        Guéliz Square
                        <br />
                        Marrakech, 40000 Maroc
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold" />
                    <a
                      href="tel:+212612345678"
                      className="hover:text-gold transition-colors"
                    >
                      +212 6 12-34-56-78
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold" />
                    <a
                      href="mailto:contact@aurumtanger.com"
                      className="hover:text-gold transition-colors"
                    >
                      contact@aurumtanger.com
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
