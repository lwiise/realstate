import type {
  Agent,
  FooterSettings,
  NavigationSettings,
  PageContentMap,
  PageKey,
  PageRecord,
  Property,
  PropertyType,
  SiteSettings,
  TransactionType,
} from "@/lib/cms-types";

const exactTranslations = new Map<string, string>([
  ["Accueil", "Home"],
  ["Acheter", "Buy"],
  ["Achat", "Buy"],
  ["Louer", "Rent"],
  ["Location", "Rent"],
  ["/mois", "/month"],
  ["/jour", "/day"],
  ["/nuit", "/night"],
  ["Location journaliere", "Daily rent"],
  ["Location journaliere", "Daily rent"],
  ["Location quotidienne", "Daily rent"],
  ["A propos", "About"],
  ["Contact", "Contact"],
  ["Biens", "Properties"],
  ["Proprietes", "Properties"],
  ["Toutes les proprietes", "All properties"],
  ["Voir tout", "View all"],
  ["Voir le bien", "View property"],
  ["Explorer", "Explore"],
  ["Nos bureaux", "Our offices"],
  ["Message envoye", "Message sent"],
  ["Demande envoyee", "Request sent"],
  ["Envoyer", "Send"],
  ["Envoyer la demande", "Send request"],
  ["Envoyer une demande", "Send an inquiry"],
  ["Rechercher", "Search"],
  ["Rechercher des biens", "Search properties"],
  ["Type de transaction", "Transaction type"],
  ["Type de bien", "Property type"],
  ["Selectionner un type", "Select a type"],
  ["Selectionner un bien", "Select a property type"],
  ["Tous les types", "All types"],
  ["Tous les biens", "All properties"],
  ["Tous", "All"],
  ["Tous les types de biens", "All property types"],
  ["Toutes les villes", "All cities"],
  ["Prix min", "Min price"],
  ["Prix max", "Max price"],
  ["Biens en vedette seulement", "Featured properties only"],
  ["Effacer les filtres", "Clear filters"],
  ["Aucun bien trouve", "No property found"],
  ["Modifier vos filtres", "Adjust your filters"],
  ["Description", "Description"],
  ["Caracteristiques et prestations", "Features and amenities"],
  ["Enregistrer", "Save"],
  ["Partager", "Share"],
  ["Appeler", "Call"],
  ["Retour aux biens", "Back to properties"],
  ["Explorer plus", "Explore more"],
  ["Biens similaires", "Similar properties"],
  ["Chambres", "Bedrooms"],
  ["Salles de bain", "Bathrooms"],
  ["Surface", "Area"],
  ["Localisation", "Location"],
  ["Appartement", "Apartment"],
  ["Appartements", "Apartments"],
  ["Villa", "Villa"],
  ["Villas", "Villas"],
  ["Bureau", "Office"],
  ["Bureaux", "Offices"],
  ["Commercial", "Commercial"],
  ["Terrain", "Land"],
  ["Terrains", "Land"],
  ["Maison", "House"],
  ["Maisons", "Houses"],
  ["Penthouse", "Penthouse"],
  ["Studio", "Studio"],
  ["meuble", "furnished"],
  ["meublee", "furnished"],
  ["meubles", "furnished"],
  ["Climatisation", "Air conditioning"],
  ["Parking", "Parking"],
  ["Piscine", "Pool"],
  ["Jardin", "Garden"],
  ["Terrasse", "Terrace"],
  ["Balcon", "Balcony"],
  ["Cuisine equipee", "Equipped kitchen"],
  ["Securite", "Security"],
  ["Ascenseur", "Elevator"],
  ["Vue mer", "Sea view"],
  ["Centre-ville", "City center"],
  ["Californie", "California"],
  ["Tanger", "Tangier"],
  ["Rabat", "Rabat"],
  ["Marrakech", "Marrakech"],
  ["Casablanca", "Casablanca"],
  ["Maroc", "Morocco"],
  ["Tous droits reserves.", "All rights reserved."],
]);

