import { getDatabaseFilePath, getDb } from "../lib/db";
import { ensureRemoteCms, isRemoteDatabaseConfigured, queryRemoteRow } from "../lib/remote-db";

async function main() {
  if (isRemoteDatabaseConfigured()) {
    await ensureRemoteCms();
    const row = await queryRemoteRow<{ count: string }>(
      "SELECT COUNT(*)::text as count FROM page_contents"
    );

    console.log(
      `Remote seed check complete. Current seeded page count: ${Number(row?.count ?? 0)}.`
    );
  } else {
    const db = getDb();
    const pageCount = db
      .prepare("SELECT COUNT(*) as count FROM page_contents")
      .get() as { count: number };

    console.log(
      `Local seed check complete for ${getDatabaseFilePath()}. Current seeded page count: ${pageCount.count}.`
    );
  }

  console.log("Initial CMS content is inserted automatically when the database is empty.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
