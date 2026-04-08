import { getDatabaseFilePath, getDb } from "../lib/db";

const db = getDb();
const pageCount = db
  .prepare("SELECT COUNT(*) as count FROM page_contents")
  .get() as { count: number };

console.log(
  `Seed check complete for ${getDatabaseFilePath()}. Current seeded page count: ${pageCount.count}.`
);
console.log("Initial CMS content is inserted automatically when the database is empty.");
