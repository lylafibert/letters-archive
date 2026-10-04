import type { Letter } from "../../model/types";
import { letterDateRange, letterExcerpt, letterTitle } from "../letter-details";
import { letterPath } from "../paths";
import { DateRangeText } from "./date-range-text";
import { SiteLink } from "./page-path";

const LetterCard = ({ letter }: { letter: Letter }) => {
  return (
    <article className="letter-card">
      <h3 className="letter-card__title">
        <SiteLink to={letterPath(letter.id)}>{letterTitle(letter)}</SiteLink>
      </h3>
      <dl className="letter-card__meta">
        <div>
          <dt className="visually-hidden">Date</dt>
          <dd>
            <DateRangeText range={letterDateRange(letter)} />
          </dd>
        </div>
        <div>
          <dt className="visually-hidden">Reference</dt>
          <dd>{letter.id}</dd>
        </div>
        {letter.origin && (
          <div>
            <dt className="visually-hidden">Written at</dt>
            <dd>{letter.origin.name}</dd>
          </div>
        )}
      </dl>
      <p className="letter-card__excerpt">{letterExcerpt(letter)}</p>
    </article>
  );
};

/** Letters in the given order, each a card under an h3. Place it under an h2. */
export const LetterList = ({ letters }: { letters: readonly Letter[] }) => {
  return (
    <ol className="letter-list">
      {letters.map((letter) => (
        <li key={letter.id}>
          <LetterCard letter={letter} />
        </li>
      ))}
    </ol>
  );
};
