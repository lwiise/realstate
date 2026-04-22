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
import { executeRemote, queryRemoteRow, queryRemoteRows } from "@/lib/remote-db";
import { getSeedPage, seedFooter, seedNavigation, seedSiteSettings } from "@/lib/seed-data";
import { getSlugLookupCandidates, getTitleLookupCandidates } from "@/lib/slug";

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

function mapBoolean(value: number | boolean | string | null | undefined) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "t" || value === "1";
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
    isPublished: mapBoolean(row.is_published as boolean),
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
    isActive: mapBoolean(row.is_active as boolean),
    sortOrder: Number(row.sort_order ?? 0),
    routePath: String(row.route_path),
    navLabel: (row.nav_label as string | null) ?? null,
    priceSuffix: (row.price_suffix as string | null) ?? null,
    showInNavigation: mapBoolean(row.show_in_navigation as boolean),
  };
}

function mapPropertyType(row: Record<string, unknown>): PropertyType {
  return {
    id: Number(row.id),
    label: String(row.label),
    slug: String(row.slug),
    description: (row.description as string | null) ?? null,
    imageUrl: (row.image_url as string | null) ?? null,
    isActive: mapBoolean(row.is_active as boolean),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

type RemotePropertyRow = Record<string, unknown> & {
  agent_ref_id?: number | null;
};

function mapProperty(row: RemotePropertyRow): Property {
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
          isPublished: mapBoolean(row.agent_is_published as boolean),
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
    featured: mapBoolean(row.featured as boolean),
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
    features: parseJson<string[]>(row.amenities_json, []),
    images: parseJson<string[]>(row.gallery_json, []),
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

function buildRemotePropertyWhere(filters: PropertyFilters, includeDrafts = false) {
  const where: string[] = [];
  const values: unknown[] = [];
  const addValue = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };

  if (!includeDrafts) {
    where.push("properties.status = 'published'");
  } else if (filters.status) {
    where.push(`properties.status = ${addValue(filters.status)}`);
  }

  if (filters.transactionSlug) {
    where.push(`transaction_types.slug = ${addValue(filters.transactionSlug)}`);
  }

  if (filters.propertyTypeSlug) {
    where.push(`property_types.slug = ${addValue(filters.propertyTypeSlug)}`);
  }

  if (filters.city) {
    const placeholder = addValue(filters.city);
    where.push(`LOWER(properties.city) = LOWER(${placeholder})`);
  }

  if (filters.keyword) {
    const placeholder = addValue(`%${filters.keyword}%`);
    where.push(
      `(LOWER(properties.title) LIKE LOWER(${placeholder}) OR LOWER(properties.short_description) LIKE LOWER(${placeholder}) OR LOWER(properties.long_description) LIKE LOWER(${placeholder}) OR LOWER(properties.neighborhood) LIKE LOWER(${placeholder}))`
    );
  }

  if (filters.minPrice != null) {
    where.push(`properties.price >= ${addValue(filters.minPrice)}`);
  }

  if (filters.maxPrice != null) {
    where.push(`properties.price <= ${addValue(filters.maxPrice)}`);
  }

  if (filters.featuredOnly) {
    where.push("properties.featured = TRUE");
  }

  return {
    sql: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "",
    values,
  };
}

export async function getSiteSettingsRemote(): Promise<SiteSettings> {
  const row = await queryRemoteRow<Record<string, unknown>>(
    "SELECT * FROM site_settings WHERE id = 1"
  );

  if (!row) {
    return seedSiteSettings;
  }

  return {
    siteName: String(row.site_name),
    siteUrl: String(row.site_url),
    siteDescription: String(row.site_description),
    siteKeywords: parseJson<string[]>(row.site_keywords_json, []),
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

export async function updateSiteSettingsRemote(input: SiteSettings) {
  await executeRemote(
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
      ON CONFLICT (id) DO UPDATE SET
        site_name = EXCLUDED.site_name,
        site_url = EXCLUDED.site_url,
        site_description = EXCLUDED.site_description,
        site_keywords_json = EXCLUDED.site_keywords_json,
        default_og_image = EXCLUDED.default_og_image,
        logo_url = EXCLUDED.logo_url,
        logo_alt = EXCLUDED.logo_alt,
        contact_email = EXCLUDED.contact_email,
        contact_phone = EXCLUDED.contact_phone,
        whatsapp_number = EXCLUDED.whatsapp_number,
        company_address = EXCLUDED.company_address,
        currency_code = EXCLUDED.currency_code,
        currency_locale = EXCLUDED.currency_locale,
        copyright_text = EXCLUDED.copyright_text,
        default_seo_title = EXCLUDED.default_seo_title,
        default_seo_description = EXCLUDED.default_seo_description,
        updated_at = EXCLUDED.updated_at
    `,
    [
      input.siteName,
      input.siteUrl,
      input.siteDescription,
      JSON.stringify(input.siteKeywords),
      input.defaultOgImage,
      input.logoUrl,
      input.logoAlt,
      input.contactEmail,
      input.contactPhone,
      input.whatsappNumber,
      input.companyAddress,
      input.currencyCode,
      input.currencyLocale,
      input.copyrightText,
      input.defaultSeoTitle,
      input.defaultSeoDescription,
      new Date().toISOString(),
    ]
  );
}

export async function getNavigationSettingsRemote(): Promise<NavigationSettings> {
  const row = await queryRemoteRow<Record<string, unknown>>(
    "SELECT * FROM navigation_settings WHERE id = 1"
  );

  if (!row) {
    return seedNavigation;
  }

  return {
    logoUrl: String(row.logo_url),
    logoAlt: String(row.logo_alt),
    links: parseJson<NavigationSettings["links"]>(row.links_json, []),
  };
}

export async function updateNavigationSettingsRemote(input: NavigationSettings) {
  await executeRemote(
    `
      INSERT INTO navigation_settings (id, logo_url, logo_alt, links_json, updated_at)
      VALUES (1, $1, $2, $3::jsonb, $4)
      ON CONFLICT (id) DO UPDATE SET
        logo_url = EXCLUDED.logo_url,
        logo_alt = EXCLUDED.logo_alt,
        links_json = EXCLUDED.links_json,
        updated_at = EXCLUDED.updated_at
    `,
    [input.logoUrl, input.logoAlt, JSON.stringify(input.links), new Date().toISOString()]
  );
}

export async function getFooterSettingsRemote(): Promise<FooterSettings> {
  const row = await queryRemoteRow<Record<string, unknown>>(
    "SELECT * FROM footer_settings WHERE id = 1"
  );

  if (!row) {
    return seedFooter;
  }

  return {
    brandText: String(row.brand_text),
    quickLinks: parseJson<FooterSettings["quickLinks"]>(row.quick_links_json, []),
    propertyLinks: parseJson<FooterSettings["propertyLinks"]>(row.property_links_json, []),
    socialLinks: parseJson<FooterSettings["socialLinks"]>(row.social_links_json, []),
    legalLinks: parseJson<FooterSettings["legalLinks"]>(row.legal_links_json, []),
  };
}

export async function updateFooterSettingsRemote(input: FooterSettings) {
  await executeRemote(
    `
      INSERT INTO footer_settings (
        id, brand_text, quick_links_json, property_links_json, social_links_json, legal_links_json, updated_at
      ) VALUES (
        1, $1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb, $6
      )
      ON CONFLICT (id) DO UPDATE SET
        brand_text = EXCLUDED.brand_text,
        quick_links_json = EXCLUDED.quick_links_json,
        property_links_json = EXCLUDED.property_links_json,
        social_links_json = EXCLUDED.social_links_json,
        legal_links_json = EXCLUDED.legal_links_json,
        updated_at = EXCLUDED.updated_at
    `,
    [
      input.brandText,
      JSON.stringify(input.quickLinks),
      JSON.stringify(input.propertyLinks),
      JSON.stringify(input.socialLinks),
      JSON.stringify(input.legalLinks),
      new Date().toISOString(),
    ]
  );
}

export async function getPageContentRemote<TPageKey extends PageKey>(
  pageKey: TPageKey
): Promise<PageRecord<TPageKey>> {
  const row = await queryRemoteRow<Record<string, unknown>>(
    "SELECT * FROM page_contents WHERE page_key = $1",
    [pageKey]
  );

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
    content: parseJson<PageContentMap[TPageKey]>(row.content_json, getSeedPage(pageKey)),
    updatedAt: String(row.updated_at),
  };
}

export async function updatePageContentRemote<TPageKey extends PageKey>(
  input: PageRecord<TPageKey>
) {
  await executeRemote(
    `
      INSERT INTO page_contents (
        page_key, title, seo_title, seo_description, og_image_url, content_json, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6::jsonb, $7
      )
      ON CONFLICT (page_key) DO UPDATE SET
        title = EXCLUDED.title,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description,
        og_image_url = EXCLUDED.og_image_url,
        content_json = EXCLUDED.content_json,
        updated_at = EXCLUDED.updated_at
    `,
    [
      input.pageKey,
      input.title,
      input.seoTitle ?? null,
      input.seoDescription ?? null,
      input.ogImageUrl ?? null,
      JSON.stringify(input.content),
      new Date().toISOString(),
    ]
  );
}

export async function getTransactionTypesRemote(options?: { includeInactive?: boolean }) {
  const rows = await queryRemoteRows<Record<string, unknown>>(
    `
      SELECT * FROM transaction_types
      ${options?.includeInactive ? "" : "WHERE is_active = TRUE"}
      ORDER BY sort_order ASC, label ASC
    `
  );

  return rows.map(mapTransactionType);
}

export async function findTransactionTypeRemote(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return (await getTransactionTypesRemote({ includeInactive: true })).find((item) => {
    return (
      item.slug.toLowerCase() === normalized ||
      item.label.toLowerCase() === normalized ||
      item.routePath.replace("/", "").toLowerCase() === normalized
    );
  });
}

export async function upsertTransactionTypeRemote(
  input: Omit<TransactionType, "id"> & { id?: number }
) {
  const updatedAt = new Date().toISOString();
  const payload = [
    input.label,
    input.slug,
    input.description ?? null,
    input.imageUrl ?? null,
    input.isActive,
    input.sortOrder,
    input.routePath,
    input.navLabel ?? null,
    input.priceSuffix ?? null,
    input.showInNavigation,
    updatedAt,
  ];

  if (input.id) {
    await executeRemote(
      `
        UPDATE transaction_types
        SET
          label = $1,
          slug = $2,
          description = $3,
          image_url = $4,
          is_active = $5,
          sort_order = $6,
          route_path = $7,
          nav_label = $8,
          price_suffix = $9,
          show_in_navigation = $10,
          updated_at = $11
        WHERE id = $12
      `,
      [...payload, input.id]
    );
    return input.id;
  }

  const row = await queryRemoteRow<{ id: number }>(
    `
      INSERT INTO transaction_types (
        label, slug, description, image_url, is_active, sort_order, route_path,
        nav_label, price_suffix, show_in_navigation, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $11
      )
      RETURNING id
    `,
    payload
  );

  return Number(row?.id ?? 0);
}

export async function deleteTransactionTypeRemote(id: number) {
  const usage = await queryRemoteRow<{ count: string }>(
    "SELECT COUNT(*)::text as count FROM properties WHERE transaction_type_id = $1",
    [id]
  );

  if (Number(usage?.count ?? 0) > 0) {
    throw new Error("This transaction type is still used by one or more properties.");
  }

  await executeRemote("DELETE FROM transaction_types WHERE id = $1", [id]);
}

export async function getPropertyTypesRemote(options?: { includeInactive?: boolean }) {
  const rows = await queryRemoteRows<Record<string, unknown>>(
    `
      SELECT * FROM property_types
      ${options?.includeInactive ? "" : "WHERE is_active = TRUE"}
      ORDER BY sort_order ASC, label ASC
    `
  );

  return rows.map(mapPropertyType);
}

export async function findPropertyTypeRemote(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return (await getPropertyTypesRemote({ includeInactive: true })).find((item) => {
    return item.slug.toLowerCase() === normalized || item.label.toLowerCase() === normalized;
  });
}

export async function upsertPropertyTypeRemote(input: Omit<PropertyType, "id"> & { id?: number }) {
  const updatedAt = new Date().toISOString();
  const payload = [
    input.label,
    input.slug,
    input.description ?? null,
    input.imageUrl ?? null,
    input.isActive,
    input.sortOrder,
    updatedAt,
  ];

  if (input.id) {
    await executeRemote(
      `
        UPDATE property_types
        SET
          label = $1,
          slug = $2,
          description = $3,
          image_url = $4,
          is_active = $5,
          sort_order = $6,
          updated_at = $7
        WHERE id = $8
      `,
      [...payload, input.id]
    );
    return input.id;
  }

  const row = await queryRemoteRow<{ id: number }>(
    `
      INSERT INTO property_types (
        label, slug, description, image_url, is_active, sort_order, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $7
      )
      RETURNING id
    `,
    payload
  );

  return Number(row?.id ?? 0);
}

export async function deletePropertyTypeRemote(id: number) {
  const usage = await queryRemoteRow<{ count: string }>(
    "SELECT COUNT(*)::text as count FROM properties WHERE property_type_id = $1",
    [id]
  );

  if (Number(usage?.count ?? 0) > 0) {
    throw new Error("This property type is still used by one or more properties.");
  }

  await executeRemote("DELETE FROM property_types WHERE id = $1", [id]);
}

export async function getAgentsRemote(options?: { includeUnpublished?: boolean }) {
  const rows = await queryRemoteRows<Record<string, unknown>>(
    `
      SELECT * FROM agents
      ${options?.includeUnpublished ? "" : "WHERE is_published = TRUE"}
      ORDER BY sort_order ASC, name ASC
    `
  );

  return rows.map(mapAgent);
}

export async function getAgentByIdRemote(id: number) {
  const row = await queryRemoteRow<Record<string, unknown>>(
    "SELECT * FROM agents WHERE id = $1",
    [id]
  );

  return row ? mapAgent(row) : undefined;
}

export async function upsertAgentRemote(
  input: Omit<Agent, "id" | "createdAt" | "updatedAt"> & { id?: number }
) {
  const updatedAt = new Date().toISOString();
  const payload = [
    input.name,
    input.slug,
    input.role,
    input.phone,
    input.email,
    input.photoUrl ?? null,
    input.bio ?? null,
    input.whatsapp ?? null,
    input.isPublished,
    input.sortOrder,
    input.seoTitle ?? null,
    input.seoDescription ?? null,
    updatedAt,
  ];

  if (input.id) {
    await executeRemote(
      `
        UPDATE agents
        SET
          name = $1,
          slug = $2,
          role = $3,
          phone = $4,
          email = $5,
          photo_url = $6,
          bio = $7,
          whatsapp = $8,
          is_published = $9,
          sort_order = $10,
          seo_title = $11,
          seo_description = $12,
          updated_at = $13
        WHERE id = $14
      `,
      [...payload, input.id]
    );
    return input.id;
  }

  const row = await queryRemoteRow<{ id: number }>(
    `
      INSERT INTO agents (
        name, slug, role, phone, email, photo_url, bio, whatsapp, is_published,
        sort_order, seo_title, seo_description, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $13
      )
      RETURNING id
    `,
    payload
  );

  return Number(row?.id ?? 0);
}

export async function deleteAgentRemote(id: number) {
  await executeRemote("UPDATE properties SET agent_id = NULL WHERE agent_id = $1", [id]);
  await executeRemote("DELETE FROM agents WHERE id = $1", [id]);
}

export async function getPropertiesRemote(
  filters: PropertyFilters = {},
  options?: { includeDrafts?: boolean }
) {
  const { sql, values } = buildRemotePropertyWhere(filters, options?.includeDrafts ?? false);
  const limitSql =
    filters.limit != null ? `LIMIT $${values.push(Number(filters.limit))}` : "";
  const rows = await queryRemoteRows<RemotePropertyRow>(
    `
      ${propertySelectSql()}
      ${sql}
      ORDER BY properties.sort_order ASC, properties.updated_at DESC
      ${limitSql}
    `,
    values
  );

  return rows.map(mapProperty);
}

export async function getPropertyBySlugRemote(slug: string) {
  const slugCandidates = getSlugLookupCandidates(slug);
  const titleCandidates = getTitleLookupCandidates(slug).map((candidate) => candidate.toLowerCase());
  const values = [...slugCandidates, ...titleCandidates];
  const slugPlaceholders = slugCandidates.map((_, index) => `$${index + 1}`).join(", ");
  const titlePlaceholders = titleCandidates
    .map((_, index) => `$${slugCandidates.length + index + 1}`)
    .join(", ");
  const row = await queryRemoteRow<RemotePropertyRow>(
    `
      ${propertySelectSql()}
      WHERE properties.slug IN (${slugPlaceholders})
        OR LOWER(properties.title) IN (${titlePlaceholders})
      LIMIT 1
    `,
    values
  );

  return row ? mapProperty(row) : undefined;
}

export async function getPropertyByIdRemote(id: number) {
  const row = await queryRemoteRow<RemotePropertyRow>(
    `
      ${propertySelectSql()}
      WHERE properties.id = $1
      LIMIT 1
    `,
    [id]
  );

  return row ? mapProperty(row) : undefined;
}

export async function getFeaturedPropertiesRemote(limit = 6) {
  return getPropertiesRemote({ featuredOnly: true, limit });
}

export async function getSimilarPropertiesRemote(
  currentId: number,
  transactionTypeSlug: string,
  propertyTypeSlug: string,
  limit = 4
) {
  const rows = await queryRemoteRows<RemotePropertyRow>(
    `
      ${propertySelectSql()}
      WHERE properties.status = 'published'
        AND properties.id != $1
        AND (
          transaction_types.slug = $2 OR
          property_types.slug = $3
        )
      ORDER BY properties.featured DESC, properties.sort_order ASC, properties.updated_at DESC
      LIMIT $4
    `,
    [currentId, transactionTypeSlug, propertyTypeSlug, limit]
  );

  return rows.map(mapProperty);
}

export async function getPropertyCitiesRemote(
  filters?: Pick<PropertyFilters, "transactionSlug" | "propertyTypeSlug">
) {
  const { sql, values } = buildRemotePropertyWhere({ ...filters, status: "published" }, false);
  const rows = await queryRemoteRows<{ city: string }>(
    `
      SELECT DISTINCT properties.city
      FROM properties
      INNER JOIN transaction_types ON transaction_types.id = properties.transaction_type_id
      INNER JOIN property_types ON property_types.id = properties.property_type_id
      ${sql}
      ORDER BY properties.city ASC
    `,
    values
  );

  return rows.map((row) => row.city);
}

export async function getPropertyCountByTypeRemote(transactionSlug?: string) {
  const values: unknown[] = [];
  const where = transactionSlug
    ? `WHERE transaction_types.slug = $${values.push(transactionSlug)} OR transaction_types.slug IS NULL`
    : "";

  const rows = await queryRemoteRows<{ slug: string; count: string }>(
    `
      SELECT
        property_types.slug,
        COUNT(properties.id)::text as count
      FROM property_types
      LEFT JOIN properties
        ON properties.property_type_id = property_types.id
        AND properties.status = 'published'
      LEFT JOIN transaction_types ON transaction_types.id = properties.transaction_type_id
      ${where}
      GROUP BY property_types.id, property_types.slug
    `,
    values
  );

  return new Map(rows.map((row) => [row.slug, Number(row.count)]));
}

export async function upsertPropertyRemote(
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
  const updatedAt = new Date().toISOString();
  const payload = [
    input.title,
    input.slug,
    input.transactionTypeId,
    input.propertyTypeId,
    input.status,
    input.featured,
    input.city,
    input.neighborhood,
    input.fullAddress ?? null,
    input.price,
    input.priceMode,
    null,
    input.shortDescription,
    input.longDescription,
    input.bedrooms ?? null,
    input.bathrooms ?? null,
    input.area ?? null,
    input.areaUnit,
    JSON.stringify(input.features),
    JSON.stringify(input.images),
    input.coverImage ?? null,
    input.video ?? null,
    null,
    input.agentId ?? null,
    input.seoTitle ?? null,
    input.seoDescription ?? null,
    input.ogImage ?? null,
    input.sortOrder,
    input.status === "published" ? input.publishedAt ?? updatedAt : null,
    updatedAt,
  ];

  if (input.id) {
    await executeRemote(
      `
        UPDATE properties
        SET
          title = $1,
          slug = $2,
          transaction_type_id = $3,
          property_type_id = $4,
          status = $5,
          featured = $6,
          city = $7,
          neighborhood = $8,
          full_address = $9,
          price = $10,
          price_mode = $11,
          price_suffix = $12,
          short_description = $13,
          long_description = $14,
          bedrooms = $15,
          bathrooms = $16,
          area = $17,
          area_unit = $18,
          amenities_json = $19::jsonb,
          gallery_json = $20::jsonb,
          cover_image_url = $21,
          video_url = $22,
          virtual_tour_url = $23,
          agent_id = $24,
          seo_title = $25,
          seo_description = $26,
          og_image_url = $27,
          sort_order = $28,
          published_at = $29,
          updated_at = $30
        WHERE id = $31
      `,
      [...payload, input.id]
    );
    return input.id;
  }

  const row = await queryRemoteRow<{ id: number }>(
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
        $27, $28, $29, $30, $30
      )
      RETURNING id
    `,
    payload
  );

  return Number(row?.id ?? 0);
}

export async function deletePropertyRemote(id: number) {
  await executeRemote("DELETE FROM properties WHERE id = $1", [id]);
}

export async function getMediaAssetsRemote() {
  const rows = await queryRemoteRows<Record<string, unknown>>(
    "SELECT * FROM media_assets ORDER BY created_at DESC"
  );

  return rows.map((row) => ({
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

export async function createMediaAssetRemote(input: {
  title: string;
  originalName: string;
  filename: string;
  mimeType: string;
  url: string;
  altText: string | null;
}) {
  const row = await queryRemoteRow<{ id: number }>(
    `
      INSERT INTO media_assets (title, original_name, filename, mime_type, url, alt_text, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `,
    [
      input.title,
      input.originalName,
      input.filename,
      input.mimeType,
      input.url,
      input.altText ?? null,
      new Date().toISOString(),
    ]
  );

  return Number(row?.id ?? 0);
}

export async function updateMediaAssetRemote(
  id: number,
  input: Pick<MediaAsset, "title" | "altText">
) {
  await executeRemote("UPDATE media_assets SET title = $1, alt_text = $2 WHERE id = $3", [
    input.title,
    input.altText ?? null,
    id,
  ]);
}

export async function createInquiryRemote(input: Omit<Inquiry, "id" | "createdAt">) {
  const row = await queryRemoteRow<{ id: number }>(
    `
      INSERT INTO inquiries (property_id, property_title, name, email, phone, message, source_page, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `,
    [
      input.propertyId ?? null,
      input.propertyTitle ?? null,
      input.name,
      input.email ?? null,
      input.phone,
      input.message,
      input.sourcePage,
      new Date().toISOString(),
    ]
  );

  return Number(row?.id ?? 0);
}

export async function getInquiriesRemote() {
  const rows = await queryRemoteRows<Record<string, unknown>>(
    "SELECT * FROM inquiries ORDER BY created_at DESC"
  );

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

export async function getDashboardStatsRemote() {
  const row = await queryRemoteRow<Record<string, unknown>>(
    `
      SELECT
        (SELECT COUNT(*) FROM properties) as propertiesCount,
        (SELECT COUNT(*) FROM properties WHERE status = 'published') as publishedCount,
        (SELECT COUNT(*) FROM agents WHERE is_published = TRUE) as agentsCount,
        (SELECT COUNT(*) FROM inquiries) as inquiriesCount
    `
  );

  return {
    propertiesCount: Number(row?.propertiescount ?? 0),
    publishedCount: Number(row?.publishedcount ?? 0),
    agentsCount: Number(row?.agentscount ?? 0),
    inquiriesCount: Number(row?.inquiriescount ?? 0),
  };
}
