import { getDatabaseFilePath, getDb, migrateDatabase } from "../lib/db";
import { ensureRemoteCms, isRemoteDatabaseConfigured } from "../lib/remote-db";
import { ensureRemoteStorage, isRemoteStorageConfigured } from "../lib/storage";

async function main() {
  if (isRemoteDatabaseConfigured()) {
    await ensureRemoteCms();
    console.log("Remote database schema is ready.");

    if (isRemoteStorageConfigured()) {
      await ensureRemoteStorage();
      console.log("Remote media storage bucket is ready.");
    }
  } else {
    const db = getDb();
    migrateDatabase(db);
    console.log(`Local database schema is ready at ${getDatabaseFilePath()}.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
