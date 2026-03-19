import Link from "next/link";
import { Home } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
            Error 404
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-10">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 font-medium text-sm tracking-wide uppercase hover:bg-gold hover:text-black transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
