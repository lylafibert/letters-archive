import { render, within } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { PagePathProvider } from "../../src/site/components/page-path";
import { HOME_PATH } from "../../src/site/paths";
import { renderDocument } from "../../src/site/render-site";

/** Renders a component as if on the page at `path`, so relative links resolve as on the site. */
export const renderAtPath = (component: ReactElement, path = HOME_PATH) => {
  return render(component, {
    wrapper: ({ children }: { children: ReactNode }) => <PagePathProvider path={path}>{children}</PagePathProvider>,
  });
};

/** Renders a whole page into the test document, exactly as the build writes it, and returns queries for its body. */
export const renderPage = (page: ReactElement, path = HOME_PATH) => {
  const parsed = new DOMParser().parseFromString(renderDocument(path, page), "text/html");
  document.replaceChild(document.importNode(parsed.documentElement, true), document.documentElement);
  return within(document.body);
};

/** The `<dd>` that describes a `<dt>` with the given text, e.g. the value shown for "Date". */
export const descriptionFor = (container: HTMLElement, term: string): HTMLElement => {
  const value = within(container).getByText(term, { selector: "dt" }).nextElementSibling;
  if (!(value instanceof HTMLElement) || value.tagName !== "DD") throw new Error(`No description for "${term}"`);
  return value;
};
