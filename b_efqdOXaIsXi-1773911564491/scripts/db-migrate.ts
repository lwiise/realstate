import { getDatabaseFilePath, getDb, migrateDatabase } from "../lib/db";

const db = getDb();
migrateDatabase(db);

console.log(`Database schema is ready at ${getDatabaseFilePath()}.`);
