export type {
  Agent,
  FooterSettings,
  HomePageContent,
  NavigationSettings,
  PageContentMap,
  PageKey,
  PageRecord,
  Property,
  PropertyFilters,
  PropertyType,
  SiteSettings,
  TransactionType,
} from "@/lib/cms-types";

const DEFAULT_CURRENCY = "MAD";
const DEFAULT_CURRENCY_LOCALE = "fr-MA";

export function formatPrice(
  price: number,
  priceSuffix?: string | null,
  locale?: string | null,
  currency?: string | null
) {
  const amount = Number.isFinite(price) ? price : 0;
  const safeLocale = locale && locale.trim() ? locale.trim() : DEFAULT_CURRENCY_LOCALE;
  const safeCurrency = currency && currency.trim() ? currency.trim().toUpperCase() : DEFAULT_CURRENCY;
  const suffix = priceSuffix ?? "";

  try {
    const formatted = new Intl.NumberFormat(safeLocale, {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted}${suffix}`;
  } catch {
    // Invalid locale or currency code from site settings: never throw from a formatter.
    let number: string;
    try {
      number = new Intl.NumberFormat(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 }).format(amount);
    } catch {
      number = String(Math.round(amount));
    }
    return `${number} ${safeCurrency}${suffix}`.trim();
  }
}

export function formatArea(area?: number | null, areaUnit?: string | null) {
  if (area == null || !Number.isFinite(area)) return null;
  const unit = (areaUnit ?? "sqft").trim();
  const unitLabels: Record<string, string> = {
    sqft: "pi²",
    "sq ft": "pi²",
    sqm: "m²",
    "sq m": "m²",
    m2: "m²",
    "m²": "m²",
  };
  const normalizedUnit = unit.toLowerCase();
  let value: string;
  try {
    value = area.toLocaleString("fr-FR");
  } catch {
    value = String(area);
  }
  return `${value} ${unitLabels[normalizedUnit] ?? unit}`;
}

export function buildWhatsAppLink(phone: string | null | undefined, message: string) {
  const normalizedPhone = (phone ?? "").replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

/**
 * Guarantees a non-empty src for next/image. Empty/blank strings make next/image
 * throw "missing required src", which (without an error boundary) blanks the page.
 */
export function imageSrc(url?: string | null, fallback = "/placeholder.jpg") {
  const trimmed = typeof url === "string" ? url.trim() : "";
  return trimmed || fallback;
}
