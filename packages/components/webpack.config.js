const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

/**
 * Webpack config for @ds/components.
 *
 * Produces two outputs:
 *   dist/index.js       — CJS for Node/SSR consumers
 *   dist/index.esm.js   — ESM for bundlers (tree-shaking)
 *
 * CSS Modules are extracted to dist/index.css.
 *
 * For MFE consumers that prefer Module Federation at runtime,
 * see webpack.federation.config.js (generated separately per project).
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
    externals: {
      react: "react",
      "react-dom": "react-dom",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { esmodules: true } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                  "@babel/preset-typescript",
                ],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.module\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isProd
                    ? "[hash:base64:8]"
                    : "[local]__[hash:base64:4]",
                  exportLocalsConvention: "camelCase",
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "index.css" }),
    ],
    optimization: {
      usedExports: true,
      sideEffects: false,
    },
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
    externals: {
      react: "react",
      "react-dom": "react-dom",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { node: "20" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                  "@babel/preset-typescript",
                ],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.module\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isProd
                    ? "[hash:base64:8]"
                    : "[local]__[hash:base64:4]",
                  exportLocalsConvention: "camelCase",
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "index.css" }),
    ],
    optimization: {
      usedExports: true,
      sideEffects: false,
    },
  },
];
