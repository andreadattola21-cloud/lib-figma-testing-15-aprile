import type { StorybookConfig } from "@storybook/react-webpack5";

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
    // CSS Modules support in Storybook
    const cssRule = config.module?.rules?.find(
      (rule) =>
        typeof rule === "object" &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test("test.css")
    );

    if (cssRule && typeof cssRule === "object") {
      // Replace default CSS rule with CSS Modules support
    }

    config.module = config.module ?? { rules: [] };
    config.module.rules = config.module.rules ?? [];

    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: "[local]__[hash:base64:4]",
              exportLocalsConvention: "camelCase" as const,
            },
          },
        },
      ],
    });

    config.module.rules.push({
      test: /(?<!\.module)\.css$/,
      use: ["style-loader", "css-loader"],
    });

    return config;
  },
};

export default config;
