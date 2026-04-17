import figma from "@figma/code-connect";
import { Button } from "@ds/components";

figma.connect(
  Button,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=4185:3778",
  {
    props: {
      label: figma.string("Label"),
      variant: figma.enum("Variant", {
        Primary: "primary",
        Subtle: "secondary",
      }),
      size: figma.enum("Size", {
        Medium: "md",
      }),
    },
    example: ({ label, variant, size }) => (
      <Button variant={variant} size={size}>
        {label}
      </Button>
    ),
  }
);
