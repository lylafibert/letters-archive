import type { DateRange } from "./edtf-to-range";

/** Decades a range overlaps, e.g. [1810, 1820] for 1818–1822. An open end counts only the known end's decade. */
export function decadesOverlapping({ earliest, latest }: DateRange): number[] {
  const first = earliest ?? latest;
  const last = latest ?? earliest;
  if (first === null || last === null) return [];
  const decades: number[] = [];
  for (let decade = decadeOf(first); decade <= decadeOf(last); decade += 10) decades.push(decade);
  return decades;
}

/** True only when both ends of the range are known and fall within the decade. */
export function isCertainlyWithinDecade({ earliest, latest }: DateRange, decade: number): boolean {
  return earliest !== null && latest !== null && decadeOf(earliest) === decade && decadeOf(latest) === decade;
}

export function decadeLabel(decade: number): string {
  return `${decade}s`;
}

function decadeOf(isoDate: string): number {
  return Math.floor(Number(isoDate.slice(0, 4)) / 10) * 10;
}
