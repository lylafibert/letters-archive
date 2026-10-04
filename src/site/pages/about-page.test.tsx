import { within } from "@testing-library/react";
import { renderPage } from "../../../tests/support/render";
import { ABOUT_PATH } from "../paths";
import { AboutPage } from "./about-page";

const renderAboutPage = () => renderPage(<AboutPage letterCount={15} />, ABOUT_PATH);

describe("AboutPage", () => {
  it("introduces the edition with the number of letters", () => {
    const page = renderAboutPage();
    expect(page.getByRole("heading", { level: 1 })).toHaveTextContent("About this edition");
    expect(page.getByText(/A small digital edition of 15 letters/)).toBeInTheDocument();
  });

  it("explains how uncertain dates become ranges, row by row", () => {
    const page = renderAboutPage();
    const table = page.getByRole("table", { name: "How uncertain dates become ranges" });
    const circaRow = within(table).getByRole("row", { name: /c\. 1820/ });
    expect(circaRow).toHaveTextContent("1820~");
    expect(circaRow).toHaveTextContent("1818–1822");
  });

  it("works out each example's range with the archive's own conventions", () => {
    const page = renderAboutPage();
    const rows = within(page.getByRole("table")).getAllByRole("row").slice(1);
    expect(rows.map((row) => row.querySelectorAll("td")[1]?.textContent)).toEqual([
      "1818–1822",
      "1846–1848",
      "March–May 1843",
      "1837–1839",
      "1839 or earlier",
      "29 September 1828",
    ]);
  });

  it("explains the editorial conventions used in transcriptions", () => {
    const page = renderAboutPage();
    expect(page.getByRole("region", { name: "Transcriptions" })).toHaveTextContent(
      "Square brackets mark editorial additions",
    );
  });

  it("links to the data and the source code", () => {
    const page = renderAboutPage();
    const data = page.getByRole("region", { name: "Data" });
    expect(within(data).getByRole("link", { name: "JSON" })).toHaveAttribute("href", "../letters.json");
    expect(within(data).getByRole("link", { name: "source code" })).toHaveAttribute(
      "href",
      expect.stringContaining("github.com"),
    );
  });
});
