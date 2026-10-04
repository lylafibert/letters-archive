// Turns an EDTF date (ISO 8601-2) into the earliest and latest days it could be.
// @edtf-ts/core parses the EDTF and gives the base bounds. On top of that, open and unknown ends both
// become null, and dates marked ? ~ or % are widened by 1, 2 or 3 units of their own precision, so
// "1820~" is 1818–1822. Qualifiers on interval ends ("1820~/1825") or single parts ("1820-?03") aren't widened.
import {
  APPROXIMATE_MULTIPLIER,
  UNCERTAIN_APPROXIMATE_MULTIPLIER,
  UNCERTAIN_MULTIPLIER,
  formatCalendarDate,
  getBounds,
  isEDTFDate,
  parse,
  type EDTFBase,
  type Precision,
  type TemporalBound,
} from "@edtf-ts/core";
import { addUnits, endOf, startOf, type CalendarDate, type DateUnit } from "./calendar-date";

export type DateRange = {
  earliest: string | null; // "YYYY-MM-DD", inclusive; null = open-ended
  latest: string | null; // "YYYY-MM-DD", inclusive; null = open-ended
};

const qualifierMargin = (parsed: EDTFBase): number => {
  if (!isEDTFDate(parsed)) return 0;
  const qualification = parsed.qualification;
  if (qualification?.uncertainApproximate) return Number(UNCERTAIN_APPROXIMATE_MULTIPLIER);
  if (qualification?.approximate) return Number(APPROXIMATE_MULTIPLIER);
  if (qualification?.uncertain) return Number(UNCERTAIN_MULTIPLIER);
  return 0;
};

/** The calendar unit of a precision, or undefined for precisions that can't be widened (e.g. seasons). */
const precisionUnit = (precision: Precision): DateUnit | undefined => {
  return precision === "year" || precision === "month" || precision === "day" ? precision : undefined;
};

const finiteDate = (bound: TemporalBound): CalendarDate | null => {
  return bound.kind === "finite" ? bound.date : null;
};

const toIsoDate = (date: CalendarDate | null): string | null => {
  return date && formatCalendarDate(date);
};

export const edtfToRange = (edtf: string): DateRange => {
  const parseResult = parse(edtf);
  if (!parseResult.success) {
    const reason = parseResult.errors.map((error) => error.message).join("; ");
    throw new Error(`Invalid EDTF date "${edtf}": ${reason}`);
  }

  const parsed = parseResult.value;
  const bounds = getBounds(parsed);
  const earliestDate = finiteDate(bounds.earliest);
  const latestDate = finiteDate(bounds.latest);
  const margin = qualifierMargin(parsed);
  const unit = precisionUnit(parsed.precision);

  if (margin === 0 || unit === undefined) {
    return { earliest: toIsoDate(earliestDate), latest: toIsoDate(latestDate) };
  }

  // Widen by `margin` whole units: back from the start of the first unit,
  // forward to the end of the last.
  return {
    earliest: toIsoDate(earliestDate && addUnits(startOf(earliestDate, unit), unit, -margin)),
    latest: toIsoDate(latestDate && endOf(addUnits(startOf(latestDate, unit), unit, margin), unit)),
  };
};
