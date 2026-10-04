// Arithmetic on calendar days (proleptic Gregorian, no time or time zone).
// Pure and dependency-free. Months and days are 1-based.

export type Day = { year: number; month: number; day: number };
export type Unit = "year" | "month" | "day";

/** The first day of the year, month or day containing `date`. */
export function startOf({ year, month, day }: Day, unit: Unit): Day {
  if (unit === "year") return { year, month: 1, day: 1 };
  if (unit === "month") return { year, month, day: 1 };
  return { year, month, day };
}

/** The last day of the year, month or day containing `date`. */
export function endOf({ year, month, day }: Day, unit: Unit): Day {
  if (unit === "year") return { year, month: 12, day: 31 };
  if (unit === "month") return { year, month, day: daysInMonth(year, month) };
  return { year, month, day };
}

/**
 * Moves a date by `n` units (negative moves back), normalising overflow:
 * month 14 becomes February of the next year, 32 January becomes 1 February.
 * Shifting a day that doesn't exist in the target month (31 January + 1 month)
 * overflows into the following month, so shift `startOf` a unit when that matters.
 */
export function shift({ year, month, day }: Day, unit: Unit, n: number): Day {
  return fromUtc(
    year + (unit === "year" ? n : 0),
    month - 1 + (unit === "month" ? n : 0),
    day + (unit === "day" ? n : 0),
  );
}

export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this one.
  return fromUtc(year, month, 0).day;
}

/** Builds a Day from possibly out-of-range UTC components (month is 0-based here). */
function fromUtc(year: number, monthIndex: number, day: number): Day {
  const date = new Date(0);
  // setUTCFullYear, not Date.UTC: Date.UTC maps years 0–99 to 1900–1999.
  date.setUTCFullYear(year, monthIndex, day);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}
