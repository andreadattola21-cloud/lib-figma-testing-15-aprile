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

## 2. Mandatory Implementation Flow

When asked to implement a Figma frame, ALL of these steps are mandatory:

1. `get_design_context` — understand layout, flex values, spacing, tokens
2. `get_metadata` — extract exact pixel dimensions for EVERY node
3. `get_variable_defs` — map Figma variables to `--ds-*` tokens
4. `get_code_connect_map` — check for existing component mappings
5. Implement using existing components where possible
6. **Cross-check**: compare every CSS value against `get_metadata` dimensions
7. Generate only the delta (new components or new compositions)

Never skip `get_metadata`. Never guess pixel values.

## 3. Token Usage

| Figma variable category | CSS custom property prefix | Example |
|------------------------|---------------------------|---------|
| Color (primitives)     | `--ds-gray-*`, `--ds-blue-*`, `--ds-red-*` | `--ds-gray-800` |
| Color (semantic)       | `--ds-text-*`, `--ds-background-*`, `--ds-border-*`, `--ds-icon-*` | `--ds-text-default-default` |
| Spacing                | `--ds-space-*`            | `--ds-space-400` = 16px |
| Border radius          | `--ds-radius-*`           | `--ds-radius-200` = 8px |
| Typography size        | `--ds-scale-*`            | `--ds-scale-03` = 16px |
| Font family            | `--ds-family-*`           | `--ds-family-sans` |
| Font weight            | `--ds-weight-*`           | `--ds-weight-bold` |
| Stroke                 | `--ds-stroke-*`           | `--ds-stroke-border` = 1px |
| Shadow / depth         | `--ds-depth-*`            | `--ds-depth-200` |

Run `get_variable_defs` if unsure which token to use — never guess values.
If a semantic token resolves to `#NaN`, use the primitive color token instead.

## 4. Component Conventions

- Named exports only (`export function Button` not `export default Button`)
- Props interface extends the relevant HTML element attributes
- CSS Modules for all component styles (files named `*.module.css`)
- No `any` in TypeScript
- Always `import type { ... } from "react"` — never bare `React.HTMLAttributes`
- Accessibility: use semantic HTML, `aria-*` attributes, focus-visible styles
- Every interactive component handles keyboard events
- Always spread `...props` on root element to forward native HTML attributes

## 5. Code Connect Rules (CRITICAL)

### File format
- Extension: `.figma.tsx` (NEVER `.figma.ts` — JSX requires `.tsx`)
- Figma URLs: string literals only (template literals rejected by parser)
- Node IDs: from `get_code_connect_suggestions` `mainComponentNodeId` (NEVER instance IDs)

### Mapping strategy
- **Primitives with Figma properties**: use `figma.string()`, `figma.enum()`, `figma.boolean()`
- **Data-driven compositions** (props are arrays like `items[]`, `columns[]`): use static examples, NO `figma.children()`, NO `props` block
- **Components with ReactNode children**: use `figma.children("*")` or `figma.children("LayerName")`

### Callback props
ALL callback/event handler props MUST use `() => {}` in examples.
NEVER reference undefined variables like `navigate`, `setActiveTab`, `setOpenIndex`.

### Empty props
NEVER use `props: {}` (empty). Either map real properties or omit `props` entirely.

### The `figma.children()` rule
`figma.children()` returns `ReactNode[]`. ONLY use it when the React component
prop accepts `ReactNode` or `ReactNode[]`. If the prop accepts a data array
(e.g. `FooterLinkColumn[]`, `AccordionItemData[]`), use a static example instead.

### Child component nesting (MANDATORY)
> 📖 **Official Figma docs**: "The nested instance also must be connected separately."
> "Make sure to connect the backing component of that instance, not the instance itself."

When connecting a composition, the parent's Code Connect does NOT cover children.
Every Figma component visible in Dev Mode needs its own `figma.connect()` call.

Steps:
1. After creating parent Code Connect, call `get_code_connect_suggestions` on parent
2. For each unmapped child: create a React primitive if reusable, then a `.figma.tsx`
3. Simple children (bold text, single link) can be connected as native elements
4. Publish with `--skip-validation` (external library nodes may fail strict validation)
5. Verify: `get_code_connect_suggestions` should return empty list

### Conditional rendering in examples
> 📖 **Official Figma docs**: "Logical operators such as ternaries or conditionals
> will be output verbatim in your example code rather than executed."

Use `figma.boolean("PropName", { true: <Element />, false: undefined })` to
conditionally include elements. Do NOT use `{expr && <Tag/>}` or ternaries
with mapped props — the parser may reject them or output them as literal text.

## 6. File Placement

```
packages/components/src/
  primitives/    ← atomic, single-responsibility
  compositions/  ← combines multiple primitives
  layout/        ← pure layout wrappers (Flex, Grid, Stack)
  hooks/         ← shared React hooks
```

Every component needs: `.types.ts`, `.module.css`, `.tsx`, `.test.tsx`, `index.ts`

## 7. Layout — Never Guess Flex Values

- Call `get_design_context` with `disableCodeConnect: true` for raw layout values
- Extract EXACT flex properties from the output:
  - `flex-wrap` vs no wrap
  - `flex-[1_0_0]` → `flex: 1 0 0` (shrink value matters!)
  - `min-w-[300px]` → `min-width: 300px`
- Do NOT substitute your own values
- `flex-wrap` + `min-width` + `flex: 1 0 0` = natural reflow, no media queries needed

## 8. What NOT to do

- Do not import from `react-dom` directly in component files
- Do not use `style={{ ... }}` with hardcoded values
- Do not create duplicate abstractions — search existing components first
- Do not write component-level CSS that belongs in a global reset
- Do not add `!important` to any CSS rule
- Do not generate entire page implementations in one call —
  work section by section to avoid large-frame performance issues
- Do not assume `width: 100%` — check `get_metadata` for actual dimensions
