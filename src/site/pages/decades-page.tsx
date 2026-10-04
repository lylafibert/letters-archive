import { decadeLabel } from "../../dates/decades";
import { Layout } from "../components/layout";
import { SiteLink } from "../components/page-path";
import { decadeCountLabel } from "../labels";
import { decadePath } from "../paths";
import type { DecadeSummary } from "../site-data";

export const DecadesPage = ({ summaries }: { summaries: readonly DecadeSummary[] }) => {
  return (
    <Layout
      title="Decades"
      description="Letters in the archive by decade, including those whose uncertain dates may fall within it."
      section="decades"
    >
      <header className="page-header">
        <h1>Decades</h1>
        <p className="lede">A letter whose date range spans more than one decade is listed under each of them.</p>
      </header>
      <ol className="decade-list">
        {summaries.map((summary) => (
          <li key={summary.decade} className="decade-row">
            <SiteLink to={decadePath(summary.decade)} className="decade-row__label">
              {decadeLabel(summary.decade)}
            </SiteLink>
            <span className="decade-row__counts">{decadeCountLabel(summary)}</span>
          </li>
        ))}
      </ol>
    </Layout>
  );
};
