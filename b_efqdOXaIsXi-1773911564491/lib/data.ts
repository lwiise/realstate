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

export function formatPrice(
  price: number,
  priceSuffix?: string | null,
  locale = "en-US",
  currency = "USD"
) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

  return `${formatted}${priceSuffix ?? ""}`;
}

export function formatArea(area?: number | null, areaUnit = "sqft") {
  if (area == null) return null;
  return `${area.toLocaleString()} ${areaUnit}`;
}

export function buildWhatsAppLink(phone: string, message: string) {
  const normalizedPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}
