CREATE TABLE places (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL CHECK (name <> '')
) STRICT;

CREATE TABLE correspondents (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL CHECK (name <> ''),
  kind TEXT NOT NULL CHECK (kind IN ('person', 'organisation'))
) STRICT;

CREATE TABLE letters (
  id             TEXT PRIMARY KEY CHECK (id GLOB '?*/?*'),  -- catalogue reference, e.g. 'MAR/001'
  sender_id      INTEGER NOT NULL REFERENCES correspondents (id),
  recipient_id   INTEGER REFERENCES correspondents (id),
  origin_id      INTEGER REFERENCES places (id),
  destination_id INTEGER REFERENCES places (id),
  date_text      TEXT CHECK (date_text <> ''),               -- as written in date_source
  date_source    TEXT CHECK (date_source IN ('dateline', 'postmark', 'endorsement', 'annotation', 'catalogue')),
  date_edtf      TEXT CHECK (date_edtf <> ''),               -- cataloguer's EDTF; the range is derived from it
  -- Inclusive range, 'YYYY-MM-DD'; NULL bound = open-ended.
  -- IS, not =: date() returns NULL for bad input, and a NULL CHECK passes.
  date_earliest  TEXT CHECK (date(date_earliest) IS date_earliest),
  date_latest    TEXT CHECK (date(date_latest) IS date_latest),
  transcription  TEXT NOT NULL CHECK (transcription <> ''),
  CHECK ((date_text IS NULL) = (date_source IS NULL)),
  -- A range needs an EDTF value to come from. Not the reverse: '../..' has no bounds.
  CHECK (date_edtf IS NOT NULL OR (date_earliest IS NULL AND date_latest IS NULL)),
  CHECK (date_earliest IS NULL OR date_latest IS NULL OR date_earliest <= date_latest)
) STRICT;

CREATE INDEX letters_sender_id      ON letters (sender_id);
CREATE INDEX letters_recipient_id   ON letters (recipient_id);
CREATE INDEX letters_origin_id      ON letters (origin_id);
CREATE INDEX letters_destination_id ON letters (destination_id);
CREATE INDEX letters_date           ON letters (date_earliest, date_latest);
