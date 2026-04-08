"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { PropertyType, TransactionType } from "@/lib/cms-types";

interface SearchBarProps {
  variant?: "hero" | "compact";
  transactionTypes: TransactionType[];
  propertyTypes: PropertyType[];
  defaultTransactionSlug?: string;
  defaultPropertyTypeSlug?: string;
}

export function SearchBar({
  variant = "hero",
  transactionTypes,
  propertyTypes,
  defaultTransactionSlug,
  defaultPropertyTypeSlug,
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
    router.push(`/properties?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <div className="bg-white shadow-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              Type de transaction
            </label>
            <select
              value={transactionSlug}
              onChange={(event) => setTransactionSlug(event.target.value)}
              className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:border-gold"
            >
              <option value="">All types</option>
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              Property type
            </label>
            <select
              value={propertyTypeSlug}
              onChange={(event) => setPropertyTypeSlug(event.target.value)}
              className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:border-gold"
            >
              <option value="">All properties</option>
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
              Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20">
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Transaction type
            </label>
            <select
              value={transactionSlug}
              onChange={(event) => setTransactionSlug(event.target.value)}
              className="w-full h-12 px-4 border border-border bg-background text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select type</option>
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Property type
            </label>
            <select
              value={propertyTypeSlug}
              onChange={(event) => setPropertyTypeSlug(event.target.value)}
              className="w-full h-12 px-4 border border-border bg-background text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select property</option>
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
              Search properties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
