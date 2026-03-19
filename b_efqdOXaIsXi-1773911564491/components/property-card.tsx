import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin, Heart, ArrowUpRight } from "lucide-react";
import { Property, formatPrice } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.slug}`} className="group block">
      <article className="bg-white border border-border overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:border-gold/30">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-black text-white text-xs px-3 py-1.5 font-medium tracking-wide">
              {property.transactionType}
            </span>
            <span className="bg-gold text-black text-xs px-3 py-1.5 font-medium tracking-wide">
              {property.propertyType}
            </span>
          </div>
          
          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-gold transition-colors"
              aria-label="Add to favorites"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
          
          {/* View property button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-2 bg-gold text-black text-xs px-4 py-2 font-medium tracking-wide">
              View Property
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price */}
          <p className="text-gold font-serif text-2xl mb-2">
            {formatPrice(property.price, property.priceUnit)}
          </p>
          
          {/* Title */}
          <h3 className="font-serif text-lg text-foreground group-hover:text-gold transition-colors duration-300 mb-3 line-clamp-1">
            {property.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>
              {property.neighborhood}, {property.city}
            </span>
          </div>
          
          {/* Specs */}
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Square className="w-4 h-4" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
