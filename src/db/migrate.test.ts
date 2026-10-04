import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { migrate, openDatabase } from "./migrate";

/** Writes the given files to a fresh temporary directory and returns its path. */
const createMigrationsDir = (files: Record<string, string>): string => {
  const migrationsDir = mkdtempSync(path.join(tmpdir(), "migrations-"));
  for (const [fileName, sql] of Object.entries(files)) writeFileSync(path.join(migrationsDir, fileName), sql);
  return migrationsDir;
};

describe("migrate", () => {
  const migrationsDir = createMigrationsDir({
    "0001_create_a.sql": "CREATE TABLE a (id INTEGER PRIMARY KEY);",
    "0002_create_b.sql": "CREATE TABLE b (id INTEGER PRIMARY KEY);",
    "notes.txt": "not a migration",
  });

  it("applies migrations in order and records the latest version", () => {
    const database = openDatabase(":memory:");
    expect(migrate(database, migrationsDir)).toEqual(["0001_create_a.sql", "0002_create_b.sql"]);
    expect(database.pragma("user_version", { simple: true })).toBe(2);
  });

  it("applies nothing when every migration has already run", () => {
    const database = openDatabase(":memory:");
    migrate(database, migrationsDir);
    expect(migrate(database, migrationsDir)).toEqual([]);
  });

  it("rolls back a failing migration and keeps the previous version", () => {
    const failingMigrationsDir = createMigrationsDir({
      "0001_valid.sql": "CREATE TABLE valid (id INTEGER);",
      "0002_invalid.sql": "CREATE TABLE half_created (id INTEGER); NOT VALID SQL;",
    });
    const database = openDatabase(":memory:");
    expect(() => migrate(database, failingMigrationsDir)).toThrow();
    expect(database.pragma("user_version", { simple: true })).toBe(1);
    const halfCreatedTables = database.prepare("SELECT name FROM sqlite_master WHERE name = 'half_created'").all();
    expect(halfCreatedTables).toEqual([]);
  });

  it("applies the project's own migrations without error", () => {
    const database = openDatabase(":memory:");
    expect(() => migrate(database)).not.toThrow();
  });
});
