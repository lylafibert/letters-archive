import Database from "better-sqlite3";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const DEFAULT_DATABASE_PATH = fileURLToPath(new URL("../../data/archive.sqlite", import.meta.url));
export const DEFAULT_MIGRATIONS_DIR = fileURLToPath(new URL("./migrations/", import.meta.url));

/** Matches `NNNN_description.sql`; the four digits are the schema version. */
const MIGRATION_FILE_NAME = /^(\d{4})_.+\.sql$/;

export function openDatabase(databasePath: string = DEFAULT_DATABASE_PATH): Database.Database {
  const database = new Database(databasePath);
  database.pragma("foreign_keys = ON");
  return database;
}

/**
 * Applies migrations named `NNNN_description.sql` in numeric order.
 * The current schema version is tracked in SQLite's built-in `user_version` pragma,
 * so each file runs exactly once. Each migration runs in its own transaction.
 * Returns the file names of the migrations that were applied.
 */
export function migrate(database: Database.Database, migrationsDir: string = DEFAULT_MIGRATIONS_DIR): string[] {
  const currentVersion = database.pragma("user_version", { simple: true }) as number;
  const migrationFileNames = readdirSync(migrationsDir)
    .filter((fileName) => MIGRATION_FILE_NAME.test(fileName))
    .sort();

  const appliedFileNames: string[] = [];
  for (const fileName of migrationFileNames) {
    const version = Number(fileName.slice(0, 4));
    if (version <= currentVersion) continue;
    const sql = readFileSync(path.join(migrationsDir, fileName), "utf8");
    database.transaction(() => {
      database.exec(sql);
      database.pragma(`user_version = ${version}`);
    })();
    appliedFileNames.push(fileName);
  }
  return appliedFileNames;
}

if (import.meta.main) {
  const database = openDatabase();
  const appliedFileNames = migrate(database);
  console.log(appliedFileNames.length ? `Applied: ${appliedFileNames.join(", ")}` : "Database is up to date.");
  database.close();
}
