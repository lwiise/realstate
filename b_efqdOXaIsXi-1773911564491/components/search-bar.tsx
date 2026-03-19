"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { TRANSACTION_TYPES, PROPERTY_TYPES, TransactionType, PropertyType } from "@/lib/data";

interface SearchBarProps {
  variant?: "hero" | "compact";
  defaultTransaction?: TransactionType;
  defaultPropertyType?: PropertyType;
}

export function SearchBar({ 
  variant = "hero", 
  defaultTransaction,
  defaultPropertyType 
}: SearchBarProps) {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<TransactionType | "">(defaultTransaction || "");
  const [propertyType, setPropertyType] = useState<PropertyType | "">(defaultPropertyType || "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (transactionType) params.set("transaction", transactionType);
    if (propertyType) params.set("type", propertyType);
    router.push(`/properties?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <div className="bg-white shadow-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              Type de Transaction
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as TransactionType | "")}
              className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:border-gold"
            >
              <option value="">All Types</option>
              {TRANSACTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType | "")}
              className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:border-gold"
            >
              <option value="">All Properties</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
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
          {/* Transaction Type */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as TransactionType | "")}
              className="w-full h-12 px-4 border border-border bg-background text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select Type</option>
              {TRANSACTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType | "")}
              className="w-full h-12 px-4 border border-border bg-background text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select Property</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full h-12 bg-black text-white font-medium text-sm tracking-wide uppercase hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-3"
            >
              <Search className="w-5 h-5" />
              Search Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
