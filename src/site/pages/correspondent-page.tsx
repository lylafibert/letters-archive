import type { Letter } from "../../model/types";
import { Layout } from "../components/layout";
import { LetterList } from "../components/letter-list";
import { CORRESPONDENT_KIND_LABELS, countLabel } from "../labels";
import { CORRESPONDENTS_PATH } from "../paths";
import type { CorrespondentSummary } from "../site-data";

export function CorrespondentPage({ summary }: { summary: CorrespondentSummary }) {
  const { correspondent, sent, received } = summary;
  return (
    <Layout
      title={correspondent.name}
      description={`Letters sent and received by ${correspondent.name}.`}
      section="correspondents"
      breadcrumbs={[{ label: "Correspondents", path: CORRESPONDENTS_PATH }, { label: correspondent.name }]}
    >
      <header className="page-header">
        <p className="eyebrow">{CORRESPONDENT_KIND_LABELS[correspondent.kind]}</p>
        <h1>{correspondent.name}</h1>
        <p className="lede">
          {countLabel(sent.length, "letter")} sent and {countLabel(received.length, "letter")} received.
        </p>
      </header>
      <LetterSection id="sent" heading="Letters sent" letters={sent} />
      <LetterSection id="received" heading="Letters received" letters={received} />
    </Layout>
  );
}

function LetterSection({ id, heading, letters }: { id: string; heading: string; letters: readonly Letter[] }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      {letters.length > 0 ? <LetterList letters={letters} /> : <p className="empty">None in the archive.</p>}
    </section>
  );
}
