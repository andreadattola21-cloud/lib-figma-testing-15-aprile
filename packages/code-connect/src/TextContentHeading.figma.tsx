import figma from "@figma/code-connect";

/**
 * Text Content Heading — section heading with optional subheading.
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2153:7834",
  {
    props: {
      heading: figma.string("Heading"),
      subheading: figma.boolean("Has Subheading", {
        true: figma.string("Subheading"),
        false: undefined,
      }),
      align: figma.enum("Align", {
        Start: "start",
        Center: "center",
      }),
    },
    example: ({ heading, subheading, align }) => (
      <header style={{ textAlign: align }}>
        <h2>{heading}</h2>
        <p>{subheading}</p>
      </header>
    ),
  }
);
