import { unstable_cache } from "next/cache";
import type {
  Agent,
  FooterSettings,
  Inquiry,
  MediaAsset,
  NavigationSettings,
  PageKey,
  PageRecord,
  Property,
  PropertyFilters,
  PropertyType,
  SiteSettings,
  TransactionType,
  TranslationPayload,
} from "@/lib/cms-types";
import * as localCms from "@/lib/cms-local";
import * as remoteCms from "@/lib/cms-remote";
import { isRemoteDatabaseConfigured } from "@/lib/remote-db";

let remoteReadWarningShown = false;

// Shared cache tag for all public CMS reads. revalidateSite() (in app/admin/actions.ts)
// calls revalidateTag(CMS_CACHE_TAG) after every write so edits appear immediately,
// while the revalidate window below caps staleness if a revalidation is ever missed.
export const CMS_CACHE_TAG = "cms";
const CMS_CACHE_OPTIONS: { revalidate: number; tags: string[] } = {
  revalidate: 3600,
  tags: [CMS_CACHE_TAG],
};

function useRemoteCms() {
  return isRemoteDatabaseConfigured();
}

function canUseRemoteReads() {
  return useRemoteCms();
}

function formatErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown remote CMS error";
}

function warnRemoteReadFallback(error: unknown) {
  if (remoteReadWarningShown) {
    return;
  }

  remoteReadWarningShown = true;
  console.warn(
    `[cms] Remote CMS read failed, falling back to local seed data. ${formatErrorMessage(error)}`
  );
}

async function readWithFallback<T>(
  remoteReader: () => Promise<T>,
  localReader: () => T | Promise<T>
) {
  if (!canUseRemoteReads()) {
    return Promise.resolve(localReader());
  }

  try {
    return await remoteReader();
  } catch (error) {
    warnRemoteReadFallback(error);
    return Promise.resolve(localReader());
  }
}

async function writeWithProvider<T>(
  remoteWriter: () => Promise<T>,
  localWriter: () => T | Promise<T>
) {
  if (useRemoteCms()) {
    return remoteWriter();
  }

  return Promise.resolve(localWriter());
}

export const getSiteSettings = unstable_cache(
  () => readWithFallback(() => remoteCms.getSiteSettingsRemote(), () => localCms.getSiteSettings()),
  ["cms:getSiteSettings"],
  CMS_CACHE_OPTIONS
);

export async function updateSiteSettings(input: SiteSettings) {
  return writeWithProvider(
    () => remoteCms.updateSiteSettingsRemote(input),
    () => localCms.updateSiteSettings(input)
  );
}

export const getNavigationSettings = unstable_cache(
  () => readWithFallback(() => remoteCms.getNavigationSettingsRemote(), () => localCms.getNavigationSettings()),
  ["cms:getNavigationSettings"],
  CMS_CACHE_OPTIONS
);

export async function updateNavigationSettings(input: NavigationSettings) {
  return writeWithProvider(
    () => remoteCms.updateNavigationSettingsRemote(input),
    () => localCms.updateNavigationSettings(input)
  );
}

export const getFooterSettings = unstable_cache(
  () => readWithFallback(() => remoteCms.getFooterSettingsRemote(), () => localCms.getFooterSettings()),
  ["cms:getFooterSettings"],
  CMS_CACHE_OPTIONS
);

export async function updateFooterSettings(input: FooterSettings) {
  return writeWithProvider(
    () => remoteCms.updateFooterSettingsRemote(input),
    () => localCms.updateFooterSettings(input)
  );
}

// unstable_cache can't carry the generic through, so cache a non-generic version
// and re-expose the original generic signature via a thin typed wrapper.
const getPageContentCached = unstable_cache(
  (pageKey: PageKey) =>
    readWithFallback(() => remoteCms.getPageContentRemote(pageKey), () => localCms.getPageContent(pageKey)),
  ["cms:getPageContent"],
  CMS_CACHE_OPTIONS
);

export function getPageContent<TPageKey extends PageKey>(pageKey: TPageKey) {
  return getPageContentCached(pageKey) as unknown as Promise<PageRecord<TPageKey>>;
}

