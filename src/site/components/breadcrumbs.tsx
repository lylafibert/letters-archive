import { SiteLink } from "./page-path";

/** A trail of pages; the last crumb, without a path, is the current page. */
export type Crumb = { label: string; path?: string };

export function Breadcrumbs({ crumbs }: { crumbs: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {crumbs.map((crumb) => (
          <li key={crumb.label}>
            {crumb.path === undefined ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <SiteLink to={crumb.path}>{crumb.label}</SiteLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
