import globals from "globals";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import security from "eslint-plugin-security";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  // Ignores - needs to be in config by itself
  // see https://github.com/eslint/eslint/discussions/18304#discussioncomment-9069706
  {
    ignores: ["dist", "node_modules", "bin", "db"]
  },

  // TypeScript
  tseslint.configs.recommended,
  tseslint.configs.strict,

  // Security
  {
    plugins: { security },
    rules: { "security/detect-object-injection": "off" },
    ...security.configs.recommended
  },

  // Jest
  {
    files: ["**/*.{spec,test}.ts"],
    plugins: { jest },
    rules: { "jest/expect-expect": "off" },
    languageOptions: {
      globals: { ...globals.jest }
    },
    ...jest.configs["flat/recommended"]
  },

  // Prettier
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": [
        "error",
        { endOfLine: "auto", trailingComma: "none" }
      ]
    }
  },

  // Project
  {
    files: ["**/*.ts"],

    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: "latest"
    },
    rules: {
      "no-console": "error",
      "func-names": "off",
      "no-underscore-dangle": "off",
      "consistent-return": "off"
    }
  }
);
