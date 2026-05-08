"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Locale, PropertyType, TransactionType } from "@/lib/cms-types";
import { localizePath } from "@/lib/i18n";

interface SearchBarProps {
  variant?: "hero" | "compact";
  transactionTypes: TransactionType[];
  propertyTypes: PropertyType[];
  defaultTransactionSlug?: string;
  defaultPropertyTypeSlug?: string;
  locale?: Locale;
}

export function SearchBar({
  variant = "hero",
  transactionTypes,
  propertyTypes,
  defaultTransactionSlug,
  defaultPropertyTypeSlug,
  locale = "fr",
}: SearchBarProps) {
  const router = useRouter();
  const [transactionSlug, setTransactionSlug] = useState(defaultTransactionSlug ?? "");
  const [propertyTypeSlug, setPropertyTypeSlug] = useState(defaultPropertyTypeSlug ?? "");

  useEffect(() => {
    setTransactionSlug(defaultTransactionSlug ?? "");
  }, [defaultTransactionSlug]);

  useEffect(() => {
    setPropertyTypeSlug(defaultPropertyTypeSlug ?? "");
  }, [defaultPropertyTypeSlug]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (transactionSlug) params.set("transaction", transactionSlug);
    if (propertyTypeSlug) params.set("type", propertyTypeSlug);
    const query = params.toString();
    router.push(localizePath(query ? `/properties?${query}` : "/properties", locale));
  };
  const text = {
    transactionType: locale === "en" ? "Transaction type" : "Type de transaction",
    propertyType: locale === "en" ? "Property type" : "Type de bien",
    allTypes: locale === "en" ? "All types" : "Tous les types",
    allProperties: locale === "en" ? "All properties" : "Tous les biens",
    selectType: locale === "en" ? "Select a type" : "Selectionner un type",
    selectProperty: locale === "en" ? "Select a property type" : "Selectionner un bien",
    search: locale === "en" ? "Search" : "Rechercher",
    searchProperties: locale === "en" ? "Search properties" : "Rechercher des biens",
  };

  if (variant === "compact") {
    return (
      <div className="bg-white shadow-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              {text.transactionType}
            </label>
            <select
              value={transactionSlug}
              onChange={(event) => setTransactionSlug(event.target.value)}
              className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:border-gold"
            >
              <option value="">{text.allTypes}</option>
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              {text.propertyType}
            </label>
            <select
              value={propertyTypeSlug}
              onChange={(event) => setPropertyTypeSlug(event.target.value)}
              className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:border-gold"
            >
              <option value="">{text.allProperties}</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full md:w-auto h-10 px-6 bg-gold text-black font-medium text-sm tracking-wide uppercase hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {text.search}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20">
      <div className="px-6 pb-8 pt-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              {text.transactionType}
            </label>
            <select
              value={transactionSlug}
              onChange={(event) => setTransactionSlug(event.target.value)}
              className="w-full h-12 px-4 border border-border bg-background text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">{text.selectType}</option>
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              {text.propertyType}
            </label>
            <select
              value={propertyTypeSlug}
              onChange={(event) => setPropertyTypeSlug(event.target.value)}
              className="w-full h-12 px-4 border border-border bg-background text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">{text.selectProperty}</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              className="cta-dark-button w-full h-12 font-medium text-sm tracking-wide uppercase flex items-center justify-center gap-3"
            >
              <Search className="w-5 h-5" />
              {text.searchProperties}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
