import { createCorrespondent, createLetter } from "../../../tests/fixtures/letters";
import { descriptionFor, renderPage } from "../../../tests/support/render";
import { letterPath } from "../paths";
import { LetterPage } from "./letter-page";

function renderLetterPage(
  letter = createLetter(),
  neighbours: { previous?: typeof letter; next?: typeof letter } = {},
) {
  return renderPage(
    <LetterPage letter={letter} previous={neighbours.previous} next={neighbours.next} />,
    letterPath(letter.id),
  );
}

describe("LetterPage", () => {
  it("titles the page with the reference, sender and recipient", () => {
    const page = renderLetterPage();
    expect(page.getByRole("heading", { level: 1 })).toHaveTextContent("Eliza Marrable to Thomas Marrable");
    expect(document.title).toBe("MAR/001: Eliza Marrable to Thomas Marrable · Letters Archive");
  });

  it("links the sender and recipient to their pages", () => {
    const page = renderLetterPage();
    expect(page.getByRole("link", { name: "Eliza Marrable" })).toHaveAttribute(
      "href",
      "../../correspondents/eliza-marrable/",
    );
    expect(page.getByRole("link", { name: "Thomas Marrable" })).toHaveAttribute(
      "href",
      "../../correspondents/thomas-marrable/",
    );
  });

  it("names the places it was written at and sent to", () => {
    renderLetterPage();
    expect(descriptionFor(document.body, "Written at")).toHaveTextContent("Hollinsford");
    expect(descriptionFor(document.body, "Sent to")).toHaveTextContent("Port Aldwick");
  });

  it("says when the recipient and places are unknown", () => {
    renderLetterPage(createLetter({ recipient: null, origin: null, destination: null }));
    expect(descriptionFor(document.body, "To")).toHaveTextContent("Unknown");
    expect(descriptionFor(document.body, "Written at")).toHaveTextContent("Unknown");
    expect(descriptionFor(document.body, "Sent to")).toHaveTextContent("Unknown");
  });

  it("shows the date as a range, as found in the source, and as EDTF", () => {
    renderLetterPage(
      createLetter({
        dateText: "c. 1820",
        dateSource: "catalogue",
        dateEdtf: "1820~",
        dateEarliest: "1818-01-01",
        dateLatest: "1822-12-31",
      }),
    );
    expect(descriptionFor(document.body, "Date")).toHaveTextContent("1818–1822");
    expect(descriptionFor(document.body, "Date as found")).toHaveTextContent("“c. 1820”, from the archive catalogue");
    expect(descriptionFor(document.body, "Machine-readable date (EDTF)")).toHaveTextContent("1820~");
  });

  it("says when a letter is undated", () => {
    const page = renderLetterPage(
      createLetter({ dateText: null, dateSource: null, dateEdtf: null, dateEarliest: null, dateLatest: null }),
    );
    expect(descriptionFor(document.body, "Date")).toHaveTextContent("Undated");
    expect(descriptionFor(document.body, "Date as found")).toHaveTextContent("None");
    expect(page.queryByText(/^Decades?$/, { selector: "dt" })).not.toBeInTheDocument();
  });

  it("links to every decade the letter may belong to", () => {
    const page = renderLetterPage(createLetter({ dateEarliest: "1818-01-01", dateLatest: "1822-12-31" }));
    expect(page.getByRole("link", { name: "1810s" })).toHaveAttribute("href", "../../decades/1810s/");
    expect(page.getByRole("link", { name: "1820s" })).toHaveAttribute("href", "../../decades/1820s/");
  });

  it("shows each line of the transcription as a paragraph", () => {
    const page = renderLetterPage();
    const transcription = page.getByRole("region", { name: "Transcription" });
    expect([...transcription.querySelectorAll("p")].map((paragraph) => paragraph.textContent)).toEqual([
      "My dear Brother,",
      "The thaw has come at last.",
      "Eliza Marrable",
    ]);
  });

  it("shows markup in a transcription as text rather than HTML", () => {
    const page = renderLetterPage(createLetter({ transcription: "Sir,\n<script>alert(1)</script>" }));
    expect(page.getByText("<script>alert(1)</script>")).toBeInTheDocument();
    expect(document.querySelector("main script")).toBeNull();
  });

  it("links to the previous and next letters", () => {
    const previous = createLetter({ id: "MAR/000", sender: createCorrespondent({ name: "Clara Ashdown" }) });
    const next = createLetter({ id: "MAR/002" });
    const page = renderLetterPage(createLetter(), { previous, next });
    expect(page.getByRole("link", { name: /Previous/ })).toHaveAttribute("href", "../../letters/mar-000/");
    expect(page.getByRole("link", { name: /Next/ })).toHaveAttribute("href", "../../letters/mar-002/");
  });
});
