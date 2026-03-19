import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertiesContent } from "./properties-content";

export const metadata = {
  title: "Properties | Aurum Estates",
  description: "Browse our exclusive collection of luxury properties for sale, rent, and daily rental.",
};

export default function PropertiesPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesContent />
      </Suspense>

      <Footer />
    </main>
  );
}

function PropertiesLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading properties...</div>
    </div>
  );
}
