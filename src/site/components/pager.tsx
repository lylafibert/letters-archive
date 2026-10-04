import { SiteLink } from "./page-path";

export type PagerLink = { path: string; title: string };

/** Links to the previous and next pages in a sequence. Renders nothing if there are neither. */
export function Pager({
  label,
  previous,
  next,
}: {
  label: string;
  previous?: PagerLink | undefined;
  next?: PagerLink | undefined;
}) {
  if (!previous && !next) return null;
  return (
    <nav aria-label={label} className="pager">
      {previous && (
        <SiteLink to={previous.path} rel="prev" className="pager__link pager__link--previous">
          <span className="pager__direction">Previous</span>
          <span className="pager__title">{previous.title}</span>
        </SiteLink>
      )}
      {next && (
        <SiteLink to={next.path} rel="next" className="pager__link pager__link--next">
          <span className="pager__direction">Next</span>
          <span className="pager__title">{next.title}</span>
        </SiteLink>
      )}
    </nav>
  );
}
