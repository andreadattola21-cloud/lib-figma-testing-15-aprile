---
description: "Use when implementing Figma designs via MCP. Covers layout extraction, metadata verification, token mapping, and Code Connect publishing. Critical lessons from real implementation mistakes."
applyTo: "packages/code-connect/**"
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

## 3. Code Connect must be verified immediately
- Files containing JSX must use `.figma.tsx` extension, not `.ts`
- Figma URLs must be string literals — template literals are rejected by the parser
- Node IDs must come from `get_code_connect_suggestions`, never use placeholders
- Always run `npx figma connect publish` and verify success before moving on
- Instance vs Component Set IDs: instance node IDs fail with `get_context_for_code_connect`; use `get_code_connect_suggestions` to discover `mainComponentNodeId` values

## 4. NEVER guess flex/layout values — extract from `get_design_context`
- Call `get_design_context` with `disableCodeConnect: true` to get raw Tailwind classes encoding exact Figma auto-layout properties
- Key flex properties to extract literally from the output:
  - `flex-wrap` vs no wrap
  - `flex-[1_0_0]` → `flex: 1 0 0` (note: shrink value matters!)
  - `min-w-[300px]` → `min-width: 300px`
- Do NOT substitute your own values (e.g. `flex: 1 1 0` when Figma says `1 0 0`)
- The combination of `flex-wrap` + `min-width` + `flex: 1 0 0` creates natural reflow without any media query

## 5. Mandatory implementation verification flow
1. `get_design_context` → understand structure and tokens
2. `get_metadata` → extract exact dimensions for every node
3. `get_variable_defs` → map Figma variables to `--ds-*` tokens
4. `get_code_connect_map` → check for existing component mappings
5. Implement component + CSS
6. **Cross-check**: compare every CSS value against metadata dimensions
7. `get_code_connect_suggestions` → get real node IDs
8. Create + publish Code Connect (`.figma.tsx`)
9. Verify in preview that the result matches the Figma screenshot
