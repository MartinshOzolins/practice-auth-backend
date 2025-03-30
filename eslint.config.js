import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

// imports
import eslintPluginPrettier from "eslint-plugin-prettier";

// ESLint configuration
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      prettier: eslintPluginPrettier,
    },
    extends: ["js/recommended", "plugin:prettier/recommended"],
    rules: {
      "no-unused-vars": "warn",
    },
  },
]);
