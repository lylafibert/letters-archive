import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { migrate, openDatabase } from "./migrate.js";

function migrationsDir(files: Record<string, string>): string {
  const dir = mkdtempSync(path.join(tmpdir(), "migrations-"));
  for (const [name, sql] of Object.entries(files)) writeFileSync(path.join(dir, name), sql);
  return dir;
}

describe("migrate", () => {
  const dir = migrationsDir({
    "0001_a.sql": "CREATE TABLE a (id INTEGER PRIMARY KEY);",
    "0002_b.sql": "CREATE TABLE b (id INTEGER PRIMARY KEY);",
    "notes.txt": "ignored",
  });

  it("applies migrations in order and records the version", () => {
    const db = openDatabase(":memory:");
    expect(migrate(db, dir)).toEqual(["0001_a.sql", "0002_b.sql"]);
    expect(db.pragma("user_version", { simple: true })).toBe(2);
  });

  it("is idempotent", () => {
    const db = openDatabase(":memory:");
    migrate(db, dir);
    expect(migrate(db, dir)).toEqual([]);
  });

  it("rolls back a failing migration", () => {
    const bad = migrationsDir({
      "0001_ok.sql": "CREATE TABLE ok (id INTEGER);",
      "0002_bad.sql": "CREATE TABLE half (id INTEGER); NOT VALID SQL;",
    });
    const db = openDatabase(":memory:");
    expect(() => migrate(db, bad)).toThrow();
    expect(db.pragma("user_version", { simple: true })).toBe(1);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE name = 'half'").all();
    expect(tables).toEqual([]);
  });

  it("runs the project's real migrations", () => {
    const db = openDatabase(":memory:");
    expect(() => migrate(db)).not.toThrow();
  });
});
