"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import {
  getPropertiesByFilter,
  TransactionType,
  PropertyType,
  TRANSACTION_TYPES,
  PROPERTY_TYPES,
} from "@/lib/data";

export function PropertiesContent() {
  const searchParams = useSearchParams();
  const transactionType = searchParams.get("transaction") as TransactionType | null;
  const propertyType = searchParams.get("type") as PropertyType | null;

  const properties = getPropertiesByFilter(
    transactionType || undefined,
    propertyType || undefined
  );

  const getPageTitle = () => {
    if (transactionType && propertyType) {
      return `${propertyType}s for ${transactionType === "Daily Rent" ? "Daily Rent" : transactionType}`;
    }
    if (transactionType) {
      return `Properties for ${transactionType === "Daily Rent" ? "Daily Rent" : transactionType}`;
    }
    if (propertyType) {
      return `${propertyType}s`;
    }
    return "All Properties";
  };

  return (
    <>
      {/* Header */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
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

      {/* Filters */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar
            variant="compact"
            defaultTransaction={transactionType || undefined}
            defaultPropertyType={propertyType || undefined}
          />
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* Quick filters */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/properties"
                  className={`px-4 py-2 text-sm transition-colors ${
                    !transactionType && !propertyType
                      ? "bg-black text-white"
                      : "bg-secondary text-foreground hover:bg-border"
                  }`}
                >
                  All
                </Link>
                {TRANSACTION_TYPES.map((type) => (
                  <Link
                    key={type}
                    href={`/properties?transaction=${encodeURIComponent(type)}`}
                    className={`px-4 py-2 text-sm transition-colors ${
                      transactionType === type
                        ? "bg-black text-white"
                        : "bg-secondary text-foreground hover:bg-border"
                    }`}
                  >
                    {type}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {properties.length} results
              </span>
              <button className="p-2 border border-border hover:border-gold transition-colors" aria-label="Grid view">
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button className="p-2 border border-border hover:border-gold transition-colors" aria-label="List view">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Property Type Pills */}
          {transactionType && (
            <div className="flex flex-wrap gap-2 mb-8">
              {PROPERTY_TYPES.map((type) => {
                const count = getPropertiesByFilter(transactionType, type).length;
                return (
                  <Link
                    key={type}
                    href={`/properties?transaction=${encodeURIComponent(transactionType)}&type=${encodeURIComponent(type)}`}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      propertyType === type
                        ? "bg-gold text-black border-gold"
                        : "border-border text-foreground hover:border-gold"
                    }`}
                  >
                    {type} ({count})
                  </Link>
                );
              })}
            </div>
          )}

          {/* Results */}
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
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-wide uppercase hover:bg-gold hover:text-black transition-colors"
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
