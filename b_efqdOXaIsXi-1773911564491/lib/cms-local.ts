import type {
  Agent,
  FooterSettings,
  Inquiry,
  MediaAsset,
  NavigationSettings,
  PageContentMap,
  PageKey,
  PageRecord,
  PriceMode,
  Property,
  PropertyFilters,
  PropertyType,
  SiteSettings,
  TransactionType,
} from "@/lib/cms-types";
import { getDb } from "@/lib/db";
import { getSeedPage, seedFooter, seedNavigation, seedSiteSettings } from "@/lib/seed-data";
import { getSlugLookupCandidates, getTitleLookupCandidates } from "@/lib/slug";

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapBoolean(value: number | boolean | null | undefined) {
  return Boolean(value);
}

function derivePriceModeFromTransaction(value: {
  slug?: string | null;
  label?: string | null;
}): PriceMode {
  const normalized = `${value.slug ?? ""} ${value.label ?? ""}`.toLowerCase();

  if (normalized.includes("daily") || normalized.includes("journal")) {
    return "daily";
  }

  if (normalized.includes("rent") || normalized.includes("louer") || normalized.includes("location")) {
    return "monthly";
  }

  return "sale";
}

function mapAgent(row: Record<string, unknown>): Agent {
  return {
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    role: String(row.role),
    phone: String(row.phone),
    email: String(row.email),
    photoUrl: (row.photo_url as string | null) ?? null,
    bio: (row.bio as string | null) ?? null,
    whatsapp: (row.whatsapp as string | null) ?? null,
    isPublished: mapBoolean(row.is_published as number),
    sortOrder: Number(row.sort_order ?? 0),
    seoTitle: (row.seo_title as string | null) ?? null,
    seoDescription: (row.seo_description as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapTransactionType(row: Record<string, unknown>): TransactionType {
  return {
    id: Number(row.id),
    label: String(row.label),
    slug: String(row.slug),
    description: (row.description as string | null) ?? null,
    imageUrl: (row.image_url as string | null) ?? null,
    isActive: mapBoolean(row.is_active as number),
    sortOrder: Number(row.sort_order ?? 0),
    routePath: String(row.route_path),
    navLabel: (row.nav_label as string | null) ?? null,
    priceSuffix: (row.price_suffix as string | null) ?? null,
    showInNavigation: mapBoolean(row.show_in_navigation as number),
  };
}

function mapPropertyType(row: Record<string, unknown>): PropertyType {
  return {
    id: Number(row.id),
    label: String(row.label),
    slug: String(row.slug),
    description: (row.description as string | null) ?? null,
    imageUrl: (row.image_url as string | null) ?? null,
    isActive: mapBoolean(row.is_active as number),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

type PropertyRow = Record<string, unknown> & {
  agent_ref_id?: number | null;
};

function mapProperty(row: PropertyRow): Property {
  const agent =
    row.agent_ref_id == null
      ? null
      : {
          id: Number(row.agent_ref_id),
          name: String(row.agent_name),
          slug: String(row.agent_slug),
          role: String(row.agent_role),
          phone: String(row.agent_phone),
          email: String(row.agent_email),
          photoUrl: (row.agent_photo_url as string | null) ?? null,
          bio: (row.agent_bio as string | null) ?? null,
          whatsapp: (row.agent_whatsapp as string | null) ?? null,
          isPublished: mapBoolean(row.agent_is_published as number),
          sortOrder: Number(row.agent_sort_order ?? 0),
          seoTitle: (row.agent_seo_title as string | null) ?? null,
          seoDescription: (row.agent_seo_description as string | null) ?? null,
          createdAt: String(row.agent_created_at),
          updatedAt: String(row.agent_updated_at),
        };

  return {
    id: Number(row.id),
    title: String(row.title),
    slug: String(row.slug),
    transactionTypeId: Number(row.transaction_type_id),
    transactionType: String(row.transaction_label),
    transactionTypeSlug: String(row.transaction_slug),
    propertyTypeId: Number(row.property_type_id),
    propertyType: String(row.property_label),
    propertyTypeSlug: String(row.property_slug),
    status: String(row.status) as Property["status"],
    featured: mapBoolean(row.featured as number),
    city: String(row.city),
    neighborhood: String(row.neighborhood),
    fullAddress: (row.full_address as string | null) ?? null,
    price: Number(row.price),
    priceMode: derivePriceModeFromTransaction({
      slug: row.transaction_slug as string | null,
      label: row.transaction_label as string | null,
    }),
    priceSuffix: (row.transaction_price_suffix as string | null) ?? null,
    shortDescription: String(row.short_description),
    longDescription: String(row.long_description),
    bedrooms: row.bedrooms == null ? null : Number(row.bedrooms),
    bathrooms: row.bathrooms == null ? null : Number(row.bathrooms),
    area: row.area == null ? null : Number(row.area),
    areaUnit: String(row.area_unit ?? "sqft"),
    features: parseJson<string[]>(row.amenities_json as string, []),
    images: parseJson<string[]>(row.gallery_json as string, []),
    coverImage: (row.cover_image_url as string | null) ?? null,
    video: (row.video_url as string | null) ?? null,
    virtualTourUrl: null,
    agentId: row.agent_id == null ? null : Number(row.agent_id),
    agent,
    seoTitle: (row.seo_title as string | null) ?? null,
    seoDescription: (row.seo_description as string | null) ?? null,
    ogImage: (row.og_image_url as string | null) ?? null,
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    publishedAt: (row.published_at as string | null) ?? null,
  };
}

function propertySelectSql() {
  return `
    SELECT
      properties.*,
      transaction_types.label as transaction_label,
      transaction_types.slug as transaction_slug,
      transaction_types.price_suffix as transaction_price_suffix,
      property_types.label as property_label,
      property_types.slug as property_slug,
      agents.id as agent_ref_id,
      agents.name as agent_name,
      agents.slug as agent_slug,
      agents.role as agent_role,
      agents.phone as agent_phone,
      agents.email as agent_email,
      agents.photo_url as agent_photo_url,
      agents.bio as agent_bio,
      agents.whatsapp as agent_whatsapp,
      agents.is_published as agent_is_published,
      agents.sort_order as agent_sort_order,
      agents.seo_title as agent_seo_title,
      agents.seo_description as agent_seo_description,
      agents.created_at as agent_created_at,
      agents.updated_at as agent_updated_at
    FROM properties
    INNER JOIN transaction_types ON transaction_types.id = properties.transaction_type_id
    INNER JOIN property_types ON property_types.id = properties.property_type_id
    LEFT JOIN agents ON agents.id = properties.agent_id
  `;
}

export function getSiteSettings(): SiteSettings {
  const db = getDb();
  const row = db.prepare("SELECT * FROM site_settings WHERE id = 1").get() as Record<string, unknown> | undefined;

  if (!row) {
    return seedSiteSettings;
  }

  return {
    siteName: String(row.site_name),
    siteUrl: String(row.site_url),
    siteDescription: String(row.site_description),
    siteKeywords: parseJson<string[]>(row.site_keywords_json as string, []),
    defaultOgImage: String(row.default_og_image),
    logoUrl: String(row.logo_url),
    logoAlt: String(row.logo_alt),
    contactEmail: String(row.contact_email),
    contactPhone: String(row.contact_phone),
    whatsappNumber: String(row.whatsapp_number),
    companyAddress: String(row.company_address),
    currencyCode: String(row.currency_code),
    currencyLocale: String(row.currency_locale),
    copyrightText: String(row.copyright_text),
    defaultSeoTitle: String(row.default_seo_title),
    defaultSeoDescription: String(row.default_seo_description),
  };
}

export function updateSiteSettings(input: SiteSettings) {
  const db = getDb();
  db.prepare(
    `
      UPDATE site_settings
      SET
        site_name = @siteName,
        site_url = @siteUrl,
        site_description = @siteDescription,
        site_keywords_json = @siteKeywords,
        default_og_image = @defaultOgImage,
        logo_url = @logoUrl,
        logo_alt = @logoAlt,
        contact_email = @contactEmail,
        contact_phone = @contactPhone,
        whatsapp_number = @whatsappNumber,
        company_address = @companyAddress,
        currency_code = @currencyCode,
        currency_locale = @currencyLocale,
        copyright_text = @copyrightText,
        default_seo_title = @defaultSeoTitle,
        default_seo_description = @defaultSeoDescription,
        updated_at = @updatedAt
      WHERE id = 1
    `
  ).run({
    ...input,
    siteKeywords: JSON.stringify(input.siteKeywords),
    updatedAt: new Date().toISOString(),
  });
}

export function getNavigationSettings(): NavigationSettings {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM navigation_settings WHERE id = 1")
    .get() as Record<string, unknown> | undefined;

  if (!row) {
    return seedNavigation;
  }

  return {
    logoUrl: String(row.logo_url),
    logoAlt: String(row.logo_alt),
    links: parseJson<NavigationSettings["links"]>(row.links_json as string, []),
  };
}

export function updateNavigationSettings(input: NavigationSettings) {
  const db = getDb();
  db.prepare(
    `
      UPDATE navigation_settings
      SET logo_url = ?, logo_alt = ?, links_json = ?, updated_at = ?
      WHERE id = 1
    `
  ).run(
    input.logoUrl,
    input.logoAlt,
    JSON.stringify(input.links),
    new Date().toISOString()
  );
}

export function getFooterSettings(): FooterSettings {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM footer_settings WHERE id = 1")
    .get() as Record<string, unknown> | undefined;

  if (!row) {
    return seedFooter;
  }

  return {
    brandText: String(row.brand_text),
    quickLinks: parseJson<FooterSettings["quickLinks"]>(row.quick_links_json as string, []),
    propertyLinks: parseJson<FooterSettings["propertyLinks"]>(row.property_links_json as string, []),
    socialLinks: parseJson<FooterSettings["socialLinks"]>(row.social_links_json as string, []),
    legalLinks: parseJson<FooterSettings["legalLinks"]>(row.legal_links_json as string, []),
  };
}

export function updateFooterSettings(input: FooterSettings) {
  const db = getDb();
  db.prepare(
    `
      UPDATE footer_settings
      SET
        brand_text = @brandText,
        quick_links_json = @quickLinks,
        property_links_json = @propertyLinks,
        social_links_json = @socialLinks,
        legal_links_json = @legalLinks,
        updated_at = @updatedAt
      WHERE id = 1
    `
  ).run({
    brandText: input.brandText,
    quickLinks: JSON.stringify(input.quickLinks),
    propertyLinks: JSON.stringify(input.propertyLinks),
    socialLinks: JSON.stringify(input.socialLinks),
    legalLinks: JSON.stringify(input.legalLinks),
    updatedAt: new Date().toISOString(),
  });
}

export function getPageContent<TPageKey extends PageKey>(pageKey: TPageKey): PageRecord<TPageKey> {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM page_contents WHERE page_key = ?")
    .get(pageKey) as Record<string, unknown> | undefined;

  if (!row) {
    return {
      pageKey,
      title: pageKey,
      seoTitle: seedSiteSettings.defaultSeoTitle,
      seoDescription: seedSiteSettings.defaultSeoDescription,
      ogImageUrl: seedSiteSettings.defaultOgImage,
      content: getSeedPage(pageKey),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    pageKey,
    title: String(row.title),
    seoTitle: (row.seo_title as string | null) ?? null,
    seoDescription: (row.seo_description as string | null) ?? null,
    ogImageUrl: (row.og_image_url as string | null) ?? null,
    content: parseJson<PageContentMap[TPageKey]>(row.content_json as string, getSeedPage(pageKey)),
    updatedAt: String(row.updated_at),
  };
}

export function updatePageContent<TPageKey extends PageKey>(input: PageRecord<TPageKey>) {
  const db = getDb();
  db.prepare(
    `
      UPDATE page_contents
      SET title = ?, seo_title = ?, seo_description = ?, og_image_url = ?, content_json = ?, updated_at = ?
      WHERE page_key = ?
    `
  ).run(
    input.title,
    input.seoTitle ?? null,
    input.seoDescription ?? null,
    input.ogImageUrl ?? null,
    JSON.stringify(input.content),
    new Date().toISOString(),
    input.pageKey
  );
}

export function getTransactionTypes(options?: { includeInactive?: boolean }) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT * FROM transaction_types
        ${options?.includeInactive ? "" : "WHERE is_active = 1"}
        ORDER BY sort_order ASC, label ASC
      `
    )
    .all() as Array<Record<string, unknown>>;

  return rows.map(mapTransactionType);
}

export function findTransactionType(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return getTransactionTypes({ includeInactive: true }).find((item) => {
    return (
      item.slug.toLowerCase() === normalized ||
      item.label.toLowerCase() === normalized ||
      item.routePath.replace("/", "").toLowerCase() === normalized
    );
  });
}

export function upsertTransactionType(input: Omit<TransactionType, "id"> & { id?: number }) {
  const db = getDb();
  const payload = {
    label: input.label,
    slug: input.slug,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    isActive: input.isActive ? 1 : 0,
    sortOrder: input.sortOrder,
    routePath: input.routePath,
    navLabel: input.navLabel ?? null,
    priceSuffix: input.priceSuffix ?? null,
    showInNavigation: input.showInNavigation ? 1 : 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (input.id) {
    db.prepare(
      `
        UPDATE transaction_types
        SET
          label = @label,
          slug = @slug,
          description = @description,
          image_url = @imageUrl,
          is_active = @isActive,
          sort_order = @sortOrder,
          route_path = @routePath,
          nav_label = @navLabel,
          price_suffix = @priceSuffix,
          show_in_navigation = @showInNavigation,
          updated_at = @updatedAt
        WHERE id = @id
      `
    ).run({ ...payload, id: input.id });
    return input.id;
  }

  const result = db.prepare(
    `
      INSERT INTO transaction_types (
        label, slug, description, image_url, is_active, sort_order, route_path,
        nav_label, price_suffix, show_in_navigation, created_at, updated_at
      ) VALUES (
        @label, @slug, @description, @imageUrl, @isActive, @sortOrder, @routePath,
        @navLabel, @priceSuffix, @showInNavigation, @createdAt, @updatedAt
      )
    `
  ).run(payload);

  return Number(result.lastInsertRowid);
}

export function deleteTransactionType(id: number) {
  const db = getDb();
  const usage = db
    .prepare("SELECT COUNT(*) as count FROM properties WHERE transaction_type_id = ?")
    .get(id) as { count: number };
  if (usage.count > 0) {
    throw new Error("This transaction type is still used by one or more properties.");
  }
  db.prepare("DELETE FROM transaction_types WHERE id = ?").run(id);
}

export function getPropertyTypes(options?: { includeInactive?: boolean }) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT * FROM property_types
        ${options?.includeInactive ? "" : "WHERE is_active = 1"}
        ORDER BY sort_order ASC, label ASC
      `
    )
    .all() as Array<Record<string, unknown>>;

  return rows.map(mapPropertyType);
}

export function findPropertyType(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return getPropertyTypes({ includeInactive: true }).find((item) => {
    return item.slug.toLowerCase() === normalized || item.label.toLowerCase() === normalized;
  });
}

export function upsertPropertyType(input: Omit<PropertyType, "id"> & { id?: number }) {
  const db = getDb();
  const payload = {
    label: input.label,
    slug: input.slug,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    isActive: input.isActive ? 1 : 0,
    sortOrder: input.sortOrder,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (input.id) {
    db.prepare(
      `
        UPDATE property_types
        SET
          label = @label,
          slug = @slug,
          description = @description,
          image_url = @imageUrl,
          is_active = @isActive,
          sort_order = @sortOrder,
          updated_at = @updatedAt
        WHERE id = @id
      `
    ).run({ ...payload, id: input.id });
    return input.id;
  }

  const result = db.prepare(
    `
      INSERT INTO property_types (
        label, slug, description, image_url, is_active, sort_order, created_at, updated_at
      ) VALUES (
        @label, @slug, @description, @imageUrl, @isActive, @sortOrder, @createdAt, @updatedAt
      )
    `
  ).run(payload);

  return Number(result.lastInsertRowid);
}

export function deletePropertyType(id: number) {
  const db = getDb();
  const usage = db
    .prepare("SELECT COUNT(*) as count FROM properties WHERE property_type_id = ?")
    .get(id) as { count: number };
  if (usage.count > 0) {
    throw new Error("This property type is still used by one or more properties.");
  }
  db.prepare("DELETE FROM property_types WHERE id = ?").run(id);
}

export function getAgents(options?: { includeUnpublished?: boolean }) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT * FROM agents
        ${options?.includeUnpublished ? "" : "WHERE is_published = 1"}
        ORDER BY sort_order ASC, name ASC
      `
    )
    .all() as Array<Record<string, unknown>>;
  return rows.map(mapAgent);
}

export function getAgentById(id: number) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? mapAgent(row) : undefined;
}

export function upsertAgent(input: Omit<Agent, "id" | "createdAt" | "updatedAt"> & { id?: number }) {
  const db = getDb();
  const payload = {
    name: input.name,
    slug: input.slug,
    role: input.role,
    phone: input.phone,
    email: input.email,
    photoUrl: input.photoUrl ?? null,
    bio: input.bio ?? null,
    whatsapp: input.whatsapp ?? null,
    isPublished: input.isPublished ? 1 : 0,
    sortOrder: input.sortOrder,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (input.id) {
    db.prepare(
      `
        UPDATE agents
        SET
          name = @name,
          slug = @slug,
          role = @role,
          phone = @phone,
          email = @email,
          photo_url = @photoUrl,
          bio = @bio,
          whatsapp = @whatsapp,
          is_published = @isPublished,
          sort_order = @sortOrder,
          seo_title = @seoTitle,
          seo_description = @seoDescription,
          updated_at = @updatedAt
        WHERE id = @id
      `
    ).run({ ...payload, id: input.id });
    return input.id;
  }

  const result = db.prepare(
    `
      INSERT INTO agents (
        name, slug, role, phone, email, photo_url, bio, whatsapp, is_published,
        sort_order, seo_title, seo_description, created_at, updated_at
      ) VALUES (
        @name, @slug, @role, @phone, @email, @photoUrl, @bio, @whatsapp, @isPublished,
        @sortOrder, @seoTitle, @seoDescription, @createdAt, @updatedAt
      )
    `
  ).run(payload);

  return Number(result.lastInsertRowid);
}

export function deleteAgent(id: number) {
  const db = getDb();
  db.prepare("UPDATE properties SET agent_id = NULL WHERE agent_id = ?").run(id);
  db.prepare("DELETE FROM agents WHERE id = ?").run(id);
}

function buildPropertyWhere(filters: PropertyFilters, includeDrafts = false) {
  const where: string[] = [];
  const params: Record<string, unknown> = {};

  if (!includeDrafts) {
    where.push("properties.status = 'published'");
  } else if (filters.status) {
    where.push("properties.status = @status");
    params.status = filters.status;
  }

  if (filters.transactionSlug) {
    where.push("transaction_types.slug = @transactionSlug");
    params.transactionSlug = filters.transactionSlug;
  }

  if (filters.propertyTypeSlug) {
    where.push("property_types.slug = @propertyTypeSlug");
    params.propertyTypeSlug = filters.propertyTypeSlug;
  }

  if (filters.city) {
    where.push("LOWER(properties.city) = LOWER(@city)");
    params.city = filters.city;
  }

  if (filters.keyword) {
    where.push(
      "(LOWER(properties.title) LIKE LOWER(@keyword) OR LOWER(properties.short_description) LIKE LOWER(@keyword) OR LOWER(properties.long_description) LIKE LOWER(@keyword) OR LOWER(properties.neighborhood) LIKE LOWER(@keyword))"
    );
    params.keyword = `%${filters.keyword}%`;
  }

  if (filters.minPrice != null) {
    where.push("properties.price >= @minPrice");
    params.minPrice = filters.minPrice;
  }

  if (filters.maxPrice != null) {
    where.push("properties.price <= @maxPrice");
    params.maxPrice = filters.maxPrice;
  }

  if (filters.featuredOnly) {
    where.push("properties.featured = 1");
  }

  return {
    sql: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "",
    params,
  };
}

export function getProperties(filters: PropertyFilters = {}, options?: { includeDrafts?: boolean }) {
  const db = getDb();
  const { sql, params } = buildPropertyWhere(filters, options?.includeDrafts ?? false);
  const limitSql = filters.limit ? `LIMIT ${Number(filters.limit)}` : "";
  const rows = db
    .prepare(
      `
        ${propertySelectSql()}
        ${sql}
        ORDER BY properties.sort_order ASC, properties.updated_at DESC
        ${limitSql}
      `
    )
    .all(params) as PropertyRow[];

  return rows.map(mapProperty);
}

export function getPropertyBySlug(slug: string) {
  const db = getDb();
  const slugCandidates = getSlugLookupCandidates(slug);
  const titleCandidates = getTitleLookupCandidates(slug).map((candidate) => candidate.toLowerCase());
  const slugPlaceholders = slugCandidates.map(() => "?").join(", ");
  const titlePlaceholders = titleCandidates.map(() => "?").join(", ");
  const row = db
    .prepare(
      `
        ${propertySelectSql()}
        WHERE properties.slug IN (${slugPlaceholders})
          OR LOWER(properties.title) IN (${titlePlaceholders})
        LIMIT 1
      `
    )
    .get(...slugCandidates, ...titleCandidates) as PropertyRow | undefined;

  return row ? mapProperty(row) : undefined;
}

export function getPropertyById(id: number) {
  const db = getDb();
  const row = db
    .prepare(
      `
        ${propertySelectSql()}
        WHERE properties.id = ?
        LIMIT 1
      `
    )
    .get(id) as PropertyRow | undefined;

  return row ? mapProperty(row) : undefined;
}

export function getFeaturedProperties(limit = 6) {
  return getProperties({ featuredOnly: true, limit });
}

export function getSimilarProperties(
  currentId: number,
  transactionTypeSlug: string,
  propertyTypeSlug: string,
  limit = 4
) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        ${propertySelectSql()}
        WHERE properties.status = 'published'
          AND properties.id != @currentId
          AND (
            transaction_types.slug = @transactionTypeSlug OR
            property_types.slug = @propertyTypeSlug
          )
        ORDER BY properties.featured DESC, properties.sort_order ASC, properties.updated_at DESC
        LIMIT ${limit}
      `
    )
    .all({
      currentId,
      transactionTypeSlug,
      propertyTypeSlug,
    }) as PropertyRow[];

  return rows.map(mapProperty);
}

export function getPropertyCities(filters?: Pick<PropertyFilters, "transactionSlug" | "propertyTypeSlug">) {
  const db = getDb();
  const { sql, params } = buildPropertyWhere(
    { ...filters, status: "published" },
    false
  );

  const rows = db
    .prepare(
      `
        SELECT DISTINCT properties.city
        FROM properties
        INNER JOIN transaction_types ON transaction_types.id = properties.transaction_type_id
        INNER JOIN property_types ON property_types.id = properties.property_type_id
        ${sql}
        ORDER BY properties.city ASC
      `
    )
    .all(params) as Array<{ city: string }>;

  return rows.map((row) => row.city);
}

export function getPropertyCountByType(transactionSlug?: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT
          property_types.slug,
          COUNT(properties.id) as count
        FROM property_types
        LEFT JOIN properties
          ON properties.property_type_id = property_types.id
          AND properties.status = 'published'
        LEFT JOIN transaction_types ON transaction_types.id = properties.transaction_type_id
        ${transactionSlug ? "WHERE transaction_types.slug = @transactionSlug OR transaction_types.slug IS NULL" : ""}
        GROUP BY property_types.id
      `
    )
    .all(transactionSlug ? { transactionSlug } : {}) as Array<{
      slug: string;
      count: number;
    }>;

  return new Map(rows.map((row) => [row.slug, Number(row.count)]));
}

export function upsertProperty(
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
  const db = getDb();
  const payload = {
    title: input.title,
    slug: input.slug,
    transactionTypeId: input.transactionTypeId,
    propertyTypeId: input.propertyTypeId,
    status: input.status,
    featured: input.featured ? 1 : 0,
    city: input.city,
    neighborhood: input.neighborhood,
    fullAddress: input.fullAddress ?? null,
    price: input.price,
    priceMode: input.priceMode,
    priceSuffix: null,
    shortDescription: input.shortDescription,
    longDescription: input.longDescription,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    area: input.area ?? null,
    areaUnit: input.areaUnit,
    amenitiesJson: JSON.stringify(input.features),
    galleryJson: JSON.stringify(input.images),
    coverImageUrl: input.coverImage ?? null,
    videoUrl: input.video ?? null,
    virtualTourUrl: null,
    agentId: input.agentId ?? null,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    ogImageUrl: input.ogImage ?? null,
    sortOrder: input.sortOrder,
    publishedAt:
      input.status === "published" ? input.publishedAt ?? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (input.id) {
    db.prepare(
      `
        UPDATE properties
        SET
          title = @title,
          slug = @slug,
          transaction_type_id = @transactionTypeId,
          property_type_id = @propertyTypeId,
          status = @status,
          featured = @featured,
          city = @city,
          neighborhood = @neighborhood,
          full_address = @fullAddress,
          price = @price,
          price_mode = @priceMode,
          price_suffix = @priceSuffix,
          short_description = @shortDescription,
          long_description = @longDescription,
          bedrooms = @bedrooms,
          bathrooms = @bathrooms,
          area = @area,
          area_unit = @areaUnit,
          amenities_json = @amenitiesJson,
          gallery_json = @galleryJson,
          cover_image_url = @coverImageUrl,
          video_url = @videoUrl,
          virtual_tour_url = @virtualTourUrl,
          agent_id = @agentId,
          seo_title = @seoTitle,
          seo_description = @seoDescription,
          og_image_url = @ogImageUrl,
          sort_order = @sortOrder,
          published_at = @publishedAt,
          updated_at = @updatedAt
        WHERE id = @id
      `
    ).run({ ...payload, id: input.id });
    return input.id;
  }

  const result = db.prepare(
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
  ).run(payload);

  return Number(result.lastInsertRowid);
}

export function deleteProperty(id: number) {
  const db = getDb();
  db.prepare("DELETE FROM properties WHERE id = ?").run(id);
}

export function getMediaAssets() {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM media_assets ORDER BY created_at DESC")
    .all() as Array<Record<string, unknown>>;

  return rows.map<MediaAsset>((row) => ({
    id: Number(row.id),
    title: String(row.title),
    originalName: String(row.original_name),
    filename: String(row.filename),
    mimeType: String(row.mime_type),
    url: String(row.url),
    altText: (row.alt_text as string | null) ?? null,
    createdAt: String(row.created_at),
  }));
}

export function createMediaAsset(input: Omit<MediaAsset, "id" | "createdAt">) {
  const db = getDb();
  const result = db.prepare(
    `
      INSERT INTO media_assets (title, original_name, filename, mime_type, url, alt_text, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
  ).run(
    input.title,
    input.originalName,
    input.filename,
    input.mimeType,
    input.url,
    input.altText ?? null,
    new Date().toISOString()
  );

  return Number(result.lastInsertRowid);
}

export function updateMediaAsset(id: number, input: Pick<MediaAsset, "title" | "altText">) {
  const db = getDb();
  db.prepare("UPDATE media_assets SET title = ?, alt_text = ? WHERE id = ?").run(
    input.title,
    input.altText ?? null,
    id
  );
}

export function createInquiry(input: Omit<Inquiry, "id" | "createdAt">) {
  const db = getDb();
  const result = db.prepare(
    `
      INSERT INTO inquiries (property_id, property_title, name, email, phone, message, source_page, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
  ).run(
    input.propertyId ?? null,
    input.propertyTitle ?? null,
    input.name,
    input.email ?? null,
    input.phone,
    input.message,
    input.sourcePage,
    new Date().toISOString()
  );

  return Number(result.lastInsertRowid);
}

export function getInquiries() {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM inquiries ORDER BY created_at DESC")
    .all() as Array<Record<string, unknown>>;

  return rows.map<Inquiry>((row) => ({
    id: Number(row.id),
    propertyId: row.property_id == null ? null : Number(row.property_id),
    propertyTitle: (row.property_title as string | null) ?? null,
    name: String(row.name),
    email: (row.email as string | null) ?? null,
    phone: String(row.phone),
    message: String(row.message),
    sourcePage: String(row.source_page),
    createdAt: String(row.created_at),
  }));
}

export function getDashboardStats() {
  const db = getDb();
  return db
    .prepare(
      `
        SELECT
          (SELECT COUNT(*) FROM properties) as propertiesCount,
          (SELECT COUNT(*) FROM properties WHERE status = 'published') as publishedCount,
          (SELECT COUNT(*) FROM agents WHERE is_published = 1) as agentsCount,
          (SELECT COUNT(*) FROM inquiries) as inquiriesCount
      `
    )
    .get() as {
      propertiesCount: number;
      publishedCount: number;
      agentsCount: number;
      inquiriesCount: number;
    };
}
