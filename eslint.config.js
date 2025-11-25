// @ts-check

import eslint from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
    eslint.configs.recommended,
    {
        extends: [...tseslint.configs.recommendedTypeChecked],
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { varsIgnorePattern: "^_" },
            ],
        },
    },
    pluginVue.configs["flat/recommended"],
    {
        ignores: ["src/.vitepress/cache", "src/.vitepress/dist"],
    },
);
