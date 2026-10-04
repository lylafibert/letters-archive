import { countLabel } from "./labels";

describe("countLabel", () => {
  it("uses the singular for one", () => {
    expect(countLabel(1, "letter")).toBe("1 letter");
  });

  it.each([0, 2])("uses the plural for %i", (count) => {
    expect(countLabel(count, "letter")).toBe(`${count} letters`);
  });

  it("accepts an irregular plural", () => {
    expect(countLabel(2, "correspondence", "correspondences")).toBe("2 correspondences");
  });
});
