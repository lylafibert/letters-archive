import type { DateRange } from "../dates/edtf-to-range";
import type { Letter } from "../model/types";

const EXCERPT_LENGTH = 140;

/** "Eliza Marrable to Thomas Marrable". */
export const letterTitle = (letter: Letter): string => {
  return `${letter.sender.name} to ${letter.recipient?.name ?? "an unknown recipient"}`;
};

export const letterDateRange = (letter: Letter): DateRange => {
  return { earliest: letter.dateEarliest, latest: letter.dateLatest };
};

export const transcriptionLines = (letter: Letter): string[] => {
  return letter.transcription.split("\n");
};

/** The opening of the letter's body (the line after the salutation), cut at a word boundary. */
export const letterExcerpt = (letter: Letter): string => {
  const lines = transcriptionLines(letter);
  const body = lines[1] ?? letter.transcription;
  if (body.length <= EXCERPT_LENGTH) return body;
  const cut = body.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
};
