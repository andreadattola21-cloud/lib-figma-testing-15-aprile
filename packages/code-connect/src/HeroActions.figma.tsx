import figma from "@figma/code-connect";
import { HeroActions, ButtonGroup, Button } from "@ds/components";

figma.connect(
  HeroActions,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=348:15901",
  {
    props: {
      children: figma.children("Button Group"),
    },
    example: ({ children }) => (
      <HeroActions title="Title" subtitle="Subtitle">
        {children}
      </HeroActions>
    ),
  }
);
