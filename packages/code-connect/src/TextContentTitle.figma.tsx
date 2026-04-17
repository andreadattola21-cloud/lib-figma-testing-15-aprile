import figma from "@figma/code-connect";
import { TextContentTitle } from "@ds/components";

figma.connect(
  TextContentTitle,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2153:7838",
  {
    props: {
      title: figma.string("Title"),
      subtitle: figma.string("Subtitle"),
      align: figma.enum("Align", {
        Start: "left",
        Center: "center",
      }),
    },
    example: ({ title, subtitle, align }) => (
      <TextContentTitle title={title} subtitle={subtitle} align={align} />
    ),
  }
);
