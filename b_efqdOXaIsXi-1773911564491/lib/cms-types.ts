export type ListingStatus = "draft" | "published" | "archived";
export type PriceMode = "sale" | "monthly" | "daily" | "custom";

export type PageKey =
  | "home"
  | "buy"
  | "rent"
  | "daily-rent"
  | "about"
  | "contact";

export interface SelectOption {
  id: number;
  label: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface TransactionType extends SelectOption {
  routePath: string;
  navLabel?: string | null;
  priceSuffix?: string | null;
  showInNavigation: boolean;
}

export interface PropertyType extends SelectOption {}

export interface Agent {
  id: number;
  name: string;
  slug: string;
  role: string;
  phone: string;
  email: string;
  photoUrl?: string | null;
  bio?: string | null;
  whatsapp?: string | null;
  isPublished: boolean;
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  transactionTypeId: number;
  transactionType: string;
  transactionTypeSlug: string;
  propertyTypeId: number;
  propertyType: string;
  propertyTypeSlug: string;
  status: ListingStatus;
  featured: boolean;
  city: string;
  neighborhood: string;
  fullAddress?: string | null;
  price: number;
  priceMode: PriceMode;
  priceSuffix?: string | null;
  shortDescription: string;
  longDescription: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  areaUnit: string;
  features: string[];
  images: string[];
  coverImage?: string | null;
  video?: string | null;
  virtualTourUrl?: string | null;
  agentId?: number | null;
  agent?: Agent | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  siteKeywords: string[];
  defaultOgImage: string;
  logoUrl: string;
  logoAlt: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  companyAddress: string;
  currencyCode: string;
  currencyLocale: string;
  copyrightText: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}

export interface NavLink {
  label: string;
  href: string;
  isEnabled: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  isEnabled: boolean;
}

export interface NavigationSettings {
  logoUrl: string;
  logoAlt: string;
  links: NavLink[];
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

export interface FooterSettings {
  brandText: string;
  quickLinks: NavLink[];
  propertyLinks: NavLink[];
  socialLinks: SocialLink[];
  legalLinks: NavLink[];
}

export interface OfficeLocation {
  name: string;
  lines: string[];
}

export interface StatItem {
  label: string;
  value: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  accent?: string;
}

export interface NumberedBenefitItem extends BenefitItem {
  number: string;
}

export interface ShowcaseCard {
  title: string;
  description: string;
  image: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  focus: string;
}

export interface PageHeroContent {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  backgroundImage: string;
}

export interface HomePageContent {
  hero: PageHeroContent;
  about: {
    eyebrow: string;
    title: string;
    descriptionPrimary: string;
    descriptionSecondary: string;
    images: string[];
    features: string[];
    ctaLabel: string;
    ctaHref: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    ctaLabel: string;
    ctaHref: string;
    limit: number;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    stats: StatItem[];
    items: TestimonialItem[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    backgroundImage: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    formTitle: string;
    offices: OfficeLocation[];
  };
}

export interface BuyPageContent {
  hero: PageHeroContent;
  categorySection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  stats: StatItem[];
  whyBuy: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    items: NumberedBenefitItem[];
  };
  listing: {
    eyebrow: string;
    title: string;
    description: string;
  };
}

export interface RentPageContent {
  hero: PageHeroContent;
  categorySection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  benefits: {
    eyebrow: string;
    title: string;
    items: BenefitItem[];
  };
  listing: {
    eyebrow: string;
    title: string;
    description: string;
  };
}

export interface DailyRentPageContent {
  hero: PageHeroContent;
  categorySection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    images: string[];
    points: string[];
  };
  useCases: {
    eyebrow: string;
    title: string;
    items: ShowcaseCard[];
  };
  listing: {
    eyebrow: string;
    title: string;
    description: string;
  };
}

export interface AboutPageContent {
  hero: PageHeroContent;
  story: {
    eyebrow: string;
    title: string;
    descriptionPrimary: string;
    descriptionSecondary: string;
    image: string;
    features: string[];
  };
  values: {
    eyebrow: string;
    title: string;
    items: BenefitItem[];
  };
}

export interface ContactPageContent {
  hero: PageHeroContent;
  intro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  offices: OfficeLocation[];
  form: {
    title: string;
    submitLabel: string;
  };
}

export type PageContentMap = {
  home: HomePageContent;
  buy: BuyPageContent;
  rent: RentPageContent;
  "daily-rent": DailyRentPageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
};

export interface MediaAsset {
  id: number;
  title: string;
  originalName: string;
  filename: string;
  mimeType: string;
  url: string;
  altText?: string | null;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  propertyId?: number | null;
  propertyTitle?: string | null;
  name: string;
  email?: string | null;
  phone: string;
  message: string;
  sourcePage: string;
  createdAt: string;
}

export interface PropertyFilters {
  transactionSlug?: string;
  propertyTypeSlug?: string;
  city?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  featuredOnly?: boolean;
  status?: ListingStatus;
  limit?: number;
}

export interface PageRecord<TPageKey extends PageKey = PageKey> {
  pageKey: TPageKey;
  title: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  content: PageContentMap[TPageKey];
  updatedAt: string;
}
