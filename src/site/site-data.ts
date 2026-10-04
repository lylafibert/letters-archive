import { decadesOverlapping, isCertainlyWithinDecade } from "../dates/decades";
import type { Correspondent, Letter } from "../model/types";
import { letterDateRange } from "./letter-details";

export type CorrespondentSummary = { correspondent: Correspondent; sent: Letter[]; received: Letter[] };

/** Letters in a decade: `certain` fall wholly within it, `possible` only may. */
export type DecadeSummary = { decade: number; certain: Letter[]; possible: Letter[] };

const nameCollator = new Intl.Collator("en-GB");

const getOrCreate = <Key, Value>(map: Map<Key, Value>, key: Key, create: () => Value): Value => {
  const existing = map.get(key);
  if (existing) return existing;
  const created = create();
  map.set(key, created);
  return created;
};

/** Everyone who sent or received a letter, by name. Letters keep their given order. */
export const summariseCorrespondents = (letters: readonly Letter[]): CorrespondentSummary[] => {
  const summaries = new Map<number, CorrespondentSummary>();
  const summaryFor = (correspondent: Correspondent): CorrespondentSummary =>
    getOrCreate(summaries, correspondent.id, () => ({ correspondent, sent: [], received: [] }));

  for (const letter of letters) {
    summaryFor(letter.sender).sent.push(letter);
    if (letter.recipient) summaryFor(letter.recipient).received.push(letter);
  }
  return [...summaries.values()].sort((first, second) =>
    nameCollator.compare(first.correspondent.name, second.correspondent.name),
  );
};

/** Every decade any letter may belong to, in order. Letters keep their given order. */
export const summariseDecades = (letters: readonly Letter[]): DecadeSummary[] => {
  const summaries = new Map<number, DecadeSummary>();
  for (const letter of letters) {
    const range = letterDateRange(letter);
    for (const decade of decadesOverlapping(range)) {
      const summary = getOrCreate(summaries, decade, () => ({ decade, certain: [], possible: [] }));
      if (isCertainlyWithinDecade(range, decade)) summary.certain.push(letter);
      else summary.possible.push(letter);
    }
  }
  return [...summaries.values()].sort((first, second) => first.decade - second.decade);
};
