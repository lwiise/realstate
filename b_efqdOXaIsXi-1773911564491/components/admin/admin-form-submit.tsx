"use client";

import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useAdminUploads } from "@/components/admin/admin-upload-context";

interface AdminFormSubmitProps {
  label: string;
  savedLabel?: string;
}

export function AdminFormSubmit({
  label,
  savedLabel = "Enregistre",
}: AdminFormSubmitProps) {
  const searchParams = useSearchParams();
  const { pending } = useFormStatus();
  const { pendingUploads } = useAdminUploads();
  const isSaved = searchParams.get("saved") === "1";
  const isBusy = pending || pendingUploads > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={isBusy}
        className="cta-dark-button rounded-md px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Enregistrement..." : pendingUploads > 0 ? "Televersement..." : label}
      </button>

      <span
        aria-live="polite"
        className={`text-sm ${
          isBusy
            ? "text-muted-foreground"
            : isSaved
              ? "text-emerald-600"
              : "text-transparent"
        }`}
      >
        {pending
          ? "Enregistrement des modifications..."
          : pendingUploads > 0
            ? "Attendez la fin du televersement des medias..."
            : isSaved
              ? savedLabel
              : "Enregistre"}
      </span>
    </div>
  );
}
