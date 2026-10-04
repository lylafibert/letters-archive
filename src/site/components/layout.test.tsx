import { Layout } from "./layout";
import { renderPage } from "../../../tests/support/render";
import { CORRESPONDENTS_PATH, correspondentPath } from "../paths";

function renderLayout(path: string, props: Partial<Parameters<typeof Layout>[0]> = {}) {
  return renderPage(
    <Layout title="Correspondents" description="People in the archive." section="correspondents" {...props}>
      <h1>Correspondents</h1>
    </Layout>,
    path,
  );
}

describe("Layout", () => {
  it("sets the document language, title and description", () => {
    renderLayout(CORRESPONDENTS_PATH);
    expect(document.documentElement).toHaveAttribute("lang", "en-GB");
    expect(document.title).toBe("Correspondents · Letters Archive");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute("content", "People in the archive.");
  });

  it("uses the site name alone as the title of the home page", () => {
    renderLayout("", { title: "Letters Archive", section: "letters" });
    expect(document.title).toBe("Letters Archive");
  });

  it("links the stylesheet relative to the page", () => {
    renderLayout("correspondents/eliza-marrable/");
    expect(document.querySelector('link[rel="stylesheet"]')).toHaveAttribute("href", "../../styles.css");
  });

  it("offers a skip link to the main content", () => {
    const page = renderLayout(CORRESPONDENTS_PATH);
    expect(page.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main");
    expect(page.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("marks the current page in the main navigation", () => {
    const page = renderLayout(CORRESPONDENTS_PATH);
    const navigation = page.getByRole("navigation", { name: "Main" });
    expect(navigation.querySelector('[aria-current="page"]')).toHaveTextContent("Correspondents");
  });

  it("marks the current section on pages within it", () => {
    const page = renderLayout(correspondentPath("Eliza Marrable"));
    expect(page.getByRole("link", { name: "Correspondents" })).toHaveAttribute("aria-current", "true");
    expect(page.getByRole("link", { name: "Decades" })).not.toHaveAttribute("aria-current");
  });

  it("shows breadcrumbs with the current page marked", () => {
    const page = renderLayout(correspondentPath("Eliza Marrable"), {
      breadcrumbs: [{ label: "Correspondents", path: CORRESPONDENTS_PATH }, { label: "Eliza Marrable" }],
    });
    const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumbs.querySelector('[aria-current="page"]')).toHaveTextContent("Eliza Marrable");
  });

  it("links to the data and source code from the footer", () => {
    const page = renderLayout(CORRESPONDENTS_PATH);
    const footer = page.getByRole("contentinfo");
    expect(footer).toContainElement(page.getByRole("link", { name: "Data (JSON)" }));
    expect(page.getByRole("link", { name: "Source code" })).toHaveAttribute(
      "href",
      expect.stringContaining("github.com"),
    );
  });
});
