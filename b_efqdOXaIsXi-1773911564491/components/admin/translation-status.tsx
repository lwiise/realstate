import { getTranslationMeta } from "@/lib/cms";
import { retranslateEntityAction } from "@/app/admin/actions";
import type { TranslatableEntityType } from "@/lib/translation-service";

// Small admin-only widget: shows the English translation status for one entity and a
// button to force a fresh Gemini re-translation. Server component (reads status from DB).

interface TranslationStatusProps {
  entityType: TranslatableEntityType;
  entityId: string | number;
  /** Where to return after re-translating (usually the current admin page path). */
  redirectTo: string;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  translated: {
    label: "Traduction anglaise à jour",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  needs_translation: {
    label: "Traduction anglaise en attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  failed: {
    label: "Échec de la traduction anglaise",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export async function TranslationStatus({ entityType, entityId, redirectTo }: TranslationStatusProps) {
  const meta = await getTranslationMeta(entityType, entityId).catch(() => null);
  const status = meta?.status ?? "needs_translation";
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.needs_translation;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Traduction (FR → EN)</span>
        <span className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${style.className}`}>
          {style.label}
        </span>
      </div>
      <form action={retranslateEntityAction} className="ml-auto">
        <input type="hidden" name="entityType" value={entityType} />
        <input type="hidden" name="entityId" value={String(entityId)} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
        >
          Re-traduire en anglais
        </button>
      </form>
    </div>
  );
}
