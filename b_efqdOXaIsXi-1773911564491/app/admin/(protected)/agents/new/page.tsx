import Link from "next/link";
import { AgentForm } from "@/components/admin/agent-form";
import { getMediaAssets } from "@/lib/admin-cms";

export default async function AdminNewAgentPage() {
  const mediaAssets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Agents</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Add agent</h1>
        </div>
        <Link
          href="/admin/agents"
          className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold"
        >
          Back to agents
        </Link>
      </div>

      <AgentForm mediaAssets={mediaAssets} />
    </div>
  );
}
