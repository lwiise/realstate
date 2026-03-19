import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PropertyType, TransactionType, propertyTypeImages, getPropertiesByFilter } from "@/lib/data";

interface PropertyTypeCardProps {
  propertyType: PropertyType;
  transactionType: TransactionType;
}

export function PropertyTypeCard({ propertyType, transactionType }: PropertyTypeCardProps) {
  const count = getPropertiesByFilter(transactionType, propertyType).length;
  
  return (
    <Link 
      href={`/properties?transaction=${encodeURIComponent(transactionType)}&type=${encodeURIComponent(propertyType)}`}
      className="group relative block aspect-[3/4] overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={propertyTypeImages[propertyType]}
        alt={propertyType}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      {/* Gold accent border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold transition-colors duration-500" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="font-serif text-2xl text-white mb-1">{propertyType}</h3>
          <p className="text-white/60 text-sm mb-4">{count} {count === 1 ? 'Property' : 'Properties'}</p>
          
          <div className="flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium tracking-wide uppercase">Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
