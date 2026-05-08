import Link from "next/link";
import { Home } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getRequestLocale } from "@/lib/i18n-server";
import { localizePath } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getRequestLocale();
  const text = {
    eyebrow: locale === "en" ? "404 error" : "Erreur 404",
    title: locale === "en" ? "Page not found" : "Page introuvable",
    body: locale === "en"
      ? "The page you are looking for may have been removed, renamed, or is temporarily unavailable."
      : "La page que vous recherchez a peut-etre ete supprimee, renommee ou est temporairement indisponible.",
    back: locale === "en" ? "Back to home" : "Retour a l'accueil",
  };

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
            {text.eyebrow}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            {text.title}
          </h1>
          <p className="text-muted-foreground mb-10">
            {text.body}
          </p>
          <Link 
            href={localizePath("/", locale)}
            className="cta-dark-button inline-flex items-center justify-center gap-3 px-8 py-4 font-medium text-sm tracking-wide uppercase"
          >
            <Home className="w-4 h-4" />
            {text.back}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
