import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_DATABASE_PATH, openDatabase } from "../db/migrate";
import { loadLetters } from "../db/queries";
import { STYLESHEET_PATH } from "./paths";
import { renderSite } from "./render-site";

const DEFAULT_OUTPUT_DIR = fileURLToPath(new URL("../../dist/", import.meta.url));
const STYLESHEET_SOURCE = fileURLToPath(new URL("./styles.css", import.meta.url));

type BuildOptions = { databasePath?: string; outputDir?: string };

/** Reads the archive from the database and writes the static site, replacing any previous build. */
export async function buildSite({
  databasePath = DEFAULT_DATABASE_PATH,
  outputDir = DEFAULT_OUTPUT_DIR,
}: BuildOptions = {}): Promise<number> {
  const database = openDatabase(databasePath, { readonly: true, fileMustExist: true });
  const letters = loadLetters(database);
  database.close();

  const files = renderSite(letters);
  await rm(outputDir, { recursive: true, force: true });
  for (const file of files) {
    const outputPath = path.join(outputDir, file.path);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, file.contents, "utf8");
  }
  await copyFile(STYLESHEET_SOURCE, path.join(outputDir, STYLESHEET_PATH));
  return files.length + 1;
}

if (import.meta.main) {
  const fileCount = await buildSite();
  console.log(`Built ${fileCount} files to ${DEFAULT_OUTPUT_DIR}`);
}
