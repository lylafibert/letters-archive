import { correspondentPath, decadePath, letterPath, outputFilePath, relativeHref, slugify } from "./paths";

describe("slugify", () => {
  it.each([
    ["MAR/001", "mar-001"],
    ["Eliza Marrable", "eliza-marrable"],
    ["The Overseers of the Poor, Wexcombe", "the-overseers-of-the-poor-wexcombe"],
    ["Zoë Brontë", "zoe-bronte"],
    ["  --Edge  case--  ", "edge-case"],
  ])("turns %j into %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("page paths", () => {
  it("places a letter under letters/ by its catalogue reference", () => {
    expect(letterPath("MAR/001")).toBe("letters/mar-001/");
  });

  it("places a correspondent under correspondents/ by name", () => {
    expect(correspondentPath("Eliza Marrable")).toBe("correspondents/eliza-marrable/");
  });

  it("places a decade under decades/ by its label", () => {
    expect(decadePath(1830)).toBe("decades/1830s/");
  });
});

describe("relativeHref", () => {
  it("links from the home page without a prefix", () => {
    expect(relativeHref("", "letters/mar-001/")).toBe("letters/mar-001/");
  });

  it("climbs one level per directory of the current page", () => {
    expect(relativeHref("letters/mar-001/", "correspondents/")).toBe("../../correspondents/");
  });

  it("links to the home page from a nested page", () => {
    expect(relativeHref("decades/", "")).toBe("../");
  });

  it("links to the home page from itself as ./", () => {
    expect(relativeHref("", "")).toBe("./");
  });
});

describe("outputFilePath", () => {
  it("writes the home page to index.html", () => {
    expect(outputFilePath("")).toBe("index.html");
  });

  it("writes a page to index.html in its directory", () => {
    expect(outputFilePath("letters/mar-001/")).toBe("letters/mar-001/index.html");
  });

  it("writes a file path as it is", () => {
    expect(outputFilePath("letters.json")).toBe("letters.json");
  });
});
