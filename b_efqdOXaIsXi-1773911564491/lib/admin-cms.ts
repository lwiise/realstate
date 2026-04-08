import type {
  PageKey,
  PropertyFilters,
} from "@/lib/cms-types";
import * as localCms from "@/lib/cms-local";
import * as remoteCms from "@/lib/cms-remote";
import { isRemoteDatabaseConfigured } from "@/lib/remote-db";

function useRemoteCms() {
  return isRemoteDatabaseConfigured();
}

function readWithProvider<T>(
  remoteReader: () => Promise<T>,
  localReader: () => T | Promise<T>
) {
  if (useRemoteCms()) {
    return remoteReader();
  }

  return Promise.resolve(localReader());
}

export async function getSiteSettings() {
  return readWithProvider(
    () => remoteCms.getSiteSettingsRemote(),
    () => localCms.getSiteSettings()
  );
}

export async function getNavigationSettings() {
  return readWithProvider(
    () => remoteCms.getNavigationSettingsRemote(),
    () => localCms.getNavigationSettings()
  );
}

export async function getFooterSettings() {
  return readWithProvider(
    () => remoteCms.getFooterSettingsRemote(),
    () => localCms.getFooterSettings()
  );
}

export async function getPageContent<TPageKey extends PageKey>(pageKey: TPageKey) {
  return readWithProvider(
    () => remoteCms.getPageContentRemote(pageKey),
    () => localCms.getPageContent(pageKey)
  );
}

export async function getTransactionTypes(options?: { includeInactive?: boolean }) {
  return readWithProvider(
    () => remoteCms.getTransactionTypesRemote(options),
    () => localCms.getTransactionTypes(options)
  );
}

export async function getPropertyTypes(options?: { includeInactive?: boolean }) {
  return readWithProvider(
    () => remoteCms.getPropertyTypesRemote(options),
    () => localCms.getPropertyTypes(options)
  );
}

export async function getAgents(options?: { includeUnpublished?: boolean }) {
  return readWithProvider(
    () => remoteCms.getAgentsRemote(options),
    () => localCms.getAgents(options)
  );
}

export async function getAgentById(id: number) {
  return readWithProvider(
    () => remoteCms.getAgentByIdRemote(id),
    () => localCms.getAgentById(id)
  );
}

export async function getProperties(
  filters: PropertyFilters = {},
  options?: { includeDrafts?: boolean }
) {
  return readWithProvider(
    () => remoteCms.getPropertiesRemote(filters, options),
    () => localCms.getProperties(filters, options)
  );
}

export async function getPropertyById(id: number) {
  return readWithProvider(
    () => remoteCms.getPropertyByIdRemote(id),
    () => localCms.getPropertyById(id)
  );
}

export async function getMediaAssets() {
  return readWithProvider(
    () => remoteCms.getMediaAssetsRemote(),
    () => localCms.getMediaAssets()
  );
}

export async function getInquiries() {
  return readWithProvider(
    () => remoteCms.getInquiriesRemote(),
    () => localCms.getInquiries()
  );
}

export async function getDashboardStats() {
  return readWithProvider(
    () => remoteCms.getDashboardStatsRemote(),
    () => localCms.getDashboardStats()
  );
}
