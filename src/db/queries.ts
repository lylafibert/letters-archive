import type Database from "better-sqlite3";
import type { Correspondent, DateSource, Letter, Place } from "../model/types";

type LetterRow = {
  id: string;
  sender_id: number;
  sender_name: string;
  sender_kind: Correspondent["kind"];
  recipient_id: number | null;
  recipient_name: string | null;
  recipient_kind: Correspondent["kind"] | null;
  origin_id: number | null;
  origin_name: string | null;
  destination_id: number | null;
  destination_name: string | null;
  date_text: string | null;
  date_source: DateSource | null;
  date_edtf: string | null;
  date_earliest: string | null;
  date_latest: string | null;
  transcription: string;
};

// Chronological: by earliest date, or latest when the start is open; undated last.
const SELECT_LETTERS = `
  SELECT letters.id,
         sender.id AS sender_id, sender.name AS sender_name, sender.kind AS sender_kind,
         recipient.id AS recipient_id, recipient.name AS recipient_name, recipient.kind AS recipient_kind,
         origin.id AS origin_id, origin.name AS origin_name,
         destination.id AS destination_id, destination.name AS destination_name,
         letters.date_text, letters.date_source, letters.date_edtf,
         letters.date_earliest, letters.date_latest, letters.transcription
  FROM letters
  JOIN correspondents AS sender ON sender.id = letters.sender_id
  LEFT JOIN correspondents AS recipient ON recipient.id = letters.recipient_id
  LEFT JOIN places AS origin ON origin.id = letters.origin_id
  LEFT JOIN places AS destination ON destination.id = letters.destination_id
  ORDER BY COALESCE(letters.date_earliest, letters.date_latest) NULLS LAST,
           letters.date_latest NULLS LAST,
           letters.id
`;

export function loadLetters(database: Database.Database): Letter[] {
  const rows = database.prepare(SELECT_LETTERS).all() as LetterRow[];
  return rows.map(toLetter);
}

function toLetter(row: LetterRow): Letter {
  return {
    id: row.id,
    sender: { id: row.sender_id, name: row.sender_name, kind: row.sender_kind },
    recipient: toCorrespondent(row.recipient_id, row.recipient_name, row.recipient_kind),
    origin: toPlace(row.origin_id, row.origin_name),
    destination: toPlace(row.destination_id, row.destination_name),
    dateText: row.date_text,
    dateSource: row.date_source,
    dateEdtf: row.date_edtf,
    dateEarliest: row.date_earliest,
    dateLatest: row.date_latest,
    transcription: row.transcription,
  };
}

function toCorrespondent(
  id: number | null,
  name: string | null,
  kind: Correspondent["kind"] | null,
): Correspondent | null {
  return id !== null && name !== null && kind !== null ? { id, name, kind } : null;
}

function toPlace(id: number | null, name: string | null): Place | null {
  return id !== null && name !== null ? { id, name } : null;
}
