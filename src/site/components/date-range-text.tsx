import { describeRange, singlePeriod } from "../../dates/describe-range";
import type { DateRange } from "../../dates/edtf-to-range";

/** Uses `<time>` only for a single period, the only kind of range a `datetime` value can express. */
export const DateRangeText = ({ range }: { range: DateRange }) => {
  const datetime = singlePeriod(range);
  const description = describeRange(range);
  return datetime ? <time dateTime={datetime}>{description}</time> : <>{description}</>;
};
