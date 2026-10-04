// Arithmetic on calendar dates (proleptic Gregorian, no time or time zone).
// Pure and dependency-free. Months and days are 1-based.

export type CalendarDate = { year: number; month: number; day: number };
export type DateUnit = "year" | "month" | "day";

/** The first day of the year, month or day containing `date`. */
export function startOf(date: CalendarDate, unit: DateUnit): CalendarDate {
  if (unit === "year") return { year: date.year, month: 1, day: 1 };
  if (unit === "month") return { year: date.year, month: date.month, day: 1 };
  return { ...date };
}

/** The last day of the year, month or day containing `date`. */
export function endOf(date: CalendarDate, unit: DateUnit): CalendarDate {
  if (unit === "year") return { year: date.year, month: 12, day: 31 };
  if (unit === "month") return { year: date.year, month: date.month, day: daysInMonth(date.year, date.month) };
  return { ...date };
}

/**
 * Adds `amount` units to `date` (a negative amount moves back), normalising
 * overflow: month 14 becomes February of the next year, 32 January becomes
 * 1 February. A day that doesn't exist in the target month (31 January + 1
 * month) overflows into the following month, so add to `startOf` a unit when
 * that matters.
 */
export function addUnits(date: CalendarDate, unit: DateUnit, amount: number): CalendarDate {
  return normalisedDate(
    date.year + (unit === "year" ? amount : 0),
    date.month - 1 + (unit === "month" ? amount : 0),
    date.day + (unit === "day" ? amount : 0),
  );
}

export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this one.
  return normalisedDate(year, month, 0).day;
}

/** Builds a valid date from components that may be out of range. `monthIndex` is 0-based. */
function normalisedDate(year: number, monthIndex: number, day: number): CalendarDate {
  const utcDate = new Date(0);
  // setUTCFullYear, not Date.UTC: Date.UTC maps years 0–99 to 1900–1999.
  utcDate.setUTCFullYear(year, monthIndex, day);
  return { year: utcDate.getUTCFullYear(), month: utcDate.getUTCMonth() + 1, day: utcDate.getUTCDate() };
}
