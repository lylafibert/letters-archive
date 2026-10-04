import { InvalidEdtfError, edtfToRange } from "./edtf-to-range";

function range(earliest: string | null, latest: string | null) {
  return { earliest, latest };
}

const VALID_EDTF_INPUTS = [
  "1821-03-14",
  "1843",
  "1844-02",
  "184X",
  "1832/1835",
  "[1826,1827]",
  "{1826,1827}",
  "../1839",
  "/1839",
  "1839/..",
  "1820~",
  "1847?",
  "1820%",
  "1844-02~",
  "1821-03-14~",
  "1843-21",
  "1843-24",
];

describe("edtfToRange", () => {
  describe("dates at day, month and year precision", () => {
    it("returns the same day as earliest and latest for a full date", () => {
      expect(edtfToRange("1821-03-14")).toEqual(range("1821-03-14", "1821-03-14"));
    });

    it("returns 1 January to 31 December for a year", () => {
      expect(edtfToRange("1843")).toEqual(range("1843-01-01", "1843-12-31"));
    });

    it("ends February on the 29th in a leap year", () => {
      expect(edtfToRange("1844-02")).toEqual(range("1844-02-01", "1844-02-29"));
    });

    it("ends February on the 28th in a common year", () => {
      expect(edtfToRange("1843-02")).toEqual(range("1843-02-01", "1843-02-28"));
    });

    it("returns the whole decade for a decade with an unspecified digit", () => {
      expect(edtfToRange("184X")).toEqual(range("1840-01-01", "1849-12-31"));
    });
  });

  describe("intervals and sets", () => {
    it("spans both endpoints inclusively for a closed interval", () => {
      expect(edtfToRange("1832/1835")).toEqual(range("1832-01-01", "1835-12-31"));
    });

    it("spans from the first to the last member for a one-of set", () => {
      expect(edtfToRange("[1826,1827]")).toEqual(range("1826-01-01", "1827-12-31"));
    });

    it("spans from the first to the last member for an all-of list", () => {
      expect(edtfToRange("{1826,1827}")).toEqual(range("1826-01-01", "1827-12-31"));
    });

    it("leaves earliest null for an interval with an open start", () => {
      expect(edtfToRange("../1839")).toEqual(range(null, "1839-12-31"));
    });

    it("leaves latest null for an interval with an open end", () => {
      expect(edtfToRange("1839/..")).toEqual(range("1839-01-01", null));
    });

    it("treats an unknown start the same as an open start", () => {
      expect(edtfToRange("/1839")).toEqual(range(null, "1839-12-31"));
    });
  });

  describe("qualifiers widen by whole units of the date's precision", () => {
    it("widens an uncertain year (?) by one year either side", () => {
      expect(edtfToRange("1847?")).toEqual(range("1846-01-01", "1848-12-31"));
    });

    it("widens an approximate year (~) by two years either side", () => {
      expect(edtfToRange("1820~")).toEqual(range("1818-01-01", "1822-12-31"));
    });

    it("widens an uncertain and approximate year (%) by three years either side", () => {
      expect(edtfToRange("1820%")).toEqual(range("1817-01-01", "1823-12-31"));
    });

    it("widens an approximate month by two months, across year boundaries", () => {
      expect(edtfToRange("1844-02~")).toEqual(range("1843-12-01", "1844-04-30"));
    });

    it("widens an approximate day by two days, across month boundaries", () => {
      expect(edtfToRange("1821-03-01~")).toEqual(range("1821-02-27", "1821-03-03"));
    });

    it("widens an approximate decade by two years either side", () => {
      expect(edtfToRange("184X~")).toEqual(range("1838-01-01", "1851-12-31"));
    });

    it("does not widen qualified interval endpoints", () => {
      expect(edtfToRange("1820~/1825")).toEqual(range("1820-01-01", "1825-12-31"));
    });
  });

  describe("seasons (northern hemisphere, meteorological)", () => {
    it("returns March to May for spring", () => {
      expect(edtfToRange("1843-21")).toEqual(range("1843-03-01", "1843-05-31"));
    });

    it("returns June to August for summer", () => {
      expect(edtfToRange("1843-22")).toEqual(range("1843-06-01", "1843-08-31"));
    });

    it("returns September to November for autumn", () => {
      expect(edtfToRange("1843-23")).toEqual(range("1843-09-01", "1843-11-30"));
    });

    it("spans the New Year for winter, from December of the stated year", () => {
      expect(edtfToRange("1842-24")).toEqual(range("1842-12-01", "1843-02-28"));
    });

    it("ends winter on 29 February when the following year is a leap year", () => {
      expect(edtfToRange("1843-24")).toEqual(range("1843-12-01", "1844-02-29"));
    });

    it("treats northern-hemisphere codes (25–28) like the generic ones (21–24)", () => {
      expect(edtfToRange("1843-25")).toEqual(edtfToRange("1843-21"));
    });
  });

  describe("invalid input", () => {
    it.each([
      ["a string that is not EDTF", "spring 1843"],
      ["an impossible date", "1843-02-30"],
      ["an empty string", ""],
    ])("rejects %s", (_description, input) => {
      expect(() => edtfToRange(input)).toThrow(InvalidEdtfError);
    });

    it("includes the original input in the error message", () => {
      expect(() => edtfToRange("spring 1843")).toThrow('"spring 1843"');
    });
  });

  describe("for every supported input", () => {
    function isValidIsoDate(value: string) {
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);
    }

    it.each(VALID_EDTF_INPUTS)("returns bounds that are null or valid YYYY-MM-DD dates for '%s'", (input) => {
      const { earliest, latest } = edtfToRange(input);
      for (const bound of [earliest, latest]) {
        if (bound !== null) expect(isValidIsoDate(bound)).toBe(true);
        else expect(bound).toBeNull();
      }
    });

    it.each(VALID_EDTF_INPUTS)("returns an earliest date no later than the latest date for '%s'", (input) => {
      const { earliest, latest } = edtfToRange(input);
      if (earliest !== null && latest !== null) expect(earliest <= latest).toBe(true);
      else expect([earliest, latest]).toContain(null);
    });
  });
});
