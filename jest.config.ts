import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: {},
  //openHandlesTimeout: 10000,
  testEnvironmentOptions: {
    NODE_ENV: "test"
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/config",
    "src/app.ts",
    "tests"
  ],
  coverageReporters: ["text", "lcov", "clover", "html"]
};

export default config;
