# Design System

Enterprise design system monorepo — React component library synced
with Figma via MCP and Code Connect.

## Packages

| Package | Description |
|---|---|
| `@ds/tokens` | Design tokens (CSS custom properties) synced from Figma variables |
| `@ds/components` | React component library (primitives, compositions, layout) |
| `@ds/code-connect` | Figma Code Connect mappings (`.figma.ts` files) |
| `@ds/storybook` | Storybook documentation and visual testing |

## Quick start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Start Storybook
npm run storybook

# Run all tests
npm run test
```

## Prerequisites

- Node.js >= 20
- Figma Organization or Enterprise plan (required for Code Connect)
- [Figma desktop app](https://www.figma.com/downloads/) (for MCP server)
- Claude Code with Figma MCP configured (see below)

---

## Figma MCP Setup

### 1. Configure the MCP server in Claude Code

Add to your Claude Code settings (`.claude/settings.json`):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```

Or use the **Figma Remote MCP** (no local install):
```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {
        "Authorization": "Bearer <your-personal-access-token>"
      }
    }
  }
}
```

Get your token: Figma → Account Settings → Personal Access Tokens.

### 2. Set environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

```env
FIGMA_ACCESS_TOKEN=your_figma_pat
FIGMA_FILE_KEY=your_figma_file_key   # from the file URL: /design/FILE_KEY/...
```

### 3. Load custom MCP rules

When starting a new Claude Code session, run:
```
/load .claude/rules/design-system.md
```

This loads the team conventions so every code generation session is consistent.

---

## Workflow: Figma → Component

### A. Sync design tokens

```bash
npm run tokens:sync
```

This calls the Figma Variables API and writes CSS custom properties to
`packages/tokens/src/tokens.css`. Review the diff before committing.

### B. Generate a new component

1. Open the Figma file and select the component frame
2. In Claude Code: `use the generate-component skill`
3. The AI will:
   - Read the design context via MCP (`get_design_context`)
   - Check existing Code Connect mappings (`get_code_connect_map`)
   - Generate the component, CSS Module, types, test, and story
   - Create the `.figma.ts` Code Connect file

### C. Publish Code Connect

```bash
npm run code-connect:publish
```

After publishing, the Figma Dev Mode panel shows real code snippets
for every mapped component.

### D. Implement a full page

Work section by section — **never** send an entire page to the MCP in one call.

```
Implement the header section from this Figma frame: [URL]
```
→ Review and test
```
Now implement the hero section from the same frame: [URL with different node-id]
```

---

## Component structure

```
packages/components/src/
├── primitives/         # Atoms: Button, Input, Badge, Checkbox, Tag…
│   └── Button/
│       ├── Button.tsx
│       ├── Button.module.css
│       ├── Button.types.ts
│       ├── Button.test.tsx
│       └── index.ts
├── compositions/       # Molecules: Card, FormField, Modal, DataTable…
├── layout/             # Layout wrappers: Flex, Grid, Stack, Section
│   └── Flex/
└── index.ts            # Named exports only (enables tree-shaking)
```

### Adding a new component

Follow the `generate-component` skill or do it manually:

1. Create folder in the right category (`primitives/`, `compositions/`, `layout/`)
2. Create `Name.types.ts`, `Name.module.css`, `Name.tsx`, `Name.test.tsx`, `index.ts`
3. Add named export to `src/index.ts`
4. Add story in `packages/storybook/stories/Name.stories.tsx`
5. Create `packages/code-connect/src/Name.figma.ts`

Rules:
- **No hardcoded values** — all from `var(--ds-*)` tokens
- **No default exports**
- **No `any`** in TypeScript

---

## MFE Integration

See [`docs/mfe-integration.md`](docs/mfe-integration.md) for:
- npm package consumption (recommended)
- Module Federation runtime sharing
- Design token loading strategy
- Versioning approach

---

## Available scripts

| Script | Description |
|---|---|
| `npm run build` | Build all packages |
| `npm run dev` | Watch mode for all packages |
| `npm run test` | Run all unit tests |
| `npm run typecheck` | TypeScript check across all packages |
| `npm run storybook` | Start Storybook dev server |
| `npm run tokens:sync` | Sync tokens from Figma |
| `npm run code-connect:publish` | Publish Code Connect mappings to Figma |
| `npm run code-connect:unpublish` | Remove Code Connect mappings |

---

## Claude Code skills

| Skill | Trigger |
|---|---|
| `generate-component` | "Generate the [X] component from Figma" |
| `figma-code-connect` | "Connect the [X] Figma component to code" |

Skills are in `.claude/skills/`. Each SKILL.md contains step-by-step
instructions the AI follows automatically when the skill is invoked.

---

## Token naming convention

```
--ds-{category}-{subcategory}-{variant}

Examples:
  --ds-color-text-default
  --ds-color-action-primary-hover
  --ds-space-4
  --ds-radius-md
  --ds-font-size-lg
  --ds-shadow-md
```

All tokens are defined in `packages/tokens/src/tokens.css`.
JS equivalents are in `packages/tokens/src/index.ts`.
