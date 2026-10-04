import { migrate, openDatabase } from "../../src/db/migrate";
import { seedDatabase } from "../../src/db/seed";
import { CORRESPONDENTS, LETTERS, PLACES, type SeedLetter } from "../../src/db/seed-data";

const migratedDatabase = () => {
  const database = openDatabase(":memory:");
  migrate(database);
  return database;
};

const count = (database: ReturnType<typeof openDatabase>, table: string): number => {
  return database.prepare(`SELECT COUNT(*) FROM ${table}`).pluck().get() as number;
};

describe("seedDatabase", () => {
  it("loads every letter, correspondent and place, passing the schema's checks", () => {
    const database = migratedDatabase();
    seedDatabase(database);
    expect(count(database, "letters")).toBe(LETTERS.length);
    expect(count(database, "correspondents")).toBe(Object.keys(CORRESPONDENTS).length);
    expect(count(database, "places")).toBe(Object.keys(PLACES).length);
  });

  it.each([
    ["an approximate year", "MAR/002", "1818-01-01", "1822-12-31"],
    ["a season", "PEN/003", "1843-03-01", "1843-05-31"],
    ["an open start", "FER/002", null, "1839-12-31"],
  ])("stores the date range derived from the EDTF for %s", (_description, id, earliest, latest) => {
    const database = migratedDatabase();
    seedDatabase(database);
    const range = database
      .prepare<[string], { date_earliest: string | null; date_latest: string | null }>(
        "SELECT date_earliest, date_latest FROM letters WHERE id = ?",
      )
      .get(id);
    expect(range).toEqual({ date_earliest: earliest, date_latest: latest });
  });

  it("stores the transcription with one line per line of the letter", () => {
    const database = migratedDatabase();
    seedDatabase(database);
    const transcription = database.prepare("SELECT transcription FROM letters WHERE id = 'MAR/002'").pluck().get();
    expect(transcription).toBe(
      "Dear Tom,\nI enclose the receipt you asked after. Do not let Mr Ferrier persuade you to the Lindmouth scheme until you have seen the books yourself.\nE. M.",
    );
  });

  it("saves nothing if any letter is rejected", () => {
    const database = migratedDatabase();
    const invalid: SeedLetter = { ...LETTERS[0]!, id: "not a catalogue reference" };
    expect(() => seedDatabase(database, [LETTERS[0]!, invalid])).toThrow();
    expect(count(database, "letters")).toBe(0);
    expect(count(database, "places")).toBe(0);
  });
});
