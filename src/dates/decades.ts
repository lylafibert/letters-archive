import type { DateRange } from "./edtf-to-range";

const decadeOf = (isoDate: string): number => {
  return Math.floor(Number(isoDate.slice(0, 4)) / 10) * 10;
};

/** Decades a range overlaps, e.g. [1810, 1820] for 1818–1822. An open end counts only the known end's decade. */
export const decadesOverlapping = ({ earliest, latest }: DateRange): number[] => {
  const first = earliest ?? latest;
  const last = latest ?? earliest;
  if (first === null || last === null) return [];
  const firstDecade = decadeOf(first);
  const decadeCount = (decadeOf(last) - firstDecade) / 10 + 1;
  return Array.from({ length: decadeCount }, (_, index) => firstDecade + index * 10);
};

/** True only when both ends of the range are known and fall within the decade. */
export const isCertainlyWithinDecade = ({ earliest, latest }: DateRange, decade: number): boolean => {
  return earliest !== null && latest !== null && decadeOf(earliest) === decade && decadeOf(latest) === decade;
};

export const decadeLabel = (decade: number): string => {
  return `${decade}s`;
};
