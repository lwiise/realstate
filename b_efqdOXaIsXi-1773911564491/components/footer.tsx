import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { getFooterSettings, getSiteSettings } from "@/lib/cms";

export async function Footer() {
  const [footer, siteSettings] = await Promise.all([getFooterSettings(), getSiteSettings()]);

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center bg-white p-2 rounded-[10px] overflow-hidden w-fit">
              <Image
                src={siteSettings.logoUrl}
                alt={siteSettings.logoAlt}
                width={120}
                height={90}
                priority
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">{footer.brandText}</p>
            <div className="flex gap-4">
              {footer.socialLinks
                .filter((link) => link.isEnabled)
                .map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors text-xs uppercase"
                  >
                    {link.label.slice(0, 2)}
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold font-serif text-lg mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              {footer.quickLinks
                .filter((link) => link.isEnabled)
                .map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link href={link.href} className="text-white/60 hover:text-gold transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-serif text-lg mb-6">Types de proprietes</h4>
            <ul className="space-y-3">
              {footer.propertyLinks
                .filter((link) => link.isEnabled)
                .map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link href={link.href} className="text-white/60 hover:text-gold transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-serif text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">{siteSettings.companyAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a
                  href={`tel:${siteSettings.contactPhone}`}
                  className="text-white/60 hover:text-gold transition-colors text-sm"
                >
                  {siteSettings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="text-white/60 hover:text-gold transition-colors text-sm"
                >
                  {siteSettings.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">{siteSettings.copyrightText}</p>
          <div className="flex gap-6">
            {footer.legalLinks
              .filter((link) => link.isEnabled)
              .map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="text-white/40 hover:text-gold transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
