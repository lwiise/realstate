"use client";

import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";

interface AdminFormSubmitProps {
  label: string;
  savedLabel?: string;
}

export function AdminFormSubmit({
  label,
  savedLabel = "Enregistré",
}: AdminFormSubmitProps) {
  const searchParams = useSearchParams();
  const { pending } = useFormStatus();
  const isSaved = searchParams.get("saved") === "1";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="cta-dark-button rounded-md px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Enregistrement..." : label}
      </button>

      <span
        aria-live="polite"
        className={`text-sm ${
          pending
            ? "text-muted-foreground"
            : isSaved
              ? "text-emerald-600"
              : "text-transparent"
        }`}
      >
        {pending ? "Enregistrement des modifications..." : isSaved ? savedLabel : "Enregistré"}
      </span>
    </div>
  );
}
