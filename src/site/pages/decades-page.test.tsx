import { createLetter } from "../../../tests/fixtures/letters";
import { renderPage } from "../../../tests/support/render";
import { DECADES_PATH } from "../paths";
import type { DecadeSummary } from "../site-data";
import { DecadesPage } from "./decades-page";

const letters = (count: number) => Array.from({ length: count }, (_, index) => createLetter({ id: `A/${index}` }));

const renderDecadesPage = (summaries: DecadeSummary[]) =>
  renderPage(<DecadesPage summaries={summaries} />, DECADES_PATH);

describe("DecadesPage", () => {
  it("links to each decade's page", () => {
    const page = renderDecadesPage([{ decade: 1820, certain: letters(1), possible: [] }]);
    expect(page.getByRole("link", { name: "1820s" })).toHaveAttribute("href", "../decades/1820s/");
  });

  it("describes each decade's letters", () => {
    const page = renderDecadesPage([{ decade: 1820, certain: letters(3), possible: letters(1) }]);
    expect(page.getByText("3 letters, plus 1 that may be from this decade")).toBeInTheDocument();
  });
});
