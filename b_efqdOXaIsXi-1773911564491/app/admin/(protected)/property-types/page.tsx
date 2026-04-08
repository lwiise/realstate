import Link from "next/link";
import { deletePropertyTypeAction } from "@/app/admin/actions";
import { getPropertyTypes } from "@/lib/admin-cms";

export default async function AdminPropertyTypesPage() {
  const propertyTypes = await getPropertyTypes({ includeInactive: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Taxonomy</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Property types</h1>
        </div>
        <Link
          href="/admin/property-types/new"
          className="cta-dark-button inline-flex w-fit rounded-md px-4 py-3 text-xs uppercase tracking-wide"
        >
          Add property type
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {propertyTypes.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 font-medium text-foreground">{item.label}</td>
                  <td className="px-4 py-4 text-muted-foreground">{item.slug}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {item.isActive ? "Active" : "Hidden"}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{item.sortOrder}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/property-types/${item.id}`}
                        className="rounded-md border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
                      >
                        Edit
                      </Link>
                      <form action={deletePropertyTypeAction}>
                        <input type="hidden" name="id" value={item.id} />
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
