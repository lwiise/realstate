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
} from "@/lib/cms-types";
import * as localCms from "@/lib/cms-local";
import * as remoteCms from "@/lib/cms-remote";
import { isRemoteDatabaseConfigured } from "@/lib/remote-db";

let remoteReadWarningShown = false;

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

export async function getSiteSettings() {
  return readWithFallback(
    () => remoteCms.getSiteSettingsRemote(),
    () => localCms.getSiteSettings()
  );
}

export async function updateSiteSettings(input: SiteSettings) {
  return writeWithProvider(
    () => remoteCms.updateSiteSettingsRemote(input),
    () => localCms.updateSiteSettings(input)
  );
}

export async function getNavigationSettings() {
  return readWithFallback(
    () => remoteCms.getNavigationSettingsRemote(),
    () => localCms.getNavigationSettings()
  );
}

export async function updateNavigationSettings(input: NavigationSettings) {
  return writeWithProvider(
    () => remoteCms.updateNavigationSettingsRemote(input),
    () => localCms.updateNavigationSettings(input)
  );
}

export async function getFooterSettings() {
  return readWithFallback(
    () => remoteCms.getFooterSettingsRemote(),
    () => localCms.getFooterSettings()
  );
}

export async function updateFooterSettings(input: FooterSettings) {
  return writeWithProvider(
    () => remoteCms.updateFooterSettingsRemote(input),
    () => localCms.updateFooterSettings(input)
  );
}

export async function getPageContent<TPageKey extends PageKey>(pageKey: TPageKey) {
  return readWithFallback(
    () => remoteCms.getPageContentRemote(pageKey),
    () => localCms.getPageContent(pageKey)
  );
}

export async function updatePageContent<TPageKey extends PageKey>(input: PageRecord<TPageKey>) {
  return writeWithProvider(
    () => remoteCms.updatePageContentRemote(input),
    () => localCms.updatePageContent(input)
  );
}

export async function getTransactionTypes(options?: { includeInactive?: boolean }) {
  return readWithFallback(
    () => remoteCms.getTransactionTypesRemote(options),
    () => localCms.getTransactionTypes(options)
  );
}

export async function findTransactionType(value?: string | null) {
  return readWithFallback(
    () => remoteCms.findTransactionTypeRemote(value),
    () => localCms.findTransactionType(value)
  );
}

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

export async function getPropertyTypes(options?: { includeInactive?: boolean }) {
  return readWithFallback(
    () => remoteCms.getPropertyTypesRemote(options),
    () => localCms.getPropertyTypes(options)
  );
}

export async function findPropertyType(value?: string | string[] | null) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return readWithFallback(
    () => remoteCms.findPropertyTypeRemote(normalized),
    () => localCms.findPropertyType(normalized)
  );
}

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

export async function getAgents(options?: { includeUnpublished?: boolean }) {
  return readWithFallback(
    () => remoteCms.getAgentsRemote(options),
    () => localCms.getAgents(options)
  );
}

export async function getAgentById(id: number) {
  return readWithFallback(
    () => remoteCms.getAgentByIdRemote(id),
    () => localCms.getAgentById(id)
  );
}

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

export async function getProperties(filters: PropertyFilters = {}, options?: { includeDrafts?: boolean }) {
  return readWithFallback(
    () => remoteCms.getPropertiesRemote(filters, options),
    () => localCms.getProperties(filters, options)
  );
}

export async function getPropertyBySlug(slug: string) {
  return readWithFallback(
    () => remoteCms.getPropertyBySlugRemote(slug),
    () => localCms.getPropertyBySlug(slug)
  );
}

export async function getPropertyById(id: number) {
  return readWithFallback(
    () => remoteCms.getPropertyByIdRemote(id),
    () => localCms.getPropertyById(id)
  );
}

export async function getFeaturedProperties(limit = 6) {
  return readWithFallback(
    () => remoteCms.getFeaturedPropertiesRemote(limit),
    () => localCms.getFeaturedProperties(limit)
  );
}

export async function getSimilarProperties(
  currentId: number,
  transactionTypeSlug: string,
  propertyTypeSlug: string,
  limit = 4
) {
  return readWithFallback(
    () => remoteCms.getSimilarPropertiesRemote(currentId, transactionTypeSlug, propertyTypeSlug, limit),
    () => localCms.getSimilarProperties(currentId, transactionTypeSlug, propertyTypeSlug, limit)
  );
}

export async function getPropertyCities(
  filters?: Pick<PropertyFilters, "transactionSlug" | "propertyTypeSlug">
) {
  return readWithFallback(
    () => remoteCms.getPropertyCitiesRemote(filters),
    () => localCms.getPropertyCities(filters)
  );
}

export async function getPropertyCountByType(transactionSlug?: string) {
  return readWithFallback(
    () => remoteCms.getPropertyCountByTypeRemote(transactionSlug),
    () => localCms.getPropertyCountByType(transactionSlug)
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
