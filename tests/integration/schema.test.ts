// Tests for the rules the schema enforces (src/db/migrations/).
//
// Each test starts from a valid letter and changes one thing, so a rejection
// can only come from the rule under test. Rejections are identified by
// SQLite's error code rather than message text, which repeats the SQL.

import Database from "better-sqlite3";
import { migrate, openDatabase } from "../../src/db/migrate";

const CHECK_FAILED = "SQLITE_CONSTRAINT_CHECK";
const NOT_NULL_FAILED = "SQLITE_CONSTRAINT_NOTNULL";
const FOREIGN_KEY_FAILED = "SQLITE_CONSTRAINT_FOREIGNKEY";
const PRIMARY_KEY_FAILED = "SQLITE_CONSTRAINT_PRIMARYKEY";
const WRONG_TYPE_FAILED = "SQLITE_CONSTRAINT_DATATYPE";

const ELIZA_ID = 1;
const THOMAS_ID = 2;
const HOLLINSFORD_ID = 1;
const PORT_ALDWICK_ID = 2;
const NONEXISTENT_ID = 99;

type LetterRow = {
  id: unknown;
  sender_id: unknown;
  recipient_id: unknown;
  origin_id: unknown;
  destination_id: unknown;
  date_text: unknown;
  date_source: unknown;
  date_edtf: unknown;
  date_earliest: unknown;
  date_latest: unknown;
  transcription: unknown;
};

// MAR/001, with every column filled in.
const validLetter: LetterRow = {
  id: "MAR/001",
  sender_id: ELIZA_ID,
  recipient_id: THOMAS_ID,
  origin_id: HOLLINSFORD_ID,
  destination_id: PORT_ALDWICK_ID,
  date_text: "14th March 1821",
  date_source: "dateline",
  date_edtf: "1821-03-14",
  date_earliest: "1821-03-14",
  date_latest: "1821-03-14",
  transcription: "My dear Brother, The thaw has come at last…",
};

let database: Database.Database;

beforeEach(() => {
  database = openDatabase(":memory:");
  migrate(database);
  database.exec(`
    INSERT INTO correspondents (id, name, kind) VALUES
      (${ELIZA_ID}, 'Eliza Marrable', 'person'),
      (${THOMAS_ID}, 'Thomas Marrable', 'person');
    INSERT INTO places (id, name) VALUES
      (${HOLLINSFORD_ID}, 'Hollinsford'),
      (${PORT_ALDWICK_ID}, 'Port Aldwick');
  `);
});

function insertLetter(changes: Partial<LetterRow> = {}): void {
  database
    .prepare(
      `INSERT INTO letters (id, sender_id, recipient_id, origin_id, destination_id,
                          date_text, date_source, date_edtf, date_earliest, date_latest, transcription)
     VALUES (@id, @sender_id, @recipient_id, @origin_id, @destination_id,
             @date_text, @date_source, @date_edtf, @date_earliest, @date_latest, @transcription)`,
    )
    .run({ ...validLetter, ...changes });
}

function insertCorrespondent(name: unknown, kind: unknown): void {
  database.prepare("INSERT INTO correspondents (name, kind) VALUES (?, ?)").run(name, kind);
}

function insertPlace(name: unknown): void {
  database.prepare("INSERT INTO places (name) VALUES (?)").run(name);
}

/** Runs `action`, which should fail, and returns SQLite's error code. */
function sqliteErrorCode(action: () => void): string {
  try {
    action();
  } catch (error) {
    if (error instanceof Database.SqliteError) return error.code;
    throw error;
  }
  throw new Error("Expected SQLite to reject this, but it was accepted.");
}

it("makes every table STRICT, so values of the wrong type are rejected", () => {
  const tablesNotStrict = database
    .prepare("SELECT name FROM pragma_table_list WHERE schema = 'main' AND name NOT LIKE 'sqlite_%' AND NOT strict")
    .pluck()
    .all();
  expect(tablesNotStrict).toEqual([]);
});

describe("correspondents", () => {
  it.each(["person", "organisation"])("accepts kind %s", (kind) => {
    expect(() => insertCorrespondent("Lindmouth Harbour Company", kind)).not.toThrow();
  });

  it("rejects any other kind", () => {
    expect(sqliteErrorCode(() => insertCorrespondent("Lindmouth Harbour Company", "company"))).toBe(CHECK_FAILED);
  });

  it("requires a name", () => {
    expect(sqliteErrorCode(() => insertCorrespondent(null, "person"))).toBe(NOT_NULL_FAILED);
    expect(sqliteErrorCode(() => insertCorrespondent("", "person"))).toBe(CHECK_FAILED);
  });
});

describe("places", () => {
  it("allows two places with the same name", () => {
    expect(() => insertPlace("Hollinsford")).not.toThrow();
  });

  it("requires a name", () => {
    expect(sqliteErrorCode(() => insertPlace(null))).toBe(NOT_NULL_FAILED);
    expect(sqliteErrorCode(() => insertPlace(""))).toBe(CHECK_FAILED);
  });
});

