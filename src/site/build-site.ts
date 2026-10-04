import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_DATABASE_PATH, openDatabase } from "../db/migrate";
import { loadLetters } from "../db/queries";
import { FAVICON_PATH, STYLESHEET_PATH } from "./paths";
import { renderSite } from "./render-site";

const DEFAULT_OUTPUT_DIR = fileURLToPath(new URL("../../dist/", import.meta.url));
const STYLESHEET_SOURCE = fileURLToPath(new URL("./styles.css", import.meta.url));
const FAVICON_SOURCE = fileURLToPath(new URL("./favicon.svg", import.meta.url));

type BuildOptions = { databasePath?: string; outputDir?: string };

/** Replaces any previous build in `outputDir`. */
export const buildSite = async ({
  databasePath = DEFAULT_DATABASE_PATH,
  outputDir = DEFAULT_OUTPUT_DIR,
}: BuildOptions = {}): Promise<number> => {
  const database = openDatabase(databasePath, { readonly: true, fileMustExist: true });
  const letters = loadLetters(database);
  database.close();

  const stylesheet = { path: STYLESHEET_PATH, contents: await readFile(STYLESHEET_SOURCE, "utf8") };
  const favicon = { path: FAVICON_PATH, contents: await readFile(FAVICON_SOURCE, "utf8") };
  const files = [...renderSite(letters), stylesheet, favicon];
  await rm(outputDir, { recursive: true, force: true });
  for (const file of files) {
    const outputPath = path.join(outputDir, file.path);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, file.contents, "utf8");
  }
  return files.length;
};

if (import.meta.main) {
  const fileCount = await buildSite();
  console.log(`Built ${fileCount} files to ${DEFAULT_OUTPUT_DIR}`);
}
