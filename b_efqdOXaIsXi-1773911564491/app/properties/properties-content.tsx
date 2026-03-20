"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import {
  getPropertiesByFilter,
  normalizePropertyType,
  normalizeTransactionType,
  TransactionType,
  PropertyType,
  TRANSACTION_TYPES,
  PROPERTY_TYPES,
} from "@/lib/data";
import { cn } from "@/lib/utils";

function buildPropertiesHref(transactionType?: TransactionType, propertyType?: PropertyType) {
  const params = new URLSearchParams();

  if (transactionType) params.set("transaction", transactionType);
  if (propertyType) params.set("type", propertyType);

  const query = params.toString();
  return query ? `/properties?${query}` : "/properties";
}

export function PropertiesContent() {
  const searchParams = useSearchParams();
  const transactionType = normalizeTransactionType(searchParams.get("transaction"));
  const propertyType = normalizePropertyType(searchParams.get("type"));

  const properties = getPropertiesByFilter(transactionType, propertyType);

  const getPageTitle = () => {
    if (transactionType && propertyType) {
      return `${propertyType} - ${transactionType}`;
    }

    if (transactionType) {
      return `Proprietes - ${transactionType}`;
    }

    if (propertyType) {
      return propertyType;
    }

    return "Toutes les Proprietes";
  };

  return (
    <>
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-gold">Properties</span>
            {transactionType && (
              <>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-white/80">{transactionType}</span>
              </>
            )}
            {propertyType && (
              <>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-white/80">{propertyType}</span>
              </>
            )}
          </nav>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-white/60">
            {properties.length} {properties.length === 1 ? "property" : "properties"} found
          </p>
        </div>
      </section>

      <section className="py-8 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar
            variant="compact"
            defaultTransaction={transactionType}
            defaultPropertyType={propertyType}
          />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/properties"
                  className={cn(
                    "px-4 py-2 text-sm border transition-colors",
                    !transactionType && !propertyType
                      ? "bg-black text-white border-black"
                      : "border-border text-foreground hover:border-gold"
                  )}
                >
                  All
                </Link>
                {TRANSACTION_TYPES.map((type) => (
                  <Link
                    key={type}
                    href={buildPropertiesHref(type, propertyType)}
                    className={cn(
                      "px-4 py-2 text-sm border transition-colors",
                      transactionType === type
                        ? "bg-black text-white border-black"
                        : "border-border text-foreground hover:border-gold"
                    )}
                  >
                    {type}
                  </Link>
                ))}
              </div>

              <span className="text-sm text-muted-foreground">
                {properties.length} {properties.length === 1 ? "result" : "results"}
              </span>
            </div>

            {transactionType && (
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((type) => {
                  const count = getPropertiesByFilter(transactionType, type).length;
                  const href =
                    propertyType === type
                      ? buildPropertiesHref(transactionType)
                      : buildPropertiesHref(transactionType, type);

                  return (
                    <Link
                      key={type}
                      href={href}
                      className={cn(
                        "px-4 py-2 text-sm border transition-colors",
                        propertyType === type
                          ? "bg-gold text-black border-gold"
                          : "border-border text-foreground hover:border-gold"
                      )}
                    >
                      {type} ({count})
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-secondary mx-auto flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to find available properties.
              </p>
              <Link
                href="/properties"
                className="cta-dark-button inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wide uppercase"
              >
                Clear Filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
