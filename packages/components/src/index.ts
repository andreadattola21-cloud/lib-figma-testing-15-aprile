/**
 * @ds/components — Design System Component Library
 *
 * Tree-shaking: import only what you need.
 *   import { Button } from "@ds/components"
 *
 * Do NOT use default exports or barrel-file re-exports at the
 * component level — import from the component's own entry point
 * in webpack configs to guarantee granular code splitting.
 */

// ─── Primitives ─────────────────────────────────────────────
export { Button } from "./primitives/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./primitives/Button";

// ─── Layout ─────────────────────────────────────────────────
export { Flex } from "./layout/Flex";

// ─── Compositions ────────────────────────────────────────────
// (added as components are built from Figma)
