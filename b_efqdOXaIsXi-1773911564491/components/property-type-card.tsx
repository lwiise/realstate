import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PropertyTypeCardProps {
  propertyType: {
    label: string;
    slug: string;
    imageUrl?: string | null;
  };
  count: number;
  href: string;
}

export function PropertyTypeCard({ propertyType, count, href }: PropertyTypeCardProps) {
  return (
    <Link href={href} className="group relative block aspect-[3/4] overflow-hidden">
      <Image
        src={propertyType.imageUrl ?? "/placeholder.jpg"}
        alt={propertyType.label}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold transition-colors duration-500" />

      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="font-serif text-2xl text-white mb-1">{propertyType.label}</h3>
          <p className="text-white/60 text-sm mb-4">
            {count} {count === 1 ? "Property" : "Properties"}
          </p>

          <div className="flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium tracking-wide uppercase">Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
