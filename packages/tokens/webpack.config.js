const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

/**
 * Webpack config for @ds/tokens.
 *
 * Produces:
 *   dist/index.js       — CJS for Node consumers
 *   dist/index.esm.js   — ESM for bundlers
 *   dist/tokens.css      — Design tokens CSS custom properties
 */
module.exports = [
  // ─── ESM build ──────────────────────────────────────────
  {
    name: "esm",
    mode: isProd ? "production" : "development",
    entry: "./src/index.ts",
    devtool: isProd ? "source-map" : "eval-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.esm.js",
      library: {
        type: "module",
      },
      clean: false,
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { esmodules: true } }],
                  "@babel/preset-typescript",
                ],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "tokens.css" }),
    ],
  },

  // ─── CJS build ──────────────────────────────────────────
  {
    name: "cjs",
    mode: isProd ? "production" : "development",
    entry: "./src/index.ts",
    devtool: isProd ? "source-map" : "eval-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      library: {
        type: "commonjs2",
      },
      clean: false,
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { node: "20" } }],
                  "@babel/preset-typescript",
                ],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "tokens.css" }),
    ],
  },
];
