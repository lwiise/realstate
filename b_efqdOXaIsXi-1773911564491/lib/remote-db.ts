import { Pool, type QueryResultRow } from "pg";
import {
  getSeedMediaUrls,
  getSeedPage,
  seedAgents,
  seedFooter,
  seedNavigation,
  seedProperties,
  seedPropertyTypes,
  seedSiteSettings,
  seedTransactionTypes,
} from "@/lib/seed-data";

declare global {
  // eslint-disable-next-line no-var
  var __cmsRemotePool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __cmsRemoteInitPromise: Promise<void> | undefined;
}

function now() {
  return new Date().toISOString();
}

function toJson(value: unknown) {
  return JSON.stringify(value ?? null);
}

export function isRemoteDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getRemoteDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is required for remote CMS storage.");
  }

  return url;
}

export function getRemotePool() {
  if (globalThis.__cmsRemotePool) {
    return globalThis.__cmsRemotePool;
  }

  const connectionString = getRemoteDatabaseUrl();
  const isLocalhost = /localhost|127\.0\.0\.1/.test(connectionString);

  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  });

  globalThis.__cmsRemotePool = pool;
  return pool;
}

const REMOTE_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media_assets (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    original_name TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    alt_text TEXT,
    created_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    bio TEXT,
    whatsapp TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transaction_types (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    route_path TEXT NOT NULL,
    nav_label TEXT,
    price_suffix TEXT,
    show_in_navigation BOOLEAN NOT NULL DEFAULT TRUE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS property_types (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    transaction_type_id INTEGER NOT NULL REFERENCES transaction_types(id) ON DELETE RESTRICT,
    property_type_id INTEGER NOT NULL REFERENCES property_types(id) ON DELETE RESTRICT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    city TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    full_address TEXT,
    price DOUBLE PRECISION NOT NULL,
    price_mode TEXT NOT NULL CHECK (price_mode IN ('sale', 'monthly', 'daily', 'custom')),
    price_suffix TEXT,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area DOUBLE PRECISION,
    area_unit TEXT NOT NULL DEFAULT 'sqft',
    amenities_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    gallery_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    cover_image_url TEXT,
    video_url TEXT,
    virtual_tour_url TEXT,
    agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
    seo_title TEXT,
    seo_description TEXT,
    og_image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    site_name TEXT NOT NULL,
    site_url TEXT NOT NULL,
    site_description TEXT NOT NULL,
    site_keywords_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    default_og_image TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    logo_alt TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    company_address TEXT NOT NULL,
    currency_code TEXT NOT NULL DEFAULT 'USD',
    currency_locale TEXT NOT NULL DEFAULT 'en-US',
    copyright_text TEXT NOT NULL,
    default_seo_title TEXT NOT NULL,
    default_seo_description TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS navigation_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    logo_url TEXT NOT NULL,
    logo_alt TEXT NOT NULL,
    links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS footer_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    brand_text TEXT NOT NULL,
    quick_links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    property_links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    social_links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    legal_links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS page_contents (
    id SERIAL PRIMARY KEY,
    page_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    og_image_url TEXT,
    content_json JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    property_title TEXT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    source_page TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
  );
`;

async function migrateRemoteDatabase() {
  const pool = getRemotePool();
  await pool.query(REMOTE_SCHEMA_SQL);
}

async function seedRemoteDatabase() {
  const pool = getRemotePool();
  const pageCountResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text as count FROM page_contents"
  );

  if (Number(pageCountResult.rows[0]?.count ?? 0) > 0) {
    return;
  }

  const client = await pool.connect();
  const timestamp = now();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        INSERT INTO site_settings (
          id, site_name, site_url, site_description, site_keywords_json, default_og_image,
          logo_url, logo_alt, contact_email, contact_phone, whatsapp_number, company_address,
          currency_code, currency_locale, copyright_text, default_seo_title,
          default_seo_description, updated_at
        ) VALUES (
          1, $1, $2, $3, $4::jsonb, $5,
          $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17
        )
      `,
      [
        seedSiteSettings.siteName,
        seedSiteSettings.siteUrl,
        seedSiteSettings.siteDescription,
        toJson(seedSiteSettings.siteKeywords),
        seedSiteSettings.defaultOgImage,
        seedSiteSettings.logoUrl,
        seedSiteSettings.logoAlt,
        seedSiteSettings.contactEmail,
        seedSiteSettings.contactPhone,
        seedSiteSettings.whatsappNumber,
        seedSiteSettings.companyAddress,
        seedSiteSettings.currencyCode,
        seedSiteSettings.currencyLocale,
        seedSiteSettings.copyrightText,
        seedSiteSettings.defaultSeoTitle,
        seedSiteSettings.defaultSeoDescription,
        timestamp,
      ]
    );

    await client.query(
      `
        INSERT INTO navigation_settings (id, logo_url, logo_alt, links_json, updated_at)
        VALUES (1, $1, $2, $3::jsonb, $4)
      `,
      [
        seedNavigation.logoUrl,
        seedNavigation.logoAlt,
        toJson(seedNavigation.links),
        timestamp,
      ]
    );

    await client.query(
      `
        INSERT INTO footer_settings (
          id, brand_text, quick_links_json, property_links_json, social_links_json, legal_links_json, updated_at
        ) VALUES (
          1, $1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb, $6
        )
      `,
      [
        seedFooter.brandText,
        toJson(seedFooter.quickLinks),
        toJson(seedFooter.propertyLinks),
        toJson(seedFooter.socialLinks),
        toJson(seedFooter.legalLinks),
        timestamp,
      ]
    );

    for (const item of seedTransactionTypes) {
      await client.query(
        `
          INSERT INTO transaction_types (
            label, slug, description, image_url, is_active, sort_order, route_path,
            nav_label, price_suffix, show_in_navigation, seo_title, seo_description,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12,
            $13, $14
          )
        `,
        [
          item.label,
          item.slug,
          item.description ?? null,
          item.imageUrl ?? null,
          item.isActive,
          item.sortOrder,
          item.routePath,
          item.navLabel ?? null,
          item.priceSuffix ?? null,
          item.showInNavigation,
          null,
          null,
          timestamp,
          timestamp,
        ]
      );
    }

    for (const item of seedPropertyTypes) {
      await client.query(
        `
          INSERT INTO property_types (
            label, slug, description, image_url, is_active, sort_order, seo_title, seo_description, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          )
        `,
        [
          item.label,
          item.slug,
          item.description ?? null,
          item.imageUrl ?? null,
          item.isActive,
          item.sortOrder,
          null,
          null,
          timestamp,
          timestamp,
        ]
      );
    }

    for (const agent of seedAgents) {
      await client.query(
        `
          INSERT INTO agents (
            name, slug, role, phone, email, photo_url, bio, whatsapp, is_published,
            sort_order, seo_title, seo_description, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14
          )
        `,
        [
          agent.name,
          agent.slug,
          agent.role,
          agent.phone,
          agent.email,
          agent.photoUrl ?? null,
          agent.bio ?? null,
          agent.whatsapp ?? null,
          agent.isPublished,
          agent.sortOrder,
          agent.seoTitle ?? null,
          agent.seoDescription ?? null,
          timestamp,
          timestamp,
        ]
      );
    }

    const transactionRows = await client.query<{ id: number; slug: string }>(
      "SELECT id, slug FROM transaction_types"
    );
    const transactionMap = new Map(transactionRows.rows.map((row) => [row.slug, row.id]));

    const propertyTypeRows = await client.query<{ id: number; slug: string }>(
      "SELECT id, slug FROM property_types"
    );
    const propertyTypeMap = new Map(propertyTypeRows.rows.map((row) => [row.slug, row.id]));

    const agentRows = await client.query<{ id: number; email: string }>("SELECT id, email FROM agents");
    const agentMap = new Map(agentRows.rows.map((row) => [row.email, row.id]));

    for (const property of seedProperties) {
      const transactionTypeId = transactionMap.get(property.transactionSlug);
      const propertyTypeId = propertyTypeMap.get(property.propertyTypeSlug);

      if (!transactionTypeId || !propertyTypeId) {
        throw new Error(`Missing taxonomy for seed property ${property.slug}`);
      }

      await client.query(
        `
          INSERT INTO properties (
            title, slug, transaction_type_id, property_type_id, status, featured, city,
            neighborhood, full_address, price, price_mode, price_suffix, short_description,
            long_description, bedrooms, bathrooms, area, area_unit, amenities_json, gallery_json,
            cover_image_url, video_url, virtual_tour_url, agent_id, seo_title, seo_description,
            og_image_url, sort_order, published_at, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13,
            $14, $15, $16, $17, $18, $19::jsonb, $20::jsonb,
            $21, $22, $23, $24, $25, $26,
            $27, $28, $29, $30, $31
          )
        `,
        [
          property.title,
          property.slug,
          transactionTypeId,
          propertyTypeId,
          property.status,
          property.featured,
          property.city,
          property.neighborhood,
          property.fullAddress ?? null,
          property.price,
          property.priceMode,
          property.priceSuffix ?? null,
          property.shortDescription,
          property.longDescription,
          property.bedrooms ?? null,
          property.bathrooms ?? null,
          property.area ?? null,
          property.areaUnit,
          toJson(property.features),
          toJson(property.images),
          property.coverImage ?? property.images[0] ?? null,
          property.video ?? null,
          property.virtualTourUrl ?? null,
          property.agentEmail ? agentMap.get(property.agentEmail) ?? null : null,
          property.seoTitle ?? null,
          property.seoDescription ?? null,
          property.ogImage ?? property.coverImage ?? property.images[0] ?? null,
          property.sortOrder,
          property.status === "published" ? timestamp : null,
          timestamp,
          timestamp,
        ]
      );
    }

    for (const pageKey of ["home", "buy", "rent", "daily-rent", "about", "contact"] as const) {
      const page = getSeedPage(pageKey);
      await client.query(
        `
          INSERT INTO page_contents (
            page_key, title, seo_title, seo_description, og_image_url, content_json, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6::jsonb, $7
          )
        `,
        [
          pageKey,
          pageKey === "home"
            ? "Homepage"
            : pageKey === "daily-rent"
              ? "Daily rent"
              : pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
          seedSiteSettings.defaultSeoTitle,
          seedSiteSettings.defaultSeoDescription,
          "hero" in page ? page.hero.backgroundImage : seedSiteSettings.defaultOgImage,
          toJson(page),
          timestamp,
        ]
      );
    }

    for (const url of getSeedMediaUrls()) {
      const originalName = url.split("/").pop() || "asset";
      await client.query(
        `
          INSERT INTO media_assets (
            title, original_name, filename, mime_type, url, alt_text, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7
          )
          ON CONFLICT (url) DO NOTHING
        `,
        [originalName, originalName, originalName, "image/jpeg", url, null, timestamp]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function ensureRemoteCms() {
  if (!isRemoteDatabaseConfigured()) {
    return;
  }

  if (!globalThis.__cmsRemoteInitPromise) {
    globalThis.__cmsRemoteInitPromise = (async () => {
      await migrateRemoteDatabase();
      await seedRemoteDatabase();
    })();
  }

  await globalThis.__cmsRemoteInitPromise;
}

export async function queryRemoteRows<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: unknown[]
) {
  await ensureRemoteCms();
  const pool = getRemotePool();
  const result = await pool.query<T>(text, values);
  return result.rows;
}

export async function queryRemoteRow<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: unknown[]
) {
  const rows = await queryRemoteRows<T>(text, values);
  return rows[0];
}

export async function executeRemote(text: string, values?: unknown[]) {
  await ensureRemoteCms();
  const pool = getRemotePool();
  return pool.query(text, values);
}
