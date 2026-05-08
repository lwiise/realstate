import type { Metadata } from "next";
import type { PageKey, Property } from "@/lib/cms-types";
import { getPageContent, getSiteSettings } from "@/lib/cms";
import { getRequestLocale } from "@/lib/i18n-server";
import { localizePageRecord, localizeProperty, localizeSiteSettings } from "@/lib/i18n-content";
import { localizePath } from "@/lib/i18n";

function normalizePathname(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

export async function buildSiteMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteSettings = localizeSiteSettings(await getSiteSettings(), locale);

  return {
    metadataBase: siteSettings.siteUrl ? new URL(siteSettings.siteUrl) : undefined,
    title: {
      default: siteSettings.defaultSeoTitle || siteSettings.siteName,
      template: `%s | ${siteSettings.siteName}`,
    },
    description: siteSettings.defaultSeoDescription || siteSettings.siteDescription,
    applicationName: siteSettings.siteName,
    keywords: siteSettings.siteKeywords,
    openGraph: {
      title: siteSettings.defaultSeoTitle || siteSettings.siteName,
      description: siteSettings.defaultSeoDescription || siteSettings.siteDescription,
      siteName: siteSettings.siteName,
      locale: locale === "en" ? "en_US" : "fr_MA",
      type: "website",
      images: [
        {
          url: siteSettings.defaultOgImage,
          alt: siteSettings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteSettings.defaultSeoTitle || siteSettings.siteName,
      description: siteSettings.defaultSeoDescription || siteSettings.siteDescription,
      images: [siteSettings.defaultOgImage],
    },
    icons: {
      icon: siteSettings.logoUrl || siteSettings.defaultOgImage,
      apple: "/apple-icon.png",
    },
  };
}

export async function buildPageMetadata(pageKey: PageKey, pathname: string): Promise<Metadata> {
  const locale = await getRequestLocale();
  const [rawSiteSettings, rawPage] = await Promise.all([getSiteSettings(), getPageContent(pageKey)]);
  const siteSettings = localizeSiteSettings(rawSiteSettings, locale);
  const page = localizePageRecord(rawPage, locale);
  const frenchPathname = normalizePathname(pathname);
  const normalizedPathname = localizePath(frenchPathname, locale);
  const title =
    page.seoTitle ||
    (pageKey === "home"
      ? siteSettings.defaultSeoTitle || siteSettings.siteName
      : page.title || siteSettings.siteName);
  const description = page.seoDescription || siteSettings.defaultSeoDescription || siteSettings.siteDescription;
  const image = page.ogImageUrl || siteSettings.defaultOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPathname,
      languages: {
        fr: frenchPathname,
        en: localizePath(frenchPathname, "en"),
      },
    },
    openGraph: {
      title,
      description,
      url: normalizedPathname,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export async function buildPropertyMetadata(
  property: Promise<Property | undefined> | Property | undefined,
  pathname: string
): Promise<Metadata> {
  const locale = await getRequestLocale();
  const [rawSiteSettings, rawResolvedProperty] = await Promise.all([getSiteSettings(), Promise.resolve(property)]);
  const siteSettings = localizeSiteSettings(rawSiteSettings, locale);
  const resolvedProperty = rawResolvedProperty ? localizeProperty(rawResolvedProperty, locale) : undefined;
  const frenchPathname = normalizePathname(pathname);
  const normalizedPathname = localizePath(frenchPathname, locale);

  if (!resolvedProperty) {
    return {
      title: locale === "en" ? "Property not found" : "Bien introuvable",
      description: locale === "en"
        ? `${siteSettings.siteName} could not find this listing.`
        : `${siteSettings.siteName} n'a pas trouve cette annonce.`,
      alternates: {
        canonical: normalizedPathname,
        languages: {
          fr: frenchPathname,
          en: localizePath(frenchPathname, "en"),
        },
      },
    };
  }

  const title = resolvedProperty.seoTitle || resolvedProperty.title;
  const description =
    resolvedProperty.seoDescription ||
    resolvedProperty.shortDescription ||
    siteSettings.siteDescription;
  const image =
    resolvedProperty.ogImage || resolvedProperty.coverImage || siteSettings.defaultOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPathname,
      languages: {
        fr: frenchPathname,
        en: localizePath(frenchPathname, "en"),
      },
    },
    openGraph: {
      title,
      description,
      url: normalizedPathname,
      images: [
        {
          url: image,
          alt: resolvedProperty.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
