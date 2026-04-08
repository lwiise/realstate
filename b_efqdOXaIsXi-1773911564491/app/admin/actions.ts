"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  countAdminUsers,
  createInitialAdminUser,
  isAdminAuthUnavailableError,
  requireAdminUser,
  signInAdmin,
  signOutAdmin,
} from "@/lib/auth";
import type {
  FooterSettings,
  NavigationSettings,
  PageContentMap,
  PageKey,
  PageRecord,
  Property,
  SiteSettings,
} from "@/lib/cms-types";
import {
  deleteAgent,
  deleteProperty,
  deletePropertyType,
  deleteTransactionType,
  updateFooterSettings,
  updateNavigationSettings,
  updatePageContent,
  updateSiteSettings,
  upsertAgent,
  upsertProperty,
  upsertPropertyType,
  upsertTransactionType,
} from "@/lib/cms";
import { getSeedPage } from "@/lib/seed-data";

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalValue(formData: FormData, key: string) {
  const value = getValue(formData, key);
  return value || null;
}

function getNumberValue(formData: FormData, key: string) {
  const value = getValue(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getJsonValue<T>(formData: FormData, key: string, fallback: T): T {
  const value = getValue(formData, key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function revalidateSite(propertySlug?: string) {
  const paths = [
    "/",
    "/about",
    "/contact",
    "/buy",
    "/rent",
    "/daily-rent",
    "/properties",
    "/admin",
    "/admin/properties",
    "/admin/agents",
    "/admin/property-types",
    "/admin/transaction-types",
    "/admin/settings",
    "/admin/navigation",
    "/admin/footer",
    "/admin/media",
    "/admin/inquiries",
  ];

  if (propertySlug) {
    paths.push(`/property/${propertySlug}`);
  }

  paths.forEach((path) => revalidatePath(path));
}

function withSavedParam(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}saved=1`;
}

export async function setupAdminAction(formData: FormData) {
  try {
    if ((await countAdminUsers()) > 0) {
      redirect("/admin/login?error=setup-disabled");
    }

    const name = getValue(formData, "name");
    const email = getValue(formData, "email");
    const password = getValue(formData, "password");

    if (!name || !email || password.length < 8) {
      redirect("/admin/login?error=setup-invalid");
    }

    await createInitialAdminUser({ name, email, password });
    await signInAdmin({ email, password });

    redirect("/admin");
  } catch (error) {
    if (isAdminAuthUnavailableError(error)) {
      redirect("/admin/login?error=auth-unavailable");
    }

    throw error;
  }
}

export async function loginAdminAction(formData: FormData) {
  try {
    const email = getValue(formData, "email");
    const password = getValue(formData, "password");

    if (!email || !password) {
      redirect("/admin/login?error=missing-fields");
    }

    const success = await signInAdmin({ email, password });
    if (!success) {
      redirect("/admin/login?error=invalid-credentials");
    }

    redirect("/admin");
  } catch (error) {
    if (isAdminAuthUnavailableError(error)) {
      redirect("/admin/login?error=auth-unavailable");
    }

    throw error;
  }
}

export async function logoutAdminAction() {
  try {
    await requireAdminUser();
    await signOutAdmin();
    redirect("/admin/login");
  } catch (error) {
    if (isAdminAuthUnavailableError(error)) {
      redirect("/admin/login?error=auth-unavailable");
    }

    throw error;
  }
}

export async function savePropertyAction(formData: FormData) {
  await requireAdminUser();

  const id = getNumberValue(formData, "id");
  const slug = getValue(formData, "slug");

  if (!getValue(formData, "title") || !slug) {
    redirect(`/admin/properties${id ? `/${id}` : "/new"}?error=missing-fields`);
  }

  const savedId = await upsertProperty({
    id: id ?? undefined,
    title: getValue(formData, "title"),
    slug,
    transactionTypeId: Number(getValue(formData, "transactionTypeId")),
    propertyTypeId: Number(getValue(formData, "propertyTypeId")),
    status: getValue(formData, "status") as Property["status"],
    featured: getBooleanValue(formData, "featured"),
    city: getValue(formData, "city"),
    neighborhood: getValue(formData, "neighborhood"),
    fullAddress: getOptionalValue(formData, "fullAddress"),
    price: Number(getValue(formData, "price")),
    priceMode: getValue(formData, "priceMode") as Property["priceMode"],
    priceSuffix: getOptionalValue(formData, "priceSuffix"),
    shortDescription: getValue(formData, "shortDescription"),
    longDescription: getValue(formData, "longDescription"),
    bedrooms: getNumberValue(formData, "bedrooms"),
    bathrooms: getNumberValue(formData, "bathrooms"),
    area: getNumberValue(formData, "area"),
    areaUnit: getValue(formData, "areaUnit") || "sqft",
    features: getJsonValue<string[]>(formData, "features", []),
    images: getJsonValue<string[]>(formData, "images", []),
    coverImage: getOptionalValue(formData, "coverImage"),
    video: getOptionalValue(formData, "video"),
    virtualTourUrl: getOptionalValue(formData, "virtualTourUrl"),
    agentId: getNumberValue(formData, "agentId"),
    seoTitle: getOptionalValue(formData, "seoTitle"),
    seoDescription: getOptionalValue(formData, "seoDescription"),
    ogImage: getOptionalValue(formData, "ogImage"),
    sortOrder: getNumberValue(formData, "sortOrder") ?? 0,
    publishedAt: null,
  });

  revalidateSite(slug);
  redirect(withSavedParam(`/admin/properties/${savedId}`));
}

export async function deletePropertyAction(formData: FormData) {
  await requireAdminUser();
  const id = Number(getValue(formData, "id"));
  const slug = getOptionalValue(formData, "slug") ?? undefined;
  await deleteProperty(id);
  revalidateSite(slug);
  redirect("/admin/properties");
}

export async function saveAgentAction(formData: FormData) {
  await requireAdminUser();
  const id = getNumberValue(formData, "id");

  const savedId = await upsertAgent({
    id: id ?? undefined,
    name: getValue(formData, "name"),
    slug: getValue(formData, "slug"),
    role: getValue(formData, "role"),
    phone: getValue(formData, "phone"),
    email: getValue(formData, "email"),
    photoUrl: getOptionalValue(formData, "photoUrl"),
    bio: getOptionalValue(formData, "bio"),
    whatsapp: getOptionalValue(formData, "whatsapp"),
    isPublished: getBooleanValue(formData, "isPublished"),
    sortOrder: getNumberValue(formData, "sortOrder") ?? 0,
    seoTitle: getOptionalValue(formData, "seoTitle"),
    seoDescription: getOptionalValue(formData, "seoDescription"),
  });

  revalidateSite();
  redirect(withSavedParam(`/admin/agents/${savedId}`));
}

export async function deleteAgentAction(formData: FormData) {
  await requireAdminUser();
  await deleteAgent(Number(getValue(formData, "id")));
  revalidateSite();
  redirect("/admin/agents");
}

export async function savePropertyTypeAction(formData: FormData) {
  await requireAdminUser();
  const id = getNumberValue(formData, "id");

  const savedId = await upsertPropertyType({
    id: id ?? undefined,
    label: getValue(formData, "label"),
    slug: getValue(formData, "slug"),
    description: getOptionalValue(formData, "description"),
    imageUrl: getOptionalValue(formData, "imageUrl"),
    isActive: getBooleanValue(formData, "isActive"),
    sortOrder: getNumberValue(formData, "sortOrder") ?? 0,
  });

  revalidateSite();
  redirect(withSavedParam(`/admin/property-types/${savedId}`));
}

export async function deletePropertyTypeAction(formData: FormData) {
  await requireAdminUser();
  await deletePropertyType(Number(getValue(formData, "id")));
  revalidateSite();
  redirect("/admin/property-types");
}

export async function saveTransactionTypeAction(formData: FormData) {
  await requireAdminUser();
  const id = getNumberValue(formData, "id");

  const savedId = await upsertTransactionType({
    id: id ?? undefined,
    label: getValue(formData, "label"),
    slug: getValue(formData, "slug"),
    description: getOptionalValue(formData, "description"),
    imageUrl: getOptionalValue(formData, "imageUrl"),
    isActive: getBooleanValue(formData, "isActive"),
    sortOrder: getNumberValue(formData, "sortOrder") ?? 0,
    routePath: getValue(formData, "routePath"),
    navLabel: getOptionalValue(formData, "navLabel"),
    priceSuffix: getOptionalValue(formData, "priceSuffix"),
    showInNavigation: getBooleanValue(formData, "showInNavigation"),
  });

  revalidateSite();
  redirect(withSavedParam(`/admin/transaction-types/${savedId}`));
}

export async function deleteTransactionTypeAction(formData: FormData) {
  await requireAdminUser();
  await deleteTransactionType(Number(getValue(formData, "id")));
  revalidateSite();
  redirect("/admin/transaction-types");
}

export async function saveNavigationAction(formData: FormData) {
  await requireAdminUser();

  const links = getJsonValue<Array<{ label?: string; href?: string; isEnabled?: string }>>(
    formData,
    "links",
    []
  ).map((link) => ({
    label: link.label ?? "",
    href: link.href ?? "",
    isEnabled: link.isEnabled === "true",
  }));

  const input: NavigationSettings = {
    logoUrl: getValue(formData, "logoUrl"),
    logoAlt: getValue(formData, "logoAlt"),
    links,
  };

  await updateNavigationSettings(input);
  revalidateSite();
  redirect(withSavedParam("/admin/navigation"));
}

export async function saveFooterAction(formData: FormData) {
  await requireAdminUser();

  const parseLinks = (key: string) =>
    getJsonValue<Array<{ label?: string; href?: string; isEnabled?: string }>>(formData, key, []).map(
      (item) => ({
        label: item.label ?? "",
        href: item.href ?? "",
        isEnabled: item.isEnabled === "true",
      })
    );

  const input: FooterSettings = {
    brandText: getValue(formData, "brandText"),
    quickLinks: parseLinks("quickLinks"),
    propertyLinks: parseLinks("propertyLinks"),
    socialLinks: parseLinks("socialLinks"),
    legalLinks: parseLinks("legalLinks"),
  };

  await updateFooterSettings(input);
  revalidateSite();
  redirect(withSavedParam("/admin/footer"));
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdminUser();

  const input: SiteSettings = {
    siteName: getValue(formData, "siteName"),
    siteUrl: getValue(formData, "siteUrl"),
    siteDescription: getValue(formData, "siteDescription"),
    siteKeywords: getJsonValue<string[]>(formData, "siteKeywords", []),
    defaultOgImage: getValue(formData, "defaultOgImage"),
    logoUrl: getValue(formData, "logoUrl"),
    logoAlt: getValue(formData, "logoAlt"),
    contactEmail: getValue(formData, "contactEmail"),
    contactPhone: getValue(formData, "contactPhone"),
    whatsappNumber: getValue(formData, "whatsappNumber"),
    companyAddress: getValue(formData, "companyAddress"),
    currencyCode: getValue(formData, "currencyCode"),
    currencyLocale: getValue(formData, "currencyLocale"),
    copyrightText: getValue(formData, "copyrightText"),
    defaultSeoTitle: getValue(formData, "defaultSeoTitle"),
    defaultSeoDescription: getValue(formData, "defaultSeoDescription"),
  };

  await updateSiteSettings(input);
  revalidateSite();
  redirect(withSavedParam("/admin/settings"));
}

export async function savePageContentAction(formData: FormData) {
  await requireAdminUser();

  const pageKey = getValue(formData, "pageKey") as PageKey;
  const content = parsePageContent(pageKey, formData);

  const record: PageRecord<PageKey> = {
    pageKey,
    title: getValue(formData, "title"),
    seoTitle: getOptionalValue(formData, "seoTitle"),
    seoDescription: getOptionalValue(formData, "seoDescription"),
    ogImageUrl: getOptionalValue(formData, "ogImageUrl"),
    content,
    updatedAt: new Date().toISOString(),
  };

  await updatePageContent(record);
  revalidateSite();
  redirect(withSavedParam(`/admin/content/${pageKey}`));
}

function parsePageContent<TPageKey extends PageKey>(
  pageKey: TPageKey,
  formData: FormData
): PageContentMap[TPageKey] {
  switch (pageKey) {
    case "home":
      return {
        hero: {
          eyebrow: getValue(formData, "heroEyebrow"),
          title: getValue(formData, "heroTitle"),
          highlight: getValue(formData, "heroHighlight"),
          description: getValue(formData, "heroDescription"),
          backgroundImage: getValue(formData, "heroBackgroundImage"),
        },
        about: {
          eyebrow: getValue(formData, "aboutEyebrow"),
          title: getValue(formData, "aboutTitle"),
          descriptionPrimary: getValue(formData, "aboutDescriptionPrimary"),
          descriptionSecondary: getValue(formData, "aboutDescriptionSecondary"),
          images: getJsonValue<string[]>(formData, "aboutImages", []),
          features: getJsonValue<string[]>(formData, "aboutFeatures", []),
          ctaLabel: getValue(formData, "aboutCtaLabel"),
          ctaHref: getValue(formData, "aboutCtaHref"),
        },
        featured: {
          eyebrow: getValue(formData, "featuredEyebrow"),
          title: getValue(formData, "featuredTitle"),
          ctaLabel: getValue(formData, "featuredCtaLabel"),
          ctaHref: getValue(formData, "featuredCtaHref"),
          limit: getNumberValue(formData, "featuredLimit") ?? 6,
        },
        testimonials: {
          eyebrow: getValue(formData, "testimonialsEyebrow"),
          title: getValue(formData, "testimonialsTitle"),
          description: getValue(formData, "testimonialsDescription"),
          stats: getJsonValue(formData, "testimonialStats", []),
          items: getJsonValue(formData, "testimonialItems", []),
        },
        cta: {
          eyebrow: getValue(formData, "ctaEyebrow"),
          title: getValue(formData, "ctaTitle"),
          description: getValue(formData, "ctaDescription"),
          backgroundImage: getValue(formData, "ctaBackgroundImage"),
          primaryLabel: getValue(formData, "ctaPrimaryLabel"),
          primaryHref: getValue(formData, "ctaPrimaryHref"),
          secondaryLabel: getValue(formData, "ctaSecondaryLabel"),
          secondaryHref: getValue(formData, "ctaSecondaryHref"),
        },
        contact: {
          eyebrow: getValue(formData, "contactEyebrow"),
          title: getValue(formData, "contactTitle"),
          formTitle: getValue(formData, "contactFormTitle"),
          offices: getJsonValue(formData, "contactOffices", []).map(
            (office: { name?: string; lines?: string }) => ({
              name: office.name ?? "",
              lines: (office.lines ?? "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            })
          ),
        },
      } as PageContentMap[TPageKey];
    case "buy":
      return {
        hero: {
          eyebrow: getValue(formData, "heroEyebrow"),
          title: getValue(formData, "heroTitle"),
          highlight: getValue(formData, "heroHighlight"),
          description: getValue(formData, "heroDescription"),
          backgroundImage: getValue(formData, "heroBackgroundImage"),
        },
        categorySection: {
          eyebrow: getValue(formData, "categoryEyebrow"),
          title: getValue(formData, "categoryTitle"),
          description: getValue(formData, "categoryDescription"),
        },
        stats: getJsonValue(formData, "stats", []),
        whyBuy: {
          eyebrow: getValue(formData, "whyEyebrow"),
          title: getValue(formData, "whyTitle"),
          description: getValue(formData, "whyDescription"),
          image: getValue(formData, "whyImage"),
          items: getJsonValue(formData, "whyItems", []),
        },
        listing: {
          eyebrow: getValue(formData, "listingEyebrow"),
          title: getValue(formData, "listingTitle"),
          description: getValue(formData, "listingDescription"),
        },
      } as PageContentMap[TPageKey];
    case "rent":
      return {
        hero: {
          eyebrow: getValue(formData, "heroEyebrow"),
          title: getValue(formData, "heroTitle"),
          highlight: getValue(formData, "heroHighlight"),
          description: getValue(formData, "heroDescription"),
          backgroundImage: getValue(formData, "heroBackgroundImage"),
        },
        categorySection: {
          eyebrow: getValue(formData, "categoryEyebrow"),
          title: getValue(formData, "categoryTitle"),
          description: getValue(formData, "categoryDescription"),
        },
        benefits: {
          eyebrow: getValue(formData, "benefitsEyebrow"),
          title: getValue(formData, "benefitsTitle"),
          items: getJsonValue(formData, "benefitItems", []),
        },
        listing: {
          eyebrow: getValue(formData, "listingEyebrow"),
          title: getValue(formData, "listingTitle"),
          description: getValue(formData, "listingDescription"),
        },
      } as PageContentMap[TPageKey];
    case "daily-rent":
      return {
        hero: {
          eyebrow: getValue(formData, "heroEyebrow"),
          title: getValue(formData, "heroTitle"),
          highlight: getValue(formData, "heroHighlight"),
          description: getValue(formData, "heroDescription"),
          backgroundImage: getValue(formData, "heroBackgroundImage"),
        },
        categorySection: {
          eyebrow: getValue(formData, "categoryEyebrow"),
          title: getValue(formData, "categoryTitle"),
          description: getValue(formData, "categoryDescription"),
        },
        services: {
          eyebrow: getValue(formData, "servicesEyebrow"),
          title: getValue(formData, "servicesTitle"),
          description: getValue(formData, "servicesDescription"),
          images: getJsonValue(formData, "servicesImages", []),
          points: getJsonValue(formData, "servicesPoints", []),
        },
        useCases: {
          eyebrow: getValue(formData, "useCasesEyebrow"),
          title: getValue(formData, "useCasesTitle"),
          items: getJsonValue(formData, "useCaseItems", []),
        },
        listing: {
          eyebrow: getValue(formData, "listingEyebrow"),
          title: getValue(formData, "listingTitle"),
          description: getValue(formData, "listingDescription"),
        },
      } as PageContentMap[TPageKey];
    case "about":
      return {
        hero: {
          eyebrow: getValue(formData, "heroEyebrow"),
          title: getValue(formData, "heroTitle"),
          highlight: getValue(formData, "heroHighlight"),
          description: getValue(formData, "heroDescription"),
          backgroundImage: getValue(formData, "heroBackgroundImage"),
        },
        story: {
          eyebrow: getValue(formData, "storyEyebrow"),
          title: getValue(formData, "storyTitle"),
          descriptionPrimary: getValue(formData, "storyDescriptionPrimary"),
          descriptionSecondary: getValue(formData, "storyDescriptionSecondary"),
          image: getValue(formData, "storyImage"),
          features: getJsonValue(formData, "storyFeatures", []),
        },
        values: {
          eyebrow: getValue(formData, "valuesEyebrow"),
          title: getValue(formData, "valuesTitle"),
          items: getJsonValue(formData, "valueItems", []),
        },
      } as PageContentMap[TPageKey];
    case "contact":
      return {
        hero: {
          eyebrow: getValue(formData, "heroEyebrow"),
          title: getValue(formData, "heroTitle"),
          highlight: getValue(formData, "heroHighlight"),
          description: getValue(formData, "heroDescription"),
          backgroundImage: getValue(formData, "heroBackgroundImage"),
        },
        intro: {
          eyebrow: getValue(formData, "introEyebrow"),
          title: getValue(formData, "introTitle"),
          description: getValue(formData, "introDescription"),
        },
        offices: getJsonValue(formData, "offices", []).map(
          (office: { name?: string; lines?: string }) => ({
            name: office.name ?? "",
            lines: (office.lines ?? "")
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          })
        ),
        form: {
          title: getValue(formData, "formTitle"),
          submitLabel: getValue(formData, "submitLabel"),
        },
      } as PageContentMap[TPageKey];
    default:
      return getSeedPage(pageKey);
  }
}
