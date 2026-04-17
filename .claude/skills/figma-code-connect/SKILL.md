---
name: figma-code-connect
description: >
  Connect a Figma component to its React implementation by creating or
  updating a .figma.tsx file in packages/code-connect/src/. Use this when
  asked to "connect", "map", or "link" a Figma component to code, or
  when there are unresolved Code Connect warnings after publishing.
---

# Skill: Figma Code Connect

## Purpose
Create or update a Code Connect file (`.figma.tsx`) that maps a Figma
library component to its React counterpart in `@ds/components`.

> 📖 **Official (Jake Albaugh, Figma DevRel)**: Code Connect Snippets sit in the codebase
> alongside components. They map Figma information to code templates and get published to
> Figma so developers see relevant code previews in Dev Mode. The snippets are also
> supplied over MCP to agentic workflows.
> There is also a lighter-weight **Code Connect UI** in Figma for mapping at file-level,
> but this skill creates the deep **Snippet** form.

## When to use
- "Connect the [ComponentName] Figma component to code"
- "Create a code connect mapping for [Component]"
- "There are unmapped components — create Code Connect files"
- After adding a new primitive or composition to `packages/components`

## Instructions

### 1. Get the Figma URL
The user must provide a URL with `node-id` in it.
If missing, ask: "Please share the Figma component URL (with ?node-id=...)".

### 2. Get the correct node ID (CRITICAL)
**NEVER use the node ID from the URL directly.** Instance node IDs fail.

Call `get_code_connect_suggestions` with the Figma file URL.
Use the `mainComponentNodeId` from the response — this is the component
definition node, not an instance.

### 3. Read the React component types
Locate the component in `packages/components/src/` and read its `.types.ts` file.
Understand:
- What props it accepts (and their TypeScript types)
- Whether it uses `children: ReactNode` or data arrays (e.g. `items: Item[]`)
- Which props are callbacks (e.g. `onToggle`, `onClick`, `onTabChange`)

### 4. Determine the mapping strategy

#### A. Primitive with Figma component properties
When the Figma component has defined properties (variants, booleans, strings)
that map 1:1 to React props:

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

Available prop mappers:
- `figma.string("PropertyName")` — maps a Figma text property
- `figma.enum("PropertyName", { FigmaValue: "codeValue" })` — maps a variant
- `figma.boolean("PropertyName")` — maps a boolean toggle
- `figma.instance("PropertyName")` — maps an instance swap (returns ReactNode)
- `figma.children("LayerName")` — maps child instances (returns ReactNode[])
- `figma.children("*")` — maps ALL direct children

#### B. Data-driven composition (MOST compositions)
When the React component accepts **data arrays** (not ReactNode children):

⚠️ **CRITICAL**: Check the component's `.types.ts`. If props like `items`, 
`columns`, `links`, `features` are typed as arrays of data objects 
(e.g. `FooterLinkColumn[]`, `AccordionItemData[]`), then the component 
is data-driven. Do NOT use `figma.children()`.

```tsx
import figma from "@figma/code-connect";
import { Footer } from "@ds/components";

figma.connect(
  Footer,
  "https://www.figma.com/design/FILE_KEY?node-id=MAIN_COMPONENT_NODE_ID",
  {
    // NO props block — data-driven components use static examples
    example: () => (
      <Footer
        logoSrc="/logo.svg"
        socialLinks={[
          { icon: "twitter", href: "https://twitter.com" },
        ]}
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

#### C. Components with ReactNode children
ONLY use `figma.children()` when the React prop is typed as `ReactNode`:

```tsx
figma.connect(Component, url, {
  props: {
    children: figma.children("*"),
  },
  example: ({ children }) => <Component>{children}</Component>,
});
```

### 5. Handle callback props

All callback/event handler props (onClick, onToggle, onTabChange, etc.)
MUST use noop arrow functions `() => {}` in examples.

**NEVER** reference variables that don't exist in scope
(like `navigate`, `setActiveTab`, `setOpenIndex`).

```tsx
// ✅ CORRECT
onButtonClick={() => {}}
onToggle={() => {}}
onTabChange={() => {}}

// ❌ WRONG — these variables don't exist in the file scope
onButtonClick={() => navigate("/checkout")}
onToggle={(i) => setOpenIndex(i)}
onTabChange={(i) => setActiveTab(i)}
```

### 6. Create the file

Create at: `packages/code-connect/src/[ComponentName].figma.tsx`

Rules:
- Extension MUST be `.figma.tsx` (not `.figma.ts`) — JSX requires `.tsx`
- Figma URL MUST be a **string literal** — template literals are rejected
- NEVER use empty `props: {}` — either map real properties or omit `props`
- Import the component from `@ds/components` (the path alias)

### 7. Validate and publish

```bash
# Typecheck the code-connect package
cd packages/code-connect && npx tsc --noEmit

# Publish to Figma
FIGMA_ACCESS_TOKEN=your_token npx figma connect publish
```

Verify:
- No TypeScript errors
- Publish completes without errors
- The Figma Dev Mode panel shows the code snippet

## Decision flowchart

```
Does the React component accept ReactNode children?
  ├── YES → Use figma.children("*") or figma.children("LayerName")
  └── NO → Does it accept data arrays (items[], columns[], links[])?
      ├── YES → Use static example with realistic data, NO props block
      └── NO → Map individual Figma properties with figma.string/enum/boolean
