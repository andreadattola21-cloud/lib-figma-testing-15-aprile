---
description: "Use when creating or editing Code Connect (.figma.tsx) files. Covers the decision flowchart for data-driven vs children components, anti-patterns, and callback handling."
applyTo: "packages/code-connect/src/**"
---
# Code Connect Rules

> 📖 Sources: Official Figma Code Connect docs + Jake Albaugh (Figma DevRel) developer workflows video.

## Two types of Code Connect

> 📖 **Official**: There are two ways to create Code Connect:

| Method | Depth | Effort | Where defined | Best for |
|--------|-------|--------|---------------|----------|
| **Code Connect Snippets** (`.figma.tsx` files) | Deep — maps properties, variants, children | Higher | Codebase | Core DS components with many variants |
| **Code Connect UI** (in Figma) | Shallow — maps component to file | Lower | Figma UI | Wider coverage, quick library-to-codebase linking |

This project uses **Snippets** for production components. Use the UI for rapid initial mapping.

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

### 📖 From official Figma docs:
- Skipping child components → "The nested instance also must be connected separately"
- Conditionals (`{x && <Y/>}`, ternaries) → "output verbatim rather than executed" — use `figma.boolean` mapping
- Instance node ID from URL → "connect the backing component, not the instance itself"

### 🔧 From practical experience (NOT in Figma docs):
- `props: {}` (empty) → Omit `props` entirely or map real properties
- `.figma.ts` with JSX → Always `.figma.tsx`
- Template literal URL → Parser rejects; use string literal
- Optional chaining on mapped props (`title?.text`) → `ParserError`; use static fallbacks
- `{expr && <Tag/>}` → Parser may crash (not just verbatim output); use `figma.boolean` true/false
- `() => navigate("/path")` → TS compilation error (undefined var); use `() => {}`

## Child Component Nesting (MANDATORY)

**"The nested instance also must be connected separately."** — Figma docs

When connecting a composition, the parent's Code Connect does NOT cover children.
Every Figma component visible in Dev Mode needs its own `figma.connect()` call.

### Steps:
1. After parent Code Connect, call `get_code_connect_suggestions` on the parent node
2. For each unmapped child (`mainComponentNodeId`):
   - Call `get_context_for_code_connect` to learn its Figma properties
   - Create a React primitive if reusable, or connect as native element if simple
   - Create a `.figma.tsx` with proper property mappings
3. Publish all with `--skip-validation` (external library nodes may fail strict validation)
4. Verify: `get_code_connect_suggestions` should return empty list

## Parserless (Template-based) Code Connect

> 📖 **From official `figma-code-connect` skill**: There is a newer "parserless" approach
> to Code Connect that uses JavaScript template strings instead of JSX.

### Two approaches to Code Connect:

| Approach | File extension | Import style | Best for |
|----------|---------------|-------------|----------|
| **Parser-based** (our current approach) | `.figma.tsx` | `import figma from "@figma/code-connect"` | Full JSX examples with React components |
| **Parserless template** (newer) | `.figma.ts` | `import figma from "figma"` | Framework-agnostic or non-JSX output |

### This project uses parser-based (`.figma.tsx`)

We use the parser-based approach because:
1. Our components are React — JSX examples are natural and type-safe
2. We import real components from `@ds/components` — the parser validates imports
3. `figma.config.json` is configured for `parser: "react"` with include patterns

### Parserless template syntax (for reference):
```ts
// url=https://www.figma.com/design/FILE_KEY?node-id=NODE_ID
// source=packages/components/src/primitives/Button/Button.tsx
// component=Button
import figma from "figma" // NOT "@figma/code-connect"
const instance = figma.selectedInstance

const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {
  Primary: "primary",
  Secondary: "secondary",
})

export default {
  example: figma.tsx`<Button variant="${variant}">${label}</Button>`,
  imports: ['import { Button } from "@ds/components"'],
  id: "button",
  metadata: { nestable: true }
}
```

Key differences from parser-based:
- Uses `import figma from "figma"` (not `"@figma/code-connect"`)
- Uses comment headers (`// url=...`, `// source=...`, `// component=...`)
- References `figma.selectedInstance` (not a string URL parameter)
- Uses tagged template literals (`figma.tsx\`...\``) with `instance.getString()`, `instance.getEnum()`, etc.
- Exports `{ example, imports, id, metadata }` object (not `figma.connect()` call)
- Property methods: `instance.getString()`, `instance.getBoolean()`, `instance.getEnum()`, `instance.getInstanceSwap()`, `instance.findInstance()`, `instance.findText()`, `instance.findConnectedInstance()`
- Typically published with `add_code_connect_map` MCP tool or `figma connect publish` CLI

### When to consider switching to parserless:
- If the project moves to Web Components, Vue, or Svelte
- If you need framework-agnostic output
- If the official Figma tooling deprecates the parser-based approach

## Lightweight Code Connect via MCP (no files)

> 📖 **From official `figma-power` steering**: `send_code_connect_mappings` creates shallow file-level mappings without `.figma.tsx` files.

For quick coverage of many components, use `send_code_connect_mappings` directly:

1. Call `get_code_connect_suggestions` to find unmapped components
2. Match each to a source file in the codebase
3. Call `send_code_connect_mappings` with the batch:
   ```
   send_code_connect_mappings(fileKey, nodeId, mappings=[
     { nodeId: "42:15", componentName: "Button", source: "packages/components/src/primitives/Button/Button.tsx", label: "React" },
     { nodeId: "42:20", componentName: "Badge", source: "packages/components/src/primitives/Badge/Badge.tsx", label: "React" }
   ])
   ```

**Limitation**: This creates shallow mappings (component → file). It does NOT map individual props, variants, or children. For deep property-mapped snippets, use our `.figma.tsx` approach.

**When to use which**:
| Need | Approach |
|------|----------|
| Quick coverage of many components | `send_code_connect_mappings` (lightweight) |
| Deep prop/variant/children mapping | `.figma.tsx` files (our standard approach) |
| Non-React frameworks | Parserless `.figma.ts` templates |

## Configuration: `figma.config.json`

This project has a `figma.config.json` at `packages/code-connect/figma.config.json`:

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

### Configuration options:

| Option | Type | Description | Our value |
|--------|------|-------------|-----------|
| `parser` | `string` | Parser to use (`"react"` for `.figma.tsx`) | `"react"` |
| `include` | `string[]` | Globs for Code Connect files to publish | `["src/*.figma.tsx", "src/**/*.figma.tsx"]` |
| `exclude` | `string[]` | Globs for files to exclude | Not set |
| `paths` | `object` | Maps import aliases to source files (mirrors tsconfig) | `{ "@ds/components": "..." }` |
| `label` | `string` | Label shown in Figma Dev Mode for snippets | Not set (defaults to framework name) |
| `language` | `string` | Syntax highlighting language (`tsx`, `jsx`, `html`, etc.) | Not set (defaults to `tsx`) |
| `documentUrlSubstitutions` | `object` | URL placeholders for multi-file projects | Not set |

When adding new Code Connect files, ensure they match the `include` patterns.
