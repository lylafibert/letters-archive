import { loadLetters } from "../../src/db/queries";
import { migrate, openDatabase } from "../../src/db/migrate";
import { seedDatabase } from "../../src/db/seed";
import { LETTERS, type SeedLetter } from "../../src/db/seed-data";

const databaseWith = (letters: readonly SeedLetter[]) => {
  const database = openDatabase(":memory:");
  migrate(database);
  seedDatabase(database, letters);
  return database;
};

const seedLetter = (overrides: Partial<SeedLetter>): SeedLetter => {
  return { ...LETTERS[0]!, ...overrides };
};

describe("loadLetters", () => {
  it("loads each letter with its correspondents and places", () => {
    const [letter] = loadLetters(databaseWith([seedLetter({ id: "MAR/001" })]));
    expect(letter).toMatchObject({
      id: "MAR/001",
      sender: { name: "Eliza Marrable", kind: "person" },
      recipient: { name: "Thomas Marrable", kind: "person" },
      origin: { name: "Hollinsford" },
      destination: { name: "Port Aldwick" },
      dateText: "14th March 1821",
      dateSource: "dateline",
      dateEdtf: "1821-03-14",
      dateEarliest: "1821-03-14",
      dateLatest: "1821-03-14",
    });
  });

  it("returns null for an unknown recipient and places", () => {
    const [letter] = loadLetters(databaseWith([seedLetter({ recipient: null, origin: null, destination: null })]));
    expect(letter).toMatchObject({ recipient: null, origin: null, destination: null });
  });

  it("orders letters by earliest date, or latest date when the start is open, with undated letters last", () => {
    const letters = [
      seedLetter({ id: "UND/001", date: null }),
      seedLetter({ id: "LAT/001", date: { text: "1850", source: "catalogue", edtf: "1850" } }),
      seedLetter({ id: "OPN/001", date: { text: "before 1840", source: "catalogue", edtf: "../1839" } }),
      seedLetter({ id: "EAR/001", date: { text: "1820", source: "catalogue", edtf: "1820" } }),
    ];
    expect(loadLetters(databaseWith(letters)).map((letter) => letter.id)).toEqual([
      "EAR/001",
      "OPN/001",
      "LAT/001",
      "UND/001",
    ]);
  });

  it("orders letters with the same dates by reference", () => {
    const sameDate = { text: "1843", source: "catalogue", edtf: "1843" } as const;
    const letters = [seedLetter({ id: "B/001", date: sameDate }), seedLetter({ id: "A/001", date: sameDate })];
    expect(loadLetters(databaseWith(letters)).map((letter) => letter.id)).toEqual(["A/001", "B/001"]);
  });
});
