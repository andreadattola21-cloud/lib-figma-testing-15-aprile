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

## 7. Mandatory implementation verification flow
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
