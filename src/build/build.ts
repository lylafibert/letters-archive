import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const OUT_DIR = fileURLToPath(new URL("../../dist/", import.meta.url));

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

export async function build(outDir: string = OUT_DIR): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), renderIndexPage(), "utf8");
  console.log(`Built site to ${outDir}`);
}

// Run only when invoked directly (not when imported by tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  await build();
}
