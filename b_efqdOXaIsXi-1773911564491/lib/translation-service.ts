// =============================================================================
// Translation orchestrator — the ONE place that decides what/when to translate.
// SERVER-ONLY (imports the DB layer + Gemini client). Reused by:
//   - admin save actions (app/admin/actions.ts)
//   - the "Re-translate" admin button (retranslateEntityAction)
//   - the backfill CLI (scripts/translate-backfill.ts)
//
// Flow per entity: build the French source payload (only translatable fields) ->
// hash it -> if unchanged & already translated, skip -> otherwise call Gemini,
// merge the result back over the French source (URLs/slugs/IDs always kept from
// French), and store it with status + hash. Never throws: on any failure the
// French content is left intact and the row is flagged for a later retry.
// =============================================================================

import { createHash } from "node:crypto";
import type { PageKey, TranslationMeta, TranslationPayload, TranslationStatus } from "@/lib/cms-types";
import { skipKeys } from "@/lib/auto-translate";
import { isGeminiConfigured, translateJsonFrToEn } from "@/lib/gemini-translate";
import * as localCms from "@/lib/cms-local";
import * as remoteCms from "@/lib/cms-remote";
import * as adminCms from "@/lib/admin-cms";
import { isRemoteDatabaseConfigured } from "@/lib/remote-db";

// Translation reads/writes go straight to the active DB provider (no unstable_cache
// layer), so this module also works in the standalone backfill script (outside Next.js).
function readTranslationMeta(entityType: string, entityId: string | number): Promise<TranslationMeta> {
  return isRemoteDatabaseConfigured()
    ? remoteCms.getTranslationMetaRemote(entityType, entityId)
    : Promise.resolve(localCms.getTranslationMeta(entityType, entityId));
}

async function writeTranslation(
  entityType: string,
  entityId: string | number,
  payload: TranslationPayload,
  meta: { sourceHash?: string | null; status?: TranslationStatus | null }
) {
  if (isRemoteDatabaseConfigured()) {
    await remoteCms.upsertContentTranslationRemote(entityType, entityId, "en", payload, meta);
  } else {
    localCms.upsertContentTranslation(entityType, entityId, "en", payload, meta);
  }
}

export type TranslatableEntityType =
  | "property"
  | "agent"
  | "transaction-type"
  | "property-type"
  | "page-content"
  | "site-settings"
  | "navigation-settings"
  | "footer-settings";

/**
 * Extracts the translatable fields of an entity in the exact shape the read path
 * (lib/i18n-content.ts) expects from `translationEn`. French values, untranslated.
 */
function buildSourcePayload(
  entityType: TranslatableEntityType,
  entity: Record<string, unknown>
): TranslationPayload {
  switch (entityType) {
    case "property":
      return {
        title: entity.title,
        neighborhood: entity.neighborhood,
        fullAddress: entity.fullAddress,
        shortDescription: entity.shortDescription,
        longDescription: entity.longDescription,
        features: entity.features,
        seoTitle: entity.seoTitle,
        seoDescription: entity.seoDescription,
      };
    case "agent":
      return {
        role: entity.role,
        bio: entity.bio,
        seoTitle: entity.seoTitle,
        seoDescription: entity.seoDescription,
      };
    case "transaction-type":
      return {
        label: entity.label,
        description: entity.description,
        navLabel: entity.navLabel,
        priceSuffix: entity.priceSuffix,
      };
    case "property-type":
      return { label: entity.label, description: entity.description };
    case "site-settings":
      return {
        siteDescription: entity.siteDescription,
        siteKeywords: entity.siteKeywords,
        copyrightText: entity.copyrightText,
        defaultSeoTitle: entity.defaultSeoTitle,
        defaultSeoDescription: entity.defaultSeoDescription,
      };
    case "navigation-settings":
      return { logoAlt: entity.logoAlt, links: entity.links };
    case "footer-settings":
      return {
        brandText: entity.brandText,
        quickLinks: entity.quickLinks,
        propertyLinks: entity.propertyLinks,
        legalLinks: entity.legalLinks,
      };
    case "page-content":
      return {
        title: entity.title,
        seoTitle: entity.seoTitle,
        seoDescription: entity.seoDescription,
        content: entity.content,
      };
  }
}

/** Deterministic hash of the French source, used to detect real content changes. */
function computeSourceHash(payload: TranslationPayload): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

