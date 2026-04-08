import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SiteContactForm } from "@/components/site-contact-form";
import { getPageContent, getSiteSettings } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact", "/contact");
}

export default async function ContactPage() {
  const [page, siteSettings] = await Promise.all([getPageContent("contact"), getSiteSettings()]);

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
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">{page.content.intro.eyebrow}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{page.content.intro.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{page.content.intro.description}</p>

              <SiteContactForm sourcePage="contact" submitLabel={page.content.form.submitLabel} />
            </div>

            <div className="space-y-8">
              <div className="bg-black text-white p-8 md:p-10">
                <h3 className="font-serif text-2xl text-gold mb-8">{page.content.form.title}</h3>

                <div className="space-y-8">
                  {page.content.offices.map((office) => (
                    <div key={office.name} className="flex gap-4">
                      <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">{office.name}</h4>
                        <p className="text-white/60 text-sm">
                          {office.lines.map((line) => (
                            <span key={line}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold" />
                    <a href={`tel:${siteSettings.contactPhone}`} className="hover:text-gold transition-colors">
                      {siteSettings.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold" />
                    <a href={`mailto:${siteSettings.contactEmail}`} className="hover:text-gold transition-colors">
                      {siteSettings.contactEmail}
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
