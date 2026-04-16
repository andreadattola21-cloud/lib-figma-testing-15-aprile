import figma from "@figma/code-connect";
import { TextLinkListItem } from "@ds/components";

figma.connect(
  TextLinkListItem,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2153:7973",
  {
    props: {
      label: figma.string("Text"),
    },
    example: ({ label }) => (
      <TextLinkListItem label={label} href="/example" />
    ),
  }
);