const phraseTranslations: Array<[RegExp, string]> = [
  [/\bProprietaires \? Louez et vendez sans perte de temps\./gi, "Owners? Rent and sell without wasting time."],
  [/\bRemplir le formulaire\b/gi, "Fill out the form"],
  [/\bFormulaire\b/gi, "Form"],
  [/\bDefiler\b/gi, "Scroll"],
  [/\bVotre projet immobilier\b/gi, "Your real estate project"],
  [/\bNotre agence locale est a votre ecoute\b/gi, "Our local agency is here to listen"],
  [/\bprojets immobiliers\b/gi, "real estate projects"],
  [/\bChez MDK IMMOBILIER\b/gi, "At MDK IMMOBILIER"],
  [/\bNotre mission\b/gi, "Our mission"],
  [/\bsolutions technologiques\b/gi, "technology solutions"],
  [/\bexpertise de nos conseillers\b/gi, "expertise of our advisors"],
  [/\bexperience client unique et personnalisee\b/gi, "unique and personalized client experience"],
  [/\bReinventons ensemble votre experience immobiliere\./gi, "Together, let us reinvent your real estate experience."],
  [/\bUn echange direct avec notre equipe \?/gi, "Want a direct conversation with our team?"],
  [/\bNous sommes a votre ecoute\b/gi, "We are here to listen"],
  [/\btelephone\b/gi, "phone"],
  [/\bTelephone\b/g, "Phone"],
  [/\be-mail\b/gi, "email"],
  [/\bOption choisie\b/gi, "Selected option"],
  [/\bOption selectionnee\b/gi, "Selected option"],
  [/\bChoisissez une option\b/gi, "Choose an option"],
  [/\bQuel accompagnement recherchez-vous \?/gi, "What support are you looking for?"],
  [/\bLouer votre bien\b/gi, "Rent out your property"],
  [/\bConfier la gestion locative de votre bien\b/gi, "Entrust your rental management to us"],
  [/\bLa gestion locative\b/gi, "Rental management"],
  [/\bDecrivez votre projet immobilier\b/gi, "Describe your real estate project"],
  [/\bVotre nom\b/gi, "Your name"],
  [/\bNom complet\b/gi, "Full name"],
  [/\bVotre message\b/gi, "Your message"],
  [/\bAjoutez un detail utile pour notre equipe\b/gi, "Add any useful detail for our team"],
  [/\bPrecedent\b/gi, "Previous"],
  [/\bSuivant\b/gi, "Next"],
  [/\bEnvoi\.\.\./gi, "Sending..."],
  [/\bMerci\. Notre equipe vous recontactera rapidement\./gi, "Thank you. Our team will contact you shortly."],
  [/\bMerci, notre equipe revient vers vous rapidement\./gi, "Thank you, our team will get back to you shortly."],
  [/\bVotre projet a bien ete transmis\./gi, "Your project has been submitted."],
  [/\baccompagnement adapte a votre besoin\b/gi, "support adapted to your needs"],
  [/\bJe suis interesse par\b/gi, "I am interested in"],
  [/\bPouvez-vous me contacter \?/gi, "Can you contact me?"],
  [/\borganiser une visite\b/gi, "schedule a viewing"],
  [/\bBonjour\b/gi, "Hello"],
  [/\bMerci de me contacter\b/gi, "Please contact me"],
  [/\bContactez-nous\b/gi, "Contact us"],
  [/\bcontactera rapidement\b/gi, "will contact you shortly"],
  [/\bNos biens\b/gi, "Our properties"],
  [/\bbiens trouves\b/gi, "properties found"],
  [/\bbien trouve\b/gi, "property found"],
  [/\bParcourez\b/gi, "Browse"],
  [/\bannonces immobilieres\b/gi, "real estate listings"],
  [/\bfiltrees\b/gi, "filtered"],
  [/\bsur\b/gi, "on"],
  [/\ba votre ecoute\b/gi, "ready to help"],
  [/\ba votre\b/gi, "at your"],
  [/\bavec\b/gi, "with"],
  [/\bpour\b/gi, "for"],
  [/\bet\b/gi, "and"],
  [/\bou\b/gi, "or"],
  [/\bde\b/gi, "of"],
  [/\bdes\b/gi, "of"],
  [/\bdu\b/gi, "of"],
  [/\bla\b/gi, "the"],
  [/\ble\b/gi, "the"],
  [/\bles\b/gi, "the"],
  [/\bun\b/gi, "a"],
  [/\bune\b/gi, "a"],
  [/\bimmobilier\b/gi, "real estate"],
  [/\bimmobiliere\b/gi, "real estate"],
  [/\bimmobilieres\b/gi, "real estate"],
  [/\bluxe\b/gi, "luxury"],
  [/\bcentre-ville\b/gi, "city center"],
  [/\bcentre ville\b/gi, "city center"],
  [/\bchambre\b/gi, "bedroom"],
  [/\bchambres\b/gi, "bedrooms"],
  [/\bsalle de bain\b/gi, "bathroom"],
  [/\bsalles de bain\b/gi, "bathrooms"],
  [/\bpropriete\b/gi, "property"],
  [/\bproprietes\b/gi, "properties"],
  [/\bbien\b/gi, "property"],
  [/\bbiens\b/gi, "properties"],
  [/\bachetez\b/gi, "buy"],
  [/\bachat\b/gi, "purchase"],
  [/\blouez\b/gi, "rent"],
  [/\bvendez\b/gi, "sell"],
  [/\bvente\b/gi, "sale"],
  [/\blocation journaliere\b/gi, "daily rental"],
  [/\blocation\b/gi, "rental"],
  [/\bjournalier\b/gi, "daily"],
  [/\bjournaliere\b/gi, "daily"],
  [/\bdisponibles\b/gi, "available"],
  [/\bdisponible\b/gi, "available"],
  [/\bmodifiez\b/gi, "adjust"],
  [/\bfiltres\b/gi, "filters"],
  [/\brecherche\b/gi, "search"],
  [/\bmot-cle\b/gi, "keyword"],
  [/\bville\b/gi, "city"],
  [/\bvilles\b/gi, "cities"],
  [/\badresse\b/gi, "address"],
  [/\bAdresse\b/g, "Address"],
  [/\bcaracteristiques\b/gi, "features"],
  [/\bprestations\b/gi, "amenities"],
  [/\bsimilaire\b/gi, "similar"],
  [/\bsimilaires\b/gi, "similar"],
  [/\bagence\b/gi, "agency"],
  [/\bequipe\b/gi, "team"],
  [/\bclient\b/gi, "client"],
  [/\bclients\b/gi, "clients"],
  [/\bpersonnalisee\b/gi, "personalized"],
  [/\blocale\b/gi, "local"],
  [/\blocal\b/gi, "local"],
  [/\bprojet\b/gi, "project"],
  [/\bprojets\b/gi, "projects"],
  [/\baccompagnement\b/gi, "support"],
  [/\bexperts\b/gi, "experts"],
  [/\bexpertise\b/gi, "expertise"],
];

