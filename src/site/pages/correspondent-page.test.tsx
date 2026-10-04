import { createCorrespondent, createLetter } from "../../../tests/fixtures/letters";
import { renderPage } from "../../../tests/support/render";
import { correspondentPath } from "../paths";
import { CorrespondentPage } from "./correspondent-page";

const eliza = createCorrespondent();

function renderCorrespondentPage(
  sent = [createLetter({ id: "MAR/001" })],
  received = [createLetter({ id: "MAR/003" })],
) {
  return renderPage(
    <CorrespondentPage summary={{ correspondent: eliza, sent, received }} />,
    correspondentPath(eliza.name),
  );
}

describe("CorrespondentPage", () => {
  it("names the correspondent and what kind of correspondent they are", () => {
    const page = renderCorrespondentPage();
    expect(page.getByRole("heading", { level: 1 })).toHaveTextContent("Eliza Marrable");
    expect(page.getByText("Person")).toBeInTheDocument();
  });

  it("lists letters sent and received in separate sections", () => {
    const page = renderCorrespondentPage();
    expect(page.getByRole("region", { name: "Letters sent" })).toHaveTextContent("MAR/001");
    expect(page.getByRole("region", { name: "Letters received" })).toHaveTextContent("MAR/003");
  });

  it("says when a section has no letters", () => {
    const page = renderCorrespondentPage([createLetter()], []);
    expect(page.getByRole("region", { name: "Letters received" })).toHaveTextContent("None in the archive.");
  });

  it("links back to all correspondents", () => {
    const page = renderCorrespondentPage();
    const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumbs.querySelector("a")).toHaveAttribute("href", "../../correspondents/");
  });
});
