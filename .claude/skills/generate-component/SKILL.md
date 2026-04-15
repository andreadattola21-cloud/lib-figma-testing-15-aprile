---
identifier: generate-component
description: >
  Generate a new React component for the design system from a Figma
  selection. Creates the component file, CSS Module, types file, barrel
  index, unit test, Storybook story, and Code Connect mapping.
  Use when asked to "generate", "create", or "implement" a component from Figma.
---

# Skill: Generate Component from Figma

## Purpose
Full pipeline: Figma selection → production-ready React component in
`packages/components`, with story and Code Connect file.

## When to use
- "Generate the [ComponentName] component from Figma"
- "Implement this Figma frame as a React component"
- "Create a [primitive|composition] from the selected Figma frame"

## Instructions

### Step 1 — Understand the design

1. Call `get_design_context` on the selected Figma frame.
   - This returns React + CSS structure — read it to understand the layout,
     not to copy it verbatim
2. Call `get_screenshot` to capture the visual reference.
3. Call `get_variable_defs` to list all Figma variables used (tokens).
4. Call `get_code_connect_map` to check if any child components already
   have Code Connect mappings — reuse them, do NOT recreate them.

### Step 2 — Classify the component

- **Primitive** if it is a single atomic element (Button, Input, Badge,
  Checkbox, Tag, Avatar, Spinner…)
  → place in `packages/components/src/primitives/[Name]/`
- **Composition** if it combines multiple primitives (Card, Modal, FormField,
  PageHeader, DataTable…)
  → place in `packages/components/src/compositions/[Name]/`
- **Layout** if it is a pure layout wrapper (Flex, Grid, Stack, Section)
  → place in `packages/components/src/layout/[Name]/`

### Step 3 — Create the files

Create these files in order:

**`[Name].types.ts`**
- Define a TypeScript interface extending the relevant HTML element's attributes
- Use semantic prop names (`isSelected` not `active`, `isLoading` not `loading`)
- Export every type used in props

**`[Name].module.css`**
- NEVER hardcode colors, spacing, or typography values
- ALWAYS use `var(--ds-*)` custom properties from `@ds/tokens`
- Use BEM-like class naming: `.button`, `.size-sm`, `.variant-primary`
- Only write CSS that directly implements the Figma design

**`[Name].tsx`**
- Named export only (no default export)
- Destructure props with defaults matching Figma's default variant
- Build `className` string from style modules, never use inline styles
- Include `aria-*` attributes for accessibility
- No hardcoded strings, no hardcoded pixel values

**`index.ts`**
```ts
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName.types";
```

**`[Name].test.tsx`**
- Test: renders without crashing
- Test: each boolean prop toggles the expected class/attribute
- Test: interactive events (click, change, keydown)
- Test: accessibility (disabled state, aria attributes)
- Use `@testing-library/react` and `userEvent`

**`[Name].stories.tsx`** in `packages/storybook/stories/`
- Title: `"Primitives/Name"` or `"Compositions/Name"`
- Args matching every prop in the types file
- Stories for each variant, size, state
- An `AllVariants` story

### Step 4 — Update the library entry point

Add the named export to `packages/components/src/index.ts`:
```ts
export { ComponentName } from "./primitives/ComponentName";
export type { ComponentNameProps } from "./primitives/ComponentName";
```

### Step 5 — Create Code Connect

Follow the **figma-code-connect** skill to create
`packages/code-connect/src/[Name].figma.ts`.

### Step 6 — Verify

Run:
```bash
npm run typecheck --filter=@ds/components
npm run test --filter=@ds/components
```

Fix any TypeScript or test errors before declaring done.

## Rules (non-negotiable)
- No hardcoded values — all values from `var(--ds-*)` tokens
- No default exports
- No `any` in TypeScript
- No new icon packages — use existing icons in `src/icons/`
- Never import `react` in files that only use JSX (React 17+ automatic runtime)
- Every new primitive needs at minimum 4 unit tests
