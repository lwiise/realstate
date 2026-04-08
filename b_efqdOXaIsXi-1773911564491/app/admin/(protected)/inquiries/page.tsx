import { getInquiries } from "@/lib/cms";

export default function AdminInquiriesPage() {
  const inquiries = getInquiries();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Leads</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Inquiries</h1>
      </div>

      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No inquiries yet.
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
                <div className="text-sm text-muted-foreground">
                  <div>{inquiry.sourcePage}</div>
                  <div>{new Date(inquiry.createdAt).toLocaleString()}</div>
                </div>
              </div>
              {inquiry.propertyTitle ? (
                <p className="mt-4 text-sm font-medium text-foreground">
                  Property: {inquiry.propertyTitle}
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