const skipKeys = new Set([
  "href",
  "ctaHref",
  "primaryHref",
  "secondaryHref",
  "image",
  "images",
  "backgroundImage",
  "coverImage",
  "photoUrl",
  "imageUrl",
  "logoUrl",
  "defaultOgImage",
  "ogImage",
  "ogImageUrl",
  "video",
  "virtualTourUrl",
  "url",
  "email",
  "phone",
  "whatsapp",
  "whatsappNumber",
  "contactPhone",
  "contactEmail",
  "siteUrl",
  "slug",
  "routePath",
  "currencyCode",
  "currencyLocale",
]);

export function translateTextToEnglish(value: string | null | undefined) {
  if (value == null) return value;

  const exact = exactTranslations.get(value.trim());
  if (exact) return exact;

  let output = value;
  for (const [pattern, replacement] of phraseTranslations) {
    output = output.replace(pattern, replacement);
  }

  return output.replace(/\s+/g, " ").trim();
}

export function translateDeepToEnglish<T>(value: T, key?: string): T {
  if (typeof value === "string") {
    return (skipKeys.has(key ?? "") ? value : translateTextToEnglish(value)) as T;
  }

  if (Array.isArray(value)) {
    if (skipKeys.has(key ?? "")) return value;
    return value.map((item) => translateDeepToEnglish(item, key)) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
      result[childKey] = translateDeepToEnglish(childValue, childKey);
    });
    return result as T;
  }

  return value;
}

