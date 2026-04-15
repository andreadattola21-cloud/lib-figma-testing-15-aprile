/**
 * Button — Figma Code Connect
 *
 * Maps the Figma "Button" library component to the @ds/components Button.
 *
 * How to update this file:
 *   1. Open the Button component in Figma (hold Cmd, click the component)
 *   2. In Claude Code: "get code connect suggestions for the Button component"
 *   3. The MCP tool `get_code_connect_suggestions` will identify unmapped props
 *   4. Use `get_context_for_code_connect` to retrieve Figma property definitions
 *   5. Update the `example` function below to reflect the actual Figma properties
 *
 * To publish:
 *   npm run code-connect:publish
 *
 * NOTE: Replace FIGMA_FILE_KEY and BUTTON_NODE_ID with your actual values.
 * The node-id comes from the Figma URL:
 *   ?node-id=4185-3778 → "4185:3778"
 */

import figma, { html } from "@figma/code-connect";
import { Button } from "@ds/components";

const FIGMA_FILE_KEY = process.env["FIGMA_FILE_KEY"] ?? "REPLACE_WITH_YOUR_FILE_KEY";
const BUTTON_NODE_ID = process.env["BUTTON_NODE_ID"] ?? "REPLACE_WITH_BUTTON_NODE_ID";

figma.connect(
  Button,
  `https://www.figma.com/design/${FIGMA_FILE_KEY}?node-id=${BUTTON_NODE_ID}`,
  {
    props: {
      // Map Figma "Variant" property → ButtonVariant
      // Adjust enum keys to match the exact variant names in your Figma component
      variant: figma.enum("Variant", {
        Primary: "primary",
        Secondary: "secondary",
        Danger: "danger",
        Ghost: "ghost",
      }),
      // Map Figma "Size" property → ButtonSize
      size: figma.enum("Size", {
        Small: "sm",
        Medium: "md",
        Large: "lg",
      }),
      // Map Figma boolean "Full Width" → fullWidth
      fullWidth: figma.boolean("Full Width"),
      // Map Figma boolean "Loading" → isLoading
      isLoading: figma.boolean("Loading"),
      // Map Figma text layer "Label" → children
      label: figma.string("Label"),
      // Map Figma instance swap "Leading Icon" → leadingIcon
      // Uncomment and adjust when icons are connected
      // leadingIcon: figma.instance("Leading Icon"),
    },
    example: ({ variant, size, fullWidth, isLoading, label }) => (
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        isLoading={isLoading}
      >
        {label}
      </Button>
    ),
  }
);
