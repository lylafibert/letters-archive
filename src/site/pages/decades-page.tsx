import { decadeLabel } from "../../dates/decades";
import { Layout } from "../components/layout";
import { SiteLink } from "../components/page-path";
import { countLabel } from "../labels";
import { decadePath } from "../paths";
import type { DecadeSummary } from "../site-data";

export function DecadesPage({ summaries }: { summaries: readonly DecadeSummary[] }) {
  const largestTotal = Math.max(1, ...summaries.map(({ certain, possible }) => certain.length + possible.length));
  return (
    <Layout
      title="Decades"
      description="Letters in the archive by decade, including those whose uncertain dates may fall within it."
      section="decades"
    >
      <header className="page-header">
        <h1>Decades</h1>
        <p className="lede">
          A letter whose date is uncertain appears in every decade it may belong to, marked as possible.
        </p>
      </header>
      <p className="legend">
        <span className="legend__item">
          <span className="legend__swatch legend__swatch--certain" aria-hidden="true" />
          Dated within the decade
        </span>
        <span className="legend__item">
          <span className="legend__swatch legend__swatch--possible" aria-hidden="true" />
          Possibly within the decade
        </span>
      </p>
      <ol className="decade-list">
        {summaries.map(({ decade, certain, possible }) => (
          <li key={decade} className="decade-row">
            <SiteLink to={decadePath(decade)} className="decade-row__label">
              {decadeLabel(decade)}
            </SiteLink>
            <span className="decade-row__counts">
              {countLabel(certain.length, "letter")}
              {possible.length > 0 && `, ${possible.length} possible`}
            </span>
            <svg
              className="decade-row__bar"
              viewBox={`0 0 ${largestTotal} 1`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect className="decade-row__bar-certain" width={certain.length} height="1" />
              <rect className="decade-row__bar-possible" x={certain.length} width={possible.length} height="1" />
            </svg>
          </li>
        ))}
      </ol>
    </Layout>
  );
}
