// Site paths are relative to the site root, with a trailing slash for pages ("letters/mar-001/").
// Links are made relative to the current page, so the site works under any base path.

export const HOME_PATH = "";
export const CORRESPONDENTS_PATH = "correspondents/";
export const DECADES_PATH = "decades/";
export const JSON_INDEX_PATH = "letters.json";
export const STYLESHEET_PATH = "styles.css";

export const letterPath = (letterId: string): string => {
  return `letters/${slugify(letterId)}/`;
};

export const correspondentPath = (correspondentName: string): string => {
  return `correspondents/${slugify(correspondentName)}/`;
};

export const decadePath = (decade: number): string => {
  return `${DECADES_PATH}${decade}s/`;
};

/** The href from one site path to another, e.g. "../../correspondents/" from "letters/mar-001/". */
export const relativeHref = (fromPath: string, toPath: string): string => {
  const depth = fromPath.split("/").filter(Boolean).length;
  const href = "../".repeat(depth) + toPath;
  return href === "" ? "./" : href;
};

/** The file a site path is written to: pages become index.html in their directory. */
export const outputFilePath = (sitePath: string): string => {
  return sitePath === "" || sitePath.endsWith("/") ? `${sitePath}index.html` : sitePath;
};

export const slugify = (text: string): string => {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};
