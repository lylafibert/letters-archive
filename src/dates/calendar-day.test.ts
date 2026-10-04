import { daysInMonth, endOf, shift, startOf, type Day } from "./calendar-day.js";

function day(year: number, month: number, d: number): Day {
  return { year, month, day: d };
}

describe("startOf", () => {
  it("returns 1 January for a year", () => {
    expect(startOf(day(1843, 7, 15), "year")).toEqual(day(1843, 1, 1));
  });

  it("returns the 1st of the month for a month", () => {
    expect(startOf(day(1843, 7, 15), "month")).toEqual(day(1843, 7, 1));
  });

  it("returns the date itself for a day", () => {
    expect(startOf(day(1843, 7, 15), "day")).toEqual(day(1843, 7, 15));
  });
});

describe("endOf", () => {
  it("returns 31 December for a year", () => {
    expect(endOf(day(1843, 7, 15), "year")).toEqual(day(1843, 12, 31));
  });

  it("returns the last day of a 30-day month", () => {
    expect(endOf(day(1843, 4, 10), "month")).toEqual(day(1843, 4, 30));
  });

  it("returns the date itself for a day", () => {
    expect(endOf(day(1843, 7, 15), "day")).toEqual(day(1843, 7, 15));
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

describe("shift", () => {
  it("moves by whole years", () => {
    expect(shift(day(1820, 1, 1), "year", -2)).toEqual(day(1818, 1, 1));
  });

  it("carries months forward into the next year", () => {
    expect(shift(day(1843, 12, 1), "month", 2)).toEqual(day(1844, 2, 1));
  });

  it("borrows months back from the previous year", () => {
    expect(shift(day(1844, 2, 1), "month", -2)).toEqual(day(1843, 12, 1));
  });

  it("carries days across a month end", () => {
    expect(shift(day(1821, 2, 27), "day", 2)).toEqual(day(1821, 3, 1));
  });

  it("borrows days back across a leap-year February", () => {
    expect(shift(day(1844, 3, 1), "day", -1)).toEqual(day(1844, 2, 29));
  });

  it("overflows a day that does not exist in the target month", () => {
    expect(shift(day(1843, 1, 31), "month", 1)).toEqual(day(1843, 3, 3));
  });

  it("returns the same date for a shift of zero", () => {
    expect(shift(day(1843, 7, 15), "month", 0)).toEqual(day(1843, 7, 15));
  });

  it("keeps years 0–99 as given rather than mapping them to the 1900s", () => {
    expect(shift(day(50, 6, 1), "year", 1)).toEqual(day(51, 6, 1));
  });
});
