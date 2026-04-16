---
description: "Use when generating, creating, or editing React components for the design system. Covers accessibility, typing, CSS tokens, component structure, and Code Connect integration."
applyTo: "packages/components/src/**"
---
# Component Development Rules

## Typing
- Props interface MUST extend the relevant HTML element attributes:
  - Buttons: `ButtonHTMLAttributes<HTMLButtonElement>`
  - Divs/cards: `HTMLAttributes<HTMLDivElement>`
  - Sections/nav/header/footer: `HTMLAttributes<HTMLElement>`
- Always `import type { ... } from "react"` — never reference `React.` namespace without import
- Export every type used in props from the component's barrel `index.ts`
- If a component renders a native `<button>`, expose `onClick` and other button attributes to consumers

## Prop Data Model (important for Code Connect)
When designing the types, determine how children are modeled:
- **Data arrays** (`items: ItemData[]`, `columns: ColumnData[]`): for structured, typed content
  - Code Connect will use static examples (no `figma.children()`)
- **ReactNode children** (`children: ReactNode`): for compositional patterns
  - Code Connect will use `figma.children("*")`
- NEVER mix both: a component either accepts data arrays OR ReactNode children

## Accessibility (WCAG 2.1 AA)
- Use semantic HTML elements (`<nav>`, `<header>`, `<footer>`, `<section>`, `<main>`)
- Navigation lists: each item in its own `<li>`, no `role="menubar"` for site nav — use `aria-current="page"` on active item
- Accordion (WAI-ARIA APG): button inside `<h3>`, `aria-expanded`, `aria-controls` pointing to panel with `role="region"` + `aria-labelledby` back to button, unique IDs via `useId()`
- Tabs (WAI-ARIA APG): `role="tablist"` on container, `role="tab"` with `aria-selected`, `aria-controls` pointing to `role="tabpanel"` with `aria-labelledby`, roving `tabIndex` (0 on active, -1 on inactive), keyboard support (Arrow keys, Home, End)
- Every interactive element must have `focus-visible` styles
- Images: always provide `alt`; decorative icons use `aria-hidden="true"`
- Links with `href="#"`: add meaningful `aria-label`

## CSS Tokens
| Figma variable     | CSS prefix          |
|-------------------|---------------------|
| Color (primitives) | `--ds-gray-*`, `--ds-blue-*`, `--ds-red-*` |
| Color (semantic)  | `--ds-text-*`, `--ds-background-*`, `--ds-border-*` |
| Spacing           | `--ds-space-*`      |
| Border radius     | `--ds-radius-*`     |
| Typography        | `--ds-scale-*` (size), `--ds-family-*` (font) |
| Stroke            | `--ds-stroke-*`     |

> ⚠️ **Do NOT use `--ds-weight-*` tokens for `font-weight`** — they contain invalid `px` units and are silently ignored by browsers. Use raw values: `font-weight: 400`, `font-weight: 600`, `font-weight: 700`.

## File Checklist
Every component needs: `.types.ts`, `.module.css`, `.tsx`, `index.ts`, `.test.tsx`
Minimum 4 tests: renders, variants, interaction, accessibility

## Mandatory MCP Flow
When implementing from Figma:
1. `get_design_context` → layout structure, flex values
2. `get_metadata` → exact pixel dimensions
3. `get_variable_defs` → map to `--ds-*` tokens
4. `get_code_connect_map` → check existing mappings
5. Cross-check every CSS value against metadata
