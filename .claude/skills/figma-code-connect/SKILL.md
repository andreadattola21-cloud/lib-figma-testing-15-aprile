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

| ❌ Anti-pattern | Why it fails | ✅ Correct approach |
|---|---|---|
| `figma.children("Slot")` on data-driven component | Returns `ReactNode[]` but prop expects `DataObject[]` | Static example with data |
| `props: {}` (empty object) | Useless for developers in Figma | Map real props or omit `props` |
| `() => navigate("/path")` in example | `navigate` is undefined → TS error | `() => {}` |
| Template literal URL | Parser rejects template literals | String literal `"https://..."` |
| Instance node ID from URL | `get_context_for_code_connect` fails | `mainComponentNodeId` from suggestions |
| `.figma.ts` extension with JSX | TS won't parse JSX in `.ts` | Always `.figma.tsx` |
| Hardcoded `fileKey` from env var | Code Connect needs literal URLs | Use full string literal URL |
