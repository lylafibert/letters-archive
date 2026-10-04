import { describeRange } from "../dates/describe-range";
import type { DateRange } from "../dates/edtf-to-range";
import type { Letter } from "../model/types";
import { letterPath } from "./paths";
import { SITE_NAME, SITE_URL } from "./site-config";

const EXCERPT_LENGTH = 140;

export const letterTitle = (letter: Letter): string => {
  return `${letter.sender.name} to ${letter.recipient?.name ?? "an unknown recipient"}`;
};

export const letterDateRange = (letter: Letter): DateRange => {
  return { earliest: letter.dateEarliest, latest: letter.dateLatest };
};

/** The date tells apart letters between the same people. */
export const letterTitleWithDate = (letter: Letter): string => {
  const date = describeRange(letterDateRange(letter));
  return `${letterTitle(letter)}, ${date === "Undated" ? "undated" : date}`;
};

/**
 * The date in the source's own words, when it adds something to the range:
 * "c. 1820" for 1818–1822, but nothing for "14th March 1821" on 14 March 1821.
 */
export const sourceWording = (letter: Letter): string | null => {
  if (letter.dateText === null) return null;
  const withoutOrdinals = letter.dateText.replace(/(\d)(st|nd|rd|th)\b/g, "$1");
  return withoutOrdinals === describeRange(letterDateRange(letter)) ? null : letter.dateText;
};

export const letterCitation = (letter: Letter): string => {
  return `${letterTitleWithDate(letter)}. ${SITE_NAME}, ${letter.id}. ${SITE_URL}${letterPath(letter.id)}`;
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
