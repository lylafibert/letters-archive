import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { HOME_PATH, relativeHref } from "../paths";

const PagePathContext = createContext(HOME_PATH);

/** Tells links which page they are on, so they can be made relative. */
export function PagePathProvider({ path, children }: { path: string; children: ReactNode }) {
  return <PagePathContext value={path}>{children}</PagePathContext>;
}

export function usePagePath(): string {
  return useContext(PagePathContext);
}

/** A link to a site path, relative to the current page. */
export function SiteLink({ to, ...anchorProps }: { to: string } & Omit<ComponentProps<"a">, "href">) {
  return <a href={relativeHref(usePagePath(), to)} {...anchorProps} />;
}
