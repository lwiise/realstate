import type {
  AboutPageContent,
  Agent,
  BuyPageContent,
  ContactPageContent,
  DailyRentPageContent,
  FooterSettings,
  HomePageContent,
  NavigationSettings,
  PageContentMap,
  PageKey,
  PriceMode,
  PropertyType,
  RentPageContent,
  SiteSettings,
  TransactionType,
} from "@/lib/cms-types";

type SeedAgent = Omit<Agent, "id" | "createdAt" | "updatedAt">;

export interface SeedProperty {
  title: string;
  slug: string;
  transactionSlug: string;
  propertyTypeSlug: string;
  status: "draft" | "published" | "archived";
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
  agentEmail?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  sortOrder: number;
}

export const seedSiteSettings: SiteSettings = {
  siteName: "MDK IMMOBILIER Real Estate",
  siteUrl: "http://localhost:3000",
  siteDescription:
    "MDK IMMOBILIER Real Estate propose des proprietes de prestige a Tanger pour l'achat, la location longue duree et la location journaliere.",
  siteKeywords: [
    "MDK IMMOBILIER Real Estate",
    "immobilier Tanger",
    "proprietes de luxe Tanger",
    "acheter propriete Tanger",
    "louer propriete Tanger",
    "location journaliere Tanger",
  ],
  defaultOgImage: "/logo-mdk.png",
  logoUrl: "/logo-mdk.png",
  logoAlt: "MDK Immobilier",
  contactEmail: "contact@mdkimmobilier.com",
  contactPhone: "+212 6 12-34-56-78",
  whatsappNumber: "+212612345678",
  companyAddress: "Boulevard Pasteur, Suite 500, Tanger, Maroc",
  currencyCode: "USD",
  currencyLocale: "en-US",
  copyrightText: "© 2026 MDK IMMOBILIER Real Estate. Tous droits reserves.",
  defaultSeoTitle: "MDK IMMOBILIER Real Estate",
  defaultSeoDescription:
    "Achetez, louez ou reservez des proprietes d'exception a Tanger avec une agence qui privilegie la discretion, la selection et l'accompagnement sur mesure.",
};

export const seedNavigation: NavigationSettings = {
  logoUrl: "/logo-mdk.png",
  logoAlt: "MDK Immobilier",
  links: [
    { label: "Acheter", href: "/buy", isEnabled: true },
    { label: "Louer", href: "/rent", isEnabled: true },
    { label: "Location journaliere", href: "/daily-rent", isEnabled: true },
    { label: "A propos", href: "/#about", isEnabled: true },
    { label: "Contact", href: "/#contact", isEnabled: true },
  ],
};

export const seedFooter: FooterSettings = {
  brandText:
    "Selectionnant des proprietes exceptionnelles pour les clients exigeants. Ou le luxe rencontre la distinction.",
  quickLinks: [
    { label: "Acheter une propriete", href: "/buy", isEnabled: true },
    { label: "Louer une propriete", href: "/rent", isEnabled: true },
    { label: "Locations journalieres", href: "/daily-rent", isEnabled: true },
    { label: "A propos", href: "/about", isEnabled: true },
    { label: "Contact", href: "/contact", isEnabled: true },
  ],
  propertyLinks: [
    { label: "Appartements", href: "/properties?type=appartement", isEnabled: true },
    { label: "Villas", href: "/properties?type=villa", isEnabled: true },
    { label: "Bureaux", href: "/properties?type=bureau", isEnabled: true },
    { label: "Commercial", href: "/properties?type=commercial", isEnabled: true },
    { label: "Terrains", href: "/properties?type=terrain", isEnabled: true },
  ],
  socialLinks: [
    { label: "Facebook", href: "#", isEnabled: true },
    { label: "Instagram", href: "#", isEnabled: true },
    { label: "LinkedIn", href: "#", isEnabled: true },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "#", isEnabled: true },
    { label: "Terms of Service", href: "#", isEnabled: true },
  ],
};

export const seedTransactionTypes: Omit<TransactionType, "id">[] = [
  {
    label: "Acheter",
    slug: "buy",
    description: "Biens disponibles a l'achat.",
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
    isActive: true,
    sortOrder: 1,
    routePath: "/buy",
    navLabel: "Acheter",
    priceSuffix: null,
    showInNavigation: true,
  },
  {
    label: "Louer",
    slug: "rent",
    description: "Biens disponibles en location longue duree.",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    isActive: true,
    sortOrder: 2,
    routePath: "/rent",
    navLabel: "Louer",
    priceSuffix: "/mois",
    showInNavigation: true,
  },
  {
    label: "Location journaliere",
    slug: "daily-rent",
    description: "Biens disponibles pour sejours courts et experiences privees.",
    imageUrl:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&q=80",
    isActive: true,
    sortOrder: 3,
    routePath: "/daily-rent",
    navLabel: "Location journaliere",
    priceSuffix: "/jour",
    showInNavigation: true,
  },
];

