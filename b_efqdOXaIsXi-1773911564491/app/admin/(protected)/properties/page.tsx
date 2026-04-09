import Link from "next/link";
import { deletePropertyAction } from "@/app/admin/actions";
import { AdminDeleteSubmit } from "@/components/admin/admin-delete-submit";
import { getProperties } from "@/lib/admin-cms";

export default async function AdminPropertiesPage() {
  const properties = await getProperties({}, { includeDrafts: true });
  const statusLabels: Record<string, string> = {
    draft: "Brouillon",
    published: "Publié",
    archived: "Archivé",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Propriétés</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Gestion des annonces</h1>
        </div>
        <Link
          href="/admin/properties/new"
          className="cta-dark-button inline-flex w-fit rounded-md px-4 py-3 text-xs uppercase tracking-wide"
        >
          Ajouter une propriété
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Mise en avant</th>
                <th className="px-4 py-3">Localisation</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">{property.title}</p>
                      <p className="text-xs text-muted-foreground">/{property.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{property.transactionType}</td>
                  <td className="px-4 py-4 text-muted-foreground">{property.propertyType}</td>
                  <td className="px-4 py-4 capitalize text-muted-foreground">
                    {statusLabels[property.status] ?? property.status}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {property.featured ? "Oui" : "Non"}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {property.city}, {property.neighborhood}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="rounded-md border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
                      >
                        Modifier
                      </Link>
                      <form action={deletePropertyAction}>
                        <input type="hidden" name="id" value={property.id} />
                        <input type="hidden" name="slug" value={property.slug} />
                        <AdminDeleteSubmit />
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
