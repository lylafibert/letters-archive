import type { CorrespondentKind, DateSource } from "../model/types";
import type { DecadeSummary } from "./site-data";

export const DATE_SOURCE_LABELS: Record<DateSource, string> = {
  dateline: "Dateline",
  postmark: "Postmark",
  endorsement: "Recipient’s endorsement",
  annotation: "Later annotation",
  catalogue: "Archive catalogue",
};

export const CORRESPONDENT_KIND_LABELS: Record<CorrespondentKind, string> = {
  person: "Person",
  organisation: "Organisation",
};

export const countLabel = (count: number, singular: string): string => {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
};

/** "3 letters", "3 letters, plus 1 that may be from this decade" or "1 letter that may be from this decade". */
export const decadeCountLabel = ({ certain, possible }: DecadeSummary): string => {
  if (possible.length === 0) return countLabel(certain.length, "letter");
  if (certain.length === 0) return `${countLabel(possible.length, "letter")} that may be from this decade`;
  return `${countLabel(certain.length, "letter")}, plus ${possible.length} that may be from this decade`;
};
