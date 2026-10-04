import { createLetter } from "../../tests/fixtures/letters";
import { countLabel, decadeCountLabel } from "./labels";

describe("countLabel", () => {
  it("uses the singular for one", () => {
    expect(countLabel(1, "letter")).toBe("1 letter");
  });

  it.each([0, 2])("uses the plural for %i", (count) => {
    expect(countLabel(count, "letter")).toBe(`${count} letters`);
  });
});

describe("decadeCountLabel", () => {
  const letters = (count: number) => Array.from({ length: count }, () => createLetter());

  it("counts letters dated within the decade", () => {
    expect(decadeCountLabel({ decade: 1840, certain: letters(4), possible: [] })).toBe("4 letters");
  });

  it("adds letters that may be from the decade", () => {
    expect(decadeCountLabel({ decade: 1820, certain: letters(3), possible: letters(1) })).toBe(
      "3 letters, plus 1 that may be from this decade",
    );
  });

  it("describes a decade with only letters that may be from it", () => {
    expect(decadeCountLabel({ decade: 1810, certain: [], possible: letters(1) })).toBe(
      "1 letter that may be from this decade",
    );
  });
});
