---
description: "Use when creating or editing Code Connect (.figma.tsx) files. Covers the decision flowchart for data-driven vs children components, anti-patterns, and callback handling."
applyTo: "packages/code-connect/src/**"
---
# Code Connect Rules

## Decision Flowchart

Before writing any Code Connect file, read the component's `.types.ts`:

```
Does the React component accept ReactNode children?
  ├── YES → Use figma.children("*") or figma.children("LayerName")
  └── NO → Does it accept data arrays (items[], columns[], links[])?
      ├── YES → Static example with realistic data, NO props, NO figma.children()
      └── NO → Map individual Figma properties with figma.string/enum/boolean
```

## File Format
- Extension: `.figma.tsx` (NEVER `.figma.ts`)
- Figma URLs: string literals only (template literals rejected)
- Node IDs: from `get_code_connect_suggestions` `mainComponentNodeId`

## Prop Mapping

| Figma property type | Code Connect API | When to use |
|---|---|---|
| Text | `figma.string("Name")` | Prop accepts `string` |
| Variant | `figma.enum("Name", { A: "a" })` | Prop accepts union type |
| Boolean | `figma.boolean("Name")` | Prop accepts `boolean` |
| Instance swap | `figma.instance("Name")` | Prop accepts `ReactNode` |
| Children layers | `figma.children("*")` | Prop accepts `ReactNode`/`ReactNode[]` |

## Data-driven Compositions

When the component accepts data arrays (e.g. `items: ItemData[]`, `columns: FooterLinkColumn[]`):

```tsx
// ✅ CORRECT — static example with real data
example: () => (
  <Footer
    columns={[
      { title: "Product", links: [{ label: "Features", href: "/features" }] }
    ]}
  />
),

// ❌ WRONG — figma.children() returns ReactNode[], not data objects
props: { children: figma.children("Slot") },
example: ({ children }) => <Footer>{children}</Footer>,
```

## Callback Props

ALL callbacks MUST use `() => {}`:

```tsx
// ✅ CORRECT
onButtonClick={() => {}}
onToggle={() => {}}

// ❌ WRONG — undefined variables cause TypeScript errors
onButtonClick={() => navigate("/checkout")}
onToggle={(i) => setOpenIndex(i)}
```

## Anti-patterns

- `props: {}` (empty) → Omit `props` entirely or map real properties
- `.figma.ts` with JSX → Always `.figma.tsx`
- Instance node ID → Use `mainComponentNodeId` from `get_code_connect_suggestions`
- Template literal URL → Use string literal
