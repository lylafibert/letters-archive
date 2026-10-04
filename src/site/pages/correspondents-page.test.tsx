import { createCorrespondent, createLetter } from "../../../tests/fixtures/letters";
import { renderPage } from "../../../tests/support/render";
import { CORRESPONDENTS_PATH } from "../paths";
import { CorrespondentsPage } from "./correspondents-page";

describe("CorrespondentsPage", () => {
  it("lists each correspondent with their kind and letter counts, linked to their page", () => {
    const overseers = createCorrespondent({ id: 9, name: "The Overseers of the Poor", kind: "organisation" });
    const page = renderPage(
      <CorrespondentsPage summaries={[{ correspondent: overseers, sent: [], received: [createLetter()] }]} />,
      CORRESPONDENTS_PATH,
    );
    expect(page.getByRole("link", { name: "The Overseers of the Poor" })).toHaveAttribute(
      "href",
      "../correspondents/the-overseers-of-the-poor/",
    );
    expect(page.getByText("Organisation")).toBeInTheDocument();
    expect(page.getByText("0 letters sent, 1 received")).toBeInTheDocument();
  });
});
