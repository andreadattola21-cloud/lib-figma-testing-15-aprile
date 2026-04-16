# Figma MCP — Lessons Learned

These rules were learned from real implementation mistakes and must be
followed every time components are generated from Figma.

---

## 1. ALWAYS verify implementation against `get_metadata`

- `get_metadata` returns exact pixel dimensions (width, height, x, y) for every node.
- Use these to set `max-width`, verify gap values, and confirm layout structure.
- Do NOT assume `width: 100%` — check the actual frame width from metadata.
- Cross-check every CSS value against the metadata before considering implementation done.

## 2. CSS fundamentals checklist

- Always add `box-sizing: border-box` on containers with padding + width.
- Always reset `body { margin: 0 }` in preview/app shells.
- Use `flex-shrink: 1` (default) unless the design explicitly prevents shrinking.
- Don't invent breakpoints — Figma designs are static. Only add responsive
  behavior where truly needed, and document the reasoning.

## 3. Code Connect — Extension and URL rules

- Files containing JSX must use `.figma.tsx` extension, not `.ts`.
- Figma URLs must be string literals — template literals are rejected by the parser.
- Node IDs must come from `get_code_connect_suggestions`, never use placeholders
  or instance IDs from URLs.
- Always run `npx figma connect publish` and verify success before moving on.
- Code Connect is part of the generate-component flow, not an afterthought.

## 4. Code Connect — Data-driven vs children components

This is the most common mistake. BEFORE writing a Code Connect file, check
the component's `.types.ts`:

- If a prop is `ReactNode` or `ReactNode[]` → use `figma.children()`
- If a prop is a data array (e.g. `FooterLinkColumn[]`, `AccordionItemData[]`,
  `NavItem[]`) → use a **static example** with realistic data
- `figma.children()` returns `ReactNode[]` — it CANNOT be passed to a prop
  that expects a typed data array

Example of the WRONG approach:
```tsx
// ❌ Footer accepts `columns: FooterLinkColumn[]`, NOT ReactNode children
props: { children: figma.children("Slot") },
example: ({ children }) => <Footer>{children}</Footer>,
```

Correct approach:
```tsx
// ✅ Static example with real data matching the types
example: () => (
  <Footer
    columns={[{ title: "Product", links: [{ label: "Features", href: "#" }] }]}
  />
),
```

## 5. Code Connect — Callback props

All callback/event handler props MUST use noop `() => {}` in examples.
NEVER reference undefined variables:

```tsx
// ❌ WRONG — navigate and setOpenIndex don't exist
onButtonClick={() => navigate("/checkout")}
onToggle={(i) => setOpenIndex(i)}

// ✅ CORRECT
onButtonClick={() => {}}
onToggle={() => {}}
```

## 6. Code Connect — Empty props

NEVER use `props: {}` (empty object). It provides no value to developers.
Either map real Figma properties or omit the `props` block entirely.

## 7. NEVER guess flex/layout values — extract from `get_design_context`

- Call `get_design_context` with `disableCodeConnect: true` to get raw
  Tailwind classes that encode the exact Figma auto-layout properties.
- Key flex properties to extract literally from the output:
  - `flex-wrap` vs no wrap
  - `flex-[1_0_0]` → `flex: 1 0 0` (note: shrink value matters!)
  - `min-w-[300px]` → `min-width: 300px`
- Do NOT substitute your own values (e.g. `flex: 1 1 0` when Figma says `1 0 0`).
- Do NOT add `flex-direction: column` in a media query if Figma uses
  `flex-wrap` for natural reflow — wrap handles the responsive behavior.

## 8. Mandatory implementation verification flow

1. `get_design_context` → understand structure and tokens
2. `get_metadata` → extract exact dimensions for every node
3. `get_variable_defs` → map Figma variables to `--ds-*` tokens
4. `get_code_connect_map` → check for existing component mappings
5. Read component `.types.ts` to understand prop data model
6. Implement component + CSS
7. **Cross-check**: compare every CSS value against metadata dimensions
8. `get_code_connect_suggestions` → get real node IDs (mainComponentNodeId)
9. Create Code Connect (`.figma.tsx`) following data-driven vs children rules
10. Typecheck: `npx tsc --noEmit` in code-connect package
11. Publish and verify success
