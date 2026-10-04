import { createCorrespondent, createLetter } from "../../tests/fixtures/letters";
import { parseJsonIndex } from "../../tests/support/json-index";
import { renderSite } from "./render-site";

describe("renderSite", () => {
  const letters = [
    createLetter({ id: "MAR/001", dateEarliest: "1821-03-14", dateLatest: "1821-03-14" }),
    createLetter({ id: "MAR/002", dateEarliest: "1818-01-01", dateLatest: "1822-12-31" }),
  ];

  it("writes the indexes, the about page and a page for every letter, correspondent and decade", () => {
    expect(renderSite(letters).map((file) => file.path)).toEqual([
      "index.html",
      "letters/mar-001/index.html",
      "letters/mar-002/index.html",
      "correspondents/index.html",
      "correspondents/eliza-marrable/index.html",
      "correspondents/thomas-marrable/index.html",
      "decades/index.html",
      "decades/1810s/index.html",
      "decades/1820s/index.html",
      "about/index.html",
      "letters.json",
    ]);
  });

  it("starts every page with a doctype", () => {
    const pages = renderSite(letters).filter((file) => file.path.endsWith(".html"));
    for (const page of pages) expect(page.contents.startsWith("<!DOCTYPE html>\n<html")).toBe(true);
  });

  it("includes every letter in the JSON index", () => {
    const jsonIndex = renderSite(letters).find((file) => file.path === "letters.json");
    expect(jsonIndex).toBeDefined();
    expect(parseJsonIndex(jsonIndex!.contents).letters).toHaveLength(2);
  });

  it("refuses to write two pages to the same path", () => {
    const namesake = createCorrespondent({ id: 99, name: "Eliza Marrable" });
    const clash = [...letters, createLetter({ id: "MAR/003", sender: namesake })];
    expect(() => renderSite(clash)).toThrow("correspondents/eliza-marrable/index.html");
  });
});
