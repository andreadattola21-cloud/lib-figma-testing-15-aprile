---
name: generate-component
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

### Step 1 — Understand the design (mandatory MCP calls)

ALL of these MCP calls are **mandatory**. Never skip any.

1. **`get_design_context`** on the selected Figma frame.
   - Returns reference code (Tailwind-style) — read it to understand layout,
     flex values, spacing, and token usage. Do NOT copy verbatim.
   - Extract exact flex properties: `flex-wrap`, `flex: 1 0 0`, `min-width`, `gap`.
   - Do NOT substitute your own values — use exactly what Figma specifies.

2. **`get_metadata`** on the same node.
   - Returns exact pixel dimensions (width, height, x, y) for every child node.
   - Use these to set `max-width`, verify gap values, and confirm layout structure.
   - Do NOT assume `width: 100%` — check the actual frame width.

3. **`get_variable_defs`** to list all Figma variables used (tokens).
   - Map every Figma variable to its `--ds-*` CSS custom property.
   - If a variable resolves to `#NaN`, use the primitive color token instead.

4. **`get_code_connect_map`** to check if any child components already
   have Code Connect mappings — reuse them, do NOT recreate them.

### Step 2 — Classify the component

- **Primitive** if it is a single atomic element (Button, Input, Badge,
  Checkbox, Tag, Avatar, Spinner…)
  → place in `packages/components/src/primitives/[Name]/`
- **Composition** if it combines multiple primitives (Card, Modal, FormField,
  PageHeader, DataTable, Header, Footer, HeroBasic…)
  → place in `packages/components/src/compositions/[Name]/`
- **Layout** if it is a pure layout wrapper (Flex, Grid, Stack, Section)
  → place in `packages/components/src/layout/[Name]/`

### Step 3 — Create the files

Create these files in order:

**`[Name].types.ts`**
- Define a TypeScript interface extending the relevant HTML element's attributes:
  - Buttons: `ButtonHTMLAttributes<HTMLButtonElement>`
  - Divs/cards: `HTMLAttributes<HTMLDivElement>`
  - Sections/nav/header/footer: `HTMLAttributes<HTMLElement>`
- ALWAYS `import type { HTMLAttributes } from "react"` — never use `React.HTMLAttributes` without an explicit import
- Use semantic prop names (`isSelected` not `active`, `isLoading` not `loading`)
- Export every type used in props
- If the component renders a native `<button>` internally (e.g. CTA), expose button attributes via a `buttonProps` prop or directly in the interface
- Determine prop data model from the Figma structure:
  - If Figma uses "Slot" layers with repeated child instances → define a typed array prop (e.g. `items: ItemData[]`, `columns: ColumnData[]`)
  - If Figma uses direct children with no defined structure → use `children: ReactNode`
  - NEVER mix the two: a component either accepts data arrays OR ReactNode children

**`[Name].module.css`**
- NEVER hardcode colors, spacing, or typography values
- ALWAYS use `var(--ds-*)` custom properties from `@ds/tokens`
- **EXCEPTION — font-weight**: the `--ds-weight-*` tokens are broken (have `px` units). Use raw numeric values: `font-weight: 600` not `var(--ds-weight-semibold)`
- Use BEM-like class naming: `.button`, `.size-sm`, `.variant-primary`
- Only write CSS that directly implements the Figma design
- Cross-check every CSS value against `get_metadata` dimensions
- **Layout extraction**: read `get_design_context` output LITERALLY:
  - If it says `flex flex-wrap` → add `flex-wrap: wrap`
  - If it says `w-[262px]` → use `width: 262px`, not `flex: 1`
  - If it says `pt-[32px] pb-[160px] px-[32px]` → use separate padding properties, not shorthand
  - If it says `flex-[1_0_0]` → use `flex: 1 0 0` (not `flex: 1`)

**`[Name].tsx`**
- Named export only (no default export)
- Destructure props with defaults matching Figma's default variant
- Build `className` string from style modules, never use inline styles for design values
- Include `aria-*` attributes for accessibility (see rules below)
- No hardcoded strings, no hardcoded pixel values
- Spread `...props` on the root element to forward native HTML attributes

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
- Minimum 4 tests per component

### Step 4 — Update the library entry point

Add the named export to `packages/components/src/index.ts`:
```ts
export { ComponentName } from "./primitives/ComponentName";
export type { ComponentNameProps } from "./primitives/ComponentName";
```

### Step 5 — Create Code Connect (CRITICAL — read carefully)

Create `packages/code-connect/src/[Name].figma.tsx` (MUST be `.figma.tsx`, NEVER `.figma.ts`).

**Get the correct node ID:**
1. Call `get_code_connect_suggestions` with the Figma URL
2. Use the `mainComponentNodeId` from the response — NEVER use instance node IDs from the URL

**Determine the mapping strategy based on component type:**

**A. Primitive with Figma component properties** (Button, Badge, Input…):
```tsx
import figma from "@figma/code-connect";
import { Button } from "@ds/components";

figma.connect(
  Button,
  "https://www.figma.com/design/FILE_KEY?node-id=MAIN_COMPONENT_NODE_ID",
  {
    props: {
      label: figma.string("Label"),
      variant: figma.enum("Variant", {
        Primary: "primary",
        Secondary: "secondary",
      }),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ label, variant, disabled }) => (
      <Button variant={variant} disabled={disabled}>
        {label}
      </Button>
    ),
  }
);
```

