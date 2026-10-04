import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Letter } from "../model/types";
import { PagePathProvider } from "./components/page-path";
import { renderJsonIndex } from "./json-index";
import { AboutPage } from "./pages/about-page";
import { CorrespondentPage } from "./pages/correspondent-page";
import { CorrespondentsPage } from "./pages/correspondents-page";
import { DecadePage } from "./pages/decade-page";
import { DecadesPage } from "./pages/decades-page";
import { HomePage } from "./pages/home-page";
import { LetterPage } from "./pages/letter-page";
import {
  ABOUT_PATH,
  CORRESPONDENTS_PATH,
  DECADES_PATH,
  HOME_PATH,
  JSON_INDEX_PATH,
  correspondentPath,
  decadePath,
  letterPath,
  outputFilePath,
} from "./paths";
import { summariseCorrespondents, summariseDecades } from "./site-data";

/** `path` is relative to the output directory. */
export type SiteFile = { path: string; contents: string };

/** Two pages with the same path (e.g. correspondents with the same name) would overwrite each other. */
const assertUniquePaths = (files: readonly SiteFile[]): void => {
  const seen = new Set<string>();
  for (const { path } of files) {
    if (seen.has(path)) throw new Error(`Two pages would be written to ${path}`);
    seen.add(path);
  }
};

export const renderDocument = (pagePath: string, page: ReactElement): string => {
  return `<!DOCTYPE html>\n${renderToStaticMarkup(<PagePathProvider path={pagePath}>{page}</PagePathProvider>)}\n`;
};

/** Expects letters in date order, which sets the order of every list and the previous and next links. */
export const renderSite = (letters: readonly Letter[]): SiteFile[] => {
  const correspondents = summariseCorrespondents(letters);
  const decadeSummaries = summariseDecades(letters);
  const decades = decadeSummaries.map((summary) => summary.decade);

  const pages: { path: string; element: ReactElement }[] = [
    {
      path: HOME_PATH,
      element: <HomePage letters={letters} correspondentCount={correspondents.length} decades={decades} />,
    },
    ...letters.map((letter, index) => ({
      path: letterPath(letter.id),
      element: <LetterPage letter={letter} previous={letters[index - 1]} next={letters[index + 1]} />,
    })),
    { path: CORRESPONDENTS_PATH, element: <CorrespondentsPage summaries={correspondents} /> },
    ...correspondents.map((summary) => ({
      path: correspondentPath(summary.correspondent.name),
      element: <CorrespondentPage summary={summary} />,
    })),
    { path: DECADES_PATH, element: <DecadesPage summaries={decadeSummaries} /> },
    ...decadeSummaries.map((summary, index) => ({
      path: decadePath(summary.decade),
      element: <DecadePage summary={summary} previous={decades[index - 1]} next={decades[index + 1]} />,
    })),
    { path: ABOUT_PATH, element: <AboutPage letterCount={letters.length} /> },
  ];

  const files = [
    ...pages.map(({ path, element }) => ({ path: outputFilePath(path), contents: renderDocument(path, element) })),
    { path: JSON_INDEX_PATH, contents: renderJsonIndex(letters) },
  ];
  assertUniquePaths(files);
  return files;
};
