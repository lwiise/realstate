"use client";

import { useFormStatus } from "react-dom";

interface AdminDeleteSubmitProps {
  idleLabel?: string;
  pendingLabel?: string;
}

export function AdminDeleteSubmit({
  idleLabel = "Delete",
  pendingLabel = "Deleting...",
}: AdminDeleteSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-70"
      aria-live="polite"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
