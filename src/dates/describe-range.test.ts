import { describeRange, singlePeriod } from "./describe-range";

const range = (earliest: string | null, latest: string | null) => {
  return { earliest, latest };
};

describe("describeRange", () => {
  it.each([
    ["a single day", range("1821-03-14", "1821-03-14"), "14 March 1821"],
    ["a whole year", range("1843-01-01", "1843-12-31"), "1843"],
    ["several whole years", range("1837-01-01", "1839-12-31"), "1837–1839"],
    ["a whole month", range("1844-02-01", "1844-02-29"), "February 1844"],
    ["whole months in one year", range("1843-03-01", "1843-05-31"), "March–May 1843"],
    ["whole months across a year end", range("1843-12-01", "1844-02-29"), "December 1843 – February 1844"],
    ["days that are not whole months", range("1833-08-05", "1833-08-10"), "5 August 1833 – 10 August 1833"],
  ])("describes %s at that precision", (_description, input, expected) => {
    expect(describeRange(input)).toBe(expected);
  });

  it.each([
    ["the end of a year", range(null, "1839-12-31"), "1839 or earlier"],
    ["the end of a month", range(null, "1839-11-30"), "November 1839 or earlier"],
    ["a day", range(null, "1833-08-12"), "12 August 1833 or earlier"],
  ])("describes an open start ending on %s", (_description, input, expected) => {
    expect(describeRange(input)).toBe(expected);
  });

  it.each([
    ["the start of a year", range("1839-01-01", null), "1839 or later"],
    ["the start of a month", range("1839-07-01", null), "July 1839 or later"],
    ["a day", range("1839-07-03", null), "3 July 1839 or later"],
  ])("describes an open end starting on %s", (_description, input, expected) => {
    expect(describeRange(input)).toBe(expected);
  });

  it("describes a range with no bounds as undated", () => {
    expect(describeRange(range(null, null))).toBe("Undated");
  });
});

describe("singlePeriod", () => {
  it.each([
    ["a day", range("1821-03-14", "1821-03-14"), "1821-03-14"],
    ["a month", range("1844-02-01", "1844-02-29"), "1844-02"],
    ["a year", range("1843-01-01", "1843-12-31"), "1843"],
  ])("returns the datetime value for %s", (_description, input, expected) => {
    expect(singlePeriod(input)).toBe(expected);
  });

  it.each([
    ["several years", range("1837-01-01", "1839-12-31")],
    ["several months", range("1843-03-01", "1843-05-31")],
    ["an open start", range(null, "1839-12-31")],
    ["an open end", range("1839-01-01", null)],
  ])("returns null for %s", (_description, input) => {
    expect(singlePeriod(input)).toBeNull();
  });
});
