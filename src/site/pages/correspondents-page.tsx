import { Layout } from "../components/layout";
import { SiteLink } from "../components/page-path";
import { CORRESPONDENT_KIND_LABELS, countLabel } from "../labels";
import { correspondentPath } from "../paths";
import type { CorrespondentSummary } from "../site-data";

export function CorrespondentsPage({ summaries }: { summaries: readonly CorrespondentSummary[] }) {
  return (
    <Layout
      title="Correspondents"
      description="People and organisations who wrote or received letters in the archive."
      section="correspondents"
    >
      <header className="page-header">
        <h1>Correspondents</h1>
        <p className="lede">People and organisations who wrote or received letters in the archive.</p>
      </header>
      <ul className="card-grid">
        {summaries.map(({ correspondent, sent, received }) => (
          <li key={correspondent.id} className="summary-card">
            <h2 className="summary-card__title">
              <SiteLink to={correspondentPath(correspondent.name)}>{correspondent.name}</SiteLink>
            </h2>
            <p className="summary-card__kind">{CORRESPONDENT_KIND_LABELS[correspondent.kind]}</p>
            <p className="summary-card__meta">
              {countLabel(sent.length, "letter")} sent, {received.length} received
            </p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
