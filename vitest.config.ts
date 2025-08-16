import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/util/setup.ts"],
    globalSetup: "./tests/util/globalSetup.ts",
    pool: "forks",
    maxConcurrency: 1,
    fileParallelism: false
  }
});
