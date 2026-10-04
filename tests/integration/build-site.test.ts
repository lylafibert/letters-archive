// Builds the real archive into a temporary directory and checks the result as a whole.
import { existsSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { HtmlValidate } from "html-validate";
import { JSDOM } from "jsdom";
import htmlValidateConfig from "../../.htmlvalidate.mjs";
import { migrate, openDatabase } from "../../src/db/migrate";
import { seedDatabase } from "../../src/db/seed";
import { LETTERS } from "../../src/db/seed-data";
import { buildSite } from "../../src/site/build-site";
import { parseJsonIndex } from "../support/json-index";

const outputDir = mkdtempSync(path.join(tmpdir(), "letters-site-"));
let htmlFiles: string[];

beforeAll(async () => {
  const databasePath = path.join(mkdtempSync(path.join(tmpdir(), "letters-db-")), "archive.sqlite");
  const database = openDatabase(databasePath);
  migrate(database);
  seedDatabase(database);
  database.close();

  await buildSite({ databasePath, outputDir });
  htmlFiles = readdirSync(outputDir, { recursive: true, encoding: "utf8" }).filter((file) => file.endsWith(".html"));
});

const read = (file: string): string => {
  return readFileSync(path.join(outputDir, file), "utf8");
};

const parse = (file: string): Document => {
  return new JSDOM(read(file)).window.document;
};

describe("buildSite", () => {
  it("writes a page for every letter", () => {
    const letterPages = htmlFiles.filter((file) => file.startsWith(`letters${path.sep}`));
    expect(letterPages).toHaveLength(LETTERS.length);
  });

  it("writes the stylesheet and a JSON index of every letter", () => {
    expect(existsSync(path.join(outputDir, "styles.css"))).toBe(true);
    expect(parseJsonIndex(read("letters.json")).letters).toHaveLength(LETTERS.length);
  });

  it("produces valid HTML that passes the accessibility rules on every page", async () => {
    const validator = new HtmlValidate(htmlValidateConfig);
    for (const file of htmlFiles) {
      const report = await validator.validateString(read(file), file);
      expect(report.results.flatMap((result) => result.messages.map((message) => message.message))).toEqual([]);
    }
  });

  it("gives every page one h1 and its own title", () => {
    const titles = new Set<string>();
    for (const file of htmlFiles) {
      const document = parse(file);
      expect(document.querySelectorAll("h1"), file).toHaveLength(1);
      titles.add(document.title);
    }
    expect(titles.size).toBe(htmlFiles.length);
  });

  it("links only to pages and files that exist", () => {
    for (const file of htmlFiles) {
      const hrefs = [...parse(file).querySelectorAll("a[href], link[href]")].map(
        (element) => element.getAttribute("href") ?? "",
      );
      for (const href of hrefs.filter((href) => !href.startsWith("http") && !href.startsWith("#"))) {
        const target = path.join(outputDir, path.dirname(file), href);
        expect(existsSync(href.endsWith("/") ? path.join(target, "index.html") : target), `${file} → ${href}`).toBe(
          true,
        );
      }
    }
  });

  it("points every in-page link at an element on that page", () => {
    for (const file of htmlFiles) {
      const document = parse(file);
      for (const link of document.querySelectorAll('a[href^="#"]')) {
        const id = link.getAttribute("href")?.slice(1) ?? "";
        expect(document.getElementById(id), `${file} → #${id}`).not.toBeNull();
      }
    }
  });
});
