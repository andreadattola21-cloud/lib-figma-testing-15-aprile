import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-links",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
  },
  webpackFinal: async (config) => {
    config.module = config.module ?? { rules: [] };
    config.module.rules = config.module.rules ?? [];

    // TypeScript + React via babel-loader (dist/ not required)
    config.module.rules.unshift({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              ["@babel/preset-env", { targets: { chrome: 100 } }],
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
          },
        },
      ],
      exclude: /node_modules/,
    });

    // ── CSS Modules ──────────────────────────────────────────
    // Exclude *.module.css from Storybook's default CSS rule so it
    // doesn't swallow the import as a plain side-effect stylesheet.
    for (const rule of config.module.rules) {
      if (
        typeof rule !== "object" ||
        rule === null ||
        !(rule.test instanceof RegExp) ||
        !rule.test.test("test.css")
      )
        continue;

      // Narrow the default rule to non-module CSS only
      rule.exclude = /\.module\.css$/;
    }

    // Add an explicit rule for *.module.css with CSS Modules enabled.
    // Uses the root style-loader + css-loader packages.
    // css-loader ≥ 7 defaults namedExport to true which removes the default
    // export object — components using `import styles from "./X.module.css"`
    // would get `undefined`. Setting namedExport: false restores the
    // default-export behaviour.
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        require.resolve("style-loader"),
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
            modules: {
              namedExport: false,
              localIdentName: "[local]__[hash:base64:4]",
              exportLocalsConvention: "camelCase",
            },
          },
        },
      ],
    });

    // Resolve @ds/* to source files (no dist build required in dev)
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@ds/components": path.resolve(
        __dirname,
        "../../components/src/index.ts"
      ),
      // exact match so @ds/tokens/css is not caught by this alias
      "@ds/tokens$": path.resolve(__dirname, "../../tokens/src/index.ts"),
      "@ds/tokens/css": path.resolve(__dirname, "../../tokens/src/tokens.css"),
    };

    return config;
  },
};

export default config;
