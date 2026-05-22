import { headers } from "next/headers";
import { cache } from "react";
import type { Locale } from "@/lib/cms-types";

// cache() memoizes per request so the many components that need the locale
// (layout, navbar, footer, every page) share a single headers() read.
export const getRequestLocale = cache(async (): Promise<Locale> => {
  const headerList = await headers();
  return headerList.get("x-site-locale") === "en" ? "en" : "fr";
});
