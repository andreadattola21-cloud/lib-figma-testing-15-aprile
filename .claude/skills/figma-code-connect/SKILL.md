---
identifier: figma-code-connect
description: >
  Connect a Figma component to its React implementation by creating or
  updating a .figma.ts file in packages/code-connect/src/. Use this when
  asked to "connect", "map", or "link" a Figma component to code, or
  when there are unresolved Code Connect warnings after publishing.
---

# Skill: Figma Code Connect

## Purpose
Create or update a Code Connect file (`.figma.ts`) that maps a Figma
library component to its React counterpart in `@ds/components`.

## When to use
- "Connect the [ComponentName] Figma component to code"
- "Create a code connect mapping for [Component]"
- "There are unmapped components — create Code Connect files"
- After adding a new primitive or composition to `packages/components`

## Instructions

1. **Get the Figma URL** — the user must provide a URL with `node-id` in it.
   If missing, ask: "Please share the Figma component URL (with ?node-id=...)".

2. **Parse the node-id**:
   - From URL `?node-id=4185-3778` → convert to `4185:3778`
   - Extract `fileKey` from the URL path segment after `/design/`

3. **Discover unmapped properties** using the MCP tool:
   ```
   get_code_connect_suggestions
   ```
   Pass the Figma file URL and `excludeMappingPrompt: true`.

4. **Fetch property definitions**:
   ```
   get_variable_defs
   ```
   Select the component in Figma first, then call this tool to get all
   variant, boolean, string, and instance-swap properties.

5. **Locate the React component** in `packages/components/src/`:
   - Primitives: `src/primitives/[ComponentName]/`
   - Compositions: `src/compositions/[ComponentName]/`
   Read the `.types.ts` file to understand all available props.

6. **Create the `.figma.ts` file** at:
   `packages/code-connect/src/[ComponentName].figma.ts`

   Use this template:
   ```ts
   import figma from "@figma/code-connect";
   import { ComponentName } from "@ds/components";

   figma.connect(
     ComponentName,
     "https://www.figma.com/design/FILE_KEY?node-id=NODE_ID",
     {
       props: {
         // VARIANT → figma.enum("FigmaPropertyName", { FigmaValue: "codeValue" })
         // BOOLEAN → figma.boolean("FigmaPropertyName")
         // TEXT    → figma.string("FigmaPropertyName")
         // INSTANCE_SWAP → figma.instance("FigmaPropertyName")
       },
       example: ({ ...props }) => <ComponentName {...props} />,
     }
   );
   ```

7. **Validate**:
   - Every Figma property that maps to a code prop must be interpolated
   - Strings: `variant="${variant}"` or as JSX `variant={variant}`
   - Instances: always `{${instanceCode}}` (braces, no quotes)
   - Booleans: use ternary if conditional display is needed
   - Check that `hasCodeConnect()` is verified before `executeTemplate()` if scripting

8. **Publish**:
   ```bash
   npm run code-connect:publish --filter=@ds/code-connect
   ```

## Edge cases
- If the Figma component has nested variants, create separate `figma.connect`
  calls per variant group in the same file
- If a prop has no code equivalent (purely visual), omit it — don't invent props
- For icon instance swaps, leave a comment placeholder until icons are connected
- Never hardcode `fileKey` — use the env var `FIGMA_FILE_KEY`
