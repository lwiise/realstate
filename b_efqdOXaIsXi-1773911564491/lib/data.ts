// Property Types - Easily editable
export const PROPERTY_TYPES = [
  "Appartement",
  "Villa",
  "Bureau",
  "Commercial",
  "Terrain",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

// Transaction Types
export const TRANSACTION_TYPES = ["Acheter", "Louer", "Location Journalière"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

// Property Interface
export interface Property {
  id: string;
  title: string;
  slug: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  price: number;
  priceUnit?: string;
  city: string;
  neighborhood: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  description: string;
  features: string[];
  images: string[];
  video?: string;
  featured: boolean;
  agent: {
    name: string;
    image: string;
    phone: string;
    email: string;
  };
}

// Mock Property Data
export const properties: Property[] = [
  {
    id: "1",
    title: "Penthouse de Luxe avec Vue Panoramique",
    slug: "penthouse-de-luxe-vue-panoramique",
    transactionType: "Acheter",
    propertyType: "Appartement",
    price: 2500000,
    city: "Tanger",
    neighborhood: "Médina",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    description:
      "Découvrez le luxe inégalé de ce magnifique penthouse avec des fenêtres du sol au plafond offrant une vue panoramique spectaculaire. Cette résidence méticuleusement conçue propose des finitions haut de gamme, incluant des sols en marbre italien, des boiseries personnalisées et un système domotique à la pointe de la technologie.",
    features: [
      "Ascenseur Privé",
      "Terrasse Panoramique",
      "Conciergerie 24/7",
      "Cave à Vin",
      "Cinéma Privé",
      "Chauffage par le Sol",
      "Système Domotique",
      "Parking (2 Places)",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    video: "https://cdn.pixabay.com/vimeo/780730376/780730376-e25fa51a0f8888c3d88cb1cac79c5dc2.mp4",
    featured: true,
    agent: {
      name: "Amina Bennani",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
      phone: "+212 6 12-34-56-78",
      email: "amina@aurumtanger.com",
    },
  },
  {
    id: "2",
    title: "Villa Méditerranéenne de Prestige",
    slug: "villa-mediterraneenne-prestige",
    transactionType: "Acheter",
    propertyType: "Villa",
    price: 8500000,
    city: "Tanger",
    neighborhood: "Malabata",
    bedrooms: 7,
    bathrooms: 9,
    area: 12000,
    description:
      "Un magnifique domaine méditerranéen établi sur plus de 2 hectares de jardins paysagés avec soin. Ce chef-d'œuvre architectural propose des espaces de vie grandioses, une piscine de style resort, un court de tennis et une maison d'hôtes.",
    features: [
      "Piscine à Débordement",
      "Court de Tennis",
      "Maison d'Hôtes",
      "Garage 8 Places",
      "Salle de Fitness",
      "Spa & Sauna",
      "Cuisine Extérieure",
      "Portail Sécurisé",
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    video: "https://cdn.pixabay.com/vimeo/780730376/780730376-e25fa51a0f8888c3d88cb1cac79c5dc2.mp4",
    featured: true,
    agent: {
      name: "Hassan Kharrouby",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      phone: "+212 6 22-33-44-55",
      email: "hassan@aurumtanger.com",
    },
  },
  {
    id: "3",
    title: "Bureau Exécutif Moderne",
    slug: "bureau-executif-moderne",
    transactionType: "Louer",
    propertyType: "Bureau",
    price: 15000,
    priceUnit: "/mois",
    city: "Tanger",
    neighborhood: "Centre-Ville",
    area: 5500,
    description:
      "Espace bureau haut de gamme au cœur du quartier d'affaires de Tanger. Dispose d'un plan d'étage ouvert, de bureaux exécutifs privés, de salles de conférence et d'une vue panoramique magnifique.",
    features: [
      "Vue Panoramique",
      "Salles de Conférence",
      "Réception",
      "Salle Serveurs",
      "Cuisine Équipée",
      "Accès 24/7",
      "Sécurité Bâtiment",
      "Parking Réservé",
    ],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    ],
    featured: true,
    agent: {
      name: "Mohammed Tahir",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      phone: "+212 6 33-44-55-66",
      email: "mohammed@aurumtanger.com",
    },
  },
  {
    id: "4",
    title: "Espace Commercial Prestigieux",
    slug: "espace-commercial-prestigieux",
    transactionType: "Louer",
    propertyType: "Commercial",
    price: 25000,
    priceUnit: "/mois",
    city: "Tanger",
    neighborhood: "Quartier Français",
    area: 4200,
    description:
      "Espace commercial exceptionnel dans le quartier français de Tanger. Parfait pour les marques de luxe, avec des plafonds hauts, des finitions haut de gamme et un excellent flux de clientèle.",
    features: [
      "Coin Stratégique",
      "Plafonds Hauts",
      "Vitrines Attrayantes",
      "Zone de Stockage",
      "Quai de Chargement",
      "Parking Clientèle",
      "Système Climatisation",
      "Système de Sécurité",
    ],
    images: [
      "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1200&q=80",
      "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=1200&q=80",
      "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Fatima Larbi",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
      phone: "+212 6 44-55-66-77",
      email: "fatima@aurumtanger.com",
    },
  },
  {
    id: "5",
    title: "Terrain Bord de Mer Tanger",
    slug: "terrain-bord-mer-tanger",
    transactionType: "Acheter",
    propertyType: "Terrain",
    price: 15000000,
    city: "Tanger",
    neighborhood: "Plage de Malabata",
    area: 43560,
    description:
      "Opportunité rare d'acquérir un terrain en première ligne de plage à Tanger. Plans approuvés disponibles pour une résidence de 2 500 m² avec vue imprenable sur le détroit.",
    features: [
      "Vue sur Mer",
      "Plans Approuvés",
      "Accès Plage Privée",
      "Utilitaires Disponibles",
      "Terrain Plat",
      "Vue sur Coucher de Soleil",
      "Communauté Fermée",
      "Prêt pour Construction",
    ],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
    ],
    featured: true,
    agent: {
      name: "Ahmed Moroccan",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      phone: "+212 6 55-66-77-88",
      email: "ahmed@aurumtanger.com",
    },
  },
  {
    id: "6",
    title: "Villa Bord de Mer - Location Journalière",
    slug: "villa-bord-mer-location-journaliere",
    transactionType: "Location Journalière",
    propertyType: "Villa",
    price: 2500,
    priceUnit: "/nuit",
    city: "Tanger",
    neighborhood: "Cap Spartel",
    bedrooms: 5,
    bathrooms: 6,
    area: 6500,
    description:
      "Villa luxueuse en bord de mer disponible pour des locations exclusives à la journée. Parfaite pour les événements, les retraites ou une expérience de vacances haut de gamme avec service de conciergerie complet.",
    features: [
      "Plage Privée",
      "Piscine Débordante",
      "Personnel Complet",
      "Cuisine de Chef",
      "Cinéma Privé",
      "Ponton Yacht",
      "Sécurité 24/7",
      "Hélipad",
    ],
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    ],
    featured: true,
    agent: {
      name: "Nadia Fassi",
      image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=200&q=80",
      phone: "+212 6 66-77-88-99",
      email: "nadia@aurumtanger.com",
    },
  },
  {
    id: "7",
    title: "Appartement Urbain Contemporain",
    slug: "appartement-urbain-contemporain",
    transactionType: "Louer",
    propertyType: "Appartement",
    price: 8500,
    priceUnit: "/mois",
    city: "Tanger",
    neighborhood: "Tanzimit",
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    description:
      "Appartement élégant et sophistiqué au cœur du quartier huppé de Tanzimit. Design moderne, électroménagers haut de gamme et vue spectaculaire sur le détroit.",
    features: [
      "Vue sur Détroit",
      "Cuisine Moderne",
      "Lave-linge Intégré",
      "Parquets Bois",
      "Balcon",
      "Accès Salle Fitness",
      "Concierge",
      "Animaux Acceptés",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Karim Idrissi",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
      phone: "+212 6 77-88-99-00",
      email: "karim@aurumtanger.com",
    },
  },
  {
    id: "8",
    title: "Suite Penthouse Exécutive",
    slug: "suite-penthouse-executive",
    transactionType: "Location Journalière",
    propertyType: "Appartement",
    price: 1200,
    priceUnit: "/nuit",
    city: "Tanger",
    neighborhood: "Médina Ancienne",
    bedrooms: 3,
    bathrooms: 2,
    area: 2400,
    description:
      "Penthouse exclusif disponible pour des séjours de courte durée. Parfait pour les cadres et voyageurs exigeants cherchant les meilleures accommodations de Tanger.",
    features: [
      "Terrasse",
      "Vue sur Ville",
      "Conciergerie",
      "Mobilier Designer",
      "Linge Haut de Gamme",
      "Machine Espresso",
      "Smart TV",
      "Service de Transfert",
    ],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Amina Bennani",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
      phone: "+212 6 12-34-56-78",
      email: "amina@aurumtanger.com",
    },
  },
  {
    id: "9",
    title: "Immeuble de Bureaux Historique",
    slug: "immeuble-bureaux-historique",
    transactionType: "Acheter",
    propertyType: "Commercial",
    price: 12000000,
    city: "Tanger",
    neighborhood: "Ville Nouvelle",
    area: 25000,
    description:
      "Prestigieux immeuble de bureaux historique dans le cœur de Tanger. Entièrement rénové avec des équipements modernes tout en préservant les détails architecturaux d'origine.",
    features: [
      "Bâtiment Historique",
      "Intérieur Rénové",
      "Ascenseurs",
      "Quai de Chargement",
      "Emplacement Central",
      "Multi-locataires",
      "Garage Parking",
      "Terrasse sur Toit",
    ],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Mohammed Tahir",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      phone: "+212 6 33-44-55-66",
      email: "mohammed@aurumtanger.com",
    },
  },
  {
    id: "10",
    title: "Parcelle de Développement Vue Montagne",
    slug: "parcelle-developpement-vue-montagne",
    transactionType: "Acheter",
    propertyType: "Terrain",
    price: 3500000,
    city: "Tanger",
    neighborhood: "Dhar Al-Baraka",
    area: 87120,
    description:
      "Parcelle exceptionnelle de 2 hectares avec vue panoramique sur les montagnes du Rif. Parfaite pour construire votre résidence de rêve avec vue spectaculaire.",
    features: [
      "Vue Montagne",
      "Accès Route",
      "Utilitaires Disponibles",
      "Accès Routier",
      "Intimité Boisée",
      "Orientation Sud",
      "Construction Approuvée",
      "Levé Complet",
    ],
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Ahmed Moroccan",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      phone: "+212 6 55-66-77-88",
      email: "ahmed@aurumtanger.com",
    },
  },
  {
    id: "11",
    title: "Villa Moderne avec Piscine",
    slug: "villa-moderne-piscine",
    transactionType: "Louer",
    propertyType: "Villa",
    price: 35000,
    priceUnit: "/mois",
    city: "Tanger",
    neighborhood: "Benaksas",
    bedrooms: 5,
    bathrooms: 5,
    area: 7500,
    description:
      "Magnifique villa moderne avec piscine à débordement et vue panoramique spectaculaire. Parfaite pour se divertir avec espaces à aire ouverte et terrasses extérieures.",
    features: [
      "Piscine à Débordement",
      "Vue Panoramique",
      "Cinéma Privé",
      "Cave à Vin",
      "Cuisine Extérieure",
      "Domotique",
      "Garage 3 Places",
      "Système de Sécurité",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    ],
    featured: true,
    agent: {
      name: "Hassan Kharrouby",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      phone: "+212 6 22-33-44-55",
      email: "hassan@aurumtanger.com",
    },
  },
  {
    id: "12",
    title: "Espace Bureau Boutique",
    slug: "espace-bureau-boutique",
    transactionType: "Location Journalière",
    propertyType: "Bureau",
    price: 500,
    priceUnit: "/jour",
    city: "Tanger",
    neighborhood: "Centre-Ville",
    area: 1200,
    description:
      "Espace bureau boutique haut de gamme disponible pour location à la journée. Idéal pour les réunions, ateliers ou besoins d'espace de travail temporaire.",
    features: [
      "Salle de Conférence",
      "WiFi Haut Débit",
      "Accès Cuisine",
      "Équipement AV",
      "Réception",
      "Parking",
      "Bar à Café",
      "Espace Extérieur",
    ],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Karim Idrissi",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
      phone: "+212 6 77-88-99-00",
      email: "karim@aurumtanger.com",
    },
  },
  {
    id: "13",
    title: "Bureau Signature Vue Marina",
    slug: "bureau-signature-vue-marina",
    transactionType: TRANSACTION_TYPES[0],
    propertyType: "Bureau",
    price: 6800000,
    city: "Tanger",
    neighborhood: "Marina Bay",
    area: 8200,
    description:
      "Plateau de bureaux haut de gamme avec vue sur la marina, reception privee et espaces de reunion modulables pour une entreprise en croissance.",
    features: [
      "Reception Privee",
      "Salle de Conseil",
      "Open Space Premium",
      "Bureaux Prives",
      "Fibre Dediee",
      "Parking Securise",
      "Acces 24/7",
      "Vue Marina",
    ],
    images: [
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&q=80",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Salma Idrissi",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      phone: "+212 6 18-22-44-66",
      email: "salma@aurumtanger.com",
    },
  },
  {
    id: "14",
    title: "Terrain Naturel Route du Cap",
    slug: "terrain-naturel-route-du-cap",
    transactionType: TRANSACTION_TYPES[1],
    propertyType: "Terrain",
    price: 18000,
    priceUnit: "/mois",
    city: "Tanger",
    neighborhood: "Route du Cap Spartel",
    area: 56000,
    description:
      "Grand terrain amenage pour activations saisonnieres, hospitality events ou projets modulaires avec acces direct depuis la route du Cap.",
    features: [
      "Acces Facile",
      "Vue Ocean",
      "Surface Plane",
      "Cloture Partielle",
      "Raccordements Proches",
      "Usage Evenementiel",
      "Parking Temporaire",
      "Zone Premium",
    ],
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Youssef El Amrani",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      phone: "+212 6 58-11-29-73",
      email: "youssef@aurumtanger.com",
    },
  },
  {
    id: "15",
    title: "Showroom Evenementiel Waterfront",
    slug: "showroom-evenementiel-waterfront",
    transactionType: TRANSACTION_TYPES[2],
    propertyType: "Commercial",
    price: 1900,
    priceUnit: "/jour",
    city: "Tanger",
    neighborhood: "Waterfront",
    area: 3600,
    description:
      "Espace commercial scenographique pour lancements de produit, pop-ups et receptions privees avec facade vitree et services de conciergerie.",
    features: [
      "Facade Vitree",
      "Eclairage Scenique",
      "Back Office",
      "Cuisine Traiteur",
      "Acces VIP",
      "Sonorisation",
      "Wifi Professionnel",
      "Parking Invite",
    ],
    images: [
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
      "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Leila Bennouna",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      phone: "+212 6 70-30-40-50",
      email: "leila@aurumtanger.com",
    },
  },
  {
    id: "16",
    title: "Terrain Panoramique Camp Horizon",
    slug: "terrain-panoramique-camp-horizon",
    transactionType: TRANSACTION_TYPES[2],
    propertyType: "Terrain",
    price: 950,
    priceUnit: "/jour",
    city: "Tanger",
    neighborhood: "Peripherie Achakar",
    area: 64000,
    description:
      "Terrain panoramique privatisable pour retraites exclusives, installations lifestyle et evenements outdoor avec vues degagees sur la cote.",
    features: [
      "Vue Panoramique",
      "Acces Securise",
      "Zone Evenementielle",
      "Point Eau",
      "Surface Modulable",
      "Coucher de Soleil",
      "Parking Service",
      "Calme Absolu",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    ],
    featured: false,
    agent: {
      name: "Omar Chraibi",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      phone: "+212 6 63-21-18-45",
      email: "omar@aurumtanger.com",
    },
  },
];