export async function updatePageContent<TPageKey extends PageKey>(input: PageRecord<TPageKey>) {
  return writeWithProvider(
    () => remoteCms.updatePageContentRemote(input),
    () => localCms.updatePageContent(input)
  );
}

export async function upsertContentTranslation(
  entityType: string,
  entityId: string | number,
  locale: "en",
  payload: TranslationPayload
) {
  return writeWithProvider(
    () => remoteCms.upsertContentTranslationRemote(entityType, entityId, locale, payload),
    () => localCms.upsertContentTranslation(entityType, entityId, locale, payload)
  );
}

export const getTransactionTypes = unstable_cache(
  (options?: { includeInactive?: boolean }) =>
    readWithFallback(() => remoteCms.getTransactionTypesRemote(options), () => localCms.getTransactionTypes(options)),
  ["cms:getTransactionTypes"],
  CMS_CACHE_OPTIONS
);

export const findTransactionType = unstable_cache(
  (value?: string | null) =>
    readWithFallback(() => remoteCms.findTransactionTypeRemote(value), () => localCms.findTransactionType(value)),
  ["cms:findTransactionType"],
  CMS_CACHE_OPTIONS
);

export async function upsertTransactionType(input: Omit<TransactionType, "id"> & { id?: number }) {
  return writeWithProvider(
    () => remoteCms.upsertTransactionTypeRemote(input),
    () => localCms.upsertTransactionType(input)
  );
}

export async function deleteTransactionType(id: number) {
  return writeWithProvider(
    () => remoteCms.deleteTransactionTypeRemote(id),
    () => localCms.deleteTransactionType(id)
  );
}

export const getPropertyTypes = unstable_cache(
  (options?: { includeInactive?: boolean }) =>
    readWithFallback(() => remoteCms.getPropertyTypesRemote(options), () => localCms.getPropertyTypes(options)),
  ["cms:getPropertyTypes"],
  CMS_CACHE_OPTIONS
);

export const findPropertyType = unstable_cache(
  (value?: string | string[] | null) => {
    const normalized = Array.isArray(value) ? value[0] : value;
    return readWithFallback(
      () => remoteCms.findPropertyTypeRemote(normalized),
      () => localCms.findPropertyType(normalized)
    );
  },
  ["cms:findPropertyType"],
  CMS_CACHE_OPTIONS
);

export async function upsertPropertyType(input: Omit<PropertyType, "id"> & { id?: number }) {
  return writeWithProvider(
    () => remoteCms.upsertPropertyTypeRemote(input),
    () => localCms.upsertPropertyType(input)
  );
}

export async function deletePropertyType(id: number) {
  return writeWithProvider(
    () => remoteCms.deletePropertyTypeRemote(id),
    () => localCms.deletePropertyType(id)
  );
}

export const getAgents = unstable_cache(
  (options?: { includeUnpublished?: boolean }) =>
    readWithFallback(() => remoteCms.getAgentsRemote(options), () => localCms.getAgents(options)),
  ["cms:getAgents"],
  CMS_CACHE_OPTIONS
);

export const getAgentById = unstable_cache(
  (id: number) => readWithFallback(() => remoteCms.getAgentByIdRemote(id), () => localCms.getAgentById(id)),
  ["cms:getAgentById"],
  CMS_CACHE_OPTIONS
);

export async function upsertAgent(
  input: Omit<Agent, "id" | "createdAt" | "updatedAt"> & { id?: number }
) {
  return writeWithProvider(
    () => remoteCms.upsertAgentRemote(input),
    () => localCms.upsertAgent(input)
  );
}

export async function deleteAgent(id: number) {
  return writeWithProvider(
    () => remoteCms.deleteAgentRemote(id),
    () => localCms.deleteAgent(id)
  );
}

export const getProperties = unstable_cache(
  (filters: PropertyFilters = {}, options?: { includeDrafts?: boolean }) =>
    readWithFallback(
      () => remoteCms.getPropertiesRemote(filters, options),
      () => localCms.getProperties(filters, options)
    ),
  ["cms:getProperties"],
  CMS_CACHE_OPTIONS
);

