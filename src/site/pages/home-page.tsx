import { decadeLabel } from "../../dates/decades";
import type { Letter } from "../../model/types";
import { Layout } from "../components/layout";
import { LetterList } from "../components/letter-list";
import { countLabel } from "../labels";
import { SITE_NAME } from "../site-config";

type HomePageProps = { letters: readonly Letter[]; correspondentCount: number; decades: readonly number[] };

export function HomePage({ letters, correspondentCount, decades }: HomePageProps) {
  const firstDecade = decades[0];
  const lastDecade = decades.at(-1);
  return (
    <Layout
      title={SITE_NAME}
      description="A small archive of fictional nineteenth-century letters, with uncertain dates recorded as found and as interpreted."
      section="letters"
    >
      <header className="page-header page-header--home">
        <h1>{SITE_NAME}</h1>
        <p className="lede">
          Letters exchanged between two families and their circle in the fictional towns of Hollinsford, Wexcombe and
          Port Aldwick. Each date is recorded as the source gives it and as a range that can be searched and sorted.
        </p>
        <dl className="stats">
          <div>
            <dt>Letters</dt>
            <dd>{letters.length}</dd>
          </div>
          <div>
            <dt>Correspondents</dt>
            <dd>{correspondentCount}</dd>
          </div>
          {firstDecade !== undefined && lastDecade !== undefined && (
            <div>
              <dt>Period</dt>
              <dd>
                {decadeLabel(firstDecade)}–{decadeLabel(lastDecade)}
              </dd>
            </div>
          )}
        </dl>
      </header>
      <section aria-labelledby="all-letters">
        <h2 id="all-letters">All letters</h2>
        <p className="section-note">
          {countLabel(letters.length, "letter")} in date order. Uncertain dates are placed by their earliest possible
          date.
        </p>
        <LetterList letters={letters} />
      </section>
    </Layout>
  );
}
