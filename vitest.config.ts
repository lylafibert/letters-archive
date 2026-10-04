import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    // describe/it/expect/beforeEach etc. are available without importing.
    globals: true,
    // A test with no assertions fails instead of passing silently.
    expect: { requireAssertions: true },
  },
});
