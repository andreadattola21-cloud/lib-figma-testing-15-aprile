import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
      },
    ],
  },
  moduleNameMapper: {
    "\\.module\\.css$": "identity-obj-proxy",
    "\\.css$": "<rootDir>/../../jest/styleMock.js",
  },
  testMatch: ["**/__tests__/**/*.tsx?", "**/*.test.tsx?"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.types.ts",
    "!src/**/index.ts",
  ],
};

export default config;