describe("letters", () => {
  it("accepts a letter with every column filled in", () => {
    expect(() => insertLetter()).not.toThrow();
  });

  it("accepts a letter with only the required columns", () => {
    const requiredOnly = {
      recipient_id: null,
      origin_id: null,
      destination_id: null,
      date_text: null,
      date_source: null,
      date_edtf: null,
      date_earliest: null,
      date_latest: null,
    };
    expect(() => insertLetter(requiredOnly)).not.toThrow();
  });

  it("rejects values of the wrong type", () => {
    expect(sqliteErrorCode(() => insertLetter({ sender_id: "Eliza Marrable" }))).toBe(WRONG_TYPE_FAILED);
  });

  describe("id", () => {
    it.each(["MAR/001", "ABCD/1000"])("accepts catalogue reference %s", (id) => {
      expect(() => insertLetter({ id })).not.toThrow();
    });

    it.each(["MAR001", "MAR/", "/001", ""])("rejects %j", (id) => {
      expect(sqliteErrorCode(() => insertLetter({ id }))).toBe(CHECK_FAILED);
    });

    it("must be unique", () => {
      insertLetter();
      expect(sqliteErrorCode(() => insertLetter())).toBe(PRIMARY_KEY_FAILED);
    });
  });

  describe("links to correspondents and places", () => {
    it("requires a sender", () => {
      expect(sqliteErrorCode(() => insertLetter({ sender_id: null }))).toBe(NOT_NULL_FAILED);
    });

    it.each(["sender_id", "recipient_id", "origin_id", "destination_id"])(
      "rejects a %s that does not exist",
      (column) => {
        expect(sqliteErrorCode(() => insertLetter({ [column]: NONEXISTENT_ID }))).toBe(FOREIGN_KEY_FAILED);
      },
    );

    it("prevents deleting a correspondent a letter refers to", () => {
      insertLetter();
      expect(sqliteErrorCode(() => database.prepare("DELETE FROM correspondents WHERE id = ?").run(ELIZA_ID))).toBe(
        FOREIGN_KEY_FAILED,
      );
    });

    it("prevents deleting a place a letter refers to", () => {
      insertLetter();
      expect(sqliteErrorCode(() => database.prepare("DELETE FROM places WHERE id = ?").run(HOLLINSFORD_ID))).toBe(
        FOREIGN_KEY_FAILED,
      );
    });
  });

  it("requires a transcription", () => {
    expect(sqliteErrorCode(() => insertLetter({ transcription: null }))).toBe(NOT_NULL_FAILED);
    expect(sqliteErrorCode(() => insertLetter({ transcription: "" }))).toBe(CHECK_FAILED);
  });

  describe("date text and source", () => {
    it.each(["dateline", "postmark", "endorsement", "annotation", "catalogue"])("accepts source %s", (date_source) => {
      expect(() => insertLetter({ date_source })).not.toThrow();
    });

    it("rejects any other source", () => {
      expect(sqliteErrorCode(() => insertLetter({ date_source: "guess" }))).toBe(CHECK_FAILED);
    });

    it("rejects text without a source", () => {
      expect(sqliteErrorCode(() => insertLetter({ date_source: null }))).toBe(CHECK_FAILED);
    });

    it("rejects a source without text", () => {
      expect(sqliteErrorCode(() => insertLetter({ date_text: null }))).toBe(CHECK_FAILED);
    });

    it("rejects empty text", () => {
      expect(sqliteErrorCode(() => insertLetter({ date_text: "" }))).toBe(CHECK_FAILED);
    });
  });

  describe.each(["date_earliest", "date_latest"])("%s", (column) => {
    // The other bound is left empty so the earliest <= latest rule can't interfere.
    function onlyThisBound(date: string) {
      return { date_earliest: null, date_latest: null, [column]: date };
    }

    it.each(["1821-03-14", "1840-02-29"])("accepts the real date %s", (date) => {
      expect(() => insertLetter(onlyThisBound(date))).not.toThrow();
    });

    it.each([
      ["1821-3-14", "missing zero padding"],
      ["1843-02-30", "impossible day"],
      ["1841-02-29", "not a leap year"],
      ["1821-03-14 10:00", "includes a time"],
      ["1821", "year only"],
      ["spring 1843", "free text"],
    ])("rejects %j (%s)", (date) => {
      expect(sqliteErrorCode(() => insertLetter(onlyThisBound(date)))).toBe(CHECK_FAILED);
    });
  });

  describe("date EDTF", () => {
    it("rejects empty EDTF", () => {
      expect(sqliteErrorCode(() => insertLetter({ date_edtf: "" }))).toBe(CHECK_FAILED);
    });

    it("rejects a range without EDTF to derive it from", () => {
      expect(sqliteErrorCode(() => insertLetter({ date_edtf: null }))).toBe(CHECK_FAILED);
    });

    it("accepts EDTF that gives no range (open at both ends)", () => {
      expect(() => insertLetter({ date_edtf: "../..", date_earliest: null, date_latest: null })).not.toThrow();
    });
  });

  describe("date range", () => {
    it("accepts a range with no earliest date ('before 1840')", () => {
      const before1840 = { date_edtf: "../1839", date_earliest: null, date_latest: "1839-12-31" };
      expect(() => insertLetter(before1840)).not.toThrow();
    });

    it("accepts a range with no latest date", () => {
      const from1839 = { date_edtf: "1839/..", date_earliest: "1839-01-01", date_latest: null };
      expect(() => insertLetter(from1839)).not.toThrow();
    });

    it("accepts a range spanning several years ('1826 or 1827')", () => {
      const eitherYear = { date_edtf: "[1826,1827]", date_earliest: "1826-01-01", date_latest: "1827-12-31" };
      expect(() => insertLetter(eitherYear)).not.toThrow();
    });

    it("rejects an earliest date after the latest date", () => {
      expect(sqliteErrorCode(() => insertLetter({ date_earliest: "1827-12-31", date_latest: "1826-01-01" }))).toBe(
        CHECK_FAILED,
      );
    });
  });
});
