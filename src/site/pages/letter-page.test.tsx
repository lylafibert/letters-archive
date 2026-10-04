import { createCorrespondent, createLetter } from "../../../tests/fixtures/letters";
import { descriptionFor, renderPage } from "../../../tests/support/render";
import { letterPath } from "../paths";
import { LetterPage } from "./letter-page";

const renderLetterPage = (
  letter = createLetter(),
  neighbours: { previous?: typeof letter; next?: typeof letter } = {},
) => {
  return renderPage(
    <LetterPage letter={letter} previous={neighbours.previous} next={neighbours.next} />,
    letterPath(letter.id),
  );
};

describe("LetterPage", () => {
  it("titles the page with the sender, recipient, date and reference", () => {
    const page = renderLetterPage();
    expect(page.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Eliza Marrable to Thomas Marrable, 14 March 1821",
    );
    expect(document.title).toBe("Eliza Marrable to Thomas Marrable, 14 March 1821 (MAR/001) · Letters Archive");
  });

  it("offers a citation with the letter's permanent URL", () => {
    const page = renderLetterPage();
    expect(page.getByRole("region", { name: "Cite this letter" })).toHaveTextContent(
      "Eliza Marrable to Thomas Marrable, 14 March 1821. Letters Archive, MAR/001. https://lylafibert.github.io/letters-archive/letters/mar-001/",
    );
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

  it("shows the date as a range, in the source's words, and where it was found", () => {
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
    expect(descriptionFor(document.body, "Date as found")).toHaveTextContent("c. 1820");
    expect(descriptionFor(document.body, "Found in")).toHaveTextContent("Archive catalogue");
  });

  it("says when a letter is undated", () => {
    const page = renderLetterPage(
      createLetter({ dateText: null, dateSource: null, dateEdtf: null, dateEarliest: null, dateLatest: null }),
    );
    expect(descriptionFor(document.body, "Date")).toHaveTextContent("Undated");
    expect(descriptionFor(document.body, "Date as found")).toHaveTextContent("None");
    expect([...document.querySelectorAll("dt")].map((term) => term.textContent)).not.toContain("Found in");
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
