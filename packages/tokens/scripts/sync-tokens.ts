/**
 * sync-tokens.ts
 *
 * Syncs design tokens from Figma variables to:
 *   - packages/tokens/src/tokens.css  (CSS custom properties)
 *   - packages/tokens/src/index.ts    (JS/TS exports)
 *
 * Prerequisites:
 *   - FIGMA_ACCESS_TOKEN env variable set
 *   - FIGMA_FILE_KEY env variable set (from your Figma file URL)
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy npm run tokens:sync
 *
 * The script uses the Figma REST API to fetch variable collections
 * from the file, then formats them as CSS custom properties following
 * the --ds-{category}-{name} naming convention.
 *
 * NOTE: This script is a template. After running `get_variable_defs`
 * via Figma MCP, update the transformation logic below to match
 * the actual structure of your Figma variable collections.
 */

import fs from "fs";
import path from "path";

const FIGMA_ACCESS_TOKEN = process.env["FIGMA_ACCESS_TOKEN"];
const FIGMA_FILE_KEY = process.env["FIGMA_FILE_KEY"];

if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
  console.error(
    "Error: FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY must be set.\n" +
    "Usage: FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy npm run tokens:sync"
  );
  process.exit(1);
}

type FigmaVariableType = "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";

interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: FigmaVariableType;
  valuesByMode: Record<string, unknown>;
}

interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: Array<{ modeId: string; name: string }>;
  variableIds: string[];
}

interface FigmaVariablesResponse {
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  };
}

async function fetchFigmaVariables(): Promise<FigmaVariablesResponse> {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
  const response = await fetch(url, {
    headers: { "X-Figma-Token": FIGMA_ACCESS_TOKEN! },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<FigmaVariablesResponse>;
}

function figmaColorToHex(color: { r: number; g: number; b: number; a: number }): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  const hex = `${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  return color.a === 1 ? `#${hex}` : `#${hex}${toHex(color.a)}`;
}

function figmaNameToCssVar(name: string): string {
  // "Color/Primitive/Gray/100" → "--ds-color-primitive-gray-100"
  return `--ds-${name
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")}`;
}

interface FigmaVariableAlias {
  type: "VARIABLE_ALIAS";
  id: string;
}

function isVariableAlias(value: unknown): value is FigmaVariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Record<string, unknown>).type === "VARIABLE_ALIAS"
  );
}

function resolveAlias(
  alias: FigmaVariableAlias,
  variables: Record<string, FigmaVariable>,
  defaultModeForVar: (variable: FigmaVariable) => string | undefined,
  visited: Set<string> = new Set()
): unknown {
  if (visited.has(alias.id)) return undefined; // circular reference guard
  visited.add(alias.id);

  const referenced = variables[alias.id];
  if (!referenced) return undefined;

  const modeId = defaultModeForVar(referenced);
  if (!modeId) return undefined;

  const value = referenced.valuesByMode[modeId];
  if (isVariableAlias(value)) {
    return resolveAlias(value, variables, defaultModeForVar, visited);
  }
  return value;
}

async function syncTokens() {
  console.log("Fetching Figma variables...");
  const data = await fetchFigmaVariables();

  const variables = Object.values(data.meta.variables);
  const variablesById = data.meta.variables;
  const collections = data.meta.variableCollections;

  function getDefaultModeId(variable: FigmaVariable): string | undefined {
    const collection = Object.values(collections).find(
      (c) => c.variableIds.includes(variable.id)
    );
    return collection?.modes[0]?.modeId;
  }

  const cssLines: string[] = [
    "/**",
    " * Design Tokens",
    " * AUTO-GENERATED — do not edit manually.",
    " * Run: npm run tokens:sync",
    " */",
    "",
    ":root {",
  ];

  for (const variable of variables) {
    const defaultModeId = getDefaultModeId(variable);
    if (!defaultModeId) continue;

    let value = variable.valuesByMode[defaultModeId];
    if (value === undefined) continue;

    // Resolve variable aliases to their final value
    if (isVariableAlias(value)) {
      value = resolveAlias(value, variablesById, getDefaultModeId);
      if (value === undefined) continue;
    }

    const cssVar = figmaNameToCssVar(variable.name);

    if (variable.resolvedType === "COLOR" && typeof value === "object" && value !== null) {
      const color = value as { r: number; g: number; b: number; a: number };
      cssLines.push(`  ${cssVar}: ${figmaColorToHex(color)};`);
    } else if (variable.resolvedType === "FLOAT" && typeof value === "number") {
      cssLines.push(`  ${cssVar}: ${value}px;`);
    } else if (variable.resolvedType === "STRING" && typeof value === "string") {
      cssLines.push(`  ${cssVar}: ${value};`);
    }
  }

  cssLines.push("}");

  const tokensPath = path.resolve(__dirname, "../src/tokens.css");
  fs.writeFileSync(tokensPath, cssLines.join("\n"), "utf-8");

  console.log(`✓ Wrote ${variables.length} tokens to ${tokensPath}`);
}

syncTokens().catch((err) => {
  console.error("Token sync failed:", err);
  process.exit(1);
});
