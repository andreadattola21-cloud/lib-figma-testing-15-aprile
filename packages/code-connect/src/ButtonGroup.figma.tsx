import figma from "@figma/code-connect";
import { ButtonGroup } from "@ds/components";

figma.connect(
  ButtonGroup,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2072:9432",
  {
    props: {
      align: figma.enum("Align", {
        Start: "start",
        End: "end",
        Center: "center",
        Justify: "justify",
      }),
      children: figma.children("*"),
    },
    example: ({ align, children }) => (
      <ButtonGroup align={align}>{children}</ButtonGroup>
    ),
  }
);
