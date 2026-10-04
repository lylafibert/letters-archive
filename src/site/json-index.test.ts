import { createLetter } from "../../tests/fixtures/letters";
import { renderJsonIndex } from "./json-index";

describe("renderJsonIndex", () => {
  it("describes each letter with its people, places, date and transcription", () => {
    const [letter] = JSON.parse(renderJsonIndex([createLetter()])).letters;
    expect(letter).toEqual({
      id: "MAR/001",
      path: "letters/mar-001/",
      sender: { name: "Eliza Marrable", kind: "person" },
      recipient: { name: "Thomas Marrable", kind: "person" },
      origin: "Hollinsford",
      destination: "Port Aldwick",
      date: {
        text: "14th March 1821",
        source: "dateline",
        edtf: "1821-03-14",
        earliest: "1821-03-14",
        latest: "1821-03-14",
      },
      transcription: ["My dear Brother,", "The thaw has come at last.", "Eliza Marrable"],
    });
  });

  it("uses null for unknown recipients and places", () => {
    const [letter] = JSON.parse(
      renderJsonIndex([createLetter({ recipient: null, origin: null, destination: null })]),
    ).letters;
    expect(letter).toMatchObject({ recipient: null, origin: null, destination: null });
  });

  it("keeps the letters in the given order", () => {
    const ids = JSON.parse(renderJsonIndex([createLetter({ id: "B/1" }), createLetter({ id: "A/1" })])).letters.map(
      (letter: { id: string }) => letter.id,
    );
    expect(ids).toEqual(["B/1", "A/1"]);
  });
});
