import { decadeLabel } from "../../dates/decades";
import { Layout } from "../components/layout";
import { LetterList } from "../components/letter-list";
import { Pager } from "../components/pager";
import { countLabel } from "../labels";
import { DECADES_PATH, decadePath } from "../paths";
import type { DecadeSummary } from "../site-data";

type DecadePageProps = { summary: DecadeSummary; previous: number | undefined; next: number | undefined };

export const DecadePage = ({ summary, previous, next }: DecadePageProps) => {
  const { decade, certain, possible } = summary;
  const label = decadeLabel(decade);
  return (
    <Layout
      title={`The ${label}`}
      description={`Letters dated within, or possibly within, the ${label}.`}
      section="decades"
      breadcrumbs={[{ label: "Decades", path: DECADES_PATH }, { label }]}
    >
      <header className="page-header">
        <h1>The {label}</h1>
        <p className="lede">
          {countLabel(certain.length, "letter")} dated within the decade, and {countLabel(possible.length, "letter")}{" "}
          whose date range extends beyond it.
        </p>
      </header>
      <section aria-labelledby="certain">
        <h2 id="certain">Dated within the {label}</h2>
        {certain.length > 0 ? <LetterList letters={certain} /> : <p className="empty">None.</p>}
      </section>
      {possible.length > 0 && (
        <section aria-labelledby="possible">
          <h2 id="possible">Possibly from the {label}</h2>
          <LetterList letters={possible} />
        </section>
      )}
      <Pager
        label="Previous and next decades"
        previous={
          previous === undefined ? undefined : { path: decadePath(previous), title: `The ${decadeLabel(previous)}` }
        }
        next={next === undefined ? undefined : { path: decadePath(next), title: `The ${decadeLabel(next)}` }}
      />
    </Layout>
  );
};
