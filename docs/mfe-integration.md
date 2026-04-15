# MFE Integration Guide

How to consume `@ds/components` in a Micro Frontend project.

## Option A — npm package (recommended for new projects)

Install the package and import components directly. Webpack tree-shakes
unused components at build time.

```bash
npm install @ds/components @ds/tokens
```

```tsx
// app.tsx
import "@ds/tokens/css"; // load design tokens once at app root
import { Button } from "@ds/components";

export function App() {
  return <Button variant="primary">Hello</Button>;
}
```

Webpack config for the consumer app (no extra setup needed beyond
having `sideEffects: false` respected):

```js
// webpack.config.js (consumer)
module.exports = {
  // standard config — tree-shaking works automatically
  // because @ds/components has "sideEffects": false
};
```

---

## Option B — Module Federation (runtime sharing)

Use this when you want the design system loaded once at runtime,
shared across all micro frontends without re-bundling.

### Design System host (exposes the library)

```js
// webpack.federation.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "designSystem",
      filename: "remoteEntry.js",
      exposes: {
        // Expose the full library
        "./components": "./src/index.ts",
        // Or expose individual components for finer granularity
        "./Button": "./src/primitives/Button/index.ts",
        "./Flex":   "./src/layout/Flex/index.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};
```

### Consumer MFE (imports at runtime)

```js
// webpack.config.js (consumer MFE)
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "myApp",
      remotes: {
        designSystem: "designSystem@https://cdn.example.com/ds/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};
```

```tsx
// In the consumer MFE — lazy load with Suspense
import React, { lazy, Suspense } from "react";

const Button = lazy(() =>
  import("designSystem/Button").then((m) => ({ default: m.Button }))
);

export function MyFeature() {
  return (
    <Suspense fallback={null}>
      <Button variant="primary">Lazy loaded from DS</Button>
    </Suspense>
  );
}
```

### TypeScript types for Module Federation remotes

```ts
// src/types/remotes.d.ts (in each consumer MFE)
declare module "designSystem/Button" {
  export { Button, ButtonProps, ButtonVariant, ButtonSize } from "@ds/components";
}

declare module "designSystem/components" {
  export * from "@ds/components";
}
```

---

## Design Tokens in MFE

CSS custom properties are inherited across shadow boundaries and iframes.
Load the token sheet once in the shell app:

```html
<!-- shell/index.html -->
<link rel="stylesheet" href="https://cdn.example.com/ds/tokens.css" />
```

Or import programmatically in the shell's root:

```ts
// shell/src/main.ts
import "@ds/tokens/css";
```

All micro frontends automatically inherit the tokens — no duplication.

---

## Versioning strategy

| Upgrade type | Approach |
|---|---|
| Patch (bug fix) | Auto-upgrade via `^` semver range |
| Minor (new component) | Upgrade at convenience, 1-sprint window |
| Major (breaking prop changes) | Coordinated upgrade, 2-3 sprint window |

Use `npm outdated` in each MFE to check alignment with the DS version.
