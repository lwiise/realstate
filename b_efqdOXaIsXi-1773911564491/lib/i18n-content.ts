import type {
  Agent,
  FooterSettings,
  Locale,
  NavigationSettings,
  PageContentMap,
  PageKey,
  PageRecord,
  Property,
  PropertyType,
  SiteSettings,
  TransactionType,
} from "@/lib/cms-types";

// English is served from the STORED translation (content_translations.data_json),
// generated once by Gemini on save / backfill — never translated live at request time.
// Each entity carries its saved English under `translationEn` (attached by the DB layer).
// Any field that is missing/empty in the stored translation falls back to the French source.

/** Reads the stored English payload off an entity, regardless of its declared type. */
function storedEn(entity: unknown): Record<string, unknown> {
  const value = (entity as { translationEn?: unknown } | null | undefined)?.translationEn;
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function pickString(generated: unknown, fallback: string): string {
  return typeof generated === "string" && generated.length > 0 ? generated : fallback;
}

function pickStringOrNull(
  generated: unknown,
  fallback: string | null | undefined
): string | null | undefined {
  if (typeof generated === "string") return generated;
  return fallback;
}

function pickArray<T>(generated: unknown, fallback: T[]): T[] {
  return Array.isArray(generated) && generated.length > 0 ? (generated as T[]) : fallback;
}

export function localizeSiteSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  if (locale === "fr") return settings;
  const en = storedEn(settings);

  return {
    ...settings,
    siteDescription: pickString(en.siteDescription, settings.siteDescription),
    siteKeywords: pickArray(en.siteKeywords, settings.siteKeywords),
    copyrightText: pickString(en.copyrightText, settings.copyrightText),
    defaultSeoTitle: pickString(en.defaultSeoTitle, settings.defaultSeoTitle),
    defaultSeoDescription: pickString(en.defaultSeoDescription, settings.defaultSeoDescription),
  };
}

export function localizeNavigation(navigation: NavigationSettings, locale: Locale): NavigationSettings {
  if (locale === "fr") return navigation;
  const en = storedEn(navigation);

  return {
    ...navigation,
    logoAlt: pickString(en.logoAlt, navigation.logoAlt),
    links: pickArray(en.links, navigation.links),
  };
}

export function localizeFooter(footer: FooterSettings, locale: Locale): FooterSettings {
  if (locale === "fr") return footer;
  const en = storedEn(footer);

  return {
    ...footer,
    brandText: pickString(en.brandText, footer.brandText),
    quickLinks: pickArray(en.quickLinks, footer.quickLinks),
    propertyLinks: pickArray(en.propertyLinks, footer.propertyLinks),
    legalLinks: pickArray(en.legalLinks, footer.legalLinks),
  };
}

export function localizeTransactionType(type: TransactionType, locale: Locale): TransactionType {
  if (locale === "fr") return type;
  const en = storedEn(type);

  return {
    ...type,
    label: pickString(en.label, type.label),
    description: pickStringOrNull(en.description, type.description),
    navLabel: pickStringOrNull(en.navLabel, type.navLabel),
    priceSuffix: pickStringOrNull(en.priceSuffix, type.priceSuffix),
  };
}

export function localizeTransactionTypes(types: TransactionType[], locale: Locale) {
  return types.map((type) => localizeTransactionType(type, locale));
}

export function localizePropertyType(type: PropertyType, locale: Locale): PropertyType {
  if (locale === "fr") return type;
  const en = storedEn(type);

  return {
    ...type,
    label: pickString(en.label, type.label),
    description: pickStringOrNull(en.description, type.description),
  };
}

export function localizePropertyTypes(types: PropertyType[], locale: Locale) {
  return types.map((type) => localizePropertyType(type, locale));
}

export function localizeAgent(agent: Agent, locale: Locale): Agent {
  if (locale === "fr") return agent;
  const en = storedEn(agent);

  return {
    ...agent,
    role: pickString(en.role, agent.role),
    bio: pickStringOrNull(en.bio, agent.bio),
    seoTitle: pickStringOrNull(en.seoTitle, agent.seoTitle),
    seoDescription: pickStringOrNull(en.seoDescription, agent.seoDescription),
  };
}

export function localizeProperty(property: Property, locale: Locale): Property {
  if (locale === "fr") return property;
  const en = storedEn(property);

  return {
    ...property,
    title: pickString(en.title, property.title),
    // transactionType/propertyType/priceSuffix English values are injected into
    // translationEn by the DB layer (withPropertyTranslation) from the related taxonomy rows.
    transactionType: pickString(en.transactionType, property.transactionType),
    propertyType: pickString(en.propertyType, property.propertyType),
    priceSuffix: property.priceSuffix
      ? pickStringOrNull(en.priceSuffix, property.priceSuffix)
      : property.priceSuffix,
    neighborhood: pickString(en.neighborhood, property.neighborhood),
    fullAddress: pickStringOrNull(en.fullAddress, property.fullAddress),
    shortDescription: pickString(en.shortDescription, property.shortDescription),
    longDescription: pickString(en.longDescription, property.longDescription),
    features: pickArray(en.features, property.features),
    seoTitle: pickStringOrNull(en.seoTitle, property.seoTitle),
    seoDescription: pickStringOrNull(en.seoDescription, property.seoDescription),
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
  const en = storedEn(page);
  const translatedContent =
    en.content && typeof en.content === "object" && !Array.isArray(en.content)
      ? (en.content as PageContentMap[TPageKey])
      : page.content;

  return {
    ...page,
    title: pickString(en.title, page.title),
    seoTitle: pickStringOrNull(en.seoTitle, page.seoTitle),
    seoDescription: pickStringOrNull(en.seoDescription, page.seoDescription),
    content: translatedContent,
  };
}