/**
 * Strips everything that must never be translated (skipKeys values, and all
 * non-string scalars) so only translatable text is sent to Gemini.
 */
function toSendable(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    return skipKeys.has(key ?? "") ? undefined : value;
  }
  if (Array.isArray(value)) {
    if (skipKeys.has(key ?? "")) return undefined;
    return value.map((item) => toSendable(item, key));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
      const sendable = toSendable(childValue, childKey);
      if (sendable !== undefined) out[childKey] = sendable;
    }
    return out;
  }
  return undefined; // numbers, booleans, null — not translatable
}

/**
 * Merges Gemini's English over the French source. English text wins for normal
 * string fields; everything else (skipKeys, numbers, booleans, missing values)
 * comes from the French source — so URLs, slugs, emails, phones and IDs are
 * guaranteed to be exactly the originals.
 */
function mergeTranslated(source: unknown, translated: unknown, key?: string): unknown {
  if (typeof source === "string") {
    if (skipKeys.has(key ?? "")) return source;
    return typeof translated === "string" && translated.trim().length > 0 ? translated : source;
  }
  if (Array.isArray(source)) {
    if (skipKeys.has(key ?? "")) return source;
    const translatedArray = Array.isArray(translated) ? translated : [];
    return source.map((item, index) => mergeTranslated(item, translatedArray[index], key));
  }
  if (source && typeof source === "object") {
    const translatedObject =
      translated && typeof translated === "object" && !Array.isArray(translated)
        ? (translated as Record<string, unknown>)
        : {};
    const out: Record<string, unknown> = {};
    for (const [childKey, childValue] of Object.entries(source as Record<string, unknown>)) {
      out[childKey] = mergeTranslated(childValue, translatedObject[childKey], childKey);
    }
    return out;
  }
  return source; // numbers, booleans, null
}

async function safeUpsert(
  entityType: TranslatableEntityType,
  entityId: string | number,
  payload: TranslationPayload,
  meta: { sourceHash: string; status: TranslationStatus }
) {
  try {
    await writeTranslation(entityType, entityId, payload, meta);
  } catch (error) {
    console.error(`[translation] Failed to store translation meta for ${entityType}#${entityId}:`, error);
  }
}

export interface SyncResult {
  status: TranslationStatus;
  skipped: boolean;
}

/**
 * Generate + store the English translation for one entity. Idempotent and safe to
 * call repeatedly — skips when the French source is unchanged and already translated
 * (unless `force` is set). NEVER throws.
 */
export async function syncEntityTranslation(
  entityType: TranslatableEntityType,
  entityId: string | number,
  entity: Record<string, unknown>,
  options?: { force?: boolean }
): Promise<SyncResult> {
  try {
    const source = buildSourcePayload(entityType, entity);
    const sourceHash = computeSourceHash(source);

    const existing = await readTranslationMeta(entityType, entityId).catch(() => null);

    if (!options?.force && existing?.status === "translated" && existing.sourceHash === sourceHash) {
      return { status: "translated", skipped: true };
    }

    // No API key (e.g. local dev / not configured): keep any prior English, flag for retry.
    if (!isGeminiConfigured()) {
      await safeUpsert(entityType, entityId, existing?.payload ?? {}, {
        sourceHash,
        status: "needs_translation",
      });
      return { status: "needs_translation", skipped: false };
    }

    const sendable = toSendable(source) as Record<string, unknown>;
    const translated = await translateJsonFrToEn(sendable);
    const merged = mergeTranslated(source, translated) as TranslationPayload;
    await writeTranslation(entityType, entityId, merged, {
      sourceHash,
      status: "translated",
    });
    return { status: "translated", skipped: false };
  } catch (error) {
    console.error(
      `[translation] Gemini translation failed for ${entityType}#${entityId}:`,
      error instanceof Error ? error.message : error
    );
    // Preserve any previously-stored English; just flag it so a retry can pick it up.
    try {
      const existing = await readTranslationMeta(entityType, entityId).catch(() => null);
      const source = buildSourcePayload(entityType, entity);
      await safeUpsert(entityType, entityId, existing?.payload ?? {}, {
        sourceHash: computeSourceHash(source),
        status: "failed",
      });
    } catch {
      // ignore — never throw out of the translation step
    }
    return { status: "failed", skipped: false };
  }
}

// ---- Bulk helpers: used by the admin "Translate everything" tool ------------

const ALL_PAGE_KEYS: PageKey[] = ["home", "buy", "rent", "daily-rent", "about", "contact"];

