// Calendar dates without times or time zones. Months and days count from 1, unlike JavaScript's Date.

export type CalendarDate = { year: number; month: number; day: number };
export type DateUnit = "year" | "month" | "day";

/** Turns parts that may overflow (month 13, day 0) into a real date. `monthIndex` counts from 0. */
const normalisedDate = (year: number, monthIndex: number, day: number): CalendarDate => {
  const utcDate = new Date(0);
  // setUTCFullYear, not Date.UTC: Date.UTC maps years 0–99 to 1900–1999.
  utcDate.setUTCFullYear(year, monthIndex, day);
  return { year: utcDate.getUTCFullYear(), month: utcDate.getUTCMonth() + 1, day: utcDate.getUTCDate() };
};

export const parseIsoDate = (isoDate: string): CalendarDate => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) throw new Error(`Not a YYYY-MM-DD date: "${isoDate}"`);
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
};

export const isSameDate = (first: CalendarDate, second: CalendarDate): boolean => {
  return first.year === second.year && first.month === second.month && first.day === second.day;
};

export const daysInMonth = (year: number, month: number): number => {
  // Day 0 of the next month is the last day of this one.
  return normalisedDate(year, month, 0).day;
};

export const startOf = (date: CalendarDate, unit: DateUnit): CalendarDate => {
  if (unit === "year") return { year: date.year, month: 1, day: 1 };
  if (unit === "month") return { year: date.year, month: date.month, day: 1 };
  return { ...date };
};

export const endOf = (date: CalendarDate, unit: DateUnit): CalendarDate => {
  if (unit === "year") return { year: date.year, month: 12, day: 31 };
  if (unit === "month") return { year: date.year, month: date.month, day: daysInMonth(date.year, date.month) };
  return { ...date };
};

/**
 * Adds `amount` units, or goes back for a negative amount. Overflow rolls over, so 31 January plus one
 * month is 3 March. Add to `startOf` the unit when that matters.
 */
export const addUnits = (date: CalendarDate, unit: DateUnit, amount: number): CalendarDate => {
  return normalisedDate(
    date.year + (unit === "year" ? amount : 0),
    date.month - 1 + (unit === "month" ? amount : 0),
    date.day + (unit === "day" ? amount : 0),
  );
};
