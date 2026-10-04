import { screen, within } from "@testing-library/react";
import { createLetter } from "../../../tests/fixtures/letters";
import { renderAtPath } from "../../../tests/support/render";
import { LetterList } from "./letter-list";

describe("LetterList", () => {
  it("lists the letters in the given order", () => {
    renderAtPath(<LetterList letters={[createLetter({ id: "MAR/003" }), createLetter({ id: "MAR/001" })]} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => within(item).getByText(/^MAR\//).textContent)).toEqual(["MAR/003", "MAR/001"]);
  });

  it("titles each letter with its sender and recipient, linked to its page", () => {
    renderAtPath(<LetterList letters={[createLetter()]} />, "correspondents/eliza-marrable/");
    const link = screen.getByRole("link", { name: "Eliza Marrable to Thomas Marrable" });
    expect(link).toHaveAttribute("href", "../../letters/mar-001/");
    expect(screen.getByRole("heading", { level: 3, name: "Eliza Marrable to Thomas Marrable" })).toContainElement(link);
  });

  it("shows the date, reference, place written and opening of each letter", () => {
    renderAtPath(<LetterList letters={[createLetter()]} />);
    for (const text of ["14 March 1821", "MAR/001", "Hollinsford", "The thaw has come at last."]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("labels each detail for screen readers", () => {
    renderAtPath(<LetterList letters={[createLetter()]} />);
    expect(screen.getByText("Date")).toHaveClass("visually-hidden");
    expect(screen.getByText("Reference")).toHaveClass("visually-hidden");
  });

  it("shows the source's wording of an uncertain date next to its range", () => {
    renderAtPath(
      <LetterList
        letters={[createLetter({ dateText: "c. 1820", dateEarliest: "1818-01-01", dateLatest: "1822-12-31" })]}
      />,
    );
    expect(screen.getByText("1818–1822")).toBeInTheDocument();
    expect(screen.getByText("c. 1820")).toBeInTheDocument();
  });

  it("leaves out the source's wording when it says the same as the range", () => {
    renderAtPath(<LetterList letters={[createLetter({ dateText: "14th March 1821" })]} />);
    expect(screen.queryByText("Date as found")).not.toBeInTheDocument();
  });

  it("leaves out the place when it is not recorded", () => {
    renderAtPath(<LetterList letters={[createLetter({ origin: null })]} />);
    expect(screen.queryByText("Written at")).not.toBeInTheDocument();
  });
});
