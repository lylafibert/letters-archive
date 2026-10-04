import { addUnits, daysInMonth, endOf, isSameDate, parseIsoDate, startOf, type CalendarDate } from "./calendar-date";

function date(year: number, month: number, day: number): CalendarDate {
  return { year, month, day };
}

describe("startOf", () => {
  it("returns 1 January for a year", () => {
    expect(startOf(date(1843, 7, 15), "year")).toEqual(date(1843, 1, 1));
  });

  it("returns the 1st of the month for a month", () => {
    expect(startOf(date(1843, 7, 15), "month")).toEqual(date(1843, 7, 1));
  });

  it("returns the date itself for a day", () => {
    expect(startOf(date(1843, 7, 15), "day")).toEqual(date(1843, 7, 15));
  });
});

describe("endOf", () => {
  it("returns 31 December for a year", () => {
    expect(endOf(date(1843, 7, 15), "year")).toEqual(date(1843, 12, 31));
  });

  it("returns the last day of a 30-day month", () => {
    expect(endOf(date(1843, 4, 10), "month")).toEqual(date(1843, 4, 30));
  });

  it("returns the date itself for a day", () => {
    expect(endOf(date(1843, 7, 15), "day")).toEqual(date(1843, 7, 15));
  });
});

describe("daysInMonth", () => {
  it.each([
    ["a 31-day month", 1843, 1, 31],
    ["a 30-day month", 1843, 4, 30],
    ["February in a common year", 1843, 2, 28],
    ["February in a leap year", 1844, 2, 29],
    ["February in a century year that is not a leap year", 1900, 2, 28],
    ["February in a century year that is a leap year", 2000, 2, 29],
  ])("returns the right length for %s", (_description, year, month, expected) => {
    expect(daysInMonth(year, month)).toBe(expected);
  });
});

describe("addUnits", () => {
  it("moves by whole years", () => {
    expect(addUnits(date(1820, 1, 1), "year", -2)).toEqual(date(1818, 1, 1));
  });

  it("carries months forward into the next year", () => {
    expect(addUnits(date(1843, 12, 1), "month", 2)).toEqual(date(1844, 2, 1));
  });

  it("borrows months back from the previous year", () => {
    expect(addUnits(date(1844, 2, 1), "month", -2)).toEqual(date(1843, 12, 1));
  });

  it("carries days across a month end", () => {
    expect(addUnits(date(1821, 2, 27), "day", 2)).toEqual(date(1821, 3, 1));
  });

  it("borrows days back across a leap-year February", () => {
    expect(addUnits(date(1844, 3, 1), "day", -1)).toEqual(date(1844, 2, 29));
  });

  it("overflows a day that does not exist in the target month", () => {
    expect(addUnits(date(1843, 1, 31), "month", 1)).toEqual(date(1843, 3, 3));
  });

  it("returns the same date when adding zero", () => {
    expect(addUnits(date(1843, 7, 15), "month", 0)).toEqual(date(1843, 7, 15));
  });

  it("keeps years 0–99 as given rather than mapping them to the 1900s", () => {
    expect(addUnits(date(50, 6, 1), "year", 1)).toEqual(date(51, 6, 1));
  });
});

describe("parseIsoDate", () => {
  it("reads the year, month and day of a YYYY-MM-DD date", () => {
    expect(parseIsoDate("1821-03-14")).toEqual(date(1821, 3, 14));
  });

  it.each(["1821-3-14", "14-03-1821", "1821", ""])("rejects %j", (input) => {
    expect(() => parseIsoDate(input)).toThrow(input);
  });
});

describe("isSameDate", () => {
  it("is true for the same year, month and day", () => {
    expect(isSameDate(date(1821, 3, 14), date(1821, 3, 14))).toBe(true);
  });

  it("is false when any part differs", () => {
    expect(isSameDate(date(1821, 3, 14), date(1821, 3, 15))).toBe(false);
  });
});
