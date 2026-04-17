---
description: "Use when implementing Figma designs via MCP. Covers layout extraction, metadata verification, token mapping, Code Connect rules, and anti-patterns learned from real mistakes."
applyTo: ["packages/code-connect/**", "packages/components/src/**"]
---
# Figma MCP Implementation Rules

> 📖 **Source**: Official Figma developer workflows (Jake Albaugh, Figma Developer Advocate)
> plus practical experience from this project.

## 0. Recommended MCP tool sequence

> 📖 **From official Figma DevRel**: The recommended sequence for implementing a Figma design is:

1. `get_metadata` → high-level structure, exact pixel dimensions
2. `get_screenshot` → visual reference for verification
3. `get_code_connect_map` → existing component mappings to reuse
4. `get_variable_defs` → token definitions with **code syntax** (the code-form name, not Figma display name)
5. `get_design_context` → full reference code (Tailwind-style) with inline Code Connect and variable references

**NEVER skip `get_screenshot`** — it is the primary way to verify your implementation matches the design.

### Annotations are machine-readable context
> 📖 **Official**: Figma annotations (content categories, property callouts, asset references)
> are passed through MCP responses. Designers use them to describe design intent
> that isn't visible in the layout alone (e.g. "this content comes from the CMS",
> "this image is in the brand-approved drive"). **Read and follow them.**

### Variable code syntax
> 📖 **Official**: Variables in Figma can have platform-specific **code syntax** (web, iOS, Android).
> When inspecting, `get_variable_defs` returns the code-form name (e.g. `--ds-background-default-secondary-hover`)
> not just the Figma display name. Always use the code syntax form in your implementation.

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

🔧 **From practical experience** (parser errors, not in Figma docs):
- Files containing JSX must use `.figma.tsx` extension, not `.ts`
- Figma URLs must be string literals — template literals are rejected by the parser
- Optional chaining on mapped props (`title?.text`) causes `ParserError`
- `{expr && <Tag/>}` may crash the parser — use `figma.boolean` mapping instead

> 📖 **Official Figma docs**: "Make sure to connect the backing component of that instance, not the instance itself."

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

🔧 **From practical experience**:
- All callback props (onClick, onToggle, onTabChange) MUST use `() => {}` — referencing undefined vars is a TS error
- NEVER use `props: {}` (empty object) — either map real Figma properties or omit `props`

## 7. Code Connect — conditional rendering

> 📖 **Official Figma docs**: "Logical operators such as ternaries or conditionals
> will be output verbatim in your example code rather than executed."

Use `figma.boolean("PropName", { true: <Element />, false: undefined })` instead.

## 8. Child component Code Connect — MANDATORY nesting rule

> 📖 **Official Figma docs**: "The nested instance also must be connected separately."

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

### Mandatory implementation verification flow:
1. `get_metadata` → high-level structure and exact dimensions
2. `get_screenshot` → visual reference to verify against
3. `get_code_connect_map` → check for existing component mappings
4. `get_variable_defs` → map Figma variables to `--ds-*` tokens (use code syntax form)
5. `get_design_context` → understand layout, tokens, and inline Code Connect
6. Read component `.types.ts` → understand prop data model
7. Implement component + CSS
8. **Cross-check**: compare every CSS value against metadata dimensions
9. **Visual check**: compare rendered output against `get_screenshot`
10. `get_code_connect_suggestions` → get real node IDs (mainComponentNodeId)
11. Create Code Connect (`.figma.tsx`) following data-driven vs children rules
12. Typecheck: `npx tsc --noEmit`
13. Publish and verify success

## 9. Beyond UI generation — other MCP use cases

> 📖 **From official Figma DevRel**: The MCP server is not just for UI code generation.
> Use it for:
> - **Project planning**: analyze a Figma section to understand scope and estimate work
> - **Token auditing**: verify that all variables used in the design have corresponding CSS tokens
> - **Component usage audit**: check which design system components are used and whether they have Code Connect
> - **Accessibility review**: inspect semantic structure, contrast, and aria patterns from design intent
> - **Design system health**: compare Figma library components against codebase implementations

## 10. Instruct your agents at workspace level

> 📖 **From official Figma DevRel**: "Instruct your agents — provide workspace-level context
> about implementation details."

Your agentic tools (Copilot, Claude, Cursor) should have:
- A defined MCP tool sequence to follow for every Figma implementation
- Rules about which tokens to use and how to map them
- Code Connect conventions (file extension, node ID source, anti-patterns)
- Knowledge of the design system structure and component categories
- Information about known bugs and workarounds (e.g. font-weight token bug)

This is exactly what these instruction files provide — keep them updated as the project evolves.

## 11. "Ready for Dev" and design handoff

> 📖 **Official**: Designers mark sections as "Ready for Dev" in Figma.
> Figma AI detects improvement opportunities (e.g. unnamed layers) during this step.
> Developers see a timeline view of only ready-for-dev sections.
> The "Focus View" scopes inspection to the marked section.

When implementing from MCP, always verify that the node you're implementing has been
marked as ready for dev. If the metadata shows the section is still in draft,
coordinate with the designer before proceeding.

## 12. Code Connect UI vs Code Connect Snippets

> 📖 **Official**: There are two ways to create Code Connect:

| Method | Depth | Effort | Where defined | Best for |
|--------|-------|--------|---------------|----------|
| **Code Connect Snippets** (`.figma.tsx` files) | Deep — maps properties, variants, children | Higher | Codebase | Core design system components with many variants |
| **Code Connect UI** (in Figma) | Shallow — maps component to file | Lower | Figma UI | Wider coverage, quick library-to-codebase linking |

This project uses **Code Connect Snippets** for production components.
The Code Connect UI is useful for rapid initial mapping before adding full snippets.

## 13. Simple Design System (SDS) reference

> 📖 **Official**: The Simple Design System (github.com/figma/sds) is Figma's reference
> implementation showing React components, Storybook, Code Connect templates,
> and REST API variable sync. Also has a Stencil/web components version.
> Use it as a reference for conventions and patterns.
