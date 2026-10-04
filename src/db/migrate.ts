import Database from "better-sqlite3";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const DEFAULT_DB_PATH = fileURLToPath(new URL("../../data/archive.sqlite", import.meta.url));
export const MIGRATIONS_DIR = fileURLToPath(new URL("./migrations/", import.meta.url));

export function openDatabase(file: string = DEFAULT_DB_PATH): Database.Database {
  const db = new Database(file);
  db.pragma("foreign_keys = ON");
  return db;
}

/**
 * Applies migrations named `NNNN_description.sql` in numeric order.
 * The current schema version is tracked in SQLite's built-in `user_version` pragma,
 * so each file runs exactly once. Each migration runs in its own transaction.
 * Returns the names of the migrations that were applied.
 */
export function migrate(db: Database.Database, dir: string = MIGRATIONS_DIR): string[] {
  const current = db.pragma("user_version", { simple: true }) as number;
  const files = readdirSync(dir)
    .filter((f) => /^\d{4}_.+\.sql$/.test(f))
    .sort();

  const applied: string[] = [];
  for (const file of files) {
    const version = Number(file.slice(0, 4));
    if (version <= current) continue;
    const sql = readFileSync(path.join(dir, file), "utf8");
    db.transaction(() => {
      db.exec(sql);
      db.pragma(`user_version = ${version}`);
    })();
    applied.push(file);
  }
  return applied;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const db = openDatabase();
  const applied = migrate(db);
  console.log(applied.length ? `Applied: ${applied.join(", ")}` : "Database is up to date.");
  db.close();
}