**B. Data-driven composition** (Footer, Header, CardGrid…):
Components that accept ARRAYS of data objects (not ReactNode children):
```tsx
import figma from "@figma/code-connect";
import { Footer } from "@ds/components";

figma.connect(
  Footer,
  "https://www.figma.com/design/FILE_KEY?node-id=MAIN_COMPONENT_NODE_ID",
  {
    // NO props mapping — use a complete static example
    example: () => (
      <Footer
        logoSrc="/logo.svg"
        columns={[
          {
            title: "Product",
            links: [
              { label: "Features", href: "/features" },
              { label: "Pricing", href: "/pricing" },
            ],
          },
        ]}
      />
    ),
  }
);
```

**C. Composition with ReactNode children** (PageLayout, CardGrid with slot children…):
Components whose props accept `ReactNode` children:
```tsx
figma.connect(Component, url, {
  props: {
    children: figma.children("*"),
  },
  example: ({ children }) => <Component>{children}</Component>,
});
```

#### ⛔ Code Connect ANTI-PATTERNS (never do these):

| Anti-pattern | Why it fails | Correct approach |
|---|---|---|
| `figma.children("Slot")` on a data-driven component | `figma.children()` returns `ReactNode[]` but the prop expects `DataObject[]` | Use static example with real data |
| `props: {}` (empty) | Provides no value to developers viewing in Figma | Either map real properties or omit `props` entirely |
| Referencing undefined variables (`navigate`, `setIndex`) | TypeScript compilation error in typecheck | Use `() => {}` for all callback props |
| Using template literals for Figma URL | Code Connect parser rejects template literals | Use string literal: `"https://..."` |
| Using instance node ID from URL | `get_context_for_code_connect` fails with instance IDs | Use `mainComponentNodeId` from `get_code_connect_suggestions` |
| `.figma.ts` extension with JSX | TypeScript won't parse JSX in `.ts` files | Always use `.figma.tsx` |

### Step 5b — Code Connect child components (MANDATORY for compositions)

**Official Figma docs: "The nested instance also must be connected separately."**

After creating the parent Code Connect, you MUST also connect every child library
component. The parent mapping does NOT automatically cover children in Dev Mode.

1. Call `get_code_connect_suggestions` on the parent node
2. Review the returned list of unmapped children (each has `mainComponentNodeId`)
3. For EACH unmapped child:
   a. Call `get_context_for_code_connect` with the child's `mainComponentNodeId`
   b. If the child is reusable, create a standalone React primitive for it
   c. Create a `.figma.tsx` Code Connect file with the proper Figma property mappings
   d. For very simple children (e.g. bold text), connect as a native element:
      ```tsx
      figma.connect("https://...?node-id=MAIN_ID", {
        props: { text: figma.string("Text") },
        example: ({ text }) => <strong>{text}</strong>,
      });
      ```
4. Publish with `--skip-validation` (needed when some nodes are from external libraries)
5. Verify: call `get_code_connect_suggestions` again — list should be empty

**Do NOT skip this step.** A composition with unconnected children provides
incomplete Code Connect coverage in Figma Dev Mode.

### Step 6 — Cross-check and verify

1. **Cross-check CSS against metadata**: Compare every CSS value (gap, padding, max-width, border-radius) against `get_metadata` pixel dimensions
2. Run typecheck:
   ```bash
   npx turbo run typecheck
   ```
3. Run tests:
   ```bash
   npx turbo run test
   ```
4. Fix any TypeScript or test errors before declaring done.

### Step 7 — Update preview app

Add a showcase page in `packages/preview/src/pages/[Name]Showcase.tsx` and register it in `App.tsx`.

**Icon and image assets**: When the Figma design contains icons or images, use the **asset URLs from `get_design_context`** (e.g. `const img = "https://www.figma.com/api/mcp/asset/..."`). Render them with `<img>` tags in the preview — do NOT recreate SVGs by hand, as they will look different from the Figma design.

## Accessibility (non-negotiable)
- Use semantic HTML: `<nav>`, `<header>`, `<footer>`, `<section>`, `<main>`
- Site navigation: each item in its own `<li>`, use `aria-current="page"` on active — NEVER `role="menubar"` for site navigation
- Accordion: button trigger inside `<h3>`, `aria-expanded`, `aria-controls` → panel with `role="region"` + `aria-labelledby` → button. Generate IDs with `useId()`
- Tabs: `role="tablist"`, `role="tab"` with `aria-selected` + `aria-controls`, `role="tabpanel"` with `aria-labelledby`, roving `tabIndex`, Arrow/Home/End keyboard support
- All interactive elements need `:focus-visible` styles
- Images need `alt`; decorative icons use `aria-hidden="true"`

## Rules (non-negotiable)
- No hardcoded values — all values from `var(--ds-*)` tokens
- No default exports
- No `any` in TypeScript
- No new icon packages — use existing icons in `src/icons/`
- Never import `react` in files that only use JSX (React 17+ automatic runtime)
- Always import types explicitly: `import type { HTMLAttributes } from "react"` — never bare `React.HTMLAttributes`
- Every new primitive needs at minimum 4 unit tests
- Tests MUST cover accessibility: ARIA attributes, keyboard interaction, landmark roles
