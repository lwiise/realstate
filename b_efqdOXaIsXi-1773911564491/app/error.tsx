"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<"fr" | "en">("fr");

  useEffect(() => {
    setLocale(document.documentElement.lang === "en" ? "en" : "fr");
    // Surface the real cause in the browser console for debugging.
    console.error("Page error:", error);
  }, [error]);

  const text =
    locale === "en"
      ? {
          eyebrow: "Something went wrong",
          title: "This page could not be displayed",
          body: "An unexpected error occurred. You can try again, or return to the homepage.",
          retry: "Try again",
          back: "Back to home",
        }
      : {
          eyebrow: "Une erreur est survenue",
          title: "Cette page n'a pas pu s'afficher",
          body: "Une erreur inattendue s'est produite. Vous pouvez reessayer ou revenir a l'accueil.",
          retry: "Reessayer",
          back: "Retour a l'accueil",
        };

  const homeHref = locale === "en" ? "/en" : "/";

  return (
    <main className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="max-w-xl mx-auto px-4 text-center">
        <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">{text.eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">{text.title}</h1>
        <p className="text-muted-foreground mb-10">{text.body}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="cta-dark-button inline-flex items-center justify-center gap-3 px-8 py-4 font-medium text-sm tracking-wide uppercase"
          >
            <RotateCcw className="w-4 h-4" />
            {text.retry}
          </button>
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center gap-3 border border-border px-8 py-4 font-medium text-sm tracking-wide uppercase hover:border-gold transition-colors"
          >
            <Home className="w-4 h-4" />
            {text.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
