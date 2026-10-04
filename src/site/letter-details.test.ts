import { createLetter } from "../../tests/fixtures/letters";
import { letterDateRange, letterExcerpt, letterTitle, transcriptionLines } from "./letter-details";

describe("letterTitle", () => {
  it("names the sender and recipient", () => {
    expect(letterTitle(createLetter())).toBe("Eliza Marrable to Thomas Marrable");
  });

  it("describes a missing recipient as unknown", () => {
    expect(letterTitle(createLetter({ recipient: null }))).toBe("Eliza Marrable to an unknown recipient");
  });
});

describe("letterDateRange", () => {
  it("returns the letter's earliest and latest dates", () => {
    const letter = createLetter({ dateEarliest: null, dateLatest: "1839-12-31" });
    expect(letterDateRange(letter)).toEqual({ earliest: null, latest: "1839-12-31" });
  });
});

describe("transcriptionLines", () => {
  it("splits the transcription into its lines", () => {
    expect(transcriptionLines(createLetter())).toEqual([
      "My dear Brother,",
      "The thaw has come at last.",
      "Eliza Marrable",
    ]);
  });
});

describe("letterExcerpt", () => {
  it("returns the line after the salutation", () => {
    expect(letterExcerpt(createLetter())).toBe("The thaw has come at last.");
  });

  it("falls back to the only line of a one-line transcription", () => {
    expect(letterExcerpt(createLetter({ transcription: "A single line." }))).toBe("A single line.");
  });

  it("cuts a long line at a word boundary and adds an ellipsis", () => {
    const longLine = `${"word ".repeat(40)}end`;
    const excerpt = letterExcerpt(createLetter({ transcription: `Sir,\n${longLine}` }));
    expect(excerpt.length).toBeLessThanOrEqual(141);
    expect(excerpt).toMatch(/word…$/);
  });

  it("drops trailing punctuation before the ellipsis", () => {
    const longLine = `${"a".repeat(130)} cut, here and then some more words`;
    expect(letterExcerpt(createLetter({ transcription: `Sir,\n${longLine}` }))).toMatch(/ cut…$/);
  });
});
