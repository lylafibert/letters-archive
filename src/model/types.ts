// Domain model for the letters archive, written as TypeScript types.

export type Place = {
  id: string;
  name: string;
};

export type Correspondent = {
  id: string;
  name: string;
  kind: "person" | "organisation";
};

export type Letter = {
  id: string;
  sender: Correspondent;
  recipient: Correspondent | null;
  origin: Place | null;
  destination: Place | null;
  date: string;
  content: string;
};
