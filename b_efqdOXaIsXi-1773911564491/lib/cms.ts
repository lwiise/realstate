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

function useRemoteCms() {
  return isRemoteDatabaseConfigured();
}

export async function getSiteSettings() {
  return useRemoteCms() ? remoteCms.getSiteSettingsRemote() : localCms.getSiteSettings();
}

export async function updateSiteSettings(input: SiteSettings) {
  return useRemoteCms()
    ? remoteCms.updateSiteSettingsRemote(input)
    : localCms.updateSiteSettings(input);
}

export async function getNavigationSettings() {
  return useRemoteCms()
    ? remoteCms.getNavigationSettingsRemote()
    : localCms.getNavigationSettings();
}

export async function updateNavigationSettings(input: NavigationSettings) {
  return useRemoteCms()
    ? remoteCms.updateNavigationSettingsRemote(input)
    : localCms.updateNavigationSettings(input);
}

export async function getFooterSettings() {
  return useRemoteCms() ? remoteCms.getFooterSettingsRemote() : localCms.getFooterSettings();
}

export async function updateFooterSettings(input: FooterSettings) {
  return useRemoteCms()
    ? remoteCms.updateFooterSettingsRemote(input)
    : localCms.updateFooterSettings(input);
}

export async function getPageContent<TPageKey extends PageKey>(pageKey: TPageKey) {
  return useRemoteCms()
    ? remoteCms.getPageContentRemote(pageKey)
    : localCms.getPageContent(pageKey);
}

export async function updatePageContent<TPageKey extends PageKey>(input: PageRecord<TPageKey>) {
  return useRemoteCms()
    ? remoteCms.updatePageContentRemote(input)
    : localCms.updatePageContent(input);
}

export async function getTransactionTypes(options?: { includeInactive?: boolean }) {
  return useRemoteCms()
    ? remoteCms.getTransactionTypesRemote(options)
    : localCms.getTransactionTypes(options);
}

export async function findTransactionType(value?: string | null) {
  return useRemoteCms()
    ? remoteCms.findTransactionTypeRemote(value)
    : localCms.findTransactionType(value);
}

export async function upsertTransactionType(input: Omit<TransactionType, "id"> & { id?: number }) {
  return useRemoteCms()
    ? remoteCms.upsertTransactionTypeRemote(input)
    : localCms.upsertTransactionType(input);
}

export async function deleteTransactionType(id: number) {
  return useRemoteCms()
    ? remoteCms.deleteTransactionTypeRemote(id)
    : localCms.deleteTransactionType(id);
}

export async function getPropertyTypes(options?: { includeInactive?: boolean }) {
  return useRemoteCms()
    ? remoteCms.getPropertyTypesRemote(options)
    : localCms.getPropertyTypes(options);
}

export async function findPropertyType(value?: string | string[] | null) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return useRemoteCms()
    ? remoteCms.findPropertyTypeRemote(normalized)
    : localCms.findPropertyType(normalized);
}

export async function upsertPropertyType(input: Omit<PropertyType, "id"> & { id?: number }) {
  return useRemoteCms()
    ? remoteCms.upsertPropertyTypeRemote(input)
    : localCms.upsertPropertyType(input);
}

export async function deletePropertyType(id: number) {
  return useRemoteCms()
    ? remoteCms.deletePropertyTypeRemote(id)
    : localCms.deletePropertyType(id);
}

export async function getAgents(options?: { includeUnpublished?: boolean }) {
  return useRemoteCms() ? remoteCms.getAgentsRemote(options) : localCms.getAgents(options);
}

export async function getAgentById(id: number) {
  return useRemoteCms() ? remoteCms.getAgentByIdRemote(id) : localCms.getAgentById(id);
}

export async function upsertAgent(
  input: Omit<Agent, "id" | "createdAt" | "updatedAt"> & { id?: number }
) {
  return useRemoteCms() ? remoteCms.upsertAgentRemote(input) : localCms.upsertAgent(input);
}

export async function deleteAgent(id: number) {
  return useRemoteCms() ? remoteCms.deleteAgentRemote(id) : localCms.deleteAgent(id);
}

export async function getProperties(filters: PropertyFilters = {}, options?: { includeDrafts?: boolean }) {
  return useRemoteCms()
    ? remoteCms.getPropertiesRemote(filters, options)
    : localCms.getProperties(filters, options);
}

export async function getPropertyBySlug(slug: string) {
  return useRemoteCms()
    ? remoteCms.getPropertyBySlugRemote(slug)
    : localCms.getPropertyBySlug(slug);
}

export async function getPropertyById(id: number) {
  return useRemoteCms() ? remoteCms.getPropertyByIdRemote(id) : localCms.getPropertyById(id);
}

export async function getFeaturedProperties(limit = 6) {
  return useRemoteCms()
    ? remoteCms.getFeaturedPropertiesRemote(limit)
    : localCms.getFeaturedProperties(limit);
}

export async function getSimilarProperties(
  currentId: number,
  transactionTypeSlug: string,
  propertyTypeSlug: string,
  limit = 4
) {
  return useRemoteCms()
    ? remoteCms.getSimilarPropertiesRemote(currentId, transactionTypeSlug, propertyTypeSlug, limit)
    : localCms.getSimilarProperties(currentId, transactionTypeSlug, propertyTypeSlug, limit);
}

export async function getPropertyCities(
  filters?: Pick<PropertyFilters, "transactionSlug" | "propertyTypeSlug">
) {
  return useRemoteCms()
    ? remoteCms.getPropertyCitiesRemote(filters)
    : localCms.getPropertyCities(filters);
}

export async function getPropertyCountByType(transactionSlug?: string) {
  return useRemoteCms()
    ? remoteCms.getPropertyCountByTypeRemote(transactionSlug)
    : localCms.getPropertyCountByType(transactionSlug);
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
  return useRemoteCms() ? remoteCms.upsertPropertyRemote(input) : localCms.upsertProperty(input);
}

export async function deleteProperty(id: number) {
  return useRemoteCms() ? remoteCms.deletePropertyRemote(id) : localCms.deleteProperty(id);
}

export async function getMediaAssets() {
  return useRemoteCms() ? remoteCms.getMediaAssetsRemote() : localCms.getMediaAssets();
}

export async function createMediaAsset(input: Omit<MediaAsset, "id" | "createdAt">) {
  return useRemoteCms()
    ? remoteCms.createMediaAssetRemote(input)
    : localCms.createMediaAsset(input);
}

export async function updateMediaAsset(id: number, input: Pick<MediaAsset, "title" | "altText">) {
  return useRemoteCms()
    ? remoteCms.updateMediaAssetRemote(id, input)
    : localCms.updateMediaAsset(id, input);
}

export async function createInquiry(input: Omit<Inquiry, "id" | "createdAt">) {
  return useRemoteCms() ? remoteCms.createInquiryRemote(input) : localCms.createInquiry(input);
}

export async function getInquiries() {
  return useRemoteCms() ? remoteCms.getInquiriesRemote() : localCms.getInquiries();
}

export async function getDashboardStats() {
  return useRemoteCms()
    ? remoteCms.getDashboardStatsRemote()
    : localCms.getDashboardStats();
}
