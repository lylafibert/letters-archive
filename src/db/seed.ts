import type Database from "better-sqlite3";
import { edtfToRange } from "../dates/edtf-to-range";
import { openDatabase } from "./migrate";
import { CORRESPONDENTS, LETTERS, PLACES, type CorrespondentKey, type PlaceKey, type SeedLetter } from "./seed-data";

const insertPlaces = (database: Database.Database): Map<PlaceKey, number> => {
  const insertPlace = database.prepare("INSERT INTO places (name) VALUES (?)");
  const placeIds = new Map<PlaceKey, number>();
  for (const [key, name] of entries(PLACES)) {
    placeIds.set(key, Number(insertPlace.run(name).lastInsertRowid));
  }
  return placeIds;
};

const insertCorrespondents = (database: Database.Database): Map<CorrespondentKey, number> => {
  const insertCorrespondent = database.prepare("INSERT INTO correspondents (name, kind) VALUES (?, ?)");
  const correspondentIds = new Map<CorrespondentKey, number>();
  for (const [key, { name, kind }] of entries(CORRESPONDENTS)) {
    correspondentIds.set(key, Number(insertCorrespondent.run(name, kind).lastInsertRowid));
  }
  return correspondentIds;
};

const insertLetters = (
  database: Database.Database,
  letters: readonly SeedLetter[],
  placeIds: Map<PlaceKey, number>,
  correspondentIds: Map<CorrespondentKey, number>,
): void => {
  const insertLetter = database.prepare(`
    INSERT INTO letters (id, sender_id, recipient_id, origin_id, destination_id,
                         date_text, date_source, date_edtf, date_earliest, date_latest, transcription)
    VALUES (@id, @senderId, @recipientId, @originId, @destinationId,
            @dateText, @dateSource, @dateEdtf, @dateEarliest, @dateLatest, @transcription)
  `);
  for (const letter of letters) {
    const range = letter.date ? edtfToRange(letter.date.edtf) : { earliest: null, latest: null };
    insertLetter.run({
      id: letter.id,
      senderId: correspondentIds.get(letter.sender),
      recipientId: letter.recipient ? correspondentIds.get(letter.recipient) : null,
      originId: letter.origin ? placeIds.get(letter.origin) : null,
      destinationId: letter.destination ? placeIds.get(letter.destination) : null,
      dateText: letter.date?.text ?? null,
      dateSource: letter.date?.source ?? null,
      dateEdtf: letter.date?.edtf ?? null,
      dateEarliest: range.earliest,
      dateLatest: range.latest,
      transcription: letter.transcription.join("\n"),
    });
  }
};

/** Object.entries with the object's own key type. */
const entries = <Key extends string, Value>(record: Record<Key, Value>): [Key, Value][] => {
  return Object.entries(record) as [Key, Value][];
};

/** Inserts the sample archive in one transaction. Expects a migrated, empty database. */
export const seedDatabase = (database: Database.Database, letters: readonly SeedLetter[] = LETTERS): void => {
  database.transaction(() => {
    const placeIds = insertPlaces(database);
    const correspondentIds = insertCorrespondents(database);
    insertLetters(database, letters, placeIds, correspondentIds);
  })();
};

if (import.meta.main) {
  const database = openDatabase();
  seedDatabase(database);
  console.log(`Seeded ${LETTERS.length} letters.`);
  database.close();
}
