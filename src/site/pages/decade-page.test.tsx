import { createLetter } from "../../../tests/fixtures/letters";
import { renderPage } from "../../../tests/support/render";
import { decadePath } from "../paths";
import { DecadePage } from "./decade-page";

const renderDecadePage = (possible = [createLetter({ id: "FER/002" })]) => {
  const summary = { decade: 1830, certain: [createLetter({ id: "PEN/002" })], possible };
  return renderPage(<DecadePage summary={summary} previous={1820} next={1840} />, decadePath(1830));
};

describe("DecadePage", () => {
  it("names the decade and summarises its letters", () => {
    const page = renderDecadePage();
    expect(page.getByRole("heading", { level: 1 })).toHaveTextContent("The 1830s");
    expect(page.getByText("1 letter, plus 1 that may be from this decade.")).toBeInTheDocument();
  });

  it("separates letters dated within the decade from those possibly within it", () => {
    const page = renderDecadePage();
    expect(page.getByRole("region", { name: "Dated within the 1830s" })).toHaveTextContent("PEN/002");
    expect(page.getByRole("region", { name: "Possibly from the 1830s" })).toHaveTextContent("FER/002");
  });

  it("leaves out the possible section when no letters only possibly belong", () => {
    const page = renderDecadePage([]);
    expect(page.queryByRole("region", { name: "Possibly from the 1830s" })).not.toBeInTheDocument();
  });

  it("links to the previous and next decades", () => {
    const page = renderDecadePage();
    expect(page.getByRole("link", { name: /Previous.*1820s/ })).toHaveAttribute("href", "../../decades/1820s/");
    expect(page.getByRole("link", { name: /Next.*1840s/ })).toHaveAttribute("href", "../../decades/1840s/");
  });
});
