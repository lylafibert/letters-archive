import { createLetter } from "../../../tests/fixtures/letters";
import { renderPage } from "../../../tests/support/render";
import { DECADES_PATH } from "../paths";
import { DecadesPage } from "./decades-page";

describe("DecadesPage", () => {
  const summaries = [
    {
      decade: 1820,
      certain: [createLetter({ id: "A/1" }), createLetter({ id: "A/2" })],
      possible: [createLetter({ id: "A/3" })],
    },
    { decade: 1830, certain: [createLetter({ id: "B/1" })], possible: [] },
  ];

  it("links to each decade with its letter counts", () => {
    const page = renderPage(<DecadesPage summaries={summaries} />, DECADES_PATH);
    expect(page.getByRole("link", { name: "1820s" })).toHaveAttribute("href", "../decades/1820s/");
    expect(page.getByText("2 letters, 1 possible")).toBeInTheDocument();
    expect(page.getByText("1 letter")).toBeInTheDocument();
  });

  it("hides the bar chart from assistive technology, since the counts are given as text", () => {
    renderPage(<DecadesPage summaries={summaries} />, DECADES_PATH);
    const bars = document.querySelectorAll("svg");
    expect(bars).toHaveLength(2);
    for (const bar of bars) expect(bar).toHaveAttribute("aria-hidden", "true");
  });

  it("scales each bar to the busiest decade", () => {
    renderPage(<DecadesPage summaries={summaries} />, DECADES_PATH);
    for (const bar of document.querySelectorAll("svg")) expect(bar).toHaveAttribute("viewBox", "0 0 3 1");
  });
});