export const getPropertyBySlug = unstable_cache(
  (slug: string) => readWithFallback(() => remoteCms.getPropertyBySlugRemote(slug), () => localCms.getPropertyBySlug(slug)),
  ["cms:getPropertyBySlug"],
  CMS_CACHE_OPTIONS
);

export const getPropertyById = unstable_cache(
  (id: number) => readWithFallback(() => remoteCms.getPropertyByIdRemote(id), () => localCms.getPropertyById(id)),
  ["cms:getPropertyById"],
  CMS_CACHE_OPTIONS
);

export const getFeaturedProperties = unstable_cache(
  (limit = 6) => readWithFallback(() => remoteCms.getFeaturedPropertiesRemote(limit), () => localCms.getFeaturedProperties(limit)),
  ["cms:getFeaturedProperties"],
  CMS_CACHE_OPTIONS
);

export const getSimilarProperties = unstable_cache(
  (currentId: number, transactionTypeSlug: string, propertyTypeSlug: string, limit = 4) =>
    readWithFallback(
      () => remoteCms.getSimilarPropertiesRemote(currentId, transactionTypeSlug, propertyTypeSlug, limit),
      () => localCms.getSimilarProperties(currentId, transactionTypeSlug, propertyTypeSlug, limit)
    ),
  ["cms:getSimilarProperties"],
  CMS_CACHE_OPTIONS
);

export const getPropertyCities = unstable_cache(
  (filters?: Pick<PropertyFilters, "transactionSlug" | "propertyTypeSlug">) =>
    readWithFallback(() => remoteCms.getPropertyCitiesRemote(filters), () => localCms.getPropertyCities(filters)),
  ["cms:getPropertyCities"],
  CMS_CACHE_OPTIONS
);

// Count helpers return a Map, which is not safely serializable by unstable_cache,
// so they stay uncached. They are single COUNT aggregates and therefore cheap.
export async function getPropertyCountByType(transactionSlug?: string) {
  return readWithFallback(
    () => remoteCms.getPropertyCountByTypeRemote(transactionSlug),
    () => localCms.getPropertyCountByType(transactionSlug)
  );
}

export async function getPropertyCountsByTransaction() {
  return readWithFallback(
    () => remoteCms.getPropertyCountsByTransactionRemote(),
    () => localCms.getPropertyCountsByTransaction()
  );
}

export async function upsertProperty(
  input: Omit<
    Property,
    | "id"
    | "transactionType"
    | "propertyType"
    | "transactionTypeSlug"
    | "propertyTypeSlug"
    | "createdAt"
    | "updatedAt"
    | "agent"
  > & { id?: number }
) {
  return writeWithProvider(
    () => remoteCms.upsertPropertyRemote(input),
    () => localCms.upsertProperty(input)
  );
}

export async function deleteProperty(id: number) {
  return writeWithProvider(
    () => remoteCms.deletePropertyRemote(id),
    () => localCms.deleteProperty(id)
  );
}

export async function getMediaAssets() {
  return readWithFallback(
    () => remoteCms.getMediaAssetsRemote(),
    () => localCms.getMediaAssets()
  );
}

export async function createMediaAsset(input: Omit<MediaAsset, "id" | "createdAt">) {
  return writeWithProvider(
    () => remoteCms.createMediaAssetRemote(input),
    () => localCms.createMediaAsset(input)
  );
}

export async function updateMediaAsset(id: number, input: Pick<MediaAsset, "title" | "altText">) {
  return writeWithProvider(
    () => remoteCms.updateMediaAssetRemote(id, input),
    () => localCms.updateMediaAsset(id, input)
  );
}

export async function createInquiry(input: Omit<Inquiry, "id" | "createdAt">) {
  return writeWithProvider(
    () => remoteCms.createInquiryRemote(input),
    () => localCms.createInquiry(input)
  );
}

export async function getInquiries() {
  return readWithFallback(
    () => remoteCms.getInquiriesRemote(),
    () => localCms.getInquiries()
  );
}

export async function getDashboardStats() {
  return readWithFallback(
    () => remoteCms.getDashboardStatsRemote(),
    () => localCms.getDashboardStats()
  );
}
