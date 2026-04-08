import Link from "next/link";
import { deleteAgentAction } from "@/app/admin/actions";
import { getAgents } from "@/lib/admin-cms";

export default async function AdminAgentsPage() {
  const agents = await getAgents({ includeUnpublished: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Agents</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Agent management</h1>
        </div>
        <Link
          href="/admin/agents/new"
          className="cta-dark-button inline-flex w-fit rounded-md px-4 py-3 text-xs uppercase tracking-wide"
        >
          Add agent
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">/{agent.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{agent.role}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <div>{agent.phone}</div>
                    <div className="text-xs">{agent.email}</div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {agent.isPublished ? "Published" : "Hidden"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/agents/${agent.id}`}
                        className="rounded-md border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
                      >
                        Edit
                      </Link>
                      <form action={deleteAgentAction}>
                        <input type="hidden" name="id" value={agent.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
