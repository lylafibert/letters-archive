import { decadesOverlapping, isCertainlyWithinDecade } from "../dates/decades";
import type { Correspondent, Letter } from "../model/types";
import { letterDateRange } from "./letter-details";

export type CorrespondentSummary = { correspondent: Correspondent; sent: Letter[]; received: Letter[] };

/** Letters in a decade: `certain` fall wholly within it, `possible` only may. */
export type DecadeSummary = { decade: number; certain: Letter[]; possible: Letter[] };

const nameCollator = new Intl.Collator("en-GB");

/** Everyone who sent or received a letter, by name. Letters keep their given order. */
export function summariseCorrespondents(letters: readonly Letter[]): CorrespondentSummary[] {
  const summaries = new Map<number, CorrespondentSummary>();
  function summaryFor(correspondent: Correspondent): CorrespondentSummary {
    let summary = summaries.get(correspondent.id);
    if (!summary) {
      summary = { correspondent, sent: [], received: [] };
      summaries.set(correspondent.id, summary);
    }
    return summary;
  }

  for (const letter of letters) {
    summaryFor(letter.sender).sent.push(letter);
    if (letter.recipient) summaryFor(letter.recipient).received.push(letter);
  }
  return [...summaries.values()].sort((first, second) =>
    nameCollator.compare(first.correspondent.name, second.correspondent.name),
  );
}

/** Every decade any letter may belong to, in order. Letters keep their given order. */
export function summariseDecades(letters: readonly Letter[]): DecadeSummary[] {
  const summaries = new Map<number, DecadeSummary>();
  for (const letter of letters) {
    const range = letterDateRange(letter);
    for (const decade of decadesOverlapping(range)) {
      let summary = summaries.get(decade);
      if (!summary) {
        summary = { decade, certain: [], possible: [] };
        summaries.set(decade, summary);
      }
      (isCertainlyWithinDecade(range, decade) ? summary.certain : summary.possible).push(letter);
    }
  }
  return [...summaries.values()].sort((first, second) => first.decade - second.decade);
}
