---
description: "Use when implementing Figma designs via MCP. Covers layout extraction, metadata verification, token mapping, Code Connect rules, and anti-patterns learned from real mistakes."
applyTo: ["packages/code-connect/**", "packages/components/src/**"]
---
# Figma MCP Implementation Rules

## 1. ALWAYS verify implementation against `get_metadata`
- `get_metadata` returns exact pixel dimensions (width, height, x, y) for every node
- Use these to set `max-width`, verify gap values, and confirm layout structure
- Do NOT assume `width: 100%` — check the actual frame width from metadata
- Cross-check every CSS value against the metadata before considering implementation done

## 2. CSS fundamentals checklist
- Always add `box-sizing: border-box` on containers with padding + width
- Always reset `body { margin: 0 }` in preview/app shells
- Use `flex-shrink: 1` (default) unless the design explicitly prevents shrinking
- Don't invent breakpoints — Figma designs are static. Only add responsive behavior where truly needed

## 2b. Layout values — extract literally from `get_design_context` (CRITICAL)
- **`flex-wrap`**: if Figma says `flex flex-wrap`, you MUST add `flex-wrap: wrap` — never omit it
- **Fixed widths**: if Figma specifies `w-[262px]` on a child, use `width: 262px` — not `flex: 1`
- **`flex: 1 0 0` vs `flex: 1`**: read the EXACT shorthand from Tailwind output. `flex-[1_0_0]` means `flex: 1 0 0` (shrink=0), NOT `flex: 1` (which is `flex: 1 1 0`)
- **min-width**: if Figma says `min-w-[240px]`, set `min-width: 240px`
- **Gap on the slot/grid container**: read the gap from the direct parent container, not the section wrapper
- **Padding asymmetry**: Figma may use `pt-[32px] pb-[160px] px-[32px]` — do NOT simplify to `padding: 32px`

## 2c. Font-weight — known `--ds-weight-*` token bug
The `--ds-weight-*` tokens in `tokens.css` include invalid `px` units (e.g. `600px`).
Browsers silently ignore `font-weight: 600px` and fall back to `normal` (400).
**Always use raw numeric font-weight values**: `font-weight: 600`, NOT `var(--ds-weight-semibold)`.

## 3. NEVER guess flex/layout values — extract from `get_design_context`
- Call `get_design_context` with `disableCodeConnect: true` to get raw Tailwind classes encoding exact Figma auto-layout properties
- Key flex properties to extract literally from the output:
  - `flex-wrap` vs no wrap
  - `flex-[1_0_0]` → `flex: 1 0 0` (note: shrink value matters!)
  - `min-w-[300px]` → `min-width: 300px`
- Do NOT substitute your own values (e.g. `flex: 1 1 0` when Figma says `1 0 0`)
- The combination of `flex-wrap` + `min-width` + `flex: 1 0 0` creates natural reflow without any media query

## 4. Code Connect file rules
- Files containing JSX must use `.figma.tsx` extension, not `.ts`
- Figma URLs must be string literals — template literals are rejected by the parser
- Node IDs must come from `get_code_connect_suggestions` `mainComponentNodeId`, never use instance node IDs from URLs
- Always run `npx figma connect publish` and verify success before moving on

## 5. Code Connect — data-driven vs children (CRITICAL)

Before writing Code Connect, read the component's `.types.ts` to determine the prop type:

| Prop type | Code Connect approach | Example |
|---|---|---|
| `ReactNode` / `ReactNode[]` | Use `figma.children("*")` or `figma.children("LayerName")` | `children: figma.children("*")` |
| Data array (`Item[]`, `Column[]`) | Static example with realistic data, NO `figma.children()` | `items={[{ title: "FAQ", content: "..." }]}` |
| Primitive values | `figma.string()`, `figma.enum()`, `figma.boolean()` | `label: figma.string("Label")` |

`figma.children()` returns `ReactNode[]` — it CANNOT be passed to a prop that expects a typed data array.

## 6. Code Connect — callback and empty props
- All callback props (onClick, onToggle, onTabChange) MUST use `() => {}` — NEVER reference undefined variables
- NEVER use `props: {}` (empty object) — either map real Figma properties or omit `props`

## 8. Child component Code Connect — MANDATORY nesting rule

**Official Figma docs: "The nested instance also must be connected separately."**

When creating a Code Connect for a composition (Footer, Header, Card Grid, etc.),
the parent's mapping does NOT automatically cover child library components.
Each Figma component visible in Dev Mode needs its own `figma.connect()` call.

### Workflow for child components:
1. After creating the parent Code Connect, call `get_code_connect_suggestions` on the parent node
2. The response lists all unmapped child components with their `mainComponentNodeId`
3. For EACH child component:
   a. Determine if it warrants a standalone React primitive (e.g. TextLinkList, TextLinkListItem)
   b. If yes → create the primitive in `packages/components/src/primitives/[Name]/`
   c. Create a `.figma.tsx` Code Connect file mapping Figma properties to React props
   d. If the child is very simple (e.g. `<strong>` text), connect it as a native element:
      ```tsx
      figma.connect("https://...?node-id=MAIN_ID", {
        props: { text: figma.string("Text") },
        example: ({ text }) => <strong>{text}</strong>,
      });
      ```
4. Publish ALL mappings together with `--skip-validation` (needed when some nodes are from external libraries)

### Key rules:
- `figma.children("*")` in the parent references child instances — those children MUST have their own Code Connect
- `figma.instance("PropName")` in the parent also requires the swapped component to be connected
- External library components (not defined in the current file) may need `--skip-validation` to publish
- NEVER leave child components unmapped — check `get_code_connect_suggestions` until the response is empty
1. `get_design_context` → understand structure and tokens
2. `get_metadata` → extract exact dimensions for every node
3. `get_variable_defs` → map Figma variables to `--ds-*` tokens
4. `get_code_connect_map` → check for existing component mappings
5. Read component `.types.ts` → understand prop data model
6. Implement component + CSS
7. **Cross-check**: compare every CSS value against metadata dimensions
8. `get_code_connect_suggestions` → get real node IDs (mainComponentNodeId)
9. Create Code Connect (`.figma.tsx`) following data-driven vs children rules
10. Typecheck: `npx tsc --noEmit`
11. Publish and verify success
