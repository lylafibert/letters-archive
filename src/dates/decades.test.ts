import { decadeLabel, decadesOverlapping, isCertainlyWithinDecade } from "./decades";

function range(earliest: string | null, latest: string | null) {
  return { earliest, latest };
}

describe("decadesOverlapping", () => {
  it("returns one decade for a range within it", () => {
    expect(decadesOverlapping(range("1837-01-01", "1839-12-31"))).toEqual([1830]);
  });

  it("returns every decade a range overlaps", () => {
    expect(decadesOverlapping(range("1818-01-01", "1822-12-31"))).toEqual([1810, 1820]);
  });

  it("includes the decade of a range ending on its first day", () => {
    expect(decadesOverlapping(range("1839-07-01", "1840-01-01"))).toEqual([1830, 1840]);
  });

  it("returns only the latest date's decade for an open start", () => {
    expect(decadesOverlapping(range(null, "1839-12-31"))).toEqual([1830]);
  });

  it("returns only the earliest date's decade for an open end", () => {
    expect(decadesOverlapping(range("1851-01-01", null))).toEqual([1850]);
  });

  it("returns no decades for an undated range", () => {
    expect(decadesOverlapping(range(null, null))).toEqual([]);
  });
});

describe("isCertainlyWithinDecade", () => {
  it("is true when both ends fall within the decade", () => {
    expect(isCertainlyWithinDecade(range("1832-01-01", "1835-12-31"), 1830)).toBe(true);
  });

  it("is false when the range extends beyond the decade", () => {
    expect(isCertainlyWithinDecade(range("1818-01-01", "1822-12-31"), 1820)).toBe(false);
  });

  it("is false when an end is open", () => {
    expect(isCertainlyWithinDecade(range(null, "1839-12-31"), 1830)).toBe(false);
  });
});

describe("decadeLabel", () => {
  it("names a decade by its first year", () => {
    expect(decadeLabel(1840)).toBe("1840s");
  });
});
