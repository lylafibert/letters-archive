import { daysInMonth, isSameDate, parseIsoDate, type CalendarDate } from "./calendar-date";
import type { DateRange } from "./edtf-to-range";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const describeClosedRange = (start: CalendarDate, end: CalendarDate): string => {
  if (isSameDate(start, end)) return formatDay(start);
  if (isYearStart(start) && isYearEnd(end)) {
    return start.year === end.year ? String(start.year) : `${start.year}–${end.year}`;
  }
  if (start.day === 1 && isMonthEnd(end)) {
    if (start.year !== end.year) return `${formatMonth(start)} – ${formatMonth(end)}`;
    if (start.month === end.month) return formatMonth(start);
    return `${monthName(start)}–${monthName(end)} ${end.year}`;
  }
  return `${formatDay(start)} – ${formatDay(end)}`;
};

const describeUpTo = (end: CalendarDate): string => {
  if (isYearEnd(end)) return String(end.year);
  if (isMonthEnd(end)) return formatMonth(end);
  return formatDay(end);
};

const describeFrom = (start: CalendarDate): string => {
  if (isYearStart(start)) return String(start.year);
  if (start.day === 1) return formatMonth(start);
  return formatDay(start);
};

const isYearStart = (date: CalendarDate): boolean => {
  return date.month === 1 && date.day === 1;
};

const isYearEnd = (date: CalendarDate): boolean => {
  return date.month === 12 && date.day === 31;
};

const isMonthEnd = (date: CalendarDate): boolean => {
  return date.day === daysInMonth(date.year, date.month);
};

const monthName = (date: CalendarDate): string => {
  return MONTH_NAMES[date.month - 1] ?? String(date.month);
};

const formatMonth = (date: CalendarDate): string => {
  return `${monthName(date)} ${date.year}`;
};

const formatDay = (date: CalendarDate): string => {
  return `${date.day} ${formatMonth(date)}`;
};

/**
 * A range in words, at the coarsest precision that describes it exactly:
 * "14 March 1821", "March–May 1843", "1837–1839", "1839 or earlier".
 */
export const describeRange = ({ earliest, latest }: DateRange): string => {
  if (earliest !== null && latest !== null) return describeClosedRange(parseIsoDate(earliest), parseIsoDate(latest));
  if (latest !== null) return `${describeUpTo(parseIsoDate(latest))} or earlier`;
  if (earliest !== null) return `${describeFrom(parseIsoDate(earliest))} or later`;
  return "Undated";
};

/** The range as a valid `<time datetime>` value ("1843", "1844-02", "1821-03-14"), if it is a single period. */
export const singlePeriod = ({ earliest, latest }: DateRange): string | null => {
  if (earliest === null || latest === null) return null;
  const start = parseIsoDate(earliest);
  const end = parseIsoDate(latest);
  if (isSameDate(start, end)) return earliest;
  if (start.year !== end.year) return null;
  if (isYearStart(start) && isYearEnd(end)) return String(start.year);
  if (start.month === end.month && start.day === 1 && isMonthEnd(end)) return earliest.slice(0, 7);
  return null;
};
