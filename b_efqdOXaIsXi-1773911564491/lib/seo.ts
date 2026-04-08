import type { Metadata } from "next";
import type { PageKey, Property } from "@/lib/cms-types";
import { getPageContent, getSiteSettings } from "@/lib/cms";

function normalizePathname(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

export async function buildSiteMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

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

export async function buildPageMetadata(pageKey: PageKey, pathname: string): Promise<Metadata> {
  const [siteSettings, page] = await Promise.all([getSiteSettings(), getPageContent(pageKey)]);
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

export async function buildPropertyMetadata(
  property: Promise<Property | undefined> | Property | undefined,
  pathname: string
): Promise<Metadata> {
  const [siteSettings, resolvedProperty] = await Promise.all([getSiteSettings(), Promise.resolve(property)]);
  const normalizedPathname = normalizePathname(pathname);

  if (!resolvedProperty) {
    return {
      title: "Property not found",
      description: `${siteSettings.siteName} could not find this listing.`,
      alternates: {
        canonical: normalizedPathname,
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
