import type { Locale } from "@/lib/cms-types";

export const defaultLocale: Locale = "fr";
export const supportedLocales = ["fr", "en"] as const;

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value === "fr" || value === "en";
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : defaultLocale;
}

export function stripLocalePrefix(pathname: string) {
  if (pathname === "/en") return "/";
  return pathname.replace(/^\/en(?=\/)/, "") || "/";
}

export function localizePath(href: string, locale: Locale) {
  if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  const [pathWithQuery, hash = ""] = href.split("#");
  const [pathname = "/", query = ""] = pathWithQuery.split("?");
  const cleanPath = stripLocalePrefix(pathname.startsWith("/") ? pathname : `/${pathname}`);
  const localizedPath = locale === "en" ? `/en${cleanPath === "/" ? "" : cleanPath}` : cleanPath;
  return `${localizedPath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function switchLocalePath(pathname: string, search: string, locale: Locale) {
  const path = localizePath(stripLocalePrefix(pathname), locale);
  return `${path}${search ? `?${search}` : ""}`;
}
