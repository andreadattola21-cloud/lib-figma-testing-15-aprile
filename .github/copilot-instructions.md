# Design System — Copilot Workspace Instructions

## Stack
- Monorepo: Turbo + npm workspaces
- Packages: `@ds/components`, `@ds/tokens`, `@ds/storybook`, `@ds/code-connect`, `@ds/preview`
- React 18, TypeScript 5, CSS Modules, Jest, Storybook 8
- Figma Code Connect: `@figma/code-connect`

## Conventions
- Named exports only — never `export default`
- Props interface extends the relevant HTML element attributes (`ButtonHTMLAttributes`, `HTMLAttributes<HTMLElement>`, etc.)
- CSS Modules for all component styles (`*.module.css`)
- No `any` in TypeScript
- All values from `var(--ds-*)` tokens — never hardcode colors, spacing, font sizes, or border radii
- Components go in: `primitives/`, `compositions/`, or `layout/` under `packages/components/src/`

## Build & Test
- Build all: `npx turbo run build` (generates ESM, CJS, CSS, and `.d.ts` declarations)
- Tests: `cd packages/components && npx jest --no-coverage`
- Preview: `cd packages/preview && npx webpack serve --mode development`
- Typecheck: `npx turbo run typecheck`
- Code Connect publish: `cd packages/code-connect && FIGMA_ACCESS_TOKEN=... npx figma connect publish`

## MCP Tool Sequence (CRITICAL)

> 📖 Source: Official Figma DevRel (Jake Albaugh)

When implementing a Figma design, follow this exact sequence:
1. `get_metadata` → structure and pixel dimensions
2. `get_screenshot` → visual reference
3. `get_code_connect_map` → existing mappings to reuse
4. `get_variable_defs` → token definitions (use code syntax form, not Figma display name)
5. `get_design_context` → full reference code with inline Code Connect and variables

Annotations in Figma (content categories, property callouts) are machine-readable
and passed through MCP — read and follow them.

## Code Connect Rules (CRITICAL)
- Files with JSX must use `.figma.tsx` extension (NEVER `.figma.ts`)
- Figma URLs must be **string literals** — template literals are rejected by the parser
- Node IDs must come from `get_code_connect_suggestions` (`mainComponentNodeId`)
- `figma.children()` returns `ReactNode[]` — ONLY use when the component prop accepts `ReactNode`, NEVER for data arrays (e.g. `items: ItemData[]`)
- For data-driven compositions, use static examples with realistic data
- All callback props in examples must use `() => {}` — never reference undefined variables
- Never use empty `props: {}` — either map real Figma properties or omit props entirely

## Important
- Always import types from `react` explicitly (`import type { HTMLAttributes } from "react"`) — never use `React.HTMLAttributes` without import
- Every component must spread `...props` on its root element to forward native HTML attributes
- See `.github/instructions/` for detailed domain-specific rules
