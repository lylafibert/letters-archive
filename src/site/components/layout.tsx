import type { ReactNode } from "react";
import {
  ABOUT_PATH,
  CORRESPONDENTS_PATH,
  DECADES_PATH,
  FAVICON_PATH,
  HOME_PATH,
  JSON_INDEX_PATH,
  STYLESHEET_PATH,
  relativeHref,
} from "../paths";
import { REPOSITORY_URL, SITE_NAME } from "../site-config";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { SiteLink, usePagePath } from "./page-path";

type Section = "letters" | "correspondents" | "decades" | "about";

const NAV_ITEMS: readonly { label: string; path: string; section: Section }[] = [
  { label: "Letters", path: HOME_PATH, section: "letters" },
  { label: "Correspondents", path: CORRESPONDENTS_PATH, section: "correspondents" },
  { label: "Decades", path: DECADES_PATH, section: "decades" },
  { label: "About", path: ABOUT_PATH, section: "about" },
];

type LayoutProps = {
  /** The page's own title. The site name is added to it. */
  title: string;
  description: string;
  section: Section;
  breadcrumbs?: readonly Crumb[];
  children: ReactNode;
};

/** "page" on the section's own page, "true" elsewhere in the section. */
const ariaCurrentFor = (item: (typeof NAV_ITEMS)[number], pagePath: string, section: Section) => {
  if (item.path === pagePath) return "page";
  if (item.section === section) return "true";
  return undefined;
};

export const Layout = ({ title, description, section, breadcrumbs, children }: LayoutProps) => {
  const pagePath = usePagePath();
  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <title>{title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`}</title>
        <meta name="description" content={description} />
        <link rel="icon" type="image/svg+xml" href={relativeHref(pagePath, FAVICON_PATH)} />
        <link rel="stylesheet" href={relativeHref(pagePath, STYLESHEET_PATH)} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="container site-header__inner">
            <SiteLink to={HOME_PATH} className="site-title">
              {SITE_NAME}
            </SiteLink>
            <nav aria-label="Main">
              <ul className="site-nav">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <SiteLink to={item.path} aria-current={ariaCurrentFor(item, pagePath, section)}>
                      {item.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="main" className="container">
          {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} />}
          {children}
        </main>
        <footer className="site-footer">
          <div className="container site-footer__inner">
            <p>All people, places and letters in this archive are fictional.</p>
            <ul className="footer-links">
              <li>
                <SiteLink to={JSON_INDEX_PATH}>Data (JSON)</SiteLink>
              </li>
              <li>
                <a href={REPOSITORY_URL}>Source code</a>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
};
