import { getInquiries } from "@/lib/admin-cms";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Prospects</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Demandes</h1>
      </div>

      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Aucune demande pour le moment.
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground">{inquiry.phone}</p>
                  {inquiry.email ? <p className="text-sm text-muted-foreground">{inquiry.email}</p> : null}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Source:</span> {inquiry.sourcePage}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Date:</span>{" "}
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              {inquiry.propertyTitle ? (
                <p className="mt-4 text-sm font-medium text-foreground">
                  Propriété : {inquiry.propertyTitle}
                </p>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                {inquiry.message}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