export function translateNavLinksToEnglish(links: NavigationSettings["links"]) {
  return links.map((link) => ({
    ...link,
    label: translateTextToEnglish(link.label) ?? link.label,
  }));
}

export function translateSiteSettingsToEnglish(input: SiteSettings) {
  return {
    siteDescription: translateTextToEnglish(input.siteDescription),
    siteKeywords: input.siteKeywords.map((keyword) => translateTextToEnglish(keyword) ?? keyword),
    copyrightText: translateTextToEnglish(input.copyrightText),
    defaultSeoTitle: translateTextToEnglish(input.defaultSeoTitle),
    defaultSeoDescription: translateTextToEnglish(input.defaultSeoDescription),
  };
}

export function translateNavigationToEnglish(input: NavigationSettings) {
  return {
    logoAlt: translateTextToEnglish(input.logoAlt),
    links: translateNavLinksToEnglish(input.links),
  };
}

export function translateFooterToEnglish(input: FooterSettings) {
  return {
    brandText: translateTextToEnglish(input.brandText),
    quickLinks: translateNavLinksToEnglish(input.quickLinks),
    propertyLinks: translateNavLinksToEnglish(input.propertyLinks),
    legalLinks: translateNavLinksToEnglish(input.legalLinks),
  };
}

export function translateTransactionTypeToEnglish(input: Omit<TransactionType, "id"> | TransactionType) {
  return {
    label: translateTextToEnglish(input.label),
    description: translateTextToEnglish(input.description),
    navLabel: translateTextToEnglish(input.navLabel),
    priceSuffix: translateTextToEnglish(input.priceSuffix),
  };
}

export function translatePropertyTypeToEnglish(input: Omit<PropertyType, "id"> | PropertyType) {
  return {
    label: translateTextToEnglish(input.label),
    description: translateTextToEnglish(input.description),
  };
}

export function translateAgentToEnglish(input: Omit<Agent, "id" | "createdAt" | "updatedAt"> | Agent) {
  return {
    role: translateTextToEnglish(input.role),
    bio: translateTextToEnglish(input.bio),
    seoTitle: translateTextToEnglish(input.seoTitle),
    seoDescription: translateTextToEnglish(input.seoDescription),
  };
}

export function translatePropertyToEnglish(
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
  > | Property
) {
  return {
    title: translateTextToEnglish(input.title),
    neighborhood: translateTextToEnglish(input.neighborhood),
    fullAddress: translateTextToEnglish(input.fullAddress),
    shortDescription: translateTextToEnglish(input.shortDescription),
    longDescription: translateTextToEnglish(input.longDescription),
    features: input.features.map((feature) => translateTextToEnglish(feature) ?? feature),
    seoTitle: translateTextToEnglish(input.seoTitle),
    seoDescription: translateTextToEnglish(input.seoDescription),
  };
}

export function translatePageRecordToEnglish<TPageKey extends PageKey>(
  input: PageRecord<TPageKey>
): Pick<PageRecord<TPageKey>, "title" | "seoTitle" | "seoDescription" | "content"> {
  return {
    title: translateTextToEnglish(input.title) ?? input.title,
    seoTitle: translateTextToEnglish(input.seoTitle),
    seoDescription: translateTextToEnglish(input.seoDescription),
    content: translateDeepToEnglish<PageContentMap[TPageKey]>(input.content),
  };
}
