import type {
  Agent,
  FooterSettings,
  Locale,
  NavigationSettings,
  PageKey,
  PageRecord,
  Property,
  PropertyType,
  SiteSettings,
  TransactionType,
} from "@/lib/cms-types";
import {
  translateAgentToEnglish,
  translateFooterToEnglish,
  translateNavigationToEnglish,
  translatePageRecordToEnglish,
  translatePropertyToEnglish,
  translatePropertyTypeToEnglish,
  translateSiteSettingsToEnglish,
  translateTextToEnglish,
  translateTransactionTypeToEnglish,
} from "@/lib/auto-translate";

// English content is always re-derived at read time from the canonical FR data
// so dictionary updates apply immediately and stored translations cannot go
// stale. Stored translations (saved by admin actions) are kept in the database
// for auditing and as future-proofing if a manual translation editor is added.

function pickString(generated: string | null | undefined, fallback: string): string {
  return typeof generated === "string" && generated.length > 0 ? generated : fallback;
}

function pickStringOrNull(
  generated: string | null | undefined,
  fallback: string | null | undefined
): string | null | undefined {
  if (typeof generated === "string") return generated;
  return fallback;
}

export function localizeSiteSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  if (locale === "fr") return settings;

  const generated = translateSiteSettingsToEnglish(settings);

  return {
    ...settings,
    siteDescription: pickString(generated.siteDescription, settings.siteDescription),
    siteKeywords: generated.siteKeywords?.length ? generated.siteKeywords : settings.siteKeywords,
    copyrightText: pickString(generated.copyrightText, settings.copyrightText),
    defaultSeoTitle: pickString(generated.defaultSeoTitle, settings.defaultSeoTitle),
    defaultSeoDescription: pickString(generated.defaultSeoDescription, settings.defaultSeoDescription),
  };
}

export function localizeNavigation(navigation: NavigationSettings, locale: Locale): NavigationSettings {
  if (locale === "fr") return navigation;

  const generated = translateNavigationToEnglish(navigation);

  return {
    ...navigation,
    logoAlt: pickString(generated.logoAlt, navigation.logoAlt),
    links: generated.links?.length ? generated.links : navigation.links,
  };
}

export function localizeFooter(footer: FooterSettings, locale: Locale): FooterSettings {
  if (locale === "fr") return footer;

  const generated = translateFooterToEnglish(footer);

  return {
    ...footer,
    brandText: pickString(generated.brandText, footer.brandText),
    quickLinks: generated.quickLinks?.length ? generated.quickLinks : footer.quickLinks,
    propertyLinks: generated.propertyLinks?.length ? generated.propertyLinks : footer.propertyLinks,
    legalLinks: generated.legalLinks?.length ? generated.legalLinks : footer.legalLinks,
  };
}

export function localizeTransactionType(type: TransactionType, locale: Locale): TransactionType {
  if (locale === "fr") return type;

  const generated = translateTransactionTypeToEnglish(type);

  return {
    ...type,
    label: pickString(generated.label, type.label),
    description: pickStringOrNull(generated.description, type.description),
    navLabel: pickStringOrNull(generated.navLabel, type.navLabel),
    priceSuffix: pickStringOrNull(generated.priceSuffix, type.priceSuffix),
  };
}

export function localizeTransactionTypes(types: TransactionType[], locale: Locale) {
  return types.map((type) => localizeTransactionType(type, locale));
}

export function localizePropertyType(type: PropertyType, locale: Locale): PropertyType {
  if (locale === "fr") return type;

  const generated = translatePropertyTypeToEnglish(type);

  return {
    ...type,
    label: pickString(generated.label, type.label),
    description: pickStringOrNull(generated.description, type.description),
  };
}

export function localizePropertyTypes(types: PropertyType[], locale: Locale) {
  return types.map((type) => localizePropertyType(type, locale));
}

export function localizeAgent(agent: Agent, locale: Locale): Agent {
  if (locale === "fr") return agent;

  const generated = translateAgentToEnglish(agent);

  return {
    ...agent,
    role: pickString(generated.role, agent.role),
    bio: pickStringOrNull(generated.bio, agent.bio),
    seoTitle: pickStringOrNull(generated.seoTitle, agent.seoTitle),
    seoDescription: pickStringOrNull(generated.seoDescription, agent.seoDescription),
  };
}

export function localizeProperty(property: Property, locale: Locale): Property {
  if (locale === "fr") return property;

  const generated = translatePropertyToEnglish(property);

  return {
    ...property,
    title: pickString(generated.title, property.title),
    transactionType: pickString(translateTextToEnglish(property.transactionType), property.transactionType),
    propertyType: pickString(translateTextToEnglish(property.propertyType), property.propertyType),
    priceSuffix: property.priceSuffix
      ? pickStringOrNull(translateTextToEnglish(property.priceSuffix), property.priceSuffix)
      : property.priceSuffix,
    neighborhood: pickString(generated.neighborhood, property.neighborhood),
    fullAddress: pickStringOrNull(generated.fullAddress, property.fullAddress),
    shortDescription: pickString(generated.shortDescription, property.shortDescription),
    longDescription: pickString(generated.longDescription, property.longDescription),
    features: generated.features?.length ? generated.features : property.features,
    seoTitle: pickStringOrNull(generated.seoTitle, property.seoTitle),
    seoDescription: pickStringOrNull(generated.seoDescription, property.seoDescription),
    agent: property.agent ? localizeAgent(property.agent, locale) : property.agent,
  };
}

export function localizeProperties(properties: Property[], locale: Locale) {
  return properties.map((property) => localizeProperty(property, locale));
}

export function localizePageRecord<TPageKey extends PageKey>(
  page: PageRecord<TPageKey>,
  locale: Locale
): PageRecord<TPageKey> {
  if (locale === "fr") return page;

  const generated = translatePageRecordToEnglish(page);

  return {
    ...page,
    title: pickString(generated.title, page.title),
    seoTitle: pickStringOrNull(generated.seoTitle, page.seoTitle),
    seoDescription: pickStringOrNull(generated.seoDescription, page.seoDescription),
    content: generated.content,
  };
}
