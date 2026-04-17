# Figma File Structure Guide for Designers

> **Audience**: Designers creating Figma files that will be consumed by AI agents
> (Copilot, Claude, Cursor) via the Figma MCP server.
>
> **Source**: [Official Figma MCP documentation — Structure your Figma file](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/)

---

## Why this matters

When developers use AI agents to implement designs, the agent reads your Figma file
through the MCP server. The better your file is structured, the more accurate the
generated code will be — fewer rounds of fixes, fewer mismatches.

---

## 1. Use Components (not detached frames)

- **Always define reusable elements as Components** in Figma.
- Components get recognized by the MCP server and matched to existing code via Code Connect.
- Detached instances are treated as anonymous frames — the agent won't know they map
  to an existing `<Button>`, `<Badge>`, or `<Card>`.

### Best practices:
- Build from the team library — don't copy-paste and detach.
- If you need a variant that doesn't exist, extend the component set rather than
  detaching and modifying.
- Use instance overrides, not detached copies.

---

## 2. Use Variables and Styles (design tokens)

- **Bind all colors, spacing, border-radius, and typography to Variables**.
- The MCP server returns variable code syntax (e.g. `--ds-space-400`, `--ds-background-default-primary`)
  which maps directly to CSS custom properties.
- Hard-coded hex values or pixel values force the developer/agent to guess which token to use.

### Variables checklist:
| Property | Should use Variable? | Example token |
|----------|---------------------|---------------|
| Fill color | ✅ Always | `background/default/primary` |
| Text color | ✅ Always | `text/default/default` |
| Border color | ✅ Always | `border/default/default` |
| Spacing (padding, gap) | ✅ Always | `space/400` (= 16px) |
| Border radius | ✅ Always | `radius/200` (= 8px) |
| Font size | ✅ Always | `scale/03` (= 16px) |
| Font weight | ✅ Always | `weight/bold` |
| Stroke width | ✅ Always | `stroke/border` |

### Code Syntax:
Set the **code syntax** on each variable so the MCP returns the exact CSS custom property name.
Go to: Variable → Edit → Code Syntax → Web → enter the CSS name (e.g. `--ds-space-400`).

---

## 3. Use Auto Layout (not absolute positioning)

- **All containers should use Auto Layout** — this maps directly to CSS `flexbox`.
- Avoid absolute positioning unless truly needed for overlapping elements.
- The MCP reads Auto Layout properties (direction, gap, padding, alignment) and
  translates them to flex properties. Manual positioning produces approximate CSS
  that often doesn't match.

### Auto Layout properties the MCP reads:
| Figma property | CSS equivalent |
|---------------|----------------|
| Direction: Horizontal | `flex-direction: row` |
| Direction: Vertical | `flex-direction: column` |
| Gap | `gap: Xpx` |
| Padding (per side) | `padding-top`, `padding-right`, etc. |
| Alignment | `align-items`, `justify-content` |
| Fill container | `flex: 1 0 0` or `width: 100%` |
| Hug contents | `width: fit-content` |
| Wrap | `flex-wrap: wrap` |
| Min width | `min-width: Xpx` |

---

## 4. Use Semantic Layer Names

- **Name every layer meaningfully** — avoid "Frame 427", "Group 3", "Rectangle 12".
- The MCP passes layer names to the agent. Semantic names like "hero-title",
  "nav-pill-list", "cta-button-group" help the agent understand intent.
- The agent uses layer names to decide HTML element types, CSS class names, and
  component boundaries.

### Naming conventions:
| ❌ Bad | ✅ Good |
|--------|---------|
| Frame 427 | hero-section |
| Group 3 | nav-pill-list |
| Rectangle 12 | card-background |
| Text | page-title |
| Instance | primary-cta |

---

## 5. Use Annotations

- **Add Figma annotations** to convey information that isn't visible in the layout:
  - Content sources ("this text comes from the CMS")
  - Behavior notes ("this panel opens on click, not hover")
  - Asset references ("this icon is from the Lucide library")
  - Responsive behavior ("this wraps on mobile")
  - States not shown ("hover and pressed states are in the component set")

- Annotations are machine-readable — the MCP server passes them through to the agent.
- Designers who annotate their files get significantly better AI output.

---

## 6. Mark Sections as "Ready for Dev"

- **Use Figma's "Ready for Dev" marker** to signal that a section is complete.
- Developers (and agents) see a timeline of ready sections in Dev Mode.
- The "Focus View" scopes inspection to the marked section, reducing noise.
- **Do not mark sections as ready if they contain placeholder content, missing states,
  or unfinished interactions.**

---

## 7. Build Complete Component Sets (variants)

- **Define all states and variants** in the component set:
  - Default, Hover, Pressed, Focused, Disabled
  - Size variants (sm, md, lg)
  - Visual variants (primary, secondary, outline, ghost)
- The agent reads component properties (variant names, boolean toggles, text properties)
  and maps them to React props.
- Missing variants = missing code paths.

### Recommended component properties:
| Property type | Use for | Example |
|--------------|---------|---------|
| Variant | Visual style, size | `Variant: Primary / Secondary` |
| Boolean | Toggle states | `Disabled: true/false`, `Has Icon: true/false` |
| Text | Editable labels | `Label`, `Description` |
| Instance swap | Slot content | `Icon`, `Leading element` |

---

## 8. Use Code Connect

- **If a component has a Code Connect mapping**, the MCP returns the exact React code
  to render it (import path, prop names, variant values).
- Without Code Connect, the agent infers from visual properties — which is less accurate.
- Designers should coordinate with developers to ensure all library components have
  Code Connect mappings published.

### How Code Connect appears in Dev Mode:
When a developer selects a component instance in Dev Mode, the right panel shows:
- The React import statement
- A JSX example with the correct props and values
- A link to the source file

---

## 9. Organize Pages and Sections

- **One page per feature area** or user flow.
- **Use sections** to group related frames within a page.
- Name pages and sections clearly — the agent may need to navigate between them.
- Keep a "Components" page with all component definitions separate from "Screens" pages
  with composed layouts.

---

## 10. Asset Management

- **Export settings**: Ensure all icons and images have correct export settings (SVG for icons, PNG/WebP for photos).
- **Use the team icon library** — don't paste random SVGs into frames.
- **Name assets semantically**: `icon-arrow-right`, not `Vector 3`.
- The MCP server provides asset download URLs — properly named and exported assets
  generate better code.

---

## Quick Checklist (before marking as "Ready for Dev")

- [ ] All elements use library components (not detached)
- [ ] All colors, spacing, radii bound to Variables with code syntax set
- [ ] All containers use Auto Layout
- [ ] All layers have semantic names (no "Frame 427")
- [ ] Component sets have all required states and variants
- [ ] Annotations added for behavior, content sources, and non-visible intent
- [ ] Section marked as "Ready for Dev"
- [ ] Code Connect verified for all library components used

---

## Resources

- [Figma MCP Server — Structure your Figma file](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/)
- [Figma MCP Server — Trigger specific tools](https://developers.figma.com/docs/figma-mcp-server/trigger-specific-tools/)
- [Figma Code Connect documentation](https://www.figma.com/developers/code-connect)
- [Simple Design System (SDS) reference](https://github.com/figma/sds)
