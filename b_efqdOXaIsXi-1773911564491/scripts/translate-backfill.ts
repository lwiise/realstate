// Backfill English translations for all existing French content.
//
// Usage:  pnpm translate:backfill
// Requires the Gemini key in the environment: google_api=... (and DATABASE_URL if
// translating the production Postgres database). Without google_api, entities are
// only flagged "needs_translation" (no English is generated).
//
// Idempotent & safe to re-run: entities already translated with an unchanged French
// source are skipped. Run it again any time after adding/importing old content.

import { getDb, migrateDatabase } from "../lib/db";
import { ensureRemoteCms, isRemoteDatabaseConfigured } from "../lib/remote-db";
import {
  getAgents,
  getFooterSettings,
  getNavigationSettings,
  getPageContent,
  getProperties,
  getPropertyTypes,
  getSiteSettings,
  getTransactionTypes,
} from "../lib/admin-cms";
import { syncEntityTranslation, type TranslatableEntityType } from "../lib/translation-service";
import { isGeminiConfigured } from "../lib/gemini-translate";
import type { PageKey } from "../lib/cms-types";

const PAGE_KEYS: PageKey[] = ["home", "buy", "rent", "daily-rent", "about", "contact"];
const DELAY_MS = 300; // gentle pacing between Gemini calls

const counts: Record<string, number> = {
  translated: 0,
  skipped: 0,
  needs_translation: 0,
  failed: 0,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run(
  entityType: TranslatableEntityType,
  entityId: string | number,
  entity: unknown,
  label: string
) {
  if (!entity) return;
  const result = await syncEntityTranslation(entityType, entityId, entity as Record<string, unknown>);
  const key = result.skipped ? "skipped" : result.status;
  counts[key] = (counts[key] ?? 0) + 1;
  console.log(`  [${key}] ${entityType} · ${label}`);
  if (!result.skipped) await sleep(DELAY_MS);
}

async function main() {
  // Ensure the schema (incl. source_hash/status columns) exists before reading meta.
  if (isRemoteDatabaseConfigured()) {
    await ensureRemoteCms();
    console.log("Using remote (PostgreSQL) database.");
  } else {
    migrateDatabase(getDb());
    console.log("Using local (SQLite) database.");
  }

  if (!isGeminiConfigured()) {
    console.warn(
      "\n⚠  google_api is not set — content will be flagged 'needs_translation' and NO English will be generated.\n"
    );
  }

  console.log("\nBackfilling French → English translations...\n");

  await run("site-settings", "1", await getSiteSettings(), "site settings");
  await run("navigation-settings", "1", await getNavigationSettings(), "navigation");
  await run("footer-settings", "1", await getFooterSettings(), "footer");

  for (const key of PAGE_KEYS) {
    await run("page-content", key, await getPageContent(key), key);
  }

  for (const type of await getTransactionTypes({ includeInactive: true })) {
    await run("transaction-type", type.id, type, type.slug);
  }
  for (const type of await getPropertyTypes({ includeInactive: true })) {
    await run("property-type", type.id, type, type.slug);
  }
  for (const agent of await getAgents({ includeUnpublished: true })) {
    await run("agent", agent.id, agent, agent.slug ?? String(agent.id));
  }
  for (const property of await getProperties({}, { includeDrafts: true })) {
    await run("property", property.id, property, property.slug);
  }

  console.log(
    `\nDone. translated=${counts.translated} · skipped=${counts.skipped} · needs_translation=${counts.needs_translation} · failed=${counts.failed}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
