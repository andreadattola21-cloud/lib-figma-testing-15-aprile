import figma from "@figma/code-connect";
import { TextLinkList } from "@ds/components";

figma.connect(
  TextLinkList,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=322:9321",
  {
    props: {
      hasTitle: figma.boolean("Has Title"),
      density: figma.enum("Density", {
        Default: "default",
        Tight: "compact",
      }),
      children: figma.children("*"),
    },
    example: ({ hasTitle, density, children }) => (
      <TextLinkList
        title="Column Title"
        hasTitle={hasTitle}
        density={density}
      >
        {children}
      </TextLinkList>
    ),
  }
);