export const seedPropertyTypes: Omit<PropertyType, "id">[] = [
  {
    label: "Appartement",
    slug: "appartement",
    description: "Residences urbaines et penthouses.",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    isActive: true,
    sortOrder: 1,
  },
  {
    label: "Villa",
    slug: "villa",
    description: "Maisons de prestige et domaines exclusifs.",
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    isActive: true,
    sortOrder: 2,
  },
  {
    label: "Bureau",
    slug: "bureau",
    description: "Espaces executifs et plateaux premium.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    isActive: true,
    sortOrder: 3,
  },
  {
    label: "Commercial",
    slug: "commercial",
    description: "Showrooms, boutiques et surfaces retail.",
    imageUrl:
      "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=800&q=80",
    isActive: true,
    sortOrder: 4,
  },
  {
    label: "Terrain",
    slug: "terrain",
    description: "Parcelles et foncier a fort potentiel.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    isActive: true,
    sortOrder: 5,
  },
];

export const seedAgents: SeedAgent[] = [
  {
    name: "Amina Bennani",
    slug: "amina-bennani",
    role: "Luxury Property Specialist",
    phone: "+212 6 12-34-56-78",
    email: "amina@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
    bio: "Amina accompagne des acheteurs et voyageurs exigeants sur des actifs premium a Tanger.",
    whatsapp: "+212612345678",
    isPublished: true,
    sortOrder: 1,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Hassan Kharrouby",
    slug: "hassan-kharrouby",
    role: "Senior Villa Consultant",
    phone: "+212 6 22-33-44-55",
    email: "hassan@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    bio: "Hassan pilote les mandats villa et les selections patrimoniales les plus sensibles.",
    whatsapp: "+212622334455",
    isPublished: true,
    sortOrder: 2,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Mohammed Tahir",
    slug: "mohammed-tahir",
    role: "Commercial Assets Advisor",
    phone: "+212 6 33-44-55-66",
    email: "mohammed@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bio: "Mohammed conseille les investisseurs sur les immeubles de bureaux et actifs commerciaux.",
    whatsapp: "+212633445566",
    isPublished: true,
    sortOrder: 3,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Fatima Larbi",
    slug: "fatima-larbi",
    role: "Retail Leasing Expert",
    phone: "+212 6 44-55-66-77",
    email: "fatima@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
    bio: "Fatima gere les surfaces retail et showrooms de centre-ville.",
    whatsapp: "+212644556677",
    isPublished: true,
    sortOrder: 4,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Ahmed Moroccan",
    slug: "ahmed-moroccan",
    role: "Land Acquisition Advisor",
    phone: "+212 6 55-66-77-88",
    email: "ahmed@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    bio: "Ahmed structure les dossiers fonciers et les opportunites terrain a fort potentiel.",
    whatsapp: "+212655667788",
    isPublished: true,
    sortOrder: 5,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Nadia Fassi",
    slug: "nadia-fassi",
    role: "Hospitality Curator",
    phone: "+212 6 66-77-88-99",
    email: "nadia@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=300&q=80",
    bio: "Nadia selectionne les retraites haut de gamme et les experiences journalieres exclusives.",
    whatsapp: "+212666778899",
    isPublished: true,
    sortOrder: 6,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Karim Idrissi",
    slug: "karim-idrissi",
    role: "Urban Rentals Consultant",
    phone: "+212 6 77-88-99-00",
    email: "karim@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80",
    bio: "Karim couvre les locations urbaines, executives et flexibles.",
    whatsapp: "+212677889900",
    isPublished: true,
    sortOrder: 7,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Salma Idrissi",
    slug: "salma-idrissi",
    role: "Corporate Property Advisor",
    phone: "+212 6 18-22-44-66",
    email: "salma@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    bio: "Salma accompagne les acquisitions corporate et les actifs signature.",
    whatsapp: "+212618224466",
    isPublished: true,
    sortOrder: 8,
    seoTitle: null,
    seoDescription: null,
  },
  {
    name: "Leila Bennouna",
    slug: "leila-bennouna",
    role: "Experience Venue Specialist",
    phone: "+212 6 70-30-40-50",
    email: "leila@aurumtanger.com",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    bio: "Leila positionne les lieux scenographiques pour marques et evenements prives.",
    whatsapp: "+212670304050",
    isPublished: true,
    sortOrder: 9,
    seoTitle: null,
    seoDescription: null,
  },
];

const description = (value: string) => value;

