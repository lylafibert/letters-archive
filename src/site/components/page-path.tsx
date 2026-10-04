import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { relativeHref } from "../paths";

const PagePathContext = createContext<string | null>(null);

/** Tells links which page they are on, so they can be made relative. */
export const PagePathProvider = ({ path, children }: { path: string; children: ReactNode }) => {
  return <PagePathContext value={path}>{children}</PagePathContext>;
};

export const usePagePath = (): string => {
  const pagePath = useContext(PagePathContext);
  if (pagePath === null) throw new Error("usePagePath must be used inside a PagePathProvider");
  return pagePath;
};

/** A link to a site path, relative to the current page. */
export const SiteLink = ({ to, ...anchorProps }: { to: string } & Omit<ComponentProps<"a">, "href">) => {
  return <a href={relativeHref(usePagePath(), to)} {...anchorProps} />;
};
