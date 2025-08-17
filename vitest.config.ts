import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/util/setup.ts"],
    globalSetup: "./tests/util/globalSetup.ts",
    pool: "forks",
    maxConcurrency: 1,
    fileParallelism: false,
    sequence: {
      concurrent: false
    },
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov", "cobertura", "html"],
      exclude: [
        "node_modules",
        "src/config",
        "src/app.ts",
        "src/index.ts",
        "src/lib",
        "tests",
        "bin",
        "db",
        "*.config.ts"
      ]
    }
  }
});
