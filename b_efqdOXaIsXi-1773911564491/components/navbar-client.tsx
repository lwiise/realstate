"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import type { Locale, NavigationSettings } from "@/lib/cms-types";
import { localizePath, stripLocalePrefix, switchLocalePath } from "@/lib/i18n";

interface NavbarClientProps {
  navigation: NavigationSettings;
  locale: Locale;
  topOffsetClassName?: string;
}

export function NavbarClient({
  navigation,
  locale,
  topOffsetClassName = "top-0",
}: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentLanguageLabel = locale === "fr" ? "Français" : "English";

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if ((href.startsWith("/#") || href.startsWith("/en#")) && stripLocalePrefix(pathname) === "/") {
      const element = document.querySelector(`#${href.split("#")[1]}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const languageOptions: Array<{ locale: Locale; label: string }> = [
    { locale: "fr", label: "Français" },
    { locale: "en", label: "English" },
  ];

  return (
    <header
      className={`fixed left-0 right-0 z-50 border-b border-gray-200 bg-white ${topOffsetClassName}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href={localizePath("/", locale)} className="flex items-center gap-3 h-full">
            <Image
              src={navigation.logoUrl}
              alt={navigation.logoAlt}
              width={115}
              height={86}
              priority
              className="h-[4.32rem] w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navigation.links
              .filter((link) => link.isEnabled)
              .map((link) => {
                const href = localizePath(link.href, locale);
                return (
                  <Link
                    key={`${href}-${link.label}`}
                    href={href}
                    onClick={() => handleNavClick(href)}
                    className="text-black/80 hover:text-gold transition-colors duration-300 text-sm tracking-wide uppercase"
                  >
                    {link.label}
                  </Link>
                );
              })}
          </div>

          <div className="hidden md:block relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/50 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-black transition-colors hover:border-gold"
              aria-expanded={languageOpen}
            >
              {currentLanguageLabel}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {languageOpen ? (
              <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                {languageOptions.map((option) => (
                  <Link
                    key={option.locale}
                    href={switchLocalePath(pathname, search, option.locale)}
                    onClick={() => setLanguageOpen(false)}
                    className={`block px-4 py-3 text-sm transition-colors ${
                      locale === option.locale
                        ? "bg-gold text-black"
                        : "text-black/75 hover:bg-secondary hover:text-black"
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-black p-2"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navigation.links
                .filter((link) => link.isEnabled)
                .map((link) => {
                  const href = localizePath(link.href, locale);
                  return (
                    <Link
                      key={`${href}-${link.label}`}
                      href={href}
                      onClick={() => handleNavClick(href)}
                      className="text-black/80 hover:text-gold transition-colors duration-300 text-sm tracking-wide uppercase py-2"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              <div className="border-t border-gray-200 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
                  {locale === "en" ? "Language" : "Langue"}
                </p>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border">
                  {languageOptions.map((option) => (
                    <Link
                      key={option.locale}
                      href={switchLocalePath(pathname, search, option.locale)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-center text-sm font-medium ${
                        locale === option.locale
                          ? "bg-gold text-black"
                          : "bg-white text-black/70"
                      }`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
