import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
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
  var __mdkDatabase: DatabaseSync | undefined;
}

const DEFAULT_DATABASE_FILE = path.join(process.cwd(), "data", "cms.sqlite");

function now() {
  return new Date().toISOString();
}

function toJson(value: unknown) {
  return JSON.stringify(value ?? null);
}

export function getDatabaseFilePath() {
  const customPath = process.env.DATABASE_FILE;
  if (!customPath) {
    if (process.env.NETLIFY === "true") {
      return "/tmp/cms.sqlite";
    }

    return DEFAULT_DATABASE_FILE;
  }
  return path.isAbsolute(customPath)
    ? customPath
    : path.join(process.cwd(), customPath);
}

export function migrateDatabase(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      original_name TEXT NOT NULL,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      alt_text TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      photo_url TEXT,
      bio TEXT,
      whatsapp TEXT,
      is_published INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transaction_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      route_path TEXT NOT NULL,
      nav_label TEXT,
      price_suffix TEXT,
      show_in_navigation INTEGER NOT NULL DEFAULT 1,
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS property_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      transaction_type_id INTEGER NOT NULL REFERENCES transaction_types(id) ON DELETE RESTRICT,
      property_type_id INTEGER NOT NULL REFERENCES property_types(id) ON DELETE RESTRICT,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      featured INTEGER NOT NULL DEFAULT 0,
      city TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      full_address TEXT,
      price REAL NOT NULL,
      price_mode TEXT NOT NULL CHECK(price_mode IN ('sale', 'monthly', 'daily', 'custom')),
      price_suffix TEXT,
      short_description TEXT NOT NULL,
      long_description TEXT NOT NULL,
      bedrooms INTEGER,
      bathrooms INTEGER,
      area REAL,
      area_unit TEXT NOT NULL DEFAULT 'sqft',
      amenities_json TEXT NOT NULL DEFAULT '[]',
      gallery_json TEXT NOT NULL DEFAULT '[]',
      cover_image_url TEXT,
      video_url TEXT,
      virtual_tour_url TEXT,
      agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      seo_title TEXT,
      seo_description TEXT,
      og_image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      site_name TEXT NOT NULL,
      site_url TEXT NOT NULL,
      site_description TEXT NOT NULL,
      site_keywords_json TEXT NOT NULL DEFAULT '[]',
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
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS navigation_settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      logo_url TEXT NOT NULL,
      logo_alt TEXT NOT NULL,
      links_json TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS footer_settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      brand_text TEXT NOT NULL,
      quick_links_json TEXT NOT NULL DEFAULT '[]',
      property_links_json TEXT NOT NULL DEFAULT '[]',
      social_links_json TEXT NOT NULL DEFAULT '[]',
      legal_links_json TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_key TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      seo_title TEXT,
      seo_description TEXT,
      og_image_url TEXT,
      content_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
      property_title TEXT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      source_page TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

function seedDatabase(db: DatabaseSync) {
  const pageCount = db
    .prepare("SELECT COUNT(*) as count FROM page_contents")
    .get() as { count: number };

  if (pageCount.count > 0) {
    return;
  }

  const timestamp = now();

  db.exec("BEGIN");

  try {
    db.prepare(
      `
        INSERT INTO site_settings (
          id, site_name, site_url, site_description, site_keywords_json, default_og_image,
          logo_url, logo_alt, contact_email, contact_phone, whatsapp_number, company_address,
          currency_code, currency_locale, copyright_text, default_seo_title,
          default_seo_description, updated_at
        ) VALUES (
          1, @siteName, @siteUrl, @siteDescription, @siteKeywords, @defaultOgImage,
          @logoUrl, @logoAlt, @contactEmail, @contactPhone, @whatsappNumber, @companyAddress,
          @currencyCode, @currencyLocale, @copyrightText, @defaultSeoTitle,
          @defaultSeoDescription, @updatedAt
        )
      `
    ).run({
      siteName: seedSiteSettings.siteName,
      siteUrl: seedSiteSettings.siteUrl,
      siteDescription: seedSiteSettings.siteDescription,
      siteKeywords: toJson(seedSiteSettings.siteKeywords),
      defaultOgImage: seedSiteSettings.defaultOgImage,
      logoUrl: seedSiteSettings.logoUrl,
      logoAlt: seedSiteSettings.logoAlt,
      contactEmail: seedSiteSettings.contactEmail,
      contactPhone: seedSiteSettings.contactPhone,
      whatsappNumber: seedSiteSettings.whatsappNumber,
      companyAddress: seedSiteSettings.companyAddress,
      currencyCode: seedSiteSettings.currencyCode,
      currencyLocale: seedSiteSettings.currencyLocale,
      copyrightText: seedSiteSettings.copyrightText,
      defaultSeoTitle: seedSiteSettings.defaultSeoTitle,
      defaultSeoDescription: seedSiteSettings.defaultSeoDescription,
      updatedAt: timestamp,
    });

    db.prepare(
      `
        INSERT INTO navigation_settings (id, logo_url, logo_alt, links_json, updated_at)
        VALUES (1, @logoUrl, @logoAlt, @links, @updatedAt)
      `
    ).run({
      logoUrl: seedNavigation.logoUrl,
      logoAlt: seedNavigation.logoAlt,
      links: toJson(seedNavigation.links),
      updatedAt: timestamp,
    });

    db.prepare(
      `
        INSERT INTO footer_settings (
          id, brand_text, quick_links_json, property_links_json, social_links_json, legal_links_json, updated_at
        ) VALUES (
          1, @brandText, @quickLinks, @propertyLinks, @socialLinks, @legalLinks, @updatedAt
        )
      `
    ).run({
      brandText: seedFooter.brandText,
      quickLinks: toJson(seedFooter.quickLinks),
      propertyLinks: toJson(seedFooter.propertyLinks),
      socialLinks: toJson(seedFooter.socialLinks),
      legalLinks: toJson(seedFooter.legalLinks),
      updatedAt: timestamp,
    });

    const insertTransactionType = db.prepare(
      `
        INSERT INTO transaction_types (
          label, slug, description, image_url, is_active, sort_order, route_path,
          nav_label, price_suffix, show_in_navigation, seo_title, seo_description,
          created_at, updated_at
        ) VALUES (
          @label, @slug, @description, @imageUrl, @isActive, @sortOrder, @routePath,
          @navLabel, @priceSuffix, @showInNavigation, @seoTitle, @seoDescription,
          @createdAt, @updatedAt
        )
      `
    );

    seedTransactionTypes.forEach((item) => {
      insertTransactionType.run({
        label: item.label,
        slug: item.slug,
        description: item.description ?? null,
        imageUrl: item.imageUrl ?? null,
        isActive: item.isActive ? 1 : 0,
        sortOrder: item.sortOrder,
        routePath: item.routePath,
        navLabel: item.navLabel ?? null,
        priceSuffix: item.priceSuffix ?? null,
        showInNavigation: item.showInNavigation ? 1 : 0,
        seoTitle: null,
        seoDescription: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    });

    const insertPropertyType = db.prepare(
      `
        INSERT INTO property_types (
          label, slug, description, image_url, is_active, sort_order, seo_title, seo_description, created_at, updated_at
        ) VALUES (
          @label, @slug, @description, @imageUrl, @isActive, @sortOrder, @seoTitle, @seoDescription, @createdAt, @updatedAt
        )
      `
    );

    seedPropertyTypes.forEach((item) => {
      insertPropertyType.run({
        label: item.label,
        slug: item.slug,
        description: item.description ?? null,
        imageUrl: item.imageUrl ?? null,
        isActive: item.isActive ? 1 : 0,
        sortOrder: item.sortOrder,
        seoTitle: null,
        seoDescription: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    });

    const insertAgent = db.prepare(
      `
        INSERT INTO agents (
          name, slug, role, phone, email, photo_url, bio, whatsapp, is_published,
          sort_order, seo_title, seo_description, created_at, updated_at
        ) VALUES (
          @name, @slug, @role, @phone, @email, @photoUrl, @bio, @whatsapp, @isPublished,
          @sortOrder, @seoTitle, @seoDescription, @createdAt, @updatedAt
        )
      `
    );

    seedAgents.forEach((agent) => {
      insertAgent.run({
        name: agent.name,
        slug: agent.slug,
        role: agent.role,
        phone: agent.phone,
        email: agent.email,
        photoUrl: agent.photoUrl ?? null,
        bio: agent.bio ?? null,
        whatsapp: agent.whatsapp ?? null,
        isPublished: agent.isPublished ? 1 : 0,
        sortOrder: agent.sortOrder,
        seoTitle: agent.seoTitle ?? null,
        seoDescription: agent.seoDescription ?? null,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    });

    const transactionMap = new Map<string, number>();
    (
      db.prepare("SELECT id, slug FROM transaction_types").all() as Array<{
        id: number;
        slug: string;
      }>
    ).forEach((row) => {
      transactionMap.set(row.slug, row.id);
    });

    const propertyTypeMap = new Map<string, number>();
    (
      db.prepare("SELECT id, slug FROM property_types").all() as Array<{
        id: number;
        slug: string;
      }>
    ).forEach((row) => {
      propertyTypeMap.set(row.slug, row.id);
    });

    const agentMap = new Map<string, number>();
    (
      db.prepare("SELECT id, email FROM agents").all() as Array<{ id: number; email: string }>
    ).forEach((row) => {
      agentMap.set(row.email, row.id);
    });

    const insertProperty = db.prepare(
      `
        INSERT INTO properties (
          title, slug, transaction_type_id, property_type_id, status, featured, city,
          neighborhood, full_address, price, price_mode, price_suffix, short_description,
          long_description, bedrooms, bathrooms, area, area_unit, amenities_json, gallery_json,
          cover_image_url, video_url, virtual_tour_url, agent_id, seo_title, seo_description,
          og_image_url, sort_order, published_at, created_at, updated_at
        ) VALUES (
          @title, @slug, @transactionTypeId, @propertyTypeId, @status, @featured, @city,
          @neighborhood, @fullAddress, @price, @priceMode, @priceSuffix, @shortDescription,
          @longDescription, @bedrooms, @bathrooms, @area, @areaUnit, @amenitiesJson, @galleryJson,
          @coverImageUrl, @videoUrl, @virtualTourUrl, @agentId, @seoTitle, @seoDescription,
          @ogImageUrl, @sortOrder, @publishedAt, @createdAt, @updatedAt
        )
      `
    );

    seedProperties.forEach((property) => {
      const transactionTypeId = transactionMap.get(property.transactionSlug);
      const propertyTypeId = propertyTypeMap.get(property.propertyTypeSlug);

      if (!transactionTypeId || !propertyTypeId) {
        throw new Error(`Missing taxonomy for seed property ${property.slug}`);
      }

      insertProperty.run({
        title: property.title,
        slug: property.slug,
        transactionTypeId,
        propertyTypeId,
        status: property.status,
        featured: property.featured ? 1 : 0,
        city: property.city,
        neighborhood: property.neighborhood,
        fullAddress: property.fullAddress ?? null,
        price: property.price,
        priceMode: property.priceMode,
        priceSuffix: property.priceSuffix ?? null,
        shortDescription: property.shortDescription,
        longDescription: property.longDescription,
        bedrooms: property.bedrooms ?? null,
        bathrooms: property.bathrooms ?? null,
        area: property.area ?? null,
        areaUnit: property.areaUnit,
        amenitiesJson: toJson(property.features),
        galleryJson: toJson(property.images),
        coverImageUrl: property.coverImage ?? property.images[0] ?? null,
        videoUrl: property.video ?? null,
        virtualTourUrl: property.virtualTourUrl ?? null,
        agentId: property.agentEmail ? agentMap.get(property.agentEmail) ?? null : null,
        seoTitle: property.seoTitle ?? null,
        seoDescription: property.seoDescription ?? null,
        ogImageUrl: property.ogImage ?? property.coverImage ?? property.images[0] ?? null,
        sortOrder: property.sortOrder,
        publishedAt: property.status === "published" ? timestamp : null,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    });

    const insertPage = db.prepare(
      `
        INSERT INTO page_contents (
          page_key, title, seo_title, seo_description, og_image_url, content_json, updated_at
        ) VALUES (
          @pageKey, @title, @seoTitle, @seoDescription, @ogImageUrl, @contentJson, @updatedAt
        )
      `
    );

    (["home", "buy", "rent", "daily-rent", "about", "contact"] as const).forEach(
      (pageKey) => {
        const page = getSeedPage(pageKey);
        insertPage.run({
          pageKey,
          title:
            pageKey === "home"
              ? "Homepage"
              : pageKey === "daily-rent"
                ? "Daily rent"
                : pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
          seoTitle: seedSiteSettings.defaultSeoTitle,
          seoDescription: seedSiteSettings.defaultSeoDescription,
          ogImageUrl: "hero" in page ? page.hero.backgroundImage : seedSiteSettings.defaultOgImage,
          contentJson: toJson(page),
          updatedAt: timestamp,
        });
      }
    );

    const insertMediaAsset = db.prepare(
      `
        INSERT OR IGNORE INTO media_assets (
          title, original_name, filename, mime_type, url, alt_text, created_at
        ) VALUES (
          @title, @originalName, @filename, @mimeType, @url, @altText, @createdAt
        )
      `
    );

    getSeedMediaUrls().forEach((url) => {
      const originalName = url.split("/").pop() || "asset";
      insertMediaAsset.run({
        title: originalName,
        originalName,
        filename: originalName,
        mimeType: "image/jpeg",
        url,
        altText: null,
        createdAt: timestamp,
      });
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getDb() {
  if (globalThis.__mdkDatabase) {
    return globalThis.__mdkDatabase;
  }

  const databaseFile = getDatabaseFilePath();
  fs.mkdirSync(path.dirname(databaseFile), { recursive: true });

  const db = new DatabaseSync(databaseFile);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");

  migrateDatabase(db);
  seedDatabase(db);

  globalThis.__mdkDatabase = db;
  return db;
}
