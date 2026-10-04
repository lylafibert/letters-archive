import { within } from "@testing-library/react";
import { createLetter } from "../../../tests/fixtures/letters";
import { descriptionFor, renderPage } from "../../../tests/support/render";
import { HomePage } from "./home-page";

describe("HomePage", () => {
  const letters = [createLetter({ id: "MAR/001" }), createLetter({ id: "MAR/002" })];

  it("summarises the number of letters and correspondents and the period covered", () => {
    renderPage(<HomePage letters={letters} correspondentCount={8} decades={[1810, 1830, 1850]} />);
    expect(descriptionFor(document.body, "Letters")).toHaveTextContent("2");
    expect(descriptionFor(document.body, "Correspondents")).toHaveTextContent("8");
    expect(descriptionFor(document.body, "Period")).toHaveTextContent("1810s–1850s");
  });

  it("leaves out the period when no letter is dated", () => {
    const page = renderPage(<HomePage letters={letters} correspondentCount={2} decades={[]} />);
    expect(page.queryByText("Period", { selector: "dt" })).not.toBeInTheDocument();
  });

  it("introduces the archive under the site name", () => {
    const page = renderPage(<HomePage letters={letters} correspondentCount={2} decades={[1820]} />);
    expect(page.getByRole("heading", { level: 1 })).toHaveTextContent("Letters Archive");
  });

  it("lists every letter under a heading", () => {
    const page = renderPage(<HomePage letters={letters} correspondentCount={2} decades={[1820]} />);
    const section = page.getByRole("region", { name: "All letters" });
    expect(within(section).getAllByRole("listitem")).toHaveLength(2);
  });
});
