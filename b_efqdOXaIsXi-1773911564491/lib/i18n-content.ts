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
  TranslationPayload,
} from "@/lib/cms-types";
import {
  translateAgentToEnglish,
  translateFooterToEnglish,
  translateNavigationToEnglish,
  translatePageRecordToEnglish,
  translatePropertyToEnglish,
  translatePropertyTypeToEnglish,
  translateSiteSettingsToEnglish,
  translateTransactionTypeToEnglish,
} from "@/lib/auto-translate";

function englishPayload(record: { translationEn?: TranslationPayload | null }) {
  return record.translationEn ?? {};
}

function getString(payload: TranslationPayload, key: string, fallback: string): string;
function getString(payload: TranslationPayload, key: string, fallback?: string | null): string | null | undefined;
function getString(payload: TranslationPayload, key: string, fallback?: string | null) {
  const value = payload[key];
  return typeof value === "string" ? value : fallback;
}

function getArray<T>(payload: TranslationPayload, key: string, fallback: T[]): T[] {
  const value = payload[key];
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function getObject<T>(payload: TranslationPayload, key: string, fallback: T): T {
  const value = payload[key];
  return value && typeof value === "object" ? (value as T) : fallback;
}

export function localizeSiteSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  if (locale === "fr") return settings;

  const generated = translateSiteSettingsToEnglish(settings);
  const payload = englishPayload(settings);

  return {
    ...settings,
    siteDescription: getString(payload, "siteDescription", generated.siteDescription ?? settings.siteDescription),
    siteKeywords: getArray<string>(payload, "siteKeywords", generated.siteKeywords),
    copyrightText: getString(payload, "copyrightText", generated.copyrightText ?? settings.copyrightText),
    defaultSeoTitle: getString(payload, "defaultSeoTitle", generated.defaultSeoTitle ?? settings.defaultSeoTitle),
    defaultSeoDescription: getString(payload, "defaultSeoDescription", generated.defaultSeoDescription ?? settings.defaultSeoDescription),
  };
}

export function localizeNavigation(navigation: NavigationSettings, locale: Locale): NavigationSettings {
  if (locale === "fr") return navigation;

  const generated = translateNavigationToEnglish(navigation);
  const payload = englishPayload(navigation);

  return {
    ...navigation,
    logoAlt: getString(payload, "logoAlt", generated.logoAlt ?? navigation.logoAlt),
    links: getArray<NavigationSettings["links"][number]>(payload, "links", generated.links),
  };
}

export function localizeFooter(footer: FooterSettings, locale: Locale): FooterSettings {
  if (locale === "fr") return footer;

  const generated = translateFooterToEnglish(footer);
  const payload = englishPayload(footer);

  return {
    ...footer,
    brandText: getString(payload, "brandText", generated.brandText ?? footer.brandText),
    quickLinks: getArray<FooterSettings["quickLinks"][number]>(payload, "quickLinks", generated.quickLinks),
    propertyLinks: getArray<FooterSettings["propertyLinks"][number]>(payload, "propertyLinks", generated.propertyLinks),
    legalLinks: getArray<FooterSettings["legalLinks"][number]>(payload, "legalLinks", generated.legalLinks),
  };
}

export function localizeTransactionType(type: TransactionType, locale: Locale): TransactionType {
  if (locale === "fr") return type;

  const generated = translateTransactionTypeToEnglish(type);
  const payload = englishPayload(type);

  return {
    ...type,
    label: getString(payload, "label", generated.label ?? type.label),
    description: getString(payload, "description", generated.description ?? type.description),
    navLabel: getString(payload, "navLabel", generated.navLabel ?? type.navLabel),
    priceSuffix: getString(payload, "priceSuffix", generated.priceSuffix ?? type.priceSuffix),
  };
}

export function localizeTransactionTypes(types: TransactionType[], locale: Locale) {
  return types.map((type) => localizeTransactionType(type, locale));
}

export function localizePropertyType(type: PropertyType, locale: Locale): PropertyType {
  if (locale === "fr") return type;

  const generated = translatePropertyTypeToEnglish(type);
  const payload = englishPayload(type);

  return {
    ...type,
    label: getString(payload, "label", generated.label ?? type.label),
    description: getString(payload, "description", generated.description ?? type.description),
  };
}

export function localizePropertyTypes(types: PropertyType[], locale: Locale) {
  return types.map((type) => localizePropertyType(type, locale));
}

export function localizeAgent(agent: Agent, locale: Locale): Agent {
  if (locale === "fr") return agent;

  const generated = translateAgentToEnglish(agent);
  const payload = englishPayload(agent);

  return {
    ...agent,
    role: getString(payload, "role", generated.role ?? agent.role),
    bio: getString(payload, "bio", generated.bio ?? agent.bio),
    seoTitle: getString(payload, "seoTitle", generated.seoTitle ?? agent.seoTitle),
    seoDescription: getString(payload, "seoDescription", generated.seoDescription ?? agent.seoDescription),
  };
}

export function localizeProperty(property: Property, locale: Locale): Property {
  if (locale === "fr") return property;

  const generated = translatePropertyToEnglish(property);
  const payload = englishPayload(property);
  const transactionType = getString(payload, "transactionType", property.transactionType);
  const propertyType = getString(payload, "propertyType", property.propertyType);
  const priceSuffix = getString(payload, "priceSuffix", property.priceSuffix);

  return {
    ...property,
    title: getString(payload, "title", generated.title ?? property.title),
    transactionType,
    propertyType,
    priceSuffix,
    neighborhood: getString(payload, "neighborhood", generated.neighborhood ?? property.neighborhood),
    fullAddress: getString(payload, "fullAddress", generated.fullAddress ?? property.fullAddress),
    shortDescription: getString(payload, "shortDescription", generated.shortDescription ?? property.shortDescription),
    longDescription: getString(payload, "longDescription", generated.longDescription ?? property.longDescription),
    features: getArray<string>(payload, "features", generated.features),
    seoTitle: getString(payload, "seoTitle", generated.seoTitle ?? property.seoTitle),
    seoDescription: getString(payload, "seoDescription", generated.seoDescription ?? property.seoDescription),
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
  const payload = englishPayload(page);

  return {
    ...page,
    title: getString(payload, "title", generated.title),
    seoTitle: getString(payload, "seoTitle", generated.seoTitle),
    seoDescription: getString(payload, "seoDescription", generated.seoDescription),
    content: getObject(payload, "content", generated.content),
  };
}
