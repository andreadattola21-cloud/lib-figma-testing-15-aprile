# Design System

Enterprise design system monorepo — React component library synced
with Figma via MCP and Code Connect.

## Packages

| Package | Description |
|---|---|
| `@ds/tokens` | Design tokens (CSS custom properties) synced from Figma variables |
| `@ds/components` | React component library (primitives, compositions, layout) |
| `@ds/code-connect` | Figma Code Connect mappings (`.figma.tsx` files) |
| `@ds/storybook` | Storybook documentation and visual testing |
| `@ds/preview` | Preview app for testing component integration |

## Quick start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Figma PAT and file key

# Build all packages
npm run build

# Run all tests
npm run test

# Start preview app
npm run preview
```

## Prerequisites

- Node.js >= 20
- npm >= 10
- Figma Organization or Enterprise plan (required for Code Connect)
- [VS Code](https://code.visualstudio.com/) with GitHub Copilot (for MCP integration)

---

## Figma MCP Setup

### VS Code (Recommended)

The repo includes `.vscode/mcp.json` pre-configured for the Figma Remote MCP server.
When you open the project in VS Code, it will auto-detect the MCP configuration.

You need to authenticate via your Figma Personal Access Token:

1. Go to **Figma → Account Settings → Personal Access Tokens**
2. Create a token with `file:read` and `code_connect:write` scopes
3. VS Code will prompt for authentication when the MCP server is first used

### Claude Code / Cursor / Other MCP Clients

Add to your MCP client config:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {
        "Authorization": "Bearer <your-personal-access-token>"
      }
    }
  }
}
```

### Environment Variables

```bash
cp .env.example .env
```

```env
FIGMA_ACCESS_TOKEN=your_figma_pat
FIGMA_FILE_KEY=your_figma_file_key   # from the file URL: /design/FILE_KEY/...
```

> ⚠️ **Security**: Never commit `.env` files. The `.gitignore` blocks them,
> but always verify with `git status` before committing.

---

## Workflow: Figma → Component

### A. Sync design tokens

```bash
npm run tokens:sync
```

This calls the Figma Variables API and writes CSS custom properties to
`packages/tokens/src/tokens.css`. Review the diff before committing.

### B. Generate a new component

1. Open the Figma file and select the component frame
2. In your AI assistant: `use the generate-component skill`
3. The AI will:
   - Read the design context via MCP (`get_design_context`)
   - Extract dimensions via `get_metadata`
   - Map variables via `get_variable_defs`
   - Check existing Code Connect mappings (`get_code_connect_map`)
   - Generate the component, CSS Module, types, test, and story
   - Create the `.figma.tsx` Code Connect file

### C. Publish Code Connect

```bash
npm run code-connect:publish
```

After publishing, the Figma Dev Mode panel shows real code snippets
for every mapped component.

### D. Implement a full page

Work section by section — **never** send an entire page to the MCP in one call.

```
Implement the header section from this Figma frame: [URL]
```
→ Review and test
```
Now implement the hero section from the same frame: [URL with different node-id]
```

---

## Component structure

```
packages/components/src/
├── primitives/         # Atoms: Button, Input, Badge, Checkbox, Tag…
│   └── Button/
│       ├── Button.tsx
│       ├── Button.module.css
│       ├── Button.types.ts
│       ├── Button.test.tsx
│       └── index.ts
├── compositions/       # Molecules: Card, Header, Footer, HeroBasic…
├── layout/             # Layout wrappers: Flex, Grid, Stack, Section
│   └── Flex/
└── index.ts            # Named exports only (enables tree-shaking)
```

### File checklist for every component

| File | Purpose |
|---|---|
| `Name.types.ts` | Props interface (extends HTML attributes) |
| `Name.module.css` | Styles using `var(--ds-*)` tokens only |
| `Name.tsx` | Component implementation |
| `Name.test.tsx` | Minimum 4 tests (render, variants, interaction, a11y) |
| `index.ts` | Named re-export |

### Rules

- **No hardcoded values** — all from `var(--ds-*)` tokens
- **No default exports** — named exports only
- **No `any`** in TypeScript
- **Always spread `...props`** on root element
- **Props extend HTML attributes** (e.g. `ButtonHTMLAttributes<HTMLButtonElement>`)

---

## Build Output

The components package produces:

| Output | Format | Purpose |
|---|---|---|
| `dist/index.esm.js` | ESM | Tree-shakeable for bundlers |
| `dist/index.js` | CJS | Node.js / SSR |
| `dist/index.css` | CSS | Extracted CSS Modules |
| `dist/index.d.ts` | TypeScript | Type declarations |

### Tree-shaking

- `sideEffects: false` in `package.json`
- Named exports only from barrel `index.ts`
- React is a peer dependency (never bundled)

---

## MFE Integration

### Install as npm package

```bash
npm install @ds/components @ds/tokens
```

### Import components

```tsx
import { Button, Header, Flex } from "@ds/components";
import "@ds/tokens/dist/tokens.css"; // Load design tokens globally
import "@ds/components/dist/index.css"; // Load component styles
```

### Module Federation (Runtime)

For MFE architectures using Module Federation (Rsbuild / Webpack 5):

```js
// host webpack.config.js
new ModuleFederationPlugin({
  remotes: {
    designSystem: "ds@https://cdn.example.com/ds/remoteEntry.js",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
});
```

---

## Available scripts

| Script | Description |
|---|---|
| `npm run build` | Build all packages |
| `npm run dev` | Watch mode for all packages |
| `npm run test` | Run all unit tests |
| `npm run typecheck` | TypeScript check across all packages |
| `npm run preview` | Start preview app dev server |
| `npm run storybook` | Start Storybook dev server |
| `npm run tokens:sync` | Sync tokens from Figma |
| `npm run code-connect:publish` | Publish Code Connect mappings to Figma |

---

## Code Connect

Code Connect files live in `packages/code-connect/src/` and map Figma components
to their React implementations. They use the `.figma.tsx` extension.

### Key rules

- URLs must be **string literals** (template literals are rejected by the parser)
- Use `figma.string("PropName")` to map Figma string properties
- Use `figma.enum("PropName", { ... })` for variant mappings
- Use `figma.boolean("PropName")` for boolean toggles
- For data-driven compositions (arrays of objects), use **static examples** — don't use `figma.children()` unless the component prop accepts `ReactNode`
- Node IDs must come from `get_code_connect_suggestions` (use `mainComponentNodeId`)

### Publishing

```bash
# Set your token
export FIGMA_ACCESS_TOKEN=your_pat

# Publish
npm run code-connect:publish

# Unpublish (removes from Figma)
npm run code-connect:unpublish
```

---

## AI Skills

| Skill | Trigger | Client |
|---|---|---|
| `generate-component` | "Generate the [X] component from Figma" | Claude Code, VS Code Copilot |
| `figma-code-connect` | "Connect the [X] Figma component to code" | Claude Code, VS Code Copilot |

Skills are defined in:
- `.claude/skills/` — Claude Code
- `.github/instructions/` — VS Code Copilot

---

## Token naming convention

```
--ds-{category}-{subcategory}-{variant}

Examples:
  --ds-text-default-default
  --ds-background-default-default
  --ds-space-400                    # 16px
  --ds-radius-200                   # 8px
  --ds-scale-03                     # 16px font size
  --ds-weight-bold
```

All tokens are defined in `packages/tokens/src/tokens.css`.
JS equivalents are in `packages/tokens/src/index.ts`.
