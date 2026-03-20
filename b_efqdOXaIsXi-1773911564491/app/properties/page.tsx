import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertiesContent } from "./properties-content";

export const metadata = {
  title: "Toutes les Propriétés",
  description:
    "Parcourez toutes les propriétés à vendre, à louer et en location journalière proposées par MDK IMMOBILIER Real Estate à Tanger.",
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