// Helper functions
const TRANSACTION_TYPE_ALIASES: Record<string, TransactionType> = {
  [TRANSACTION_TYPES[0]]: TRANSACTION_TYPES[0],
  Buy: TRANSACTION_TYPES[0],
  [TRANSACTION_TYPES[1]]: TRANSACTION_TYPES[1],
  Rent: TRANSACTION_TYPES[1],
  [TRANSACTION_TYPES[2]]: TRANSACTION_TYPES[2],
  "Location Journaliere": TRANSACTION_TYPES[2],
  "Location JournaliÃ¨re": TRANSACTION_TYPES[2],
  "Daily Rent": TRANSACTION_TYPES[2],
};

const PROPERTY_TYPE_ALIASES: Record<string, PropertyType> = {
  Appartement: "Appartement",
  Appartements: "Appartement",
  Villa: "Villa",
  Villas: "Villa",
  Bureau: "Bureau",
  Bureaux: "Bureau",
  Commercial: "Commercial",
  Terrain: "Terrain",
  Terrains: "Terrain",
};

export function normalizeTransactionType(value?: string | null): TransactionType | undefined {
  if (!value) return undefined;
  return TRANSACTION_TYPE_ALIASES[value];
}

export function normalizePropertyType(value?: string | null): PropertyType | undefined {
  if (!value) return undefined;
  return PROPERTY_TYPE_ALIASES[value];
}
export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertiesByFilter(
  transactionType?: TransactionType,
  propertyType?: PropertyType
): Property[] {
  return properties.filter((p) => {
    if (transactionType && p.transactionType !== transactionType) return false;
    if (propertyType && p.propertyType !== propertyType) return false;
    return true;
  });
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}

export function getSimilarProperties(
  currentId: string,
  transactionType: TransactionType,
  propertyType: PropertyType,
  limit = 4
): Property[] {
  return properties
    .filter(
      (p) =>
        p.id !== currentId &&
        (p.transactionType === transactionType || p.propertyType === propertyType)
    )
    .slice(0, limit);
}

export function formatPrice(price: number, priceUnit?: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted}${priceUnit || ""}`;
}

// Property type images for category cards
export const propertyTypeImages: Record<PropertyType, string> = {
  Appartement:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  Villa:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  Bureau:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  Commercial:
    "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=800&q=80",
  Terrain: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
};