export const seedProperties: SeedProperty[] = [
  {
    title: "Penthouse de luxe avec vue panoramique",
    slug: "penthouse-de-luxe-vue-panoramique",
    transactionSlug: "buy",
    propertyTypeSlug: "appartement",
    status: "published",
    featured: true,
    city: "Tanger",
    neighborhood: "Medina",
    price: 2500000,
    priceMode: "sale",
    shortDescription:
      "Penthouse signature avec terrasse panoramique et finitions haut de gamme au coeur de Tanger.",
    longDescription: description(
      "Decouvrez le luxe inegale de ce magnifique penthouse avec des fenetres du sol au plafond offrant une vue panoramique spectaculaire. Cette residence meticuleusement concue propose des finitions haut de gamme, incluant des sols en marbre italien, des boiseries personnalisees et un systeme domotique a la pointe de la technologie."
    ),
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    areaUnit: "sqft",
    features: [
      "Ascenseur prive",
      "Terrasse panoramique",
      "Conciergerie 24/7",
      "Cave a vin",
      "Cinema prive",
      "Chauffage au sol",
      "Systeme domotique",
      "Parking 2 places",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    video:
      "https://cdn.pixabay.com/vimeo/780730376/780730376-e25fa51a0f8888c3d88cb1cac79c5dc2.mp4",
    agentEmail: "amina@aurumtanger.com",
    sortOrder: 1,
  },
  {
    title: "Villa mediterraneenne de prestige",
    slug: "villa-mediterraneenne-prestige",
    transactionSlug: "buy",
    propertyTypeSlug: "villa",
    status: "published",
    featured: true,
    city: "Tanger",
    neighborhood: "Malabata",
    price: 8500000,
    priceMode: "sale",
    shortDescription:
      "Domaine mediterraneen sur jardins paysagers avec piscine resort et maison d'hotes.",
    longDescription: description(
      "Un magnifique domaine mediterraneen etabli sur plus de 2 hectares de jardins paysagers avec soin. Ce chef-d'oeuvre architectural propose des espaces de vie grandioses, une piscine de style resort, un court de tennis et une maison d'hotes."
    ),
    bedrooms: 7,
    bathrooms: 9,
    area: 12000,
    areaUnit: "sqft",
    features: [
      "Piscine a debordement",
      "Court de tennis",
      "Maison d'hotes",
      "Garage 8 places",
      "Salle de fitness",
      "Spa et sauna",
      "Cuisine exterieure",
      "Portail securise",
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    video:
      "https://cdn.pixabay.com/vimeo/780730376/780730376-e25fa51a0f8888c3d88cb1cac79c5dc2.mp4",
    agentEmail: "hassan@aurumtanger.com",
    sortOrder: 2,
  },
  {
    title: "Bureau executif moderne",
    slug: "bureau-executif-moderne",
    transactionSlug: "rent",
    propertyTypeSlug: "bureau",
    status: "published",
    featured: true,
    city: "Tanger",
    neighborhood: "Centre-Ville",
    price: 15000,
    priceMode: "monthly",
    priceSuffix: "/mois",
    shortDescription:
      "Plateau executive au coeur du quartier d'affaires avec reception, salles de conference et vue panoramique.",
    longDescription: description(
      "Espace bureau haut de gamme au coeur du quartier d'affaires de Tanger. Il dispose d'un plan d'etage ouvert, de bureaux executifs prives, de salles de conference et d'une vue panoramique magnifique."
    ),
    area: 5500,
    areaUnit: "sqft",
    features: [
      "Vue panoramique",
      "Salles de conference",
      "Reception",
      "Salle serveurs",
      "Cuisine equipee",
      "Acces 24/7",
      "Securite batiment",
      "Parking reserve",
    ],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    agentEmail: "mohammed@aurumtanger.com",
    sortOrder: 3,
  },
  {
    title: "Espace commercial prestigieux",
    slug: "espace-commercial-prestigieux",
    transactionSlug: "rent",
    propertyTypeSlug: "commercial",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Quartier Francais",
    price: 25000,
    priceMode: "monthly",
    priceSuffix: "/mois",
    shortDescription:
      "Surface premium pour marques de luxe avec vitrine, hauteur sous plafond et excellent flux client.",
    longDescription: description(
      "Espace commercial exceptionnel dans le quartier francais de Tanger. Parfait pour les marques de luxe, avec des plafonds hauts, des finitions haut de gamme et un excellent flux de clientele."
    ),
    area: 4200,
    areaUnit: "sqft",
    features: [
      "Coin strategique",
      "Plafonds hauts",
      "Vitrines attrayantes",
      "Zone de stockage",
      "Quai de chargement",
      "Parking clientele",
      "Systeme climatisation",
      "Systeme de securite",
    ],
    images: [
      "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1200&q=80",
      "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=1200&q=80",
      "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1200&q=80",
    agentEmail: "fatima@aurumtanger.com",
    sortOrder: 4,
  },
  {
    title: "Terrain bord de mer Tanger",
    slug: "terrain-bord-mer-tanger",
    transactionSlug: "buy",
    propertyTypeSlug: "terrain",
    status: "published",
    featured: true,
    city: "Tanger",
    neighborhood: "Plage de Malabata",
    price: 15000000,
    priceMode: "sale",
    shortDescription:
      "Parcelle rare en premiere ligne de plage avec plans approuves pour une residence signature.",
    longDescription: description(
      "Opportunite rare d'acquerir un terrain en premiere ligne de plage a Tanger. Plans approuves disponibles pour une residence de 2 500 m2 avec vue imprenable sur le detroit."
    ),
    area: 43560,
    areaUnit: "sqft",
    features: [
      "Vue sur mer",
      "Plans approuves",
      "Acces plage privee",
      "Utilitaires disponibles",
      "Terrain plat",
      "Vue sur coucher de soleil",
      "Communaute fermee",
      "Pret pour construction",
    ],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    agentEmail: "ahmed@aurumtanger.com",
    sortOrder: 5,
  },
  {
    title: "Villa bord de mer - location journaliere",
    slug: "villa-bord-mer-location-journaliere",
    transactionSlug: "daily-rent",
    propertyTypeSlug: "villa",
    status: "published",
    featured: true,
    city: "Tanger",
    neighborhood: "Cap Spartel",
    price: 2500,
    priceMode: "daily",
    priceSuffix: "/jour",
    shortDescription:
      "Villa privee en bord de mer avec personnel complet, piscine et services de conciergerie.",
    longDescription: description(
      "Villa luxueuse en bord de mer disponible pour des locations exclusives a la journee. Parfaite pour les evenements, les retraites ou une experience de vacances haut de gamme avec service de conciergerie complet."
    ),
    bedrooms: 5,
    bathrooms: 6,
    area: 6500,
    areaUnit: "sqft",
    features: [
      "Plage privee",
      "Piscine debordante",
      "Personnel complet",
      "Cuisine de chef",
      "Cinema prive",
      "Ponton yacht",
      "Securite 24/7",
      "Helipad",
    ],
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80",
    agentEmail: "nadia@aurumtanger.com",
    sortOrder: 6,
  },
  {
    title: "Appartement urbain contemporain",
    slug: "appartement-urbain-contemporain",
    transactionSlug: "rent",
    propertyTypeSlug: "appartement",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Tanzimit",
    price: 8500,
    priceMode: "monthly",
    priceSuffix: "/mois",
    shortDescription:
      "Appartement elegant avec balcon, vue sur le detroit et finitions contemporaines.",
    longDescription: description(
      "Appartement elegant et sophistique au coeur du quartier huppe de Tanzimit. Design moderne, electromenagers haut de gamme et vue spectaculaire sur le detroit."
    ),
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    areaUnit: "sqft",
    features: [
      "Vue sur detroit",
      "Cuisine moderne",
      "Lave-linge integre",
      "Parquet bois",
      "Balcon",
      "Acces salle fitness",
      "Concierge",
      "Animaux acceptes",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    agentEmail: "karim@aurumtanger.com",
    sortOrder: 7,
  },
  {
    title: "Suite penthouse executive",
    slug: "suite-penthouse-executive",
    transactionSlug: "daily-rent",
    propertyTypeSlug: "appartement",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Medina ancienne",
    price: 1200,
    priceMode: "daily",
    priceSuffix: "/jour",
    shortDescription:
      "Penthouse court sejour pour cadres et voyageurs exigeants en recherche de service premium.",
    longDescription: description(
      "Penthouse exclusif disponible pour des sejours de courte duree. Parfait pour les cadres et voyageurs exigeants cherchant les meilleures accommodations de Tanger."
    ),
    bedrooms: 3,
    bathrooms: 2,
    area: 2400,
    areaUnit: "sqft",
    features: [
      "Terrasse",
      "Vue sur ville",
      "Conciergerie",
      "Mobilier designer",
      "Linge haut de gamme",
      "Machine espresso",
      "Smart TV",
      "Service de transfert",
    ],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    agentEmail: "amina@aurumtanger.com",
    sortOrder: 8,
  },
  {
    title: "Immeuble de bureaux historique",
    slug: "immeuble-bureaux-historique",
    transactionSlug: "buy",
    propertyTypeSlug: "commercial",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Ville Nouvelle",
    price: 12000000,
    priceMode: "sale",
    shortDescription:
      "Immeuble renove avec cachet historique, ideal pour une strategie multi-locataire premium.",
    longDescription: description(
      "Prestigieux immeuble de bureaux historique dans le coeur de Tanger. Entierement renove avec des equipements modernes tout en preservant les details architecturaux d'origine."
    ),
    area: 25000,
    areaUnit: "sqft",
    features: [
      "Batiment historique",
      "Interieur renove",
      "Ascenseurs",
      "Quai de chargement",
      "Emplacement central",
      "Multi-locataires",
      "Garage parking",
      "Terrasse sur toit",
    ],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    agentEmail: "mohammed@aurumtanger.com",
    sortOrder: 9,
  },
  {
    title: "Parcelle de developpement vue montagne",
    slug: "parcelle-developpement-vue-montagne",
    transactionSlug: "buy",
    propertyTypeSlug: "terrain",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Dhar Al-Baraka",
    price: 3500000,
    priceMode: "sale",
    shortDescription:
      "Deux hectares avec vues degagees sur le Rif, parfaits pour un projet de residence signature.",
    longDescription: description(
      "Parcelle exceptionnelle de 2 hectares avec vue panoramique sur les montagnes du Rif. Parfaite pour construire votre residence de reve avec vue spectaculaire."
    ),
    area: 87120,
    areaUnit: "sqft",
    features: [
      "Vue montagne",
      "Acces route",
      "Utilitaires disponibles",
      "Intimite boisee",
      "Orientation sud",
      "Construction approuvee",
      "Leve complet",
      "Fort potentiel",
    ],
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    agentEmail: "ahmed@aurumtanger.com",
    sortOrder: 10,
  },
  {
    title: "Villa moderne avec piscine",
    slug: "villa-moderne-piscine",
    transactionSlug: "rent",
    propertyTypeSlug: "villa",
    status: "published",
    featured: true,
    city: "Tanger",
    neighborhood: "Benaksas",
    price: 35000,
    priceMode: "monthly",
    priceSuffix: "/mois",
    shortDescription:
      "Villa contemporaine avec vues panoramiques, piscine a debordement et espaces de reception ouverts.",
    longDescription: description(
      "Magnifique villa moderne avec piscine a debordement et vue panoramique spectaculaire. Parfaite pour se divertir avec espaces a aire ouverte et terrasses exterieures."
    ),
    bedrooms: 5,
    bathrooms: 5,
    area: 7500,
    areaUnit: "sqft",
    features: [
      "Piscine a debordement",
      "Vue panoramique",
      "Cinema prive",
      "Cave a vin",
      "Cuisine exterieure",
      "Domotique",
      "Garage 3 places",
      "Systeme de securite",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    agentEmail: "hassan@aurumtanger.com",
    sortOrder: 11,
  },
  {
    title: "Espace bureau boutique",
    slug: "espace-bureau-boutique",
    transactionSlug: "daily-rent",
    propertyTypeSlug: "bureau",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Centre-Ville",
    price: 500,
    priceMode: "daily",
    priceSuffix: "/jour",
    shortDescription:
      "Bureau premium a la journee pour ateliers, meetings et besoins flexibles de haut niveau.",
    longDescription: description(
      "Espace bureau boutique haut de gamme disponible pour location a la journee. Ideal pour les reunions, ateliers ou besoins d'espace de travail temporaire."
    ),
    area: 1200,
    areaUnit: "sqft",
    features: [
      "Salle de conference",
      "WiFi haut debit",
      "Acces cuisine",
      "Equipement AV",
      "Reception",
      "Parking",
      "Bar a cafe",
      "Espace exterieur",
    ],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    agentEmail: "karim@aurumtanger.com",
    sortOrder: 12,
  },
  {
    title: "Bureau signature vue marina",
    slug: "bureau-signature-vue-marina",
    transactionSlug: "buy",
    propertyTypeSlug: "bureau",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Marina Bay",
    price: 6800000,
    priceMode: "sale",
    shortDescription:
      "Plateau corporate premium avec reception privee, salles modulables et vue marina.",
    longDescription: description(
      "Plateau de bureaux haut de gamme avec vue sur la marina, reception privee et espaces de reunion modulables pour une entreprise en croissance."
    ),
    area: 8200,
    areaUnit: "sqft",
    features: [
      "Reception privee",
      "Salle de conseil",
      "Open space premium",
      "Bureaux prives",
      "Fibre dediee",
      "Parking securise",
      "Acces 24/7",
      "Vue marina",
    ],
    images: [
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&q=80",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&q=80",
    agentEmail: "salma@aurumtanger.com",
    sortOrder: 13,
  },
  {
    title: "Terrain naturel route du cap",
    slug: "terrain-naturel-route-du-cap",
    transactionSlug: "rent",
    propertyTypeSlug: "terrain",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Route du Cap Spartel",
    price: 18000,
    priceMode: "monthly",
    priceSuffix: "/mois",
    shortDescription:
      "Terrain amenage pour activations saisonnieres, hospitality events ou projets modulaires.",
    longDescription: description(
      "Grand terrain amenage pour activations saisonnieres, hospitality events ou projets modulaires avec acces direct depuis la route du Cap."
    ),
    area: 56000,
    areaUnit: "sqft",
    features: [
      "Acces facile",
      "Vue ocean",
      "Surface plane",
      "Cloture partielle",
      "Raccordements proches",
      "Usage evenementiel",
      "Parking temporaire",
      "Zone premium",
    ],
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    agentEmail: "ahmed@aurumtanger.com",
    sortOrder: 14,
  },
  {
    title: "Showroom evenementiel waterfront",
    slug: "showroom-evenementiel-waterfront",
    transactionSlug: "daily-rent",
    propertyTypeSlug: "commercial",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Waterfront",
    price: 1900,
    priceMode: "daily",
    priceSuffix: "/jour",
    shortDescription:
      "Lieu scenographique pour lancements de produit, pop-ups et receptions privees.",
    longDescription: description(
      "Espace commercial scenographique pour lancements de produit, pop-ups et receptions privees avec facade vitree et services de conciergerie."
    ),
    area: 3600,
    areaUnit: "sqft",
    features: [
      "Facade vitree",
      "Eclairage scenique",
      "Back office",
      "Cuisine traiteur",
      "Acces VIP",
      "Sonorisation",
      "Wifi professionnel",
      "Parking invite",
    ],
    images: [
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
      "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
    agentEmail: "leila@aurumtanger.com",
    sortOrder: 15,
  },
  {
    title: "Terrain panoramique camp horizon",
    slug: "terrain-panoramique-camp-horizon",
    transactionSlug: "daily-rent",
    propertyTypeSlug: "terrain",
    status: "published",
    featured: false,
    city: "Tanger",
    neighborhood: "Peripherie Achakar",
    price: 950,
    priceMode: "daily",
    priceSuffix: "/jour",
    shortDescription:
      "Terrain privatisable pour retraites exclusives, installations lifestyle et evenements outdoor.",
    longDescription: description(
      "Terrain panoramique privatisable pour retraites exclusives, installations lifestyle et evenements outdoor avec vues degagees sur la cote."
    ),
    area: 64000,
    areaUnit: "sqft",
    features: [
      "Vue panoramique",
      "Acces securise",
      "Zone evenementielle",
      "Point eau",
      "Surface modulable",
      "Coucher de soleil",
      "Parking service",
      "Calme absolu",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    agentEmail: "ahmed@aurumtanger.com",
    sortOrder: 16,
  },
];

export const seedPages: PageContentMap = {
  home: {
    hero: {
      eyebrow: "Proprietes exceptionnelles a Tanger",
      title: "Decouvrez votre domaine",
      highlight: "de luxe ideal",
      description:
        "Selectionnez les plus belles proprietes de Tanger pour les acheteurs et locataires exigeants en quete d'elegance et de sophistication inegalees.",
      backgroundImage:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    },
    about: {
      eyebrow: "A propos de Aurum Tanger",
      title: "Redefinir le luxe immobilier",
      descriptionPrimary:
        "Depuis plus de deux decennies, Aurum Tanger est la destination de reference pour des proprietes exceptionnelles. Nous comprenons que trouver la maison parfaite est plus qu'une transaction: c'est decouvrir un espace qui reflete vos aspirations et votre style de vie.",
      descriptionSecondary:
        "Notre portefeuille selectionne presente les residences les plus exclusives, des domaines en bord de mer aux retraites en penthouse, chacune choisie pour sa distinction architecturale et sa qualite sans compromis.",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
      ],
      features: [
        "Annonces exclusives",
        "Agents experts",
        "Reseau international",
        "Service personnalise",
      ],
      ctaLabel: "Explorez nos proprietes",
      ctaHref: "/buy",
    },
    featured: {
      eyebrow: "Selection curatee",
      title: "Proprietes en vedette",
      ctaLabel: "Voir toutes les proprietes",
      ctaHref: "/properties",
      limit: 6,
    },
    testimonials: {
      eyebrow: "La voix de nos clients",
      title: "Des experiences discretes, fluides et memorables",
      description:
        "Chaque transaction est accompagnee avec le meme niveau de rigueur, de clarte et de sens du detail. Voici comment nos clients decrivent l'experience Aurum.",
      stats: [
        { label: "Repeat clients", value: "98%" },
        { label: "First shortlist", value: "24h" },
        { label: "Client rating", value: "5.0" },
      ],
      items: [
        {
          quote:
            "Aurum a securise un appartement waterfront avant sa mise sur le marche public. L'accompagnement a ete precis, discret et tres rassurant jusqu'a la signature.",
          name: "Samira El Khoury",
          role: "Investisseur prive",
          focus: "Appartement | Acheter",
        },
        {
          quote:
            "Nous cherchions une villa familiale en location longue duree avec un niveau de finition irreprochable. L'equipe a compris le brief des le premier rendez-vous.",
          name: "Nabil Tazi",
          role: "Directeur general",
          focus: "Villa | Louer",
        },
        {
          quote:
            "Pour notre retreat executif, nous avions besoin d'un lieu fort, flexible et impeccable. La recommandation d'Aurum a transforme l'experience de tout l'evenement.",
          name: "Lea Marchand",
          role: "Fondatrice studio evenementiel",
          focus: "Commercial | Location journaliere",
        },
        {
          quote:
            "Leur lecture du marche local nous a fait gagner un temps considerable. Les biens proposes etaient pertinents, bien negocies et parfaitement alignes avec notre strategie.",
          name: "Rachid Benali",
          role: "Family office advisor",
          focus: "Bureau | Acheter",
        },
      ],
    },
    cta: {
      eyebrow: "Commencez votre aventure",
      title: "Pret a trouver votre propriete de reve ?",
      description:
        "Que vous cherchiez a acheter, louer ou investir, notre equipe d'experts est la pour vous guider a chaque etape de votre parcours immobilier.",
      backgroundImage:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
      primaryLabel: "Parcourir les proprietes",
      primaryHref: "/buy",
      secondaryLabel: "Nous contacter",
      secondaryHref: "/#contact",
    },
    contact: {
      eyebrow: "Nous contacter",
      title: "Contactez notre equipe",
      formTitle: "Envoyer le message",
      offices: [
        { name: "Tanger", lines: ["Boulevard Pasteur, Suite 500", "Tanger, 90000 Maroc"] },
        { name: "Casablanca", lines: ["Boulevard de la Corniche", "Casablanca, 20100 Maroc"] },
        { name: "Marrakech", lines: ["Gueliz Square", "Marrakech, 40000 Maroc"] },
      ],
    },
  },
  buy: {
    hero: {
      eyebrow: "Proprietes a vendre",
      title: "Trouvez votre investissement",
      highlight: "de reve",
      description:
        "Explorez notre collection curatee de proprietes exceptionnelles disponibles a l'achat, chacune representant le summum du luxe immobilier.",
      backgroundImage:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80",
    },
    categorySection: {
      eyebrow: "Choisissez votre style",
      title: "Types de proprietes",
      description:
        "Selectionnez un type de bien pour explorer nos annonces exclusives disponibles a l'achat.",
    },
    stats: [
      { label: "Sales Volume", value: "$2.5B+" },
      { label: "Properties Sold", value: "500+" },
      { label: "Expert Agents", value: "50+" },
      { label: "Years Experience", value: "20+" },
    ],
    whyBuy: {
      eyebrow: "Why choose us",
      title: "Expert guidance for your investment",
      description:
        "When you purchase through Aurum Estates, you're not just buying a property. You're making a strategic investment with the support of industry-leading expertise.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      items: [
        {
          number: "01",
          title: "Market analysis",
          description:
            "Comprehensive market insights to ensure your investment decision is well informed.",
        },
        {
          number: "02",
          title: "Legal support",
          description:
            "Full legal assistance throughout the purchase process for complete peace of mind.",
        },
        {
          number: "03",
          title: "Financing options",
          description:
            "Access to exclusive financing solutions tailored to your profile and goals.",
        },
      ],
    },
    listing: {
      eyebrow: "Selection active",
      title: "Dernieres opportunites a l'achat",
      description:
        "Retrouvez les annonces publiees les plus recentes, filtrees automatiquement sur l'achat.",
    },
  },
  rent: {
    hero: {
      eyebrow: "Proprietes a louer",
      title: "Vivez dans le",
      highlight: "luxe",
      description:
        "Experimentez la vie premium avec notre selection curatee de proprietes a louer, offrant la flexibilite sans compromettre l'elegance.",
      backgroundImage:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80",
    },
    categorySection: {
      eyebrow: "Choose your style",
      title: "Types de proprietes",
      description:
        "Selectionnez un type de bien pour explorer nos locations premium.",
    },
    benefits: {
      eyebrow: "Rental benefits",
      title: "Why rent with Aurum",
      items: [
        {
          title: "Verified properties",
          description:
            "Every property is personally inspected and verified by our team before publication.",
        },
        {
          title: "Flexible terms",
          description:
            "Customizable lease durations for long stays, executive assignments or seasonal needs.",
        },
        {
          title: "24/7 support",
          description:
            "Dedicated support team available around the clock throughout the tenant journey.",
        },
      ],
    },
    listing: {
      eyebrow: "Selection active",
      title: "Biens disponibles a la location",
      description:
        "Resultats filtres sur la location longue duree avec mise a jour via les taxonomies du CMS.",
    },
  },
  "daily-rent": {
    hero: {
      eyebrow: "Locations journalieres",
      title: "Experiences",
      highlight: "exclusives",
      description:
        "De magnifiques retraites de vacances aux lieux d'evenements sophistiques, decouvrez des proprietes premium disponibles en location journaliere.",
      backgroundImage:
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80",
    },
    categorySection: {
      eyebrow: "Choose your experience",
      title: "Types de proprietes",
      description:
        "Selectionnez un type de bien pour explorer nos options exclusives de location journaliere.",
    },
    services: {
      eyebrow: "Premium services",
      title: "Every day is extraordinary",
      description:
        "Nos proprietes journalieres incluent des services et amenites concus pour rendre chaque moment memorable.",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
      ],
      points: [
        "Concierge service",
        "Private chef available",
        "Chauffeur service",
        "Daily housekeeping",
        "Event planning",
        "24/7 security",
      ],
    },
    useCases: {
      eyebrow: "Perfect for",
      title: "Every occasion",
      items: [
        {
          title: "Vacation retreats",
          description: "Luxury escapes",
          image:
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
        },
        {
          title: "Private events",
          description: "Memorable celebrations",
          image:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
        },
        {
          title: "Corporate meetings",
          description: "Impressive venues",
          image:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
        },
        {
          title: "Film and photo",
          description: "Stunning backdrops",
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
        },
      ],
    },
    listing: {
      eyebrow: "Selection active",
      title: "Disponibilites journalieres",
      description:
        "Annonces de sejour court, privatisation et experiences premium mises a jour depuis l'admin.",
    },
  },
  about: {
    hero: {
      eyebrow: "A propos",
      title: "Une agence fondee sur la",
      highlight: "selection",
      description:
        "Nous accompagnons l'achat, la location et les experiences journalieres haut de gamme a Tanger avec une approche plus precise, plus discrete et plus exigeante.",
      backgroundImage:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    },
    story: {
      eyebrow: "Notre histoire",
      title: "Selection, accompagnement et execution",
      descriptionPrimary:
        "MDK IMMOBILIER Real Estate agit comme un partenaire de confiance pour les clients qui attendent plus qu'une simple recherche de biens. Notre role consiste a cadrer le besoin, filtrer le marche et construire un parcours clair jusqu'a la signature.",
      descriptionSecondary:
        "Nous privilegions la qualite de portefeuille, la lecture du quartier, le potentiel patrimonial et la qualite de service. Chaque recommandation est pensee pour reduire le bruit et accelerer la bonne decision.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      features: [
        "Selection curatee",
        "Accompagnement sur mesure",
        "Lecture precise du marche",
        "Execution rapide et discrete",
      ],
    },
    values: {
      eyebrow: "Nos valeurs",
      title: "Ce qui structure chaque mission",
      items: [
        {
          title: "Clarte",
          description:
            "Des recommandations argumentees, des processus lisibles et des priorites nettes.",
        },
        {
          title: "Discretion",
          description:
            "Une execution respectueuse de la confidentialite attendue sur les dossiers sensibles.",
        },
        {
          title: "Exigence",
          description:
            "Une selection rigoureuse et un niveau de finition controle avant publication.",
        },
      ],
    },
  },
  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Parlons de votre prochain",
      highlight: "projet",
      description:
        "Que vous souhaitiez acheter, louer, privatiser un lieu ou simplement cadrer votre recherche, notre equipe vous repond rapidement avec un premier niveau d'orientation concret.",
      backgroundImage:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
    },
    intro: {
      eyebrow: "Nous contacter",
      title: "Une equipe disponible et reactive",
      description:
        "Envoyez votre demande avec quelques details sur le type de bien, la localisation et votre calendrier. Nous revenons vers vous avec une premiere orientation et des options pertinentes.",
    },
    offices: [
      { name: "Tanger", lines: ["Boulevard Pasteur, Suite 500", "Tanger, 90000 Maroc"] },
      { name: "Casablanca", lines: ["Boulevard de la Corniche", "Casablanca, 20100 Maroc"] },
      { name: "Marrakech", lines: ["Gueliz Square", "Marrakech, 40000 Maroc"] },
    ],
    form: {
      title: "Envoyer une demande",
      submitLabel: "Envoyer le message",
    },
  },
};

export function getSeedPage<TPageKey extends PageKey>(pageKey: TPageKey): PageContentMap[TPageKey] {
  return seedPages[pageKey];
}

export function getSeedMediaUrls(): string[] {
  const urls = new Set<string>();

  urls.add(seedSiteSettings.logoUrl);
  urls.add(seedSiteSettings.defaultOgImage);
  urls.add(seedNavigation.logoUrl);

  seedTransactionTypes.forEach((item) => {
    if (item.imageUrl) urls.add(item.imageUrl);
  });

  seedPropertyTypes.forEach((item) => {
    if (item.imageUrl) urls.add(item.imageUrl);
  });

  seedAgents.forEach((agent) => {
    if (agent.photoUrl) urls.add(agent.photoUrl);
  });

  seedProperties.forEach((property) => {
    if (property.coverImage) urls.add(property.coverImage);
    if (property.ogImage) urls.add(property.ogImage);
    property.images.forEach((image) => urls.add(image));
  });

  const pages = Object.values(seedPages) as Array<
    | HomePageContent
    | BuyPageContent
    | RentPageContent
    | DailyRentPageContent
    | AboutPageContent
    | ContactPageContent
  >;

  pages.forEach((page) => {
    if ("hero" in page && page.hero.backgroundImage) {
      urls.add(page.hero.backgroundImage);
    }
  });

  seedPages.home.about.images.forEach((image) => urls.add(image));
  urls.add(seedPages.home.cta.backgroundImage);
  urls.add(seedPages.buy.whyBuy.image);
  seedPages["daily-rent"].services.images.forEach((image) => urls.add(image));
  seedPages["daily-rent"].useCases.items.forEach((item) => urls.add(item.image));
  urls.add(seedPages.about.story.image);

  return Array.from(urls).filter(Boolean);
}
