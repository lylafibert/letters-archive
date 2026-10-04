import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Letter } from "../model/types";
import { PagePathProvider } from "./components/page-path";
import { renderJsonIndex } from "./json-index";
import { CorrespondentPage } from "./pages/correspondent-page";
import { CorrespondentsPage } from "./pages/correspondents-page";
import { DecadePage } from "./pages/decade-page";
import { DecadesPage } from "./pages/decades-page";
import { HomePage } from "./pages/home-page";
import { LetterPage } from "./pages/letter-page";
import {
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

/** A file to write, relative to the output directory. */
export type SiteFile = { path: string; contents: string };

/** Every page and data file of the site, from letters in date order. */
export function renderSite(letters: readonly Letter[]): SiteFile[] {
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
  ];

  const files = [
    ...pages.map(({ path, element }) => ({ path: outputFilePath(path), contents: renderDocument(path, element) })),
    { path: JSON_INDEX_PATH, contents: renderJsonIndex(letters) },
  ];
  assertUniquePaths(files);
  return files;
}

export function renderDocument(pagePath: string, page: ReactElement): string {
  return `<!DOCTYPE html>\n${renderToStaticMarkup(<PagePathProvider path={pagePath}>{page}</PagePathProvider>)}\n`;
}

/** Two pages with the same path (e.g. correspondents with the same name) would overwrite each other. */
function assertUniquePaths(files: readonly SiteFile[]): void {
  const seen = new Set<string>();
  for (const { path } of files) {
    if (seen.has(path)) throw new Error(`Two pages would be written to ${path}`);
    seen.add(path);
  }
}
