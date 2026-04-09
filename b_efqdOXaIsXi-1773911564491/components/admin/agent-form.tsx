import { saveAgentAction } from "@/app/admin/actions";
import { AdminFormSubmit } from "@/components/admin/admin-form-submit";
import { ImageInput } from "@/components/admin/image-input";
import type { Agent, MediaAsset } from "@/lib/cms-types";

interface AgentFormProps {
  agent?: Agent;
  mediaAssets: MediaAsset[];
}

export function AgentForm({ agent, mediaAssets }: AgentFormProps) {
  return (
    <form action={saveAgentAction} className="space-y-8">
      {agent ? <input type="hidden" name="id" value={agent.id} /> : null}

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Profil de l’agent</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Nom</span>
            <input
              name="name"
              defaultValue={agent?.name}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Slug</span>
            <input
              name="slug"
              defaultValue={agent?.slug}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Rôle</span>
            <input
              name="role"
              defaultValue={agent?.role}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Téléphone</span>
            <input
              name="phone"
              defaultValue={agent?.phone}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">E-mail</span>
            <input
              name="email"
              type="email"
              defaultValue={agent?.email}
              required
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">WhatsApp</span>
            <input
              name="whatsapp"
              defaultValue={agent?.whatsapp ?? ""}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
            <input type="checkbox" name="isPublished" defaultChecked={agent?.isPublished ?? true} />
            <span className="text-sm text-foreground">Publié</span>
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Ordre de tri</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={agent?.sortOrder ?? 0}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Biographie et médias</h2>
        <div className="mt-6 grid gap-6">
          <ImageInput
            name="photoUrl"
            label="Photo de l’agent"
            defaultValue={agent?.photoUrl}
            library={mediaAssets}
          />
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Biographie</span>
            <textarea
              name="bio"
              rows={6}
              defaultValue={agent?.bio ?? ""}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Titre SEO</span>
            <input
              name="seoTitle"
              defaultValue={agent?.seoTitle ?? ""}
              className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Description SEO</span>
            <textarea
              name="seoDescription"
              rows={4}
              defaultValue={agent?.seoDescription ?? ""}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm"
            />
          </label>
        </div>
      </section>

      <AdminFormSubmit label="Enregistrer l’agent" />
    </form>
  );
}