```

## Anti-patterns (NEVER do these)

### 📖 From official Figma docs:
| ❌ Anti-pattern | Why it fails | ✅ Correct approach |
|---|---|---|
| Skipping child components | "The nested instance also must be connected separately" | Connect each child with its own `figma.connect()` |
| Instance node ID from URL | "Connect the backing component, not the instance itself" | `mainComponentNodeId` from `get_code_connect_suggestions` |
| `{expr && <Tag/>}` or ternaries | "Logical operators will be output verbatim rather than executed" | `figma.boolean("Prop", { true: <El />, false: undefined })` |

### 🔧 From practical experience (NOT in Figma docs):
| ❌ Anti-pattern | Why it fails | ✅ Correct approach |
|---|---|---|
| `figma.children("Slot")` on data-driven component | Returns `ReactNode[]` but prop expects `DataObject[]` | Static example with data |
| `props: {}` (empty object) | Useless for developers in Figma | Map real props or omit `props` |
| `() => navigate("/path")` in example | `navigate` is undefined → TS compilation error | `() => {}` |
| Template literal URL | Parser rejects template literals | String literal `"https://..."` |
| `.figma.ts` extension with JSX | TS won't parse JSX in `.ts` | Always `.figma.tsx` |
| `title?.text` in example JSX | `ParserError: Could not find prop mapping` | Use static fallback string or simpler prop mapping |
| `{expr && <Tag/>}` conditional rendering | Parser may also **crash** (not just verbatim) | Render unconditionally; use `figma.boolean` mapping |
| Hardcoded `fileKey` from env var | Code Connect needs literal URLs | Use full string literal URL |

## 8. Child component nesting (MANDATORY)

> 📖 **Official Figma docs**: "The nested instance also must be connected separately."
> "Make sure to connect the backing component of that instance, not the instance itself."

When connecting a composition, the parent's Code Connect does NOT cover children.
Every Figma library component visible in Dev Mode needs its own `figma.connect()`.

### Workflow:
1. After creating the parent's Code Connect, call `get_code_connect_suggestions` on the parent
2. The response lists all unmapped child components with `mainComponentNodeId`
3. For each child:
   a. Call `get_context_for_code_connect` to understand its Figma properties
   b. Create a React primitive if the child is reusable (e.g. TextLinkList)
   c. Create a `.figma.tsx` with proper property mappings
   d. For simple children (bold text, single link), connect as native elements
4. Publish with `--skip-validation` (external library nodes may fail validation)
5. Verify: call `get_code_connect_suggestions` again — list should be empty

### Available property mappers for child Code Connect:
- `figma.string("Text")` — text content
- `figma.enum("Density", { Default: "default", Tight: "compact" })` — variants
- `figma.boolean("Has Title")` — boolean toggles
- `figma.children("*")` — child instances (requires those children to also be connected)
- `figma.nestedProps("LayerName", { ... })` — access child layer props from parent

## Skill Boundaries

### When to use `figma-code-connect`:
- "Connect [Component] to Figma"
- "Map this component to its Figma design"
- "Create Code Connect for [Name]"
- "There are unmapped components — fix Code Connect"
- After running `generate-component` when additional children need mapping

### When to use `send_code_connect_mappings` (lightweight, no files):
- "Quick-map all components in this frame"
- "Link these components to their source files"
- When you need shallow coverage of many components quickly
- This creates file-level mappings (component → source), NOT deep prop mappings

### When to switch to `generate-component`:
- The user wants a NEW component created from a Figma design
- "Implement this Figma frame as React"
- "Generate [Name] component from Figma"

### When to use neither:
- "What tokens does this design use?" → call `get_variable_defs` directly
- "Show me this design" → call `get_screenshot` directly
- "What's the structure?" → call `get_metadata` directly

## Parserless (Template-based) Code Connect — Reference

> 📖 **From official `figma-code-connect` skill**: There is a newer "parserless" approach.

This project uses the **parser-based** approach (`.figma.tsx` with `import figma from "@figma/code-connect"`).
The parserless approach exists but is not used here.

### Key differences:

| Feature | Parser-based (ours) | Parserless (template) |
|---------|--------------------|-----------------------|
| File extension | `.figma.tsx` | `.figma.ts` |
| Import | `import figma from "@figma/code-connect"` | `import figma from "figma"` |
| Component reference | `figma.connect(Component, url, config)` | `figma.tsx\`<Component />\`` with `figma.selectedInstance` |
| Component import | Real `import { Button } from "@ds/components"` | No import needed |
| Publishing | `figma connect publish` CLI | `add_code_connect_map` MCP tool or CLI |

### Why we use parser-based:
1. JSX examples are type-safe — TypeScript validates the component usage
2. Real component imports ensure the code snippet stays in sync with actual API
3. `figma.config.json` handles path resolution for `@ds/components`

### `figma.config.json` (at `packages/code-connect/figma.config.json`):
```json
{
  "codeConnect": {
    "parser": "react",
    "include": ["src/*.figma.tsx", "src/**/*.figma.tsx"],
    "paths": {
      "@ds/components": "../components/src/index.ts"
    }
  }
}
```

New Code Connect files must match the `include` patterns to be published.
