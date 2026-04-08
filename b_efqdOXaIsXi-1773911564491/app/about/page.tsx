import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getPageContent } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildPageMetadata("about", "/about");
}

export default function AboutPage() {
  const page = getPageContent("about");

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src={page.content.hero.backgroundImage} alt={page.content.hero.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">{page.content.hero.eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {page.content.hero.title}
            <br />
            <span className="text-gold">{page.content.hero.highlight}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{page.content.hero.description}</p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image src={page.content.story.image} alt={page.content.story.title} fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold -z-10" />
            </div>

            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">{page.content.story.eyebrow}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{page.content.story.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{page.content.story.descriptionPrimary}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{page.content.story.descriptionSecondary}</p>

              <div className="grid grid-cols-2 gap-6">
                {page.content.story.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">{page.content.values.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">{page.content.values.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {page.content.values.items.map((item) => (
              <div key={item.title} className="border border-border bg-white p-8">
                <h3 className="font-serif text-2xl text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
