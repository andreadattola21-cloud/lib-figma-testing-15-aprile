---
description: "Use when generating, creating, or editing React components for the design system. Covers accessibility, typing, CSS tokens, and component structure."
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
| Color             | `--ds-color-*` or `--ds-gray-*`, `--ds-blue-*`, etc. |
| Spacing           | `--ds-space-*`      |
| Border radius     | `--ds-radius-*`     |
| Typography        | `--ds-scale-*` (size), `--ds-family-*` (font) |
| Stroke            | `--ds-stroke-*`     |

## File Checklist
Every component needs: `.types.ts`, `.module.css`, `.tsx`, `index.ts`, `.test.tsx`
Minimum 4 tests: renders, variants, interaction, accessibility
