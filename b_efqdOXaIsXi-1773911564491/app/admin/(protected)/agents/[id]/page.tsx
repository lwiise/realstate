import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentForm } from "@/components/admin/agent-form";
import { getAgentById, getMediaAssets } from "@/lib/cms";

interface AdminEditAgentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditAgentPage({ params }: AdminEditAgentPageProps) {
  const { id } = await params;
  const [agent, mediaAssets] = await Promise.all([getAgentById(Number(id)), getMediaAssets()]);

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Agents</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Edit agent</h1>
        </div>
        <Link
          href="/admin/agents"
          className="rounded-md border border-border px-4 py-3 text-xs uppercase tracking-wide transition-colors hover:border-gold"
        >
          Back to agents
        </Link>
      </div>

      <AgentForm agent={agent} mediaAssets={mediaAssets} />
    </div>
  );
}
