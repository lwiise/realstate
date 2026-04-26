import type { Metadata } from "next";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { ContactProjectForm } from "@/components/contact-project-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getFooterSettings, getSiteSettings } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact", "/contact");
}

export default async function ContactPage() {
  const [siteSettings, footer] = await Promise.all([getSiteSettings(), getFooterSettings()]);

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
  } as const;

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="bg-white pb-24 pt-32 lg:pb-32 lg:pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1.02fr_0.98fr] xl:gap-24">
            <div className="space-y-10">
              <div>
                <p className="font-serif text-3xl italic text-[var(--gold-solid)] md:text-5xl">
                  Votre projet immobilier
                </p>
                <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-slate-800 md:text-6xl md:leading-[1.08]">
                  Notre agence locale est a votre ecoute pour vous accompagner dans tous vos
                  projets immobiliers.
                </h1>
              </div>

              <div className="max-w-3xl space-y-6 text-xl leading-relaxed text-slate-700">
                <p>
                  Chez MDK IMMOBILIER, notre mission est d&apos;allier la performance de nos
                  solutions technologiques a l&apos;expertise de nos conseillers, afin de vous
                  offrir une experience client unique et personnalisee.
                </p>
                <p className="font-medium text-slate-800">
                  Reinventons ensemble votre experience immobiliere.
                </p>
              </div>

              <div className="space-y-8 pt-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">
                    Un echange direct avec notre equipe ?
                  </h2>
                  <p className="mt-3 text-lg text-slate-600">
                    Nous sommes a votre ecoute par telephone ou par e-mail pour cadrer rapidement
                    votre projet.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-2xl font-semibold text-slate-700">Telephone</p>
                    <a
                      href={`tel:${siteSettings.contactPhone}`}
                      className="inline-flex items-center gap-3 text-2xl font-semibold text-slate-700 transition-colors hover:text-[#ff5a36]"
                    >
                      <Phone className="h-6 w-6 text-[#ff5a36]" />
                      {siteSettings.contactPhone}
                    </a>
                  </div>

                  <div className="space-y-3">
                    <p className="text-2xl font-semibold text-slate-700">E-mail</p>
                    <a
                      href={`mailto:${siteSettings.contactEmail}`}
                      className="inline-flex items-center gap-3 text-2xl font-semibold text-slate-700 transition-colors hover:text-[#ff5a36]"
                    >
                      <Mail className="h-6 w-6 text-[#ff5a36]" />
                      {siteSettings.contactEmail}
                    </a>
                  </div>
                </div>

                {footer.socialLinks.filter((link) => link.isEnabled).length > 0 ? (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {footer.socialLinks
                      .filter((link) => link.isEnabled)
                      .map((link) => {
                        const Icon =
                          socialIcons[link.label.trim().toLowerCase() as keyof typeof socialIcons];

                        return (
                          <Link
                            key={`${link.label}-${link.href}`}
                            href={link.href}
                            className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-slate-800 text-white transition-colors hover:bg-[#ff5a36]"
                            aria-label={link.label}
                          >
                            {Icon ? <Icon className="h-6 w-6" /> : <span>{link.label.slice(0, 2)}</span>}
                          </Link>
                        );
                      })}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="pt-3">
              <ContactProjectForm sourcePage="Formulaire contact" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
