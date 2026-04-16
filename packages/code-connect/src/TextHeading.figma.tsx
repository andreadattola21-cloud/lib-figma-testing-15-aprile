import figma from "@figma/code-connect";

/**
 * Text Heading — a heading text element (h1–h6 style).
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2087:8488",
  {
    props: {
      text: figma.string("Text"),
    },
    example: ({ text }) => <h3>{text}</h3>,
  }
);
