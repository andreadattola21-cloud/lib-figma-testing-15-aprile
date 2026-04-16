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
- Tests: `cd packages/components && npx jest --no-coverage`
- Preview: `cd packages/preview && npx webpack serve --mode development`
- Code Connect publish: `cd packages/code-connect && FIGMA_ACCESS_TOKEN=... npx figma connect publish`
- No `dist/` folder — preview and storybook resolve `@ds/components` via webpack alias to source

## Important
- Always import types from `react` explicitly (`import type { HTMLAttributes } from "react"`) — never use `React.HTMLAttributes` without import
- Every component must spread `...props` on its root element to forward native HTML attributes
- See `.github/instructions/` for detailed domain-specific rules
