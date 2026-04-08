"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { PropertyType, TransactionType } from "@/lib/cms-types";
import { cn } from "@/lib/utils";

interface PropertyFiltersProps {
  transactionTypes: TransactionType[];
  propertyTypes: PropertyType[];
  cities: string[];
  countsByTransaction: Record<string, number>;
  value: {
    transaction?: string;
    type?: string;
    city?: string;
    keyword?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: boolean;
  };
}

export function PropertyFilters({
  transactionTypes,
  propertyTypes,
  cities,
  countsByTransaction,
  value,
}: PropertyFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [keyword, setKeyword] = useState(value.keyword ?? "");
  const [minPrice, setMinPrice] = useState(value.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(value.maxPrice ?? "");

  useEffect(() => setKeyword(value.keyword ?? ""), [value.keyword]);
  useEffect(() => setMinPrice(value.minPrice ?? ""), [value.minPrice]);
  useEffect(() => setMaxPrice(value.maxPrice ?? ""), [value.maxPrice]);

  const currentQuery = useMemo(
    () => ({
      transaction: value.transaction ?? "",
      type: value.type ?? "",
      city: value.city ?? "",
      featured: value.featured ? "1" : "",
    }),
    [value.city, value.featured, value.transaction, value.type]
  );

  const updateQuery = (updates: Record<string, string | boolean | undefined>) => {
    const params = new URLSearchParams();

    const next = {
      transaction: currentQuery.transaction,
      type: currentQuery.type,
      city: currentQuery.city,
      keyword,
      minPrice,
      maxPrice,
      featured: currentQuery.featured,
      ...updates,
    };

    Object.entries(next).forEach(([key, rawValue]) => {
      const stringValue =
        typeof rawValue === "boolean" ? (rawValue ? "1" : "") : rawValue ?? "";
      if (stringValue) {
        params.set(key, stringValue);
      }
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      updateQuery({ keyword, minPrice, maxPrice });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [keyword, minPrice, maxPrice]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateQuery({ transaction: "", type: value.type, city: value.city, featured: value.featured })}
          className={cn(
            "px-4 py-2 text-sm border transition-colors",
            !value.transaction ? "bg-black text-white border-black" : "border-border text-foreground hover:border-gold"
          )}
        >
          All ({Object.values(countsByTransaction).reduce((total, count) => total + count, 0)})
        </button>
        {transactionTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => updateQuery({ transaction: type.slug, type: "", city: "", featured: false })}
            className={cn(
              "px-4 py-2 text-sm border transition-colors",
              value.transaction === type.slug
                ? "bg-black text-white border-black"
                : "border-border text-foreground hover:border-gold"
            )}
          >
            {type.label} ({countsByTransaction[type.slug] ?? 0})
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Keyword search"
          className="h-11 rounded-md border border-border bg-background px-3 text-sm xl:col-span-2"
        />
        <select
          value={value.type ?? ""}
          onChange={(event) => updateQuery({ type: event.target.value })}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="">All property types</option>
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.slug}>
              {type.label}
            </option>
          ))}
        </select>
        <select
          value={value.city ?? ""}
          onChange={(event) => updateQuery({ city: event.target.value })}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="Min price"
          className="h-11 rounded-md border border-border bg-background px-3 text-sm"
        />
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="Max price"
          className="h-11 rounded-md border border-border bg-background px-3 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-3 rounded-md border border-border px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value.featured)}
            onChange={(event) => updateQuery({ featured: event.target.checked })}
          />
          Featured only
        </label>
        <button
          type="button"
          onClick={() => {
            setKeyword("");
            setMinPrice("");
            setMaxPrice("");
            router.replace(pathname);
          }}
          className="rounded-md border border-border px-4 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