export interface TranslatableEntityRef {
  entityType: TranslatableEntityType;
  entityId: string | number;
  entity: Record<string, unknown>;
  label: string;
}

/** Enumerates every translatable entity (including drafts / unpublished / inactive). */
export async function listTranslatableEntities(): Promise<TranslatableEntityRef[]> {
  const refs: TranslatableEntityRef[] = [];
  const [site, navigation, footer] = await Promise.all([
    adminCms.getSiteSettings(),
    adminCms.getNavigationSettings(),
    adminCms.getFooterSettings(),
  ]);
  refs.push({ entityType: "site-settings", entityId: "1", entity: site as unknown as Record<string, unknown>, label: "Paramètres du site" });
  refs.push({ entityType: "navigation-settings", entityId: "1", entity: navigation as unknown as Record<string, unknown>, label: "Navigation" });
  refs.push({ entityType: "footer-settings", entityId: "1", entity: footer as unknown as Record<string, unknown>, label: "Pied de page" });

  for (const key of ALL_PAGE_KEYS) {
    const page = await adminCms.getPageContent(key);
    refs.push({ entityType: "page-content", entityId: key, entity: page as unknown as Record<string, unknown>, label: `Page : ${key}` });
  }
  for (const type of await adminCms.getTransactionTypes({ includeInactive: true })) {
    refs.push({ entityType: "transaction-type", entityId: type.id, entity: type as unknown as Record<string, unknown>, label: `Transaction : ${type.label}` });
  }
  for (const type of await adminCms.getPropertyTypes({ includeInactive: true })) {
    refs.push({ entityType: "property-type", entityId: type.id, entity: type as unknown as Record<string, unknown>, label: `Type : ${type.label}` });
  }
  for (const agent of await adminCms.getAgents({ includeUnpublished: true })) {
    refs.push({ entityType: "agent", entityId: agent.id, entity: agent as unknown as Record<string, unknown>, label: `Agent : ${agent.name}` });
  }
  for (const property of await adminCms.getProperties({}, { includeDrafts: true })) {
    refs.push({ entityType: "property", entityId: property.id, entity: property as unknown as Record<string, unknown>, label: `Bien : ${property.title}` });
  }
  return refs;
}

export interface TranslationOverview {
  total: number;
  translated: number;
  pending: number;
  failed: number;
  geminiConfigured: boolean;
}

/** Read-only status summary for the admin Translations page. */
export async function getTranslationOverview(): Promise<TranslationOverview> {
  const entities = await listTranslatableEntities();
  let translated = 0;
  let pending = 0;
  let failed = 0;
  await Promise.all(
    entities.map(async (ref) => {
      const meta = await readTranslationMeta(ref.entityType, ref.entityId).catch(() => null);
      if (meta?.status === "translated") translated += 1;
      else if (meta?.status === "failed") failed += 1;
      else pending += 1;
    })
  );
  return { total: entities.length, translated, pending, failed, geminiConfigured: isGeminiConfigured() };
}

export interface TranslateBatchResult {
  geminiConfigured: boolean;
  translatedNow: number;
  failed: number;
  remaining: number;
}

/**
 * Translates up to `limit` not-yet-translated entities in parallel. Kept small so a
 * single request stays within serverless time limits — call repeatedly until remaining === 0.
 */
export async function translatePendingBatch(limit = 6): Promise<TranslateBatchResult> {
  if (!isGeminiConfigured()) {
    return { geminiConfigured: false, translatedNow: 0, failed: 0, remaining: 0 };
  }

  const entities = await listTranslatableEntities();
  const statuses = await Promise.all(
    entities.map(async (ref) => {
      const meta = await readTranslationMeta(ref.entityType, ref.entityId).catch(() => null);
      return { ref, translated: meta?.status === "translated" };
    })
  );
  const pending = statuses.filter((entry) => !entry.translated).map((entry) => entry.ref);
  const batch = pending.slice(0, limit);

  let translatedNow = 0;
  let failed = 0;
  await Promise.all(
    batch.map(async (ref) => {
      const result = await syncEntityTranslation(ref.entityType, ref.entityId, ref.entity, { force: true });
      if (result.status === "translated") translatedNow += 1;
      else failed += 1;
    })
  );

  return {
    geminiConfigured: true,
    translatedNow,
    failed,
    remaining: Math.max(0, pending.length - translatedNow),
  };
}
