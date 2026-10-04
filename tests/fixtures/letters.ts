import type { Correspondent, Letter, Place } from "../../src/model/types";

export const createCorrespondent = (overrides: Partial<Correspondent> = {}): Correspondent => {
  return { id: 1, name: "Eliza Marrable", kind: "person", ...overrides };
};

export const createPlace = (overrides: Partial<Place> = {}): Place => {
  return { id: 1, name: "Hollinsford", ...overrides };
};

/** MAR/001 with every field filled in. Override what a test is about. */
export const createLetter = (overrides: Partial<Letter> = {}): Letter => {
  return {
    id: "MAR/001",
    sender: createCorrespondent(),
    recipient: createCorrespondent({ id: 2, name: "Thomas Marrable" }),
    origin: createPlace(),
    destination: createPlace({ id: 2, name: "Port Aldwick" }),
    dateText: "14th March 1821",
    dateSource: "dateline",
    dateEdtf: "1821-03-14",
    dateEarliest: "1821-03-14",
    dateLatest: "1821-03-14",
    transcription: ["My dear Brother,", "The thaw has come at last.", "Eliza Marrable"].join("\n"),
    ...overrides,
  };
};
