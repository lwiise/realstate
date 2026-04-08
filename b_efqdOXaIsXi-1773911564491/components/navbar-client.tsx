"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { NavigationSettings } from "@/lib/cms-types";

interface NavbarClientProps {
  navigation: NavigationSettings;
}

export function NavbarClient({ navigation }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      const element = document.querySelector(href.replace("/", ""));
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 h-full">
            <Image
              src={navigation.logoUrl}
              alt={navigation.logoAlt}
              width={80}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navigation.links
              .filter((link) => link.isEnabled)
              .map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-black/80 hover:text-gold transition-colors duration-300 text-sm tracking-wide uppercase"
                >
                  {link.label}
                </Link>
              ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-black p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navigation.links
                .filter((link) => link.isEnabled)
                .map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-black/80 hover:text-gold transition-colors duration-300 text-sm tracking-wide uppercase py-2"
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
