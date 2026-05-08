import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin, Heart, ArrowUpRight } from "lucide-react";
import { formatArea, formatPrice, Property } from "@/lib/data";
import { getSiteSettings } from "@/lib/cms";
import { getRequestLocale } from "@/lib/i18n-server";
import { localizeProperty, localizeSiteSettings } from "@/lib/i18n-content";
import { localizePath } from "@/lib/i18n";

interface PropertyCardProps {
  property: Property;
}

export async function PropertyCard({ property }: PropertyCardProps) {
  const locale = await getRequestLocale();
  const siteSettings = localizeSiteSettings(await getSiteSettings(), locale);
  const displayProperty = localizeProperty(property, locale);
  const propertyHref = localizePath(`/property/${encodeURIComponent(property.slug)}`, locale);
  const labels = {
    favorite: locale === "en" ? "Add to favorites" : "Ajouter aux favoris",
    view: locale === "en" ? "View property" : "Voir le bien",
    bedroom: locale === "en" ? "bedroom" : "chambre",
    bedrooms: locale === "en" ? "bedrooms" : "chambres",
    bathroom: locale === "en" ? "bathroom" : "salle de bain",
    bathrooms: locale === "en" ? "bathrooms" : "salles de bain",
  };

  return (
    <Link href={propertyHref} className="group block">
      <article className="bg-white border border-border overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:border-gold/30">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={displayProperty.coverImage ?? displayProperty.images[0]}
            alt={displayProperty.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-black text-white text-xs px-3 py-1.5 font-medium tracking-wide">
              {displayProperty.transactionType}
            </span>
            <span className="bg-gold text-black text-xs px-3 py-1.5 font-medium tracking-wide">
              {displayProperty.propertyType}
            </span>
          </div>
          
          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-gold transition-colors"
              aria-label={labels.favorite}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
          
          {/* View property button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-2 bg-gold text-black text-xs px-4 py-2 font-medium tracking-wide">
              {labels.view}
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price */}
          <p className="text-gold font-serif text-2xl mb-2">
            {formatPrice(
              displayProperty.price,
              displayProperty.priceSuffix,
              siteSettings.currencyLocale,
              siteSettings.currencyCode
            )}
          </p>
          
          {/* Title */}
          <h3 className="font-serif text-lg text-foreground group-hover:text-gold transition-colors duration-300 mb-3 line-clamp-1">
            {displayProperty.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>
              {displayProperty.neighborhood}, {displayProperty.city}
            </span>
          </div>
          
          {/* Specs */}
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            {displayProperty.bedrooms && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Bed className="w-4 h-4" />
                <span>
                  {displayProperty.bedrooms} {displayProperty.bedrooms === 1 ? labels.bedroom : labels.bedrooms}
                </span>
              </div>
            )}
            {displayProperty.bathrooms && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Bath className="w-4 h-4" />
                <span>
                  {displayProperty.bathrooms} {displayProperty.bathrooms === 1 ? labels.bathroom : labels.bathrooms}
                </span>
              </div>
            )}
            {displayProperty.area ? (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Square className="w-4 h-4" />
                <span>{formatArea(displayProperty.area, displayProperty.areaUnit)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
