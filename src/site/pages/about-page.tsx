import { describeRange } from "../../dates/describe-range";
import { edtfToRange } from "../../dates/edtf-to-range";
import { Layout } from "../components/layout";
import { SiteLink } from "../components/page-path";
import { countLabel } from "../labels";
import { JSON_INDEX_PATH } from "../paths";
import { REPOSITORY_URL } from "../site-config";

// Each range is worked out by the archive's own code, so the table can't drift from it.
const DATING_EXAMPLES = [
  { wording: "c. 1820", edtf: "1820~", convention: "Approximate dates are widened by two years either side." },
  { wording: "?1847", edtf: "1847?", convention: "Doubtful dates are widened by a year either side." },
  { wording: "spring 1843", edtf: "1843-21", convention: "Seasons are meteorological, in the northern hemisphere." },
  { wording: "late 1830s", edtf: "1837/1839", convention: "Parts of a decade become a span of years." },
  { wording: "before 1840", edtf: "../1839", convention: "The range has no earliest date." },
  { wording: "Michaelmas 1828", edtf: "1828-09-29", convention: "Feast days become their fixed date." },
] as const;

export const AboutPage = ({ letterCount }: { letterCount: number }) => {
  return (
    <Layout
      title="About this edition"
      description="How the letters in the archive are dated, transcribed and published."
      section="about"
    >
      <header className="page-header">
        <h1>About this edition</h1>
        <p className="lede">
          A small digital edition of {countLabel(letterCount, "letter")} between two families and their circle, from
          about 1820 to the early 1850s. The people, places and letters are all invented.
        </p>
      </header>
      <div className="prose">
        <section aria-labelledby="dating" className="section">
          <h2 id="dating">How letters are dated</h2>
          <p>
            Historical letters are often vaguely dated, or not dated at all. Each date is recorded in three ways: in the
            words of its source, as an{" "}
            <a href="https://www.loc.gov/standards/datetime/">Extended Date/Time Format (EDTF)</a> value, and as a range
            of the earliest and latest possible days. The range is what puts the letters in order.
          </p>
          <p>
            The source is the letter&rsquo;s own dateline where it has one. Otherwise it is the postmark, the
            recipient&rsquo;s note of when it arrived, a later annotation, or the archive catalogue.
          </p>
          <div className="table-scroll">
            <table>
              <caption>How uncertain dates become ranges</caption>
              <thead>
                <tr>
                  <th scope="col">In the source</th>
                  <th scope="col">EDTF</th>
                  <th scope="col">Range</th>
                  <th scope="col">Convention</th>
                </tr>
              </thead>
              <tbody>
                {DATING_EXAMPLES.map(({ wording, edtf, convention }) => (
                  <tr key={edtf}>
                    <th scope="row">{wording}</th>
                    <td>
                      <code>{edtf}</code>
                    </td>
                    <td>{describeRange(edtfToRange(edtf))}</td>
                    <td>{convention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            A letter whose range spans more than one decade is listed under each of them, marked as possibly from that
            decade.
          </p>
        </section>
        <section aria-labelledby="transcription" className="section">
          <h2 id="transcription">Transcriptions</h2>
          <p>
            Spelling and punctuation follow the original, with each line of the letter on its own line. Square brackets
            mark editorial additions, and <code>[?]</code> marks an uncertain reading.
          </p>
        </section>
        <section aria-labelledby="data" className="section">
          <h2 id="data">Data</h2>
          <p>
            The whole archive is available as <SiteLink to={JSON_INDEX_PATH}>JSON</SiteLink>, and the{" "}
            <a href={REPOSITORY_URL}>source code</a> is on GitHub.
          </p>
        </section>
      </div>
    </Layout>
  );
};
