import figma from "@figma/code-connect";

/**
 * Text Strong — bold inline text.
 * Connected as a native <strong> element since it's a typography primitive.
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2087:8486",
  {
    props: {
      text: figma.string("Text"),
    },
    example: ({ text }) => <strong>{text}</strong>,
  }
);
