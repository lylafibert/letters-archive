import type { Letter } from "../model/types";
import { transcriptionLines } from "./letter-details";
import { letterPath } from "./paths";

const toJsonLetter = (letter: Letter) => {
  return {
    id: letter.id,
    path: letterPath(letter.id),
    sender: { name: letter.sender.name, kind: letter.sender.kind },
    recipient: letter.recipient && { name: letter.recipient.name, kind: letter.recipient.kind },
    origin: letter.origin?.name ?? null,
    destination: letter.destination?.name ?? null,
    date: {
      text: letter.dateText,
      source: letter.dateSource,
      edtf: letter.dateEdtf,
      earliest: letter.dateEarliest,
      latest: letter.dateLatest,
    },
    transcription: transcriptionLines(letter),
  };
};

export type JsonLetter = ReturnType<typeof toJsonLetter>;
export type JsonIndex = { letters: JsonLetter[] };

/** The whole archive as JSON, for reuse outside the site. Paths are relative to the site root. */
export const renderJsonIndex = (letters: readonly Letter[]): string => {
  const index: JsonIndex = { letters: letters.map(toJsonLetter) };
  return `${JSON.stringify(index, null, 2)}\n`;
};
