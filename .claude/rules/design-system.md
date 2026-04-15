# Design System — Custom MCP Rules

These rules apply to every code generation session using Figma MCP.
They encode the team conventions so the AI produces consistent output
without needing repeated instructions.

---

## 1. General

- Always use components from `@ds/components`. Never create one-off HTML
  elements with inline styles when a component exists.
- Always use `var(--ds-*)` CSS custom properties. Never hardcode colors,
  spacing, font sizes, or border radii.
- Always check `get_code_connect_map` before generating a component —
  if a mapping exists, reuse the existing component.
- Prefer composition over duplication: if a new design looks like an
  existing component with minor variations, extend via props.

## 2. Implementation Flow

When asked to implement a Figma frame:

1. `get_design_context` — understand layout and structure
2. `get_screenshot` — verify visual fidelity
3. `get_variable_defs` — extract all tokens used
4. `get_code_connect_map` — check for existing component mappings
5. Implement using existing components where possible
6. Generate only the delta (new components or new compositions)

## 3. Token Usage

| Figma variable category | CSS custom property prefix |
|------------------------|---------------------------|
| Color                  | `--ds-color-*`            |
| Spacing                | `--ds-space-*`            |
| Border radius          | `--ds-radius-*`           |
| Typography             | `--ds-font-*`, `--ds-line-height-*` |
| Shadow                 | `--ds-shadow-*`           |
| Transition             | `--ds-transition-*`       |

Run `get_variable_defs` if unsure which token to use — never guess values.

## 4. Component Conventions

- Named exports only (`export function Button` not `export default Button`)
- Props interface extends the relevant HTML element attributes
- CSS Modules for all component styles (files named `*.module.css`)
- No `any` in TypeScript
- Accessibility: use semantic HTML, `aria-*` attributes, focus-visible styles
- Every interactive component handles keyboard events

## 5. File Placement

```
packages/components/src/
  primitives/    ← atomic, single-responsibility
  compositions/  ← combines multiple primitives
  layout/        ← pure layout wrappers (Flex, Grid, Stack)
  hooks/         ← shared React hooks
```

## 6. Assets

- If `get_design_context` returns a `localhost:*` source for an image or
  SVG, use it directly as the `src` — do not re-import from a package.
- Do not add new icon packages. Use the icons available in
  `packages/components/src/icons/`.

## 7. What NOT to do

- Do not import from `react-dom` directly in component files
- Do not use `style={{ ... }}` with hardcoded values on any element
- Do not create duplicate abstractions — search existing components first
- Do not write component-level CSS that belongs in a global reset
- Do not add `!important` to any CSS rule
- Do not generate entire page implementations in one call —
  work section by section to avoid large-frame performance issues
