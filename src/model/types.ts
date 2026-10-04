// Domain model for the letters archive, written as TypeScript types.

export type Place = {
  id: number;
  name: string;
};

export type Correspondent = {
  id: number;
  name: string;
  kind: "person" | "organisation";
};

export type DateSource =
  | "dateline"
  | "postmark"
  | "endorsement"
  | "annotation"
  | "catalogue";

export type Letter = {
  id: string; // catalogue reference, e.g. "MAR/001"
  sender: Correspondent;
  recipient: Correspondent | null;
  origin: Place | null;
  destination: Place | null;
  dateText: string | null; // as written in dateSource
  dateSource: DateSource | null; // null exactly when dateText is null
  dateEdtf: string | null; // EDTF (ISO 8601-2), e.g. "[1826,1827]"; dateEarliest/dateLatest derive from it
  dateEarliest: string | null; // "YYYY-MM-DD", inclusive; null = open-ended
  dateLatest: string | null; // "YYYY-MM-DD", inclusive; null = open-ended
  transcription: string;
};
