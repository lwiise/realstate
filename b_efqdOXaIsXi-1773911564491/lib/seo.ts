import type { Metadata } from "next";
import type { PageKey, Property } from "@/lib/cms-types";
import { getPageContent, getSiteSettings } from "@/lib/cms";

function normalizePathname(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

export function buildSiteMetadata(): Metadata {
  const siteSettings = getSiteSettings();

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
      locale: "fr_MA",
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

export function buildPageMetadata(pageKey: PageKey, pathname: string): Metadata {
  const siteSettings = getSiteSettings();
  const page = getPageContent(pageKey);
  const normalizedPathname = normalizePathname(pathname);
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

export function buildPropertyMetadata(property: Property | undefined, pathname: string): Metadata {
  const siteSettings = getSiteSettings();
  const normalizedPathname = normalizePathname(pathname);

  if (!property) {
    return {
      title: "Property not found",
      description: `${siteSettings.siteName} could not find this listing.`,
      alternates: {
        canonical: normalizedPathname,
      },
    };
  }

  const title = property.seoTitle || property.title;
  const description = property.seoDescription || property.shortDescription || siteSettings.siteDescription;
  const image = property.ogImage || property.coverImage || siteSettings.defaultOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPathname,
    },
    openGraph: {
      title,
      description,
      url: normalizedPathname,
      images: [
        {
          url: image,
          alt: property.title,
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
