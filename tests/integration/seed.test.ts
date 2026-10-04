import { edtfToRange } from "../../src/dates/edtf-to-range";
import { migrate, openDatabase } from "../../src/db/migrate";
import { seedDatabase } from "../../src/db/seed";
import { CORRESPONDENTS, LETTERS, PLACES, type SeedLetter } from "../../src/db/seed-data";

function migratedDatabase() {
  const database = openDatabase(":memory:");
  migrate(database);
  return database;
}

function count(database: ReturnType<typeof openDatabase>, table: string): number {
  return database.prepare(`SELECT COUNT(*) FROM ${table}`).pluck().get() as number;
}

describe("seedDatabase", () => {
  it("loads every letter, correspondent and place, passing the schema's checks", () => {
    const database = migratedDatabase();
    seedDatabase(database);
    expect(count(database, "letters")).toBe(LETTERS.length);
    expect(count(database, "correspondents")).toBe(Object.keys(CORRESPONDENTS).length);
    expect(count(database, "places")).toBe(Object.keys(PLACES).length);
  });

  it("stores each letter's date range as derived from its EDTF", () => {
    const database = migratedDatabase();
    seedDatabase(database);
    const rows = database.prepare("SELECT date_edtf, date_earliest, date_latest FROM letters").all() as {
      date_edtf: string;
      date_earliest: string | null;
      date_latest: string | null;
    }[];
    for (const row of rows) {
      expect({ earliest: row.date_earliest, latest: row.date_latest }).toEqual(edtfToRange(row.date_edtf));
    }
  });

  it("stores the transcription with one line per line of the letter", () => {
    const database = migratedDatabase();
    seedDatabase(database);
    const transcription = database.prepare("SELECT transcription FROM letters WHERE id = 'MAR/002'").pluck().get();
    expect(transcription).toBe(LETTERS.find((letter) => letter.id === "MAR/002")?.transcription.join("\n"));
  });

  it("saves nothing if any letter is rejected", () => {
    const database = migratedDatabase();
    const invalid: SeedLetter = { ...LETTERS[0]!, id: "not a catalogue reference" };
    expect(() => seedDatabase(database, [LETTERS[0]!, invalid])).toThrow();
    expect(count(database, "letters")).toBe(0);
    expect(count(database, "places")).toBe(0);
  });
});
