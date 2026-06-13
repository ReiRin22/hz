import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // features 間の直接参照禁止
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/*/**"],
              message:
                "機能間の直接参照は禁止です。複数機能で使用するコンポーネントは shared/ に配置してください。",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
