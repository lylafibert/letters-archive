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
  type TemporalBound,
} from "@edtf-ts/core";
import { endOf, shift, startOf, type Day, type Unit } from "./calendar-day.js";

export type DateRange = {
  earliest: string | null; // "YYYY-MM-DD", inclusive; null = open-ended
  latest: string | null; // "YYYY-MM-DD", inclusive; null = open-ended
};

export class InvalidEdtfError extends Error {
  override name = "InvalidEdtfError";
}

export function edtfToRange(edtf: string): DateRange {
  const result = parse(edtf);
  if (!result.success) {
    const reason = result.errors.map((error) => error.message).join("; ");
    throw new InvalidEdtfError(`Invalid EDTF date "${edtf}": ${reason}`);
  }

  const { value } = result;
  const { earliest, latest } = getBounds(value);
  const margin = qualifierMargin(value);
  const unit = toUnit(value.precision);

  const earliestDay = finiteDay(earliest);
  const latestDay = finiteDay(latest);

  if (margin === 0 || unit === undefined) {
    return { earliest: toIsoDate(earliestDay), latest: toIsoDate(latestDay) };
  }

  // Widen by `margin` whole units: back from the start of the first unit,
  // forward to the end of the last.
  return {
    earliest: toIsoDate(earliestDay && shift(startOf(earliestDay, unit), unit, -margin)),
    latest: toIsoDate(latestDay && endOf(shift(startOf(latestDay, unit), unit, margin), unit)),
  };
}

function qualifierMargin(value: EDTFBase): number {
  if (!isEDTFDate(value)) return 0;
  const q = value.qualification;
  if (q?.uncertainApproximate) return Number(UNCERTAIN_APPROXIMATE_MULTIPLIER);
  if (q?.approximate) return Number(APPROXIMATE_MULTIPLIER);
  if (q?.uncertain) return Number(UNCERTAIN_MULTIPLIER);
  return 0;
}

function toUnit(precision: EDTFBase["precision"]): Unit | undefined {
  return precision === "year" || precision === "month" || precision === "day"
    ? precision
    : undefined;
}

/** The bound's day, or null when it is open or unknown. */
function finiteDay(bound: TemporalBound): Day | null {
  return bound.kind === "finite" ? bound.date : null;
}

function toIsoDate(day: Day | null): string | null {
  return day && formatCalendarDate(day);
}
