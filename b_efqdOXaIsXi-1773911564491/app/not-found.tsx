import Link from "next/link";
import { Home } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
            Erreur 404
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Page introuvable
          </h1>
          <p className="text-muted-foreground mb-10">
            La page que vous recherchez a peut-etre ete supprimee, renommee
            ou est temporairement indisponible.
          </p>
          <Link 
            href="/"
            className="cta-dark-button inline-flex items-center justify-center gap-3 px-8 py-4 font-medium text-sm tracking-wide uppercase"
          >
            <Home className="w-4 h-4" />
            Retour a l'accueil
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
