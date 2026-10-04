import { decadeLabel, decadesOverlapping } from "../../dates/decades";
import type { Correspondent, Letter } from "../../model/types";
import { DateRangeText } from "../components/date-range-text";
import { Layout } from "../components/layout";
import { SiteLink } from "../components/page-path";
import { Pager } from "../components/pager";
import { DATE_SOURCE_LABELS } from "../labels";
import {
  letterCitation,
  letterDateRange,
  letterExcerpt,
  letterTitle,
  letterTitleWithDate,
  transcriptionLines,
} from "../letter-details";
import { HOME_PATH, correspondentPath, decadePath, letterPath } from "../paths";

type LetterPageProps = { letter: Letter; previous: Letter | undefined; next: Letter | undefined };

const CorrespondentLink = ({ correspondent }: { correspondent: Correspondent }) => {
  return <SiteLink to={correspondentPath(correspondent.name)}>{correspondent.name}</SiteLink>;
};

const MissingValue = ({ children = "Unknown" }: { children?: string }) => {
  return <span className="unknown">{children}</span>;
};

export const LetterPage = ({ letter, previous, next }: LetterPageProps) => {
  const title = letterTitle(letter);
  const range = letterDateRange(letter);
  const decades = decadesOverlapping(range);
  return (
    <Layout
      title={`${letterTitleWithDate(letter)} (${letter.id})`}
      description={letterExcerpt(letter)}
      section="letters"
      breadcrumbs={[{ label: "Letters", path: HOME_PATH }, { label: letter.id }]}
    >
      <header className="page-header">
        <p className="eyebrow">Letter {letter.id}</p>
        <h1>
          {title}
          <span className="visually-hidden">, </span>
          <span className="page-header__date">
            <DateRangeText range={range} />
          </span>
        </h1>
      </header>
      <div className="letter-layout">
        <section aria-labelledby="details" className="letter-details">
          <h2 id="details">Details</h2>
          <dl className="details-list">
            <dt>From</dt>
            <dd>
              <CorrespondentLink correspondent={letter.sender} />
            </dd>
            <dt>To</dt>
            <dd>{letter.recipient ? <CorrespondentLink correspondent={letter.recipient} /> : <MissingValue />}</dd>
            <dt>Written at</dt>
            <dd>{letter.origin?.name ?? <MissingValue />}</dd>
            <dt>Sent to</dt>
            <dd>{letter.destination?.name ?? <MissingValue />}</dd>
            <dt>Date</dt>
            <dd>
              <DateRangeText range={range} />
            </dd>
            <dt>Date as found</dt>
            <dd>
              {letter.dateText ? (
                <span className="source-wording">{letter.dateText}</span>
              ) : (
                <MissingValue>None</MissingValue>
              )}
            </dd>
            {letter.dateSource && (
              <>
                <dt>Found in</dt>
                <dd>{DATE_SOURCE_LABELS[letter.dateSource]}</dd>
              </>
            )}
            {decades.length > 0 && (
              <>
                <dt>{decades.length === 1 ? "Decade" : "Decades"}</dt>
                <dd>
                  <ul className="inline-list">
                    {decades.map((decade) => (
                      <li key={decade}>
                        <SiteLink to={decadePath(decade)}>{decadeLabel(decade)}</SiteLink>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </section>
        <div className="letter-main">
          <section aria-labelledby="transcription" className="letter-transcription">
            <h2 id="transcription">Transcription</h2>
            <div className="transcription">
              {transcriptionLines(letter).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </section>
          <section aria-labelledby="cite" className="citation">
            <h2 id="cite">Cite this letter</h2>
            <p>{letterCitation(letter)}</p>
          </section>
        </div>
      </div>
      <Pager
        label="Previous and next letters"
        previous={previous && { path: letterPath(previous.id), title: letterTitleWithDate(previous) }}
        next={next && { path: letterPath(next.id), title: letterTitleWithDate(next) }}
      />
    </Layout>
  );
};
