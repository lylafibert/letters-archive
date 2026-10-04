// Converts an EDTF date (ISO 8601-2) into an inclusive earliest/latest range of
// calendar days, for storing, sorting and querying.
//
// Parsing and base bounds come from @edtf-ts/core. On top of that:
// - Open ("../1839") and unknown ("/1839") endpoints both become null.
// - Qualified single dates are widened by whole units of their own precision,
//   using the library's search-padding multipliers:
//   uncertain (?) ±1, approximate (~) ±2, both (%) ±3.
//   So "1820~" is 1818–1822 and "1844-02~" is December 1843 – April 1844.
// - Sets and lists span from their first to their last member.
// Not handled: qualifiers on interval endpoints ("1820~/1825") or on single
// components ("1820-?03"); these use the unwidened bounds.
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

export class InvalidEdtfError extends Error {
  override name = "InvalidEdtfError";
}

export function edtfToRange(edtf: string): DateRange {
  const parseResult = parse(edtf);
  if (!parseResult.success) {
    const reason = parseResult.errors.map((error) => error.message).join("; ");
    throw new InvalidEdtfError(`Invalid EDTF date "${edtf}": ${reason}`);
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
}

/** How many units of its precision a qualified single date is widened by. */
function qualifierMargin(parsed: EDTFBase): number {
  if (!isEDTFDate(parsed)) return 0;
  const qualification = parsed.qualification;
  if (qualification?.uncertainApproximate) return Number(UNCERTAIN_APPROXIMATE_MULTIPLIER);
  if (qualification?.approximate) return Number(APPROXIMATE_MULTIPLIER);
  if (qualification?.uncertain) return Number(UNCERTAIN_MULTIPLIER);
  return 0;
}

/** The calendar unit of a precision, or undefined for precisions that can't be widened (e.g. seasons). */
function precisionUnit(precision: Precision): DateUnit | undefined {
  return precision === "year" || precision === "month" || precision === "day" ? precision : undefined;
}

/** The bound's date, or null when it is open or unknown. */
function finiteDate(bound: TemporalBound): CalendarDate | null {
  return bound.kind === "finite" ? bound.date : null;
}

function toIsoDate(date: CalendarDate | null): string | null {
  return date && formatCalendarDate(date);
}
