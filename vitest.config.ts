import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // describe/it/expect/beforeEach etc. are available without importing.
    globals: true,
    // A test with no assertions fails instead of passing silently.
    expect: { requireAssertions: true },
    projects: [
      {
        extends: true,
        test: { name: "node", include: ["src/**/*.test.ts", "tests/**/*.test.ts"], environment: "node" },
      },
      {
        extends: true,
        test: {
          name: "dom",
          include: ["src/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["tests/support/setup-dom.ts"],
        },
      },
    ],
  },
});
