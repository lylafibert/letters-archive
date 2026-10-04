import type { CorrespondentKind, DateSource } from "../model/types";

export const DATE_SOURCE_LABELS: Record<DateSource, string> = {
  dateline: "the dateline",
  postmark: "the postmark",
  endorsement: "the recipient’s endorsement",
  annotation: "a later annotation",
  catalogue: "the archive catalogue",
};

export const CORRESPONDENT_KIND_LABELS: Record<CorrespondentKind, string> = {
  person: "Person",
  organisation: "Organisation",
};

/** "1 letter", "2 letters". */
export const countLabel = (count: number, singular: string): string => {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
};
