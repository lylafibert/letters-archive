import { renderIndexPage } from "./build";

describe("renderIndexPage", () => {
  it("renders a valid HTML document with a language and a heading", () => {
    const html = renderIndexPage();
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<html lang="en">');
    expect(html).toMatch(/<h1>.+<\/h1>/);
  });
});
