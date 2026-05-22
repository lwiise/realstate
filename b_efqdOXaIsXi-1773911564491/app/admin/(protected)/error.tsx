"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

// Contained error boundary for admin pages: renders inside the admin shell, keeps the
// app usable, surfaces the error digest (maps to the server log) for diagnosis, and
// never blanks the whole screen.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Erreur</p>
      <h1 className="font-serif text-2xl text-foreground">Cette section n&apos;a pas pu s&apos;afficher</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Une erreur inattendue s&apos;est produite.
        {error.digest ? ` (réf. ${error.digest})` : ""}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Réessayer
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-gold"
        >
          <Home className="h-4 w-4" />
          Tableau de bord
        </Link>
      </div>
    </div>
  );
}
