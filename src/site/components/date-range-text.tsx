import { describeRange, singlePeriod } from "../../dates/describe-range";
import type { DateRange } from "../../dates/edtf-to-range";

/** A date range in words, marked up as `<time>` when it is a single machine-readable period. */
export function DateRangeText({ range }: { range: DateRange }) {
  const datetime = singlePeriod(range);
  const description = describeRange(range);
  return datetime ? <time dateTime={datetime}>{description}</time> : <>{description}</>;
}
