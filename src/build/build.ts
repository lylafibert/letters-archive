import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DEFAULT_OUTPUT_DIR = fileURLToPath(new URL("../../dist/", import.meta.url));

export function renderIndexPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Letters Archive</title>
</head>
<body>
  <main>
    <h1>Letters Archive</h1>
    <p>Hello, world. The archive is under construction.</p>
  </main>
</body>
</html>
`;
}

export async function buildSite(outputDir: string = DEFAULT_OUTPUT_DIR): Promise<void> {
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), renderIndexPage(), "utf8");
  console.log(`Built site to ${outputDir}`);
}

if (import.meta.main) {
  await buildSite();
}
